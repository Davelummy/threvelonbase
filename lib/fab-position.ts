export const FAB_STORAGE_KEY = "tb-wa-fab";
export const FAB_EDGE_PAD = 8;

export type FabPosition = {
  x: number;
  y: number;
};

export function clampFabPosition(
  x: number,
  y: number,
  size: number,
  viewportWidth: number,
  viewportHeight: number,
  pad = FAB_EDGE_PAD,
): FabPosition {
  const maxX = Math.max(pad, viewportWidth - size - pad);
  const maxY = Math.max(pad, viewportHeight - size - pad);
  return {
    x: Math.min(Math.max(pad, x), maxX),
    y: Math.min(Math.max(pad, y), maxY),
  };
}

export function parseFabPosition(value: string | null): FabPosition | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<FabPosition>;
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") return null;
    if (!Number.isFinite(parsed.x) || !Number.isFinite(parsed.y)) return null;
    return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
}
