import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("motion hooks stay visible until owned animation starts", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const motion = await readFile(
    new URL("../app/components/motion/ScrollMotion.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(css, /\.gs-hidden\s*\{\s*opacity:\s*0/);
  assert.match(css, /@media \(scripting: none\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(motion, /play none none none/);
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(motion, /addEventListener\("change"/);
  assert.doesNotMatch(motion, /ScrollTrigger\.getAll/);
  assert.doesNotMatch(motion, /play reverse play reverse/);
});
