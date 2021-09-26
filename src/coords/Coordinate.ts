import { Point } from './Point'

type CoordinateData = {
  anchor: Point;
  scroll: Point;
  scale: number;
  angle: number;
}

/**
 * 座標型を保持するイミュータブルなクラスです。
 */
export class Coordinate {
  readonly anchor: Point
  readonly scroll: Point
  readonly scale: number
  readonly angle: number

  constructor(data?: Partial<CoordinateData>
  ) {
    this.anchor = data?.anchor ?? new Point()
    this.scroll = data?.scroll ?? new Point()
    this.scale = data?.scale ?? 1
    this.angle = data?.angle ?? 0
  }

  toData(): CoordinateData {
    return {
      anchor: this.anchor,
      scroll: this.scroll,
      scale: this.scale,
      angle: this.angle,
    }
  }

  clone(data?: Partial<CoordinateData>): Coordinate {
    const base = this.toData()
    return new Coordinate({...base, ...data})
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
