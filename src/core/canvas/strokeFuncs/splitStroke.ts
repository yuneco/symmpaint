import { PenInput } from '../PenInput'

/**
 * 一般のストロークを筆圧0の地点で分割し、複数本のストロークとして返します
 * @param stroke ペン座標の配列
 */
export const splitStoke = (stroke: PenInput[]): PenInput[][] => {
  const splitPoint = stroke.findIndex(
    (inp, index) => index > 0 && inp.pressure === 0
  )
  if (splitPoint === -1) return [stroke]
  const segment = stroke.slice(0, splitPoint)
  const rest = stroke.slice(splitPoint)
  const isValidSegment = !(segment.length === 1 && segment[0].pressure === 0)
  const isValidRest = !(rest.length === 1 && rest[0].pressure === 0)
  return [
    ...(isValidSegment ? [segment] : []),
    ...(isValidRest ? splitStoke(rest) : []),
  ]
}
