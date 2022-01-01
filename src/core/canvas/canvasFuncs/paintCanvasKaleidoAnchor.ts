import { Coordinate } from '../..'
import { AbstractCanvas } from '../AbstractCanvas'
import { paintKaleidoGrid } from '../strokeFuncs/canvasPaintFuncs'

export const paintCanvasKaleidoAnchor = (
  view: AbstractCanvas,
  coord: Coordinate,
  anchor: [Coordinate, Coordinate],
  isKaleido: [boolean, boolean],
  penCount: [number, number],
  color: [string, string]
) => {
  const [hasParentGrid, hasChildGrid] = [penCount[0] >= 2, penCount[1] >= 2]
  const [pKaleido, cKaleido] = isKaleido
  const [pCount, cCount] = [
    penCount[0] * (pKaleido ? 2 : 1),
    penCount[1] * (cKaleido ? 2 : 1),
  ]
  const [pAnchor, cAnchor] = anchor
  const angleP2C = cAnchor.scroll.sub(pAnchor.scroll).angle

  const parentAngleOffset = penCount[0] % 2 ? 360 / pCount / 2 : 0

  const pAngle = coord.angle + anchor[0].angle + parentAngleOffset

  if (hasParentGrid) {
    // root coord
    paintKaleidoGrid(
      view,
      pCount,
      isKaleido[0],
      new Coordinate({
        scroll: coord.scroll.invert
          .move(anchor[0].scroll)
          .scale(coord.scale)
          .rotate(coord.angle),
        angle: pAngle,
      }),
      hasChildGrid ? '#cccccc' : color[0]
    )
  }

  if (hasChildGrid) {
    // child coord
    paintKaleidoGrid(
      view,
      cCount,
      isKaleido[1],
      new Coordinate({
        scroll: coord.scroll.invert
          .move(anchor[1].scroll)
          .scale(coord.scale)
          .rotate(coord.angle),
        angle: coord.angle + angleP2C + anchor[1].angle + 90,
      }),
      color[1],
      true
    )
  }
}
