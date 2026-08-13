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

