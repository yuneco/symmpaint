import { Point } from './Point'

export class Coordinate {
  readonly anchor: Point
  readonly scroll: Point
  readonly scale: number
  readonly angle: number

  constructor(
    anchor = new Point(),
    scroll = new Point(),
    scale = 1,
    angle = 0
  ) {
    this.anchor = anchor
    this.scroll = scroll
    this.scale = scale
    this.angle = angle
  }

  // toLocal(gp: Point): Point {
  //   return gp.rotate(this.angle).scale(this.scale).move(this.anchor)
  // }

  // toGlobal(lp: Point): Point {
  //   return lp
  //     .move(this.anchor.scale(-1))
  //     .scale(1 / this.scale)
  //     .rotate(-this.angle)
  // }
}
