import { Coordinate } from "..";
import { CanvasToolName } from "./CanvasToolName";
import { StrokeRecord } from "./StrokeRecord";
import { StrokeStyle } from "./StrokeStyle";

export type PaintCanvasSetting = {
  style: StrokeStyle
  tool: CanvasToolName
  backgroundColor: string
  anchor: [Coordinate, Coordinate]
  penCount: [number, number]
  isKaleido: [boolean, boolean]
  stamp: StrokeRecord | undefined
}
