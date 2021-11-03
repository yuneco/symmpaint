import { AbstractCanvas } from '../AbstractCanvas'
import { clearCanvas } from './canvasPaintFuncs'
import { Pen } from '../Pen'
import { StrokeRecord } from '../StrokeRecord'
import { getStrokeAvrPressure } from './getStrokePressure'
import { splitStoke } from './splitStroke'

export const replayPenStroke = (
  canvas: AbstractCanvas,
  stroke: StrokeRecord,
  isPreview: boolean
) => {
  const defaultMatrix = new DOMMatrix()
  canvas.coord = stroke.canvasCoord
  canvas.ctx.strokeStyle = stroke.style.color
  canvas.ctx.lineWidth = stroke.style.penSize * stroke.canvasCoord.scale
  const pen = new Pen()
  pen.state = stroke.penState

  if (isPreview) {
    const segments = splitStoke(stroke.inputs)
    segments.forEach(seg => {
      const pressure = getStrokeAvrPressure(seg)
      pen.drawLines(
        canvas,
        defaultMatrix,
        seg.map((inp) => inp.point),
        pressure
      )  
    })
  } else {
    const [first, ...rests] = stroke.inputs
    if (!first) return
    let last = first
    rests.forEach((inp) => {
      if(inp.pressure) pen.drawTo(canvas, defaultMatrix, last.point, inp.point, inp.pressure)
      last = inp
    })
  }
}

export const replayCelarAllStroke = (canvas: AbstractCanvas) => {
  clearCanvas(canvas)
}

/**
 * 記録したストロークを再生します
 * @param canvas 出力先
 * @param strokeCanvas 一時作業用キャンパス
 * @param strokes 再生するストローク履歴
 * @param isPreview プレビューモード（高速）を使用するか？
 */
export const replayStrokes = (
  canvas: AbstractCanvas,
  strokeCanvas: AbstractCanvas,
  strokes: StrokeRecord[],
  isPreview = false
) => {
  strokes.forEach((stroke) => {
    if (stroke.tool === 'pen') {
      clearCanvas(strokeCanvas)
      replayPenStroke(strokeCanvas, stroke, isPreview)
      strokeCanvas.copy(canvas.ctx, {alpha: stroke.style.alpha})
    }
    if (stroke.tool === 'clearAll') {
      replayCelarAllStroke(canvas)
    }
  })
  clearCanvas(strokeCanvas)
}
