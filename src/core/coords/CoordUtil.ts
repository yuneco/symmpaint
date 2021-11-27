import { Coordinate } from './Coordinate'
import { Point } from './Point'

/**
 * 角度を-180 < angle <= +180の範囲に正規化します
 * @param angle
 */
export const normalizeAngle = (angle: number): number => {
  const m = angle >= 0 ? angle % 360 : 360 + (angle % 360)
  return m <= 180 ? m : -360 + m
}

export const mixAngle = (a0: number, a1: number, amount = 0.5): number => {
  const p0 = new Point(1, 0).rotate(a0).scale(1 - amount)
  const p1 = new Point(1, 0).rotate(a1).scale(amount)
  return p0.move(p1).angle
}

export const a2r = (angle: number): number => (angle / 180) * Math.PI
export const r2a = (rad: number): number => (rad / Math.PI) * 180

export const multiplyCoord = (c1: Coordinate, c2: Coordinate): Coordinate => {
  const mx = c1.matrix.multiply(c2.matrix)
  const p = mx.transformPoint()
  return new Coordinate({
    scroll: new Point(p.x, p.y),
    angle: c1.angle + c2.angle,
    scale: c1.scale * c2.scale,
  })
}
