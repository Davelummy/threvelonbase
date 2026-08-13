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

test("keeps a dragged WhatsApp button inside the viewport", async () => {
  const source = await readFile(new URL("../lib/fab-position.ts", import.meta.url), "utf8");
  assert.match(source, /Math\.min\(Math\.max\(pad, x\), maxX\)/);
  assert.match(source, /Math\.min\(Math\.max\(pad, y\), maxY\)/);
  assert.doesNotMatch(source, /tb-wa-fab|localStorage/);
  assert.deepEqual(clampFabPosition(12, 20, 58, 375, 812), { x: 12, y: 20 });
  assert.deepEqual(clampFabPosition(-40, -10, 58, 375, 812), { x: 8, y: 8 });
  assert.deepEqual(clampFabPosition(400, 900, 58, 375, 812), { x: 309, y: 746 });
});

test("does not persist a dragged WhatsApp button across reloads", async () => {
  const source = await readFile(new URL("../app/components/brand/FloatingWhatsApp.tsx", import.meta.url), "utf8");
  assert.match(source, /defaultCorner/);
  assert.match(source, /removeItem\("tb-wa-fab"\)/);
  assert.doesNotMatch(source, /localStorage\.setItem/);
  assert.doesNotMatch(source, /localStorage\.getItem/);
});
