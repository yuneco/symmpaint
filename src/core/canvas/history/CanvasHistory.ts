import { Coordinate } from '../..'
import { notNull } from '../../misc/notNull'
import { AbstractCanvas } from '../AbstractCanvas'
import { PenState } from '../Pen'
import { StrokeRecord, StrokeTool } from '../StrokeRecord'
import { StrokeStyle } from '../StrokeStyle'
import { drawHistory } from './drawHistory'
import { getSnapshotFor } from './getSnapshotFor'
import { goBackHistory } from './goHistory'
import { getForwardHistory, hasBackHistory } from './hasHistory'
import { addToDebugBox, clearDebugBox, removeFromDebugBox } from './historyDebugArea'
import { HistoryState } from './HistoryState'
import { pushHistory } from './pushHistory'

const SNAP_INTERVAL = 10
const MAX_SNAPS = 10

const createSnapshot = (canvas: AbstractCanvas) => {
  const snap = new AbstractCanvas(canvas.width, canvas.height)
  canvas.copy(snap.ctx)
  addToDebugBox(snap.el)
  return snap
}

export class CanvasHistory {
  private state: HistoryState = { stack: [], currentIndex: -1 }
  private currentStroke?: StrokeRecord

  constructor(initialState?: {
    canvasCoord: Coordinate,
    penState: PenState,
    style: StrokeStyle,
    tool?: StrokeTool
  }) {
    clearDebugBox()
    if (initialState) {
      this.start(initialState.canvasCoord, initialState.penState, initialState.style, initialState.tool)
      // Blank snapshot for back to initial state
      this.commit(new AbstractCanvas(1, 1))
    }
  }

  get strokes() {
    return this.state.stack[this.state.currentIndex]
  }

  get snapshot() {
    return getSnapshotFor(this.state)
  }

  get current() {
    return this.currentStroke
  }

  get undoable() {
    return hasBackHistory(this.state)
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

    // 削除されるスナップショットがあればデバッグエリアからも消す
    const forwards = getForwardHistory(this.state)
    forwards.map(ent => ent.snapshot?.el).filter(notNull).forEach(removeFromDebugBox)

    // 履歴を追加
    this.state = pushHistory(
      this.state,
      this.currentStroke,
      () => createSnapshot(canvas),
      MAX_SNAPS,
      SNAP_INTERVAL
    )
    this.currentStroke = undefined
  }

  /**
   * 現在のストロークをキャンセルし、なかったことにします
   */
  rollback() {
    if (!this.currentStroke) return
    this.currentStroke = undefined
  }

  /**
   * @param output Undo後のキャンバスの出力先
   * @return undoが行われた場合true
   */
  undo(output: AbstractCanvas): boolean {
    if (!this.undoable) {
      return false
    }

    this.state = goBackHistory(this.state)
    drawHistory(this.state, output, this.state.currentIndex)
    return true
  }
}
