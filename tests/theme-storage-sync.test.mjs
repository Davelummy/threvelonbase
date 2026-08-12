import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const STORAGE_KEY = "tb-theme";
const SOURCE_URL = new URL("../app/components/theme/ThemeToggle.tsx", import.meta.url);

/**
 * Extract and evaluate the pure storage-resolution helper from ThemeToggle.
 * Avoids a DOM/React runtime while still testing the production source.
 */
async function loadResolveStorageThemeUpdate() {
  const source = await readFile(SOURCE_URL, "utf8");

  const start = source.indexOf("export function resolveStorageThemeUpdate");
  assert.ok(start !== -1, "resolveStorageThemeUpdate must be exported from ThemeToggle");

  // Function body ends at the first top-level closing brace after the signature.
  // The function is small and brace-balanced, so scan until depth returns to 0.
  const fromExport = source.slice(start);
  let depth = 0;
  let end = -1;
  for (let i = 0; i < fromExport.length; i += 1) {
    const ch = fromExport[i];
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  assert.ok(end !== -1, "could not locate end of resolveStorageThemeUpdate");

  const isThemeStart = source.indexOf("function isTheme(");
  assert.ok(isThemeStart !== -1, "isTheme helper must exist");
  let isThemeDepth = 0;
  let isThemeEnd = -1;
  const isThemeFrom = source.slice(isThemeStart);
  for (let i = 0; i < isThemeFrom.length; i += 1) {
    const ch = isThemeFrom[i];
    if (ch === "{") isThemeDepth += 1;
    if (ch === "}") {
      isThemeDepth -= 1;
      if (isThemeDepth === 0) {
        isThemeEnd = i + 1;
        break;
      }
    }
  }
  assert.ok(isThemeEnd !== -1, "could not locate end of isTheme");

  const isThemeFn = source
    .slice(isThemeStart, isThemeStart + isThemeEnd)
    .replace(/: value is Theme/, "")
    .replace(/value: string \| null \| undefined/, "value");

  const resolveFn = fromExport
    .slice(0, end)
    .replace("export function", "function")
    .replace(/key: string \| null/, "key")
    .replace(/newValue: string \| null/, "newValue")
    .replace(/getSystemTheme: \(\) => Theme = systemTheme/, "getSystemTheme = systemTheme")
    .replace(/\): Theme \| null/, ")");

  const javascript = `
const STORAGE_KEY = ${JSON.stringify(STORAGE_KEY)};
${isThemeFn}
${resolveFn}
return resolveStorageThemeUpdate;
`;

  return new Function(javascript)();
}

test("applies light-to-dark theme change from another tab", async () => {
  const resolveStorageThemeUpdate = await loadResolveStorageThemeUpdate();
  assert.equal(resolveStorageThemeUpdate(STORAGE_KEY, "dark", () => "light"), "dark");
});

test("applies dark-to-light theme change from another tab", async () => {
  const resolveStorageThemeUpdate = await loadResolveStorageThemeUpdate();
  assert.equal(resolveStorageThemeUpdate(STORAGE_KEY, "light", () => "dark"), "light");
});

test("falls back to system preference when tb-theme is removed", async () => {
  const resolveStorageThemeUpdate = await loadResolveStorageThemeUpdate();

  assert.equal(resolveStorageThemeUpdate(STORAGE_KEY, null, () => "dark"), "dark");
  assert.equal(resolveStorageThemeUpdate(STORAGE_KEY, null, () => "light"), "light");
});

test("ignores unrelated storage keys so theme does not change", async () => {
  const resolveStorageThemeUpdate = await loadResolveStorageThemeUpdate();

  assert.equal(resolveStorageThemeUpdate("other-key", "dark", () => "light"), null);
  assert.equal(resolveStorageThemeUpdate("session-id", "abc", () => "dark"), null);
  assert.equal(resolveStorageThemeUpdate(null, null, () => "dark"), null);
  assert.equal(resolveStorageThemeUpdate(STORAGE_KEY, "not-a-theme", () => "light"), null);
});

test("subscribe applies storage themes before notifying (source contract)", async () => {
  const source = await readFile(SOURCE_URL, "utf8");

  // Dedicated storage handler must exist (not a bare onStoreChange subscription).
  assert.match(source, /const onStorage = \(event: StorageEvent\)/);
  assert.match(source, /addEventListener\("storage", onStorage\)/);
  assert.doesNotMatch(source, /addEventListener\("storage", onStoreChange\)/);

  // Apply document theme before notifying subscribers.
  const handlerBody = source.match(
    /const onStorage = \(event: StorageEvent\) => \{([\s\S]*?)\n  \};/,
  );
  assert.ok(handlerBody, "onStorage handler body should be present");
  const body = handlerBody[1];
  const applyIndex = body.indexOf("applyTheme(next)");
  const notifyIndex = body.indexOf("onStoreChange()");
  assert.ok(applyIndex !== -1, "onStorage must applyTheme");
  assert.ok(notifyIndex !== -1, "onStorage must notify subscribers");
  assert.ok(applyIndex < notifyIndex, "applyTheme must run before onStoreChange");
});
