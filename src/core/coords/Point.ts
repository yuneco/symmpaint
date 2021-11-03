/**
 * XY座標を保持するイミュータブルなクラスです
 */
export class Point {
  readonly x: number
  readonly y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  equals(p: Point) {
    return this.x === p.x && this.y === p.y
  }

  move(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y)
  }

  sub(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y)
  }

  get angle() {
    return Math.atan2(this.y, this.x) / Math.PI * 180
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  rotate(angle: number): Point {
    const rad = (angle / 180) * Math.PI
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const x = this.x * cos - this.y * sin
    const y = this.x * sin + this.y * cos
    return new Point(x, y)
  }

  scale(times: number): Point {
    return new Point(this.x * times, this.y * times)
  }
}

export const toPoint = (pointLike: {x: number; y: number}): Point => new Point(pointLike.x, pointLike.y)