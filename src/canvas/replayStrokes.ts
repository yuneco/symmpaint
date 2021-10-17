import { AbstractCanvas } from "./AbstractCanvas";
import { Pen } from "./Pen";
import { StrokeRecord } from "./StrokeRecord";

export const replayPenStroke = (canvas: AbstractCanvas, stroke: StrokeRecord, overridePressure: number | undefined = undefined) => {
  canvas.coord = stroke.canvasCoord
  canvas.ctx.lineWidth = stroke.style.penSize * stroke.canvasCoord.scale
  const pen = new Pen()
  pen.state = stroke.penState

  if (overridePressure) {
    pen.drawLines(canvas, new  DOMMatrix(), stroke.inputs.map(inp => inp.point), overridePressure)
  } else {
    const [first, ...lests] = stroke.inputs
    if (!first) return
    pen.moveTo(first.point)
    lests.forEach(inp => {
      pen.drawTo(canvas, new  DOMMatrix(), inp.point, inp.pressure)
    })  
  }
}

export const replayCelarAllStroke = (canvas: AbstractCanvas) => {
  canvas.clear()
}

export const replayStrokes = (canvas: AbstractCanvas, strokes: StrokeRecord[]) => {
  strokes.forEach(stroke => {
    if (stroke.tool === 'pen') {
      replayPenStroke(canvas, stroke)
    }
    if (stroke.tool === 'clearAll') {
      replayCelarAllStroke(canvas )
    }
  })
}