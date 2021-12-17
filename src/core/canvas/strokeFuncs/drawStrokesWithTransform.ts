import { computeSidePoints, smooth, vector2, Vector2 } from "svg-variable-width-line";
import { PenInput, PenStroke } from "../PenInput";

const points2path = (points: ({x: number, y: number})[]) => {
  const [first, ...edges] = points
  const d = `M${first.x}, ${first.y} L` + edges.map(p => isNaN(p.x + p.y) ? '' : `${p.x}, ${p.y}`).join(' ') + ''
  return new Path2D(d)
} 

const splitStroke = (inputs: PenStroke): PenStroke[] => {
  if (inputs.length <= 2) return [inputs]
  for(let index = 2; index < inputs.length; index++) {
    const p1 = inputs[index - 2]
    const p2 = inputs[index - 1]
    const p3 = inputs[index - 0]
    const a1 = p2.point.sub(p1.point).angle;
    const a2 = p3.point.sub(p2.point).angle;

    const angle = Math.abs(a1 - a2)
    if (Math.abs(angle - 180) < 10) {
      return [inputs.slice(0, index), ...splitStroke(inputs.slice(index - 1))]
    }  
  }
  return [inputs]
}

const createPath = (inputs: PenInput[], thickness: number) => {

  const points = inputs.map(inp => ({
    x: inp.point.x,
    y: inp.point.y,
    w: Math.max(1, inp.pressure * thickness)
  }))
  // const smoothedPoints = smooth(points, 3)
  // return new Path2D(compute(...smoothedPoints).d)

  const smoothedPoints = smooth(points, 3)
  const edgePoints: Vector2[] = [];
  for (let index = 0; index < smoothedPoints.length; index += 1) {
    const { left, right } = computeSidePoints(
      smoothedPoints[index],
      smoothedPoints[index - 1] || smoothedPoints[index + 1]
    );
    const lastLeft = edgePoints.slice(index)[0];
    let swap = false
    if (lastLeft) {
      const ll =  vector2.length(lastLeft, left)
      const lr = vector2.length(lastLeft, right)
      swap = ll - lr > 0
    }
    if (
      lastLeft &&
      swap
    ) {
      edgePoints.splice(index, 0, left, right);
    } else {
      edgePoints.splice(index, 0, right, left);
    }
  }

  return points2path(edgePoints)
}

/**
 * ストロークを描画します
 * @param ctx 出力先。塗り色(fillStyle)と線の太さ(lineWidth)はこのctxに設定されているものを使用します
 * @param inputStrokes ストローク
 * @param transforms 複製する座標変換。ストロークをこのtransformの数だけ、座標変換した上で描画します
 */
export const drawStrokesWithTransform = (ctx: CanvasRenderingContext2D ,inputStrokes: PenStroke[], transforms: (DOMMatrix | undefined)[]) => {
  const strokes = inputStrokes.flatMap(splitStroke)
  const pathParts = strokes.map(st => createPath(st, ctx.lineWidth))
  transforms.forEach(tr => {
    pathParts.forEach(path => {
      const p = new Path2D()
      p.addPath(path, tr)
      ctx.fill(p)
    })
  })
}