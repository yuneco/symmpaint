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
