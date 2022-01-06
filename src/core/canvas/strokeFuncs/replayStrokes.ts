import { AbstractCanvas } from '../AbstractCanvas'
import { clearCanvas } from './canvasPaintFuncs'
import { Pen } from '../Pen'
import { StrokeRecord } from '../StrokeRecord'
import { splitStoke } from './splitStroke'

export const replayPenStroke = (canvas: AbstractCanvas, stroke: StrokeRecord) => {
  canvas.ctx.save()
  canvas.ctx.fillStyle = stroke.style.color
  canvas.ctx.lineWidth = stroke.style.penSize
  const pen = new Pen()
  pen.state = stroke.penState
  pen.drawStrokes(canvas, splitStoke(stroke.inputs))
  canvas.ctx.restore()
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
  strokes: StrokeRecord[]
) => {
  strokes.forEach((stroke) => {
    if (stroke.tool === 'pen') {
      clearCanvas(strokeCanvas)
      replayPenStroke(strokeCanvas, stroke)
      strokeCanvas.copy(canvas.ctx, {
        alpha: stroke.style.alpha,
        composition: stroke.style.composition,
      })
    }
    if (stroke.tool === 'clearAll') {
      replayCelarAllStroke(canvas)
    }
  })
  clearCanvas(strokeCanvas)
}
