"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
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

function viewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function FloatingWhatsApp() {
  const ref = useRef<HTMLAnchorElement>(null);
  const posRef = useRef<FabPosition | null>(null);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    moved: false,
  });
  const [position, setPosition] = useState<FabPosition | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    posRef.current = position;
  }, [position]);

  useEffect(() => {
    const stored = parseFabPosition(window.localStorage.getItem(FAB_STORAGE_KEY));
    const el = ref.current;
    if (!stored || !el) return;
    const size = el.offsetWidth;
    const view = viewportSize();
    const next = clampFabPosition(stored.x, stored.y, size, view.width, view.height);
    setPosition(next);
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

  function onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    if (event.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: rect.left,
      origY: rect.top,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
      return;
    }
    drag.moved = true;
    setDragging(true);
    const size = ref.current?.offsetWidth ?? 58;
    const view = viewportSize();
    const next = clampFabPosition(drag.origX + dx, drag.origY + dy, size, view.width, view.height);
    posRef.current = next;
    setPosition(next);
  }

  function endDrag(event: PointerEvent<HTMLAnchorElement>) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    ref.current?.releasePointerCapture(event.pointerId);
    drag.pointerId = -1;
    if (drag.moved && posRef.current) {
      try {
        window.localStorage.setItem(FAB_STORAGE_KEY, JSON.stringify(posRef.current));
      } catch {
        // Private mode can block storage; the in-session position still works.
      }
    }
    setDragging(false);
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    dragRef.current.moved = false;
  }

  const className = [
    "floating-whatsapp",
    position ? "is-moved" : "",
    dragging ? "is-dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      ref={ref}
      className={className}
      style={position ? { left: position.x, top: position.y } : undefined}
      target="_blank"
      rel="noreferrer"
      draggable={false}
      aria-label={withNewTabLabel("Chat with Threvelonbase on WhatsApp")}
      title="Drag to move. Open to chat on WhatsApp."
      href={whatsappHref("Hello Threvelonbase, I would like to make an enquiry.")}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={onClick}
    >
      <span className="floating-whatsapp-glass" aria-hidden="true" />
      <WhatsAppIcon size={28} className="floating-whatsapp-icon" />
      <NewTabHint />
    </a>
  );
}
