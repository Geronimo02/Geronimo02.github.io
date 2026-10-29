export const clamp01 = n => Math.max(0, Math.min(1, n));
export function scrollProgress(top, sceneHeight, viewportHeight) {
  const travel = sceneHeight - viewportHeight;
  return travel > 0 ? clamp01(-top / travel) : 0;
}
