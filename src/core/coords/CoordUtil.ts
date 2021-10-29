/**
 * 角度を-180 < angle <= +180の範囲に正規化します
 * @param angle 
 */
export const normalizeAngle = (angle: number): number => {
  const m = angle >= 0 ? angle % 360 : 360 + (angle % 360)
  return m <= 180 ? m : -360 + m;
}

export const a2r = (angle: number): number => angle / 180 * Math.PI
export const r2a = (rad: number): number => rad / Math.PI * 180 