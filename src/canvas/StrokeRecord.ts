import { Coordinate } from '../coords/Coordinate'
import { Point } from '../coords/Point'
import { PenState } from './Pen'

type PenInput = {
  point: Point
  pressure: number
}

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
export class StrokeRecord{
  /** addPointで記録された座標 */
  readonly inputs: PenInput[] = []
  /** ストローク記録時のペンの状態 */
  readonly penState: PenState
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
  constructor(canvasCoord: Coordinate, penState: PenState, tool: StrokeTool = 'pen') {
    this.canvasCoord = canvasCoord
    this.penState = penState
    this.tool = tool
  }

  /**
   * ストロークの記録に座標を追加します
   */
  addPoint(point: Point, pressure: number) {
    this.inputs.push({point, pressure})
  }

}
