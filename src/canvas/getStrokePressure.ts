import { StrokeRecord } from "./StrokeRecord";

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