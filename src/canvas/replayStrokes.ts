import { AbstractCanvas } from "./AbstractCanvas";
import { Pen } from "./Pen";
import { StrokeRecord } from "./StrokeRecord";

const replayPenStroke = (canvas: AbstractCanvas, stroke: StrokeRecord) => {
  canvas.coord = stroke.canvasCoord
  console.log('rep stroke', stroke)
  const pen = new Pen()
  pen.state = stroke.penState
  const [first, ...lests] = stroke.inputs
  if (!first) return
  pen.moveTo(first.point)
  lests.forEach(inp => {
    pen.drawTo(canvas, new  DOMMatrix(), inp.point, inp.pressure)
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