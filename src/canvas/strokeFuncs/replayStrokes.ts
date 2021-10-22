import { AbstractCanvas } from '../AbstractCanvas'
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
    const [first, ...lests] = stroke.inputs
    if (!first) return
    pen.moveTo(first.point)
    lests.forEach((inp) => {
      inp.pressure
        ? pen.drawTo(canvas, defaultMatrix, inp.point, inp.pressure)
        : pen.moveTo(inp.point)
    })
  }
}

export const replayCelarAllStroke = (canvas: AbstractCanvas) => {
  canvas.clear()
}

export const replayStrokes = (
  canvas: AbstractCanvas,
  strokes: StrokeRecord[],
  isPreview = false
) => {
  strokes.forEach((stroke) => {
    if (stroke.tool === 'pen') {
      replayPenStroke(canvas, stroke, isPreview)
    }
    if (stroke.tool === 'clearAll') {
      replayCelarAllStroke(canvas)
    }
  })
}
