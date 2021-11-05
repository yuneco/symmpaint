import { PenInput } from '../canvas/PenInput'
import { Point } from '../coords/Point'
import { LimittedStack } from '../misc/LimittedStack'

const STRENGTH = 0.2
const MIN_HIST_COUNT = 3

export class PointerSmoother {
  private readonly inps = new LimittedStack<PenInput>(10)

  clear() {
    this.inps.clear()
  }

  add(inp: PenInput): PenInput {
    if (this.inps.length < MIN_HIST_COUNT) {
      this.inps.push(inp)
      return inp
    }
    const angle = (this.avrAngle() - inp.point.angle) * STRENGTH
    const point = inp.point.rotate(angle)
    const pressure =
      inp.pressure * (1 - STRENGTH) + this.avrPressure() * STRENGTH
    const adjustedInp = { point, pressure }
    this.inps.push(adjustedInp)
    return adjustedInp
  }

  private avrAngle() {
    const inps = this.inps.getItems()
    return inps
      .map((inp) => {
        return inp.point.scale(1 / inp.point.length)
      })
      .reduce((p, c) => p.move(c), new Point())
      .scale(1 / inps.length).angle
  }

  private avrPressure() {
    const inps = this.inps.getItems()
    return inps.map((inp) => inp.pressure).reduce((p, c) => p + c) / inps.length
  }
}
