import { Coordinate } from "../.."
import { AbstractCanvas } from "../AbstractCanvas"
import { paintKaleidoGrid } from "../strokeFuncs/canvasPaintFuncs"

export const  paintCanvasKaleidoAnchor = (view: AbstractCanvas, coord: Coordinate, anchor: [Coordinate, Coordinate], isKaleido: [boolean, boolean], penCount: [number, number], color: [string, string]) => {
  const [countParent, countChild] = penCount
  const [hasParentGrid, hasChildGrid] = [countParent >= 2, countChild >= 2]
  if (hasParentGrid) {
    // root coord
    paintKaleidoGrid(
      view,
      countParent * (isKaleido[0] ? 2 : 1),
      isKaleido[0],
      new Coordinate({
        scroll: coord.scroll.invert
          .move(anchor[0].scroll)
          .scale(coord.scale)
          .rotate(coord.angle),
        angle: coord.angle + anchor[0].angle,
      }),
      hasChildGrid ? '#cccccc' : color[0]
    )
  }
  if (hasChildGrid) {
    // child coord
    paintKaleidoGrid(
      view,
      countChild * (isKaleido[1] ? 2 : 1),
      isKaleido[1],
      new Coordinate({
        scroll: coord.scroll.invert
          .move(anchor[1].scroll)
          .scale(coord.scale)
          .rotate(coord.angle),
        angle: coord.angle + anchor[0].angle + anchor[1].angle,
      }),
      color[1]
    )
  }
}
