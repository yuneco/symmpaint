import { LimittedStack } from '../misc/LimittedStack'
import { AbstractCanvas } from './AbstractCanvas'
import { replayStrokes } from './replayStrokes'
import { StrokeRecord } from './StrokeRecord'

const MAXSTROKE = 10

export class CanvasHistory {
  private readonly history = new LimittedStack<StrokeRecord>(MAXSTROKE)
  private readonly snapshot: AbstractCanvas

  constructor(canvasWidth: number, canvasHeight: number) {
    this.snapshot = new AbstractCanvas(canvasWidth, canvasHeight)

    // 履歴がフローした際の処理
    this.history.listenOverflow((stroke) => {
      if (!this.snapshot) return
      replayStrokes(this.snapshot, [stroke])
    })
  }

  get strokes() {
    return this.history.peek()
  }

  push(stroke: StrokeRecord) {
    this.history.push(stroke)
  }

  get current() {
    return this.history.peek()
  }

  undo(output: AbstractCanvas) {
    if (!this.snapshot) return
    output.ctx.drawImage(this.snapshot.el, 0, 0)
    this.history.pop() // 最後の一つを捨てる
    replayStrokes(output, this.history.getItems())

  }
}
