/**
 * Generates closed "topographic" contour paths. Used by the hero visual and
 * decorative backdrops. Deterministic, so server and client output always match.
 */
export type ContourOptions = {
  cx: number;
  cy: number;
  rings: number;
  start: number;
  step: number;
  seed?: number;
  squash?: number;
  points?: number;
};

export function contourPaths({
  cx,
  cy,
  rings,
  start,
  step,
  seed = 1,
  squash = 0.92,
  points = 90,
}: ContourOptions): string[] {
  const paths: string[] = [];
  for (let k = 0; k < rings; k++) {
    const radius = start + k * step;
    const amp = 0.55 + k * 0.05;
    const driftX = k * 1.6;
    const driftY = -k * 1.0;
    let d = "";
    for (let i = 0; i < points; i++) {
      const t = (i / points) * Math.PI * 2;
      const wobble =
        1 +
        amp * 0.09 * Math.sin(3 * t + seed + k * 0.21) +
        amp * 0.05 * Math.sin(5 * t + seed * 1.7 - k * 0.17) +
        amp * 0.035 * Math.sin(2 * t + seed * 0.6 + k * 0.11);
      const x = cx + driftX + radius * wobble * Math.cos(t);
      const y = cy + driftY + radius * wobble * squash * Math.sin(t);
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(`${d}Z`);
  }
  return paths;
}
