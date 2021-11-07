import { PenInput } from '../canvas/PenInput'
import { normalizeAngle } from '../coords/CoordUtil'
import { Point } from '../coords/Point'
import { LimittedStack } from '../misc/LimittedStack'

const STRENGTH = 0.1
const MIN_HIST_COUNT = 3

const getVecAngle = (p0: Point, p1: Point): number => {
  return p1.sub(p0).angle
}

const setVecAngle = (angle: number, p0: Point, p1: Point): Point => {
  const p = p1.sub(p0)
  return p.rotate(angle - p.angle).move(p0)
}

const mixAngle = (a0: number, a1: number, amount=0.5): number => {
  const p0 = new Point(1, 0).rotate(a0).scale(1 - amount)
  const p1 = new Point(1, 0).rotate(a1).scale(amount)
  return p0.move(p1).angle
}

export class PointerSmoother {
  private readonly inps = new LimittedStack<PenInput>(30)

  clear() {
    this.inps.clear()
  }

  add(inp: PenInput): PenInput {
    const lastInp = this.inps.peek()
    if (!lastInp || this.inps.length < MIN_HIST_COUNT) {
      this.inps.push(inp)
      return inp
    }
    const avrAngle = this.avrAngle()
    const newAngle = getVecAngle(lastInp.point, inp.point)
    const angle = mixAngle(avrAngle, newAngle, 1 - STRENGTH)
    const point = setVecAngle(angle, lastInp.point, inp.point)

    const pressure =
       this.avrPressure() * STRENGTH + inp.pressure * (1 - STRENGTH)

      const adjustedInp = { point, pressure }
    this.inps.push(adjustedInp)
    return adjustedInp
  }

  private avrAngle() {
    const inps = this.inps.getItems()
    const angles = inps.map((p0, index) => {
      const p1 = inps[index + 1]
      if (!p1) return NaN
      return getVecAngle(p0.point, p1.point)
    }).filter(a => !isNaN(a))
    const diffs = angles.map((a1, index) => {
      const a0 = angles[index - 1]
      if (a0 === undefined) return 0
      return normalizeAngle(a1 - a0)
    })
    return normalizeAngle(angles[0] + diffs.reduce((p, c) => p + c, 0) / diffs.length)
  }

  private avrPressure() {
    const inps = this.inps.getItems()
    return inps.map((inp) => inp.pressure).reduce((p, c) => p + c) / inps.length
  }
}
