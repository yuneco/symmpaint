import { AbstractCanvas } from "./AbstractCanvas";
import { StrokeRecord } from "./StrokeRecord";

export const replayStrokes = (canvas: AbstractCanvas, strokes: StrokeRecord[]) => {
  strokes.forEach(stroke => {
    canvas.coord = stroke.canvasCoord
    canvas.pen.state = stroke.penState
    const [first, ...lests] = stroke.inputs
    if (!first) return
    canvas.moveTo(first.point)
    lests.forEach(inp => {
      canvas.drawTo(inp.point, inp.pressure)
    })
  })
}