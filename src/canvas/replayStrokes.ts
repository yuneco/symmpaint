import { AbstractCanvas } from "./AbstractCanvas";
import { StrokeRecord } from "./StrokeRecord";

const replayPenStroke = (canvas: AbstractCanvas, stroke: StrokeRecord) => {
  canvas.coord = stroke.canvasCoord
  canvas.pen.state = stroke.penState
  const [first, ...lests] = stroke.inputs
  if (!first) return
  canvas.moveTo(first.point)
  lests.forEach(inp => {
    canvas.drawTo(inp.point, inp.pressure)
  })
}

const replayCelarAllStroke = (canvas: AbstractCanvas) => {
  canvas.clear()
}

export const replayStrokes = (canvas: AbstractCanvas, strokes: StrokeRecord[]) => {
  strokes.forEach(stroke => {
    if (stroke.tool === 'pen') {
      replayPenStroke(canvas, stroke)
    }
    if (stroke.tool === 'clearAll') {
      replayCelarAllStroke(canvas)
    }
  })
}