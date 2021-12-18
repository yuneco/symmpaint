import { Coordinate } from "../.."
import { Pen } from "../Pen"

const relativeChildAnchor = (anchor: [Coordinate, Coordinate]): Coordinate => {
  return new Coordinate({
    scroll: anchor[1].scroll
      .sub(anchor[0].scroll)
      .rotate(-anchor[0].angle),
    angle: anchor[1].angle,
  })
}

export const createPen = (count: [number, number], anchor: [Coordinate, Coordinate], isKaleido: [boolean, boolean]) => {
  const root = new Pen()
  const [pKaleido, cKaleido] = isKaleido
  const [pCount, cCount] = [
    count[0] * (pKaleido ? 2 : 1),
    count[1] * (cKaleido ? 2 : 1),
  ]
  const relativeAnchor = relativeChildAnchor(anchor)

  root.coord = anchor[0]
  for (let penNo = 0; penNo < pCount; penNo++) {
    const isFlip = pKaleido && penNo % 2 !== 0
    const child = root.addChildPen(
      new Coordinate({ angle: (penNo / pCount) * 360, flipY: isFlip })
    )
    for (let penNoCh = 0; penNoCh < cCount; penNoCh++) {
      const isFlipCh = cKaleido && penNoCh % 2 !== 0
      child
        .addChildPen(
          new Coordinate({
            scroll: relativeAnchor.scroll,
            angle: relativeAnchor.angle,
          })
        )
        .addChildPen(
          new Coordinate({
            angle: (penNoCh / cCount) * 360,
            flipY: isFlipCh,
          })
        )
    }
  }

  return root
}
