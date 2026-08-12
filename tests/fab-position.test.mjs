import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function clampFabPosition(x, y, size, viewportWidth, viewportHeight, pad = 8) {
  const maxX = Math.max(pad, viewportWidth - size - pad);
  const maxY = Math.max(pad, viewportHeight - size - pad);
  return {
    x: Math.min(Math.max(pad, x), maxX),
    y: Math.min(Math.max(pad, y), maxY),
  };
}

function parseFabPosition(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") return null;
    if (!Number.isFinite(parsed.x) || !Number.isFinite(parsed.y)) return null;
    return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
}

test("keeps a dragged WhatsApp button inside the viewport", async () => {
  const source = await readFile(new URL("../lib/fab-position.ts", import.meta.url), "utf8");
  assert.match(source, /Math\.min\(Math\.max\(pad, x\), maxX\)/);
  assert.match(source, /Math\.min\(Math\.max\(pad, y\), maxY\)/);
  assert.deepEqual(clampFabPosition(12, 20, 58, 375, 812), { x: 12, y: 20 });
  assert.deepEqual(clampFabPosition(-40, -10, 58, 375, 812), { x: 8, y: 8 });
  assert.deepEqual(clampFabPosition(400, 900, 58, 375, 812), { x: 309, y: 746 });
});

test("ignores invalid stored WhatsApp button positions", () => {
  assert.equal(parseFabPosition(null), null);
  assert.equal(parseFabPosition("nope"), null);
  assert.deepEqual(parseFabPosition(JSON.stringify({ x: 40, y: 80 })), { x: 40, y: 80 });
});
