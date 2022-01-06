import { Point } from '../coords/Point'

export type PenInput = {
  point: Point
  pressure: number
}

export type PenStroke = PenInput[]
