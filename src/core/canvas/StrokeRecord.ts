import { Coordinate } from '../coords/Coordinate'
import { Point, toPoint } from '../coords/Point'
import { Pen, PenState } from './Pen'
import { PenInput } from './PenInput'
import { joinStrokes } from './strokeFuncs/joinStrokes'
import { StrokeStyle } from './StrokeStyle'
/**
 * ストロークによって実行される機能を示します。
 * pen ... ペンツールによる線の描画
 * clearAll ... 全消去。この機能では座標の記録は意味を持ちません
 */
export type StrokeTool = 'pen' | 'clearAll'

/**
 * 一つの操作を記録したレコードです。
 * 通常のペン操作では、一つの操作 = 1本のストロークです。
 * このレコードには、記録した操作を再現するために必要な全ての状態が保存されます。
 */
export class StrokeRecord {
  /** addPointで記録された座標 */
  readonly inputs: PenInput[] = []
  /** ストローク記録時のペンの状態 */
  readonly penState: PenState
  /** 線のスタイル */
  readonly style: StrokeStyle
  /** ストローク記録時のキャンバスの座標系 */
  readonly canvasCoord: Coordinate
  /** このストロークで実現される機能 */
  readonly tool: StrokeTool

  /**
   * 新しいストロークの記録を開始します
   * @param canvasCoord キャンバスの座標系
   * @param penState ペンの状態
   * @param tool このストロークの機能
   */
  constructor(
    canvasCoord: Coordinate,
    penState: PenState,
    style: StrokeStyle,
    tool: StrokeTool = 'pen'
  ) {
    this.canvasCoord = canvasCoord
    this.penState = penState
    this.style = style
    this.tool = tool
  }

  /**
   * ストロークの記録に座標を追加します
   */
  addPoint(point: Point, pressure: number) {
    this.inputs.push({ point, pressure })
  }

  /**
   * 記録した座標をクリアします
   * @param shouldKeepFirst 最初の要素を保持するか？
   * @param shouldKeepLast 最後の要素を保持するか？
   */
  clearPoints(shouldKeepFirst = false, shouldKeepLast = false) {
    const first = shouldKeepFirst ? this.inputs.shift() : undefined
    const last = shouldKeepLast ? this.inputs.pop() : undefined
    this.inputs.length = 0
    if (first) this.inputs.push(first)
    if (last) this.inputs.push(last)
  }

  get flatten() {
    const pen = new Pen()
    pen.state = this.penState
    const strokes = pen.dryRun(this.inputs, undefined, this.canvasCoord)
    const anchor = toPoint(
      this.canvasCoord.matrixScrollAfter.transformPoint(pen.anchor.scroll)
    ).invert
    const joinedStroke = joinStrokes(strokes).map((inp) => ({
      point: inp.point.move(anchor),
      pressure: inp.pressure,
    }))
    pen.clearChildren()
    pen.anchor = new Coordinate()
    const rec = new StrokeRecord(
      this.canvasCoord,
      pen.state,
      this.style,
      this.tool
    )
    rec.inputs.push(...joinedStroke)
    return rec
  }
}
