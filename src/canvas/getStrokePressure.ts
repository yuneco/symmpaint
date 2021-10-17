import { StrokeRecord } from "./StrokeRecord";

const avr = (arr: number[]): number => {
  return arr.reduce((p, c) => p + c, 0) / arr.length
}

/**
 * ストロークの「抜き」を除外した終端の筆圧を返します
 * @param stroke 
 */
export const getStrokeEndPressure = (stroke: StrokeRecord) => {
  if(!stroke.inputs.length) return 0;
  // 暫定的に90%地点の筆圧を返す
  const index = Math.floor(stroke.inputs.length * 0.9)
  return stroke.inputs[index].pressure
}

/**
 * ストロークの平均の筆圧を返します
 * @param stroke 
 */
 export const getStrokeAvrPressure = (stroke: StrokeRecord) => {
  if(!stroke.inputs.length) return 0;
  return avr(stroke.inputs.map(inp => inp.pressure))
}
