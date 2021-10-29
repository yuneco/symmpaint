import { PenInput } from "../PenInput";

/**
 * 複数本のストロークを筆圧0のストロークで結合し、1本のストロークにまとめます
 * @param inps 座標列の配列
 */
export const joinStrokes = (strokes: PenInput[][]): PenInput[] => {
  return strokes.flatMap(stroke =>  {
    if (!stroke.length) return stroke
    const first = stroke[0]
    const last = stroke[stroke.length - 1]
    return [{point: first.point, pressure: 0} ,...stroke, {point: last.point, pressure: 0}]
  })
}
