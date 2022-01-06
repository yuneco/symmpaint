import { PenInput } from '../PenInput'

/**
 * 一般のストロークを筆圧0の地点で分割し、複数本のストロークとして返します
 * @param stroke ペン座標の配列
 */
export const splitStoke = (stroke: PenInput[]): PenInput[][] => {
  if (stroke.length === 0) return []

  const result: PenInput[][] = []
  let current: PenInput[] = [stroke[0]]
  let isInSegment = stroke[0].pressure !== 0

  for (let index = 1; index < stroke.length; index++) {
    const inp = stroke[index]

    // 筆圧0が出現したらセグメント終了
    if (isInSegment && inp.pressure === 0) {
      current.push(inp)
      result.push(current)
      // 新しいセグメントを作成。この時点では開始と見做さない
      current = [inp] // 筆圧0の入力はこのセグメントの終了と次のセグメントの開始の両方に含む
      isInSegment = false
      continue
    }
    // 筆圧0が続く間はセグメントの開始点を上書きし続ける
    if (!isInSegment && inp.pressure === 0) {
      current = [inp]
      isInSegment = false
      continue
    }
    // セグメント中は入力点をそのまま追加
    current.push(inp)
    isInSegment = true
  }

  // 最後のセグメントが途中なら追加
  if (isInSegment) {
    result.push(current)
  }

  return result
}
