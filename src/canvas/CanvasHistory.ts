import { Coordinate } from '../coords/Coordinate'
import { LimittedStack } from '../misc/LimittedStack'
import { AbstractCanvas } from './AbstractCanvas'
import { PenState } from './Pen'
import { replayStrokes } from './replayStrokes'
import { StrokeRecord, StrokeTool } from './StrokeRecord'

const MAXSTROKE = 110
const STROKES_PER_SNAPSHOT = 10

export class CanvasHistory {
  private readonly canvasWidth: number
  private readonly canvasHeight: number
  private readonly history = new LimittedStack<StrokeRecord>(Infinity)
  private readonly snapshots = new LimittedStack<AbstractCanvas>(
    MAXSTROKE / STROKES_PER_SNAPSHOT
  )

  private currentStroke?: StrokeRecord

  private lastSnapshotIndex = 0
  private oldestSnapshotIndex = 0
  private oldestSnapshot?: AbstractCanvas

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.addSnapshot()
    this.snapshots.listenOverflow(snap => {
      this.oldestSnapshotIndex += STROKES_PER_SNAPSHOT
      this.oldestSnapshot = snap
      console.log(`oldestSnapshotIndex: ${this.oldestSnapshotIndex}`)
    })
  }

  get strokes() {
    return this.history.peek()
  }

  get snapshot() {
    return this.snapshots.peek()!
  }

  get prevSnapshot() {
    return this.snapshots.peek(-1)
  }

  get lastHistories() {
    const items = this.history.getItems()
    return items.slice(this.lastSnapshotIndex + 1)
  }

  addSnapshot() {
    const snap = new AbstractCanvas(this.canvasWidth, this.canvasHeight)
    this.snapshots.push(snap)
    const prev = this.prevSnapshot
    if (prev) {
      snap.ctx.drawImage(prev.el, 0, 0)
    }

    this.lastSnapshotIndex = this.history.length - 1
  }

  start(canvasCoord: Coordinate, penState: PenState, tool?: StrokeTool): StrokeRecord {
    const stroke = new StrokeRecord(canvasCoord, penState, tool)
    this.currentStroke = stroke
    return stroke
  }

  commit() {
    if (!this.currentStroke) return
    this.history.push(this.currentStroke)
    replayStrokes(this.snapshot, [this.currentStroke])
    const currentStackLength = this.history.length - this.lastSnapshotIndex - 1
    if (currentStackLength === STROKES_PER_SNAPSHOT) {
      console.log('new snapshot', this.snapshots.length)
      this.addSnapshot()
    }
    this.currentStroke = undefined
  }

  get current() {
    return this.currentStroke
  }

  get undoable() {
    return this.history.length > this.oldestSnapshotIndex
  }

  undo(output: AbstractCanvas): boolean {
    if (!this.undoable) {
      console.log('no more history')
      return false
    }
    const snap = this.prevSnapshot ?? this.oldestSnapshot
    if (snap) {
      output.ctx.drawImage(snap.el, 0, 0)
    } else {
      console.log('no prev')
    }

    this.history.pop() // 最後の一つを捨てる
    replayStrokes(output, this.lastHistories)

    if (!this.lastHistories.length && this.snapshots.length > 1) {
      this.snapshots.pop()
      console.log('back prev snap', this.snapshots.length)
      this.lastSnapshotIndex -= STROKES_PER_SNAPSHOT
    }

    // console.log({
    //   snapshots: this.snapshots.length,
    //   hists: this.lastHistories,
    //   oldestSnapshotIndex: this.oldestSnapshotIndex,
    //   lastSnapshotIndex: this.lastSnapshotIndex,
    // })
    return true
  }
}
