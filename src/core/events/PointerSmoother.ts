import { PenInput } from '../canvas/PenInput'
import { LimittedStack } from '../misc/LimittedStack'

const STRENGTH = 0.4
const MIN_HIST_COUNT = 3

const contrast = (n: number) => {
  return 1 - Math.pow(1 - n, 2)
}
const filterPressure = (pressure: number) => {
  const MIN = 0.05
  if (pressure < MIN) return 0
  return Math.max(0, contrast(pressure))
}

export class PointerSmoother {
  private readonly inps = new LimittedStack<PenInput>(5)

  clear() {
    this.inps.clear()
  }

  add(inp: PenInput): PenInput {
    const lastInp = this.inps.peek()
    if (!lastInp || this.inps.length < MIN_HIST_COUNT) {
      this.inps.push(inp)
      return inp
    }
    const pressure = filterPressure(
      this.avrPressure() * STRENGTH + inp.pressure * (1 - STRENGTH)
    )

    const adjustedInp = { point: inp.point, pressure }
    this.inps.push(adjustedInp)
    return adjustedInp
  }

  private avrPressure() {
    const inps = this.inps.getItems()
    return inps.map((inp) => inp.pressure).reduce((p, c) => p + c) / inps.length
  }
}
