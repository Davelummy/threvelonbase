"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { clampFabPosition, type FabPosition } from "../../../lib/fab-position";
import { whatsappHref } from "../../../lib/whatsapp";
import { NewTabHint, withNewTabLabel } from "../a11y/NewTabHint";
import { WhatsAppIcon } from "./WhatsAppIcon";

const DRAG_THRESHOLD_PX = 3;
const chatHref = whatsappHref("Hello Threvelonbase, I would like to make an enquiry.");

function viewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function defaultCorner(size: number): FabPosition {
  const view = viewportSize();
  return clampFabPosition(view.width - size - 22, view.height - size - 22, size, view.width, view.height);
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
    const el = ref.current;
    if (!el) return;
    const size = el.offsetWidth || 58;
    try {
      window.localStorage.removeItem("tb-wa-fab");
    } catch {
      // Private mode can block storage; a reload still starts in the default corner.
    }
    const next = defaultCorner(size);
    posRef.current = next;
    setPosition(next);
  }, []);

  useEffect(() => {
    function reclamp() {
      const size = ref.current?.offsetWidth ?? 58;
      const view = viewportSize();
      setPosition((current) => {
        const source = current ?? defaultCorner(size);
        const next = clampFabPosition(source.x, source.y, size, view.width, view.height);
        posRef.current = next;
        return next;
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
    el.setPointerCapture(event.pointerId);

    const size = el.offsetWidth || 58;
    const start = posRef.current ?? defaultCorner(size);
    const drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: start.x,
      origY: start.y,
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
      const view = viewportSize();
      const next = clampFabPosition(
        drag.origX + dx,
        drag.origY + dy,
        ref.current?.offsetWidth ?? size,
        view.width,
        view.height,
      );
      posRef.current = next;
      setPosition(next);
    };

    const onUp = (upEvent: globalThis.PointerEvent) => {
      if (upEvent.pointerId !== drag.pointerId) return;
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("pointercancel", onUp, true);
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      setDragging(false);
      if (drag.moved) return;
      openChat();
    };

    document.addEventListener("pointermove", onMove, { capture: true, passive: false });
    document.addEventListener("pointerup", onUp, { capture: true });
    document.addEventListener("pointercancel", onUp, { capture: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openChat();
  }

  const className = [
    "floating-whatsapp",
    "is-free",
    dragging ? "is-dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      style={
        position
          ? {
              left: position.x,
              top: position.y,
              right: "auto",
              bottom: "auto",
            }
          : undefined
      }
      aria-label={withNewTabLabel("Chat with Threvelonbase on WhatsApp")}
      title="Drag to move. Tap to chat on WhatsApp."
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <span className="floating-whatsapp-glow" aria-hidden="true" />
      <span className="floating-whatsapp-glass" aria-hidden="true" />
      <WhatsAppIcon size={28} className="floating-whatsapp-icon" />
      <NewTabHint />
    </button>
  );
}
