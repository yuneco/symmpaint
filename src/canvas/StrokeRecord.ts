import { Coordinate } from '../coords/Coordinate'
import { Point } from '../coords/Point'
import { PenState } from './Pen'

type PenInput = {
  point: Point
  pressure: number
}

export class StrokeRecord {
  readonly inputs: PenInput[] = []
  readonly penState: PenState
  readonly canvasCoord: Coordinate
  
  constructor(canvasCoord: Coordinate, penState: PenState) {
    this.canvasCoord = canvasCoord
    this.penState = penState
  }

  addPoint(point: Point, pressure: number) {
    this.inputs.push({point, pressure})
  }

}
