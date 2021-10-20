import { PenInput } from "../PenInput";
const avr = (arr: number[]): number => {
  return arr.reduce((p, c) => p + c, 0) / arr.length
}

/**
 * ストロークの「抜き」を除外した終端の筆圧を返します
 * @param stroke 
 */
export const getStrokeEndPressure = (inputs: PenInput[]) => {
  if(!inputs.length) return 0;
  // 暫定的に90%地点の筆圧を返す
  const index = Math.floor(inputs.length * 0.9)
  return inputs[index].pressure
}

/**
 * ストロークの平均の筆圧を返します
 * @param stroke 
 */
 export const getStrokeAvrPressure = (inputs: PenInput[]) => {
  if(!inputs.length) return 0;
  // 筆圧0以外のエントリの平均
  return avr(inputs.map(inp => inp.pressure).filter(pr => pr > 0))
}
