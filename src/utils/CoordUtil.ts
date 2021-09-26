export const normalizeAngle = (angle: number): number => {
  const m = angle >= 0 ? angle % 360 : 360 + (angle % 360)
  return m <= 180 ? m : -360 + m;
}
