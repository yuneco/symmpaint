import { CanvasToolName } from "../controls/CanvasToolName"

/** 押されているキーから行うべき操作を判定します */
export const toolForKeys = (keys: string[]): CanvasToolName => {
  const keySp = keys.includes(' ')
  const keyOpt = keys.includes('Alt')
  const keyCmd = keys.includes('Meta')
  const keyShift = keys.includes('Shift')
  if (keySp && keyCmd && keyOpt) return 'zoomdown'
  if (keySp && keyCmd) return 'zoomup'
  if (keySp && keyOpt) return 'rotate'
  if (keySp) return 'scroll'
  if (keyShift) return 'draw:line'
  if (keyOpt) return 'draw:stamp'
  return 'draw'
}
