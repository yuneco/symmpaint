import { Coordinate } from '../coords/Coordinate'
import { LimittedStack } from '../misc/LimittedStack'
import { AbstractCanvas } from './AbstractCanvas'
import { PenState } from './Pen'
import { replayStrokes } from './strokeFuncs/replayStrokes'
import { StrokeRecord, StrokeTool } from './StrokeRecord'
import { StrokeStyle } from './StrokeStyle'

const MAXSTROKE = 110
const STROKES_PER_SNAPSHOT = 10

export class CanvasHistory {
  private readonly canvasWidth: number
  private readonly canvasHeight: number
  // ストロークの履歴自体は無制限に記録する
  private readonly history = new LimittedStack<StrokeRecord>(Infinity)
  // スナップショットはメモリ使用量が多いので上限を設ける
  private readonly snapshots = new LimittedStack<AbstractCanvas>(
    MAXSTROKE / STROKES_PER_SNAPSHOT
  )

  private currentStroke?: StrokeRecord

  private lastSnapshotIndex = 0
  private oldestSnapshotIndex = 0

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.snapshots.listenOverflow(() => {
      this.oldestSnapshotIndex += STROKES_PER_SNAPSHOT
    })
  }

  /** Undo可能な履歴の数 */
  get length() {
    return this.history.length - this.oldestSnapshotIndex
  }

  get strokes() {
    return this.history.peek()
  }

  get snapshot() {
    return this.snapshots.peek()
  }

  get prevSnapshot() {
    return this.snapshots.peek(-1)
  }

  get lastHistories() {
    const items = this.history.getItems()
    return items.slice(this.lastSnapshotIndex)
  }

  get current() {
    return this.currentStroke
  }

  get undoable() {
    return this.length >= 1
  }


  addSnapshot() {
    const snap = new AbstractCanvas(this.canvasWidth, this.canvasHeight)
    this.snapshots.push(snap)
    const prev = this.prevSnapshot
    if (prev) {
      snap.ctx.save()
      snap.ctx.resetTransform()
      snap.ctx.drawImage(prev.el, 0, 0)
      snap.ctx.restore()
    }

    const debugBox = document.querySelector('#debug .history .snaps')
    if (debugBox) {
      debugBox.innerHTML = ''
      const scale = 120 / Math.max(snap.el.width, snap.el.height)
      snap.el.style.width = `${snap.el.width * scale}px`
      snap.el.style.height = `${snap.el.height * scale}px`
      debugBox.appendChild(snap.el)
      snap.el.scrollIntoView()
    }
    this.lastSnapshotIndex = this.history.length - 1
  }

  start(
    canvasCoord: Coordinate,
    penState: PenState,
    style: StrokeStyle,
    tool?: StrokeTool
  ): StrokeRecord {
    const stroke = new StrokeRecord(canvasCoord, penState, style, tool)
    this.currentStroke = stroke
    return stroke
  }

  /**
   * 現在のストロークを確定します
   * @param canvas 現在のストロークを描画する「前」のキャンバス。スナップショットを作成する必要がある場合に内容を読み取って保存します。
   */
  commit(canvas: AbstractCanvas) {
    if (!this.currentStroke) return
    this.history.push(this.currentStroke)

    const currentStackLength = this.history.length - this.lastSnapshotIndex - 1
    if (currentStackLength === STROKES_PER_SNAPSHOT) {
      this.addSnapshot()
      if (!this.snapshot) {
        console.error('failed to add snapshot')
        return
      }
      canvas.copy(this.snapshot.ctx, { alpha: this.currentStroke.style.alpha })
      // console.log('new snapshot', this.snapshots.length)
    }

    this.currentStroke = undefined
  }

  /**
   * 現在のストロークをキャンセルし、なかったことにします
   */
  rollback() {
    if (!this.currentStroke) return
    // console.log('stroke rollbacked')
    this.currentStroke = undefined
  }

  undo(output: AbstractCanvas): boolean {
    if (!this.undoable) {
      // console.log('no history to undo')
      return false
    }

    const tempCanvas = new AbstractCanvas(output.width, output.height)

    output.ctx.save()
    const snap = this.snapshot
    if (snap) {
      output.ctx.save()
      output.ctx.resetTransform()
      output.ctx.drawImage(snap.el, 0, 0)
      output.ctx.restore()
    }

    this.history.pop() // 最後の一つを捨てる
    replayStrokes(output, tempCanvas, this.lastHistories)

    if (!this.lastHistories.length && this.snapshots.length >= 1) {
      const sp = this.snapshots.pop()
      sp && sp.el.parentNode?.removeChild(sp.el)
      this.lastSnapshotIndex -= STROKES_PER_SNAPSHOT
      // console.log('back prev snap', this.snapshots.length, this.snapshots)
    }
    output.ctx.restore()
    return true
  }
}
