"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  clampFabPosition,
  FAB_STORAGE_KEY,
  parseFabPosition,
  type FabPosition,
} from "../../../lib/fab-position";
import { whatsappHref } from "../../../lib/whatsapp";
import { NewTabHint, withNewTabLabel } from "../a11y/NewTabHint";
import { WhatsAppIcon } from "./WhatsAppIcon";

const DRAG_THRESHOLD_PX = 6;
const chatHref = whatsappHref("Hello Threvelonbase, I would like to make an enquiry.");

function viewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function openChat() {
  window.open(chatHref, "_blank", "noopener,noreferrer");
}

export function FloatingWhatsApp() {
  const ref = useRef<HTMLButtonElement>(null);
  const posRef = useRef<FabPosition | null>(null);
  const [position, setPosition] = useState<FabPosition | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    posRef.current = position;
  }, [position]);

  useEffect(() => {
    const stored = parseFabPosition(window.localStorage.getItem(FAB_STORAGE_KEY));
    const el = ref.current;
    if (!stored || !el) return;
    const view = viewportSize();
    setPosition(clampFabPosition(stored.x, stored.y, el.offsetWidth, view.width, view.height));
  }, []);

  useEffect(() => {
    function reclamp() {
      setPosition((current) => {
        if (!current) return current;
        const size = ref.current?.offsetWidth ?? 58;
        const view = viewportSize();
        return clampFabPosition(current.x, current.y, size, view.width, view.height);
      });
    }

    window.addEventListener("resize", reclamp);
    window.visualViewport?.addEventListener("resize", reclamp);
    return () => {
      window.removeEventListener("resize", reclamp);
      window.visualViewport?.removeEventListener("resize", reclamp);
    };
  }, []);

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: rect.left,
      origY: rect.top,
      moved: false,
    };

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      if (moveEvent.pointerId !== drag.pointerId) return;
      const dx = moveEvent.clientX - drag.startX;
      const dy = moveEvent.clientY - drag.startY;
      if (!drag.moved && dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        return;
      }
      drag.moved = true;
      moveEvent.preventDefault();
      setDragging(true);
      const size = ref.current?.offsetWidth ?? 58;
      const view = viewportSize();
      const next = clampFabPosition(drag.origX + dx, drag.origY + dy, size, view.width, view.height);
      posRef.current = next;
      setPosition(next);
    };

    const onUp = (upEvent: globalThis.PointerEvent) => {
      if (upEvent.pointerId !== drag.pointerId) return;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setDragging(false);
      if (drag.moved && posRef.current) {
        try {
          window.localStorage.setItem(FAB_STORAGE_KEY, JSON.stringify(posRef.current));
        } catch {
          // Private mode can block storage; the in-session position still works.
        }
        return;
      }
      openChat();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openChat();
  }

  const className = [
    "floating-whatsapp",
    position ? "is-moved" : "",
    dragging ? "is-dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      style={position ? { left: position.x, top: position.y } : undefined}
      aria-label={withNewTabLabel("Chat with Threvelonbase on WhatsApp")}
      title="Drag to move. Tap to chat on WhatsApp."
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <span className="floating-whatsapp-glass" aria-hidden="true" />
      <WhatsAppIcon size={28} className="floating-whatsapp-icon" />
      <NewTabHint />
    </button>
  );
}
