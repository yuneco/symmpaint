import { Coordinate, Point } from '../..'
import { normalizeAngle } from '../../coords/CoordUtil'
import { PointsDist } from '../../coords/PointsDist'
import { getNextZoom } from '../../events/zoomTable'
import { AbstractCanvas } from '../AbstractCanvas'
import { CanvasToolName } from '../CanvasToolName'
import { PaintCanvas } from '../PaintCanvas'
import { TransformTarget } from '../PaintCanvasEvent'
import { Pen } from '../Pen'
import { clearCanvas } from '../strokeFuncs/canvasPaintFuncs'
import { getStrokeEndPressure } from '../strokeFuncs/getStrokePressure'
import { replayPenStroke } from '../strokeFuncs/replayStrokes'
import { StrokeRecord } from '../StrokeRecord'

type EventStatus = {
  /** 現在のストロークで実行中の操作 */
  activeEvent: CanvasToolName | undefined
  /** 現在のストローク開始時の座標系（スクロールや回転で使用） */
  startCoord: Coordinate
  /** 現在のストローク開始時のアンカー[root, child] */
  startAnchor: [Coordinate, Coordinate]
  /** 現在のストローク開始時の座標 */
  startPoint: Point
  /** 現在のストロークにおける直近の座標 */
  lastPoint: Point
  /** スタンプのキャプチャーモードか？ */
  isCapturing: boolean
  /** 履歴の現在のストローク */
  currentStroke: StrokeRecord | undefined
  /** 現在のストローク用のペン */
  pen: Pen
}

/** 移動の対象 */
type TransformScrollTarget = 'canvas' | 'anchor'
/** 回転の対象 */
type TransformRotateTarget = TransformScrollTarget

type CanvasEvents = {
  onScroll: (scroll: Point, target: TransformScrollTarget) => void
  onRotate: (angle: number, target: TransformRotateTarget) => void
  onZoom: (scale: number) => void
}

export type StrokeState = {
  enabled: boolean
} & Readonly<Pick<EventStatus, 'startCoord' | 'startAnchor'>>

/**
 * キャンバスのツール設定に従い、ストロークによる描画操作とスクロール・ズーム等の変形操作要求を行います。
 * pointerdown〜pointerupまでの一連の操作を1ストロークとし、ストロークの中間状態を管理します。
 * 描画操作：
 *   ツールがdrawやdraw:line等の描画系に設定されている場合、ストロークによるこれらの描画を行います
 * 変形操作: 
 *   スクロール・回転・ズームの量を計算し、変形要求としてhandlerで指定されたコールバックを呼び出します
 * @param canvas 
 * @param handler 変形操作のコールバック
 */
export const useStrokeTools = (canvas: PaintCanvas, handler: CanvasEvents) => {
  let enabled = true
  const eventStatus: EventStatus = {
    activeEvent: undefined,
    startCoord: new Coordinate(),
    startAnchor: [new Coordinate(), new Coordinate()],
    startPoint: new Point(),
    lastPoint: new Point(),
    isCapturing: false,
    currentStroke: undefined,
    pen: new Pen()
  }

  const strokeCanvas = new AbstractCanvas(
    canvas.width * canvas.resolution,
    canvas.height * canvas.resolution
  )

  const event2viewPoint = (ev: PointerEvent): Point => {
    return new Point(
      (ev.offsetX - canvas.width / 2) * canvas.resolution,
      (ev.offsetY - canvas.height / 2) * canvas.resolution
    )
  }

  const resetEventStatus = (ev: PointerEvent) => {
    const action = canvas.tool
    eventStatus.activeEvent = action
    eventStatus.startCoord = canvas.coord
    eventStatus.startAnchor = [canvas.anchor, canvas.childAnchor]
    eventStatus.lastPoint = eventStatus.startPoint = event2viewPoint(ev)
    eventStatus.isCapturing = ev.metaKey
    eventStatus.pen = canvas.canvasPen
    eventStatus.currentStroke = undefined
  }

  const onDown = (ev: PointerEvent): boolean => {
    if (!enabled) return false
    const action = canvas.tool
    resetEventStatus(ev)

    if (action === 'zoomup' || action === 'zoomdown') {
      const scale = canvas.coord.scale
      if (action === 'zoomup') handler.onZoom(getNextZoom(scale, true))
      if (action === 'zoomdown') handler.onZoom(getNextZoom(scale, false))
      return false
    }

    if (
      action === 'draw' ||
      action === 'draw:line' ||
      action === 'draw:stamp'
    ) {
      startStroke(eventStatus.startPoint)
    }

    return true
  }

  const onDrag = (ev: PointerEvent, dist: PointsDist) => {
    if (!enabled) return
    const action = eventStatus.activeEvent
    const viewP = event2viewPoint(ev)
    const inp = {
      point: viewP,
      pressure: ev.pressure,
    }
    if (action === 'draw' || action === 'draw:line') {
      clearCanvas(strokeCanvas)
      continueStroke(inp.point, inp.pressure || 0.5)
    }
    if (action === 'draw:stamp' && canvas.stamp) {
      const dp = inp.point.sub(eventStatus.startPoint)
      const stampScale = dp.length / 100
      clearCanvas(strokeCanvas)
      putStroke(
        canvas.stamp,
        eventStatus.startPoint,
        stampScale,
        dp.angle,
        true
      )
    }
    if (action === 'scroll') onScroll(dist, 'canvas')
    if (action === 'scroll:anchor') onScroll(dist, 'anchor')
    if (action === 'rotate') onRotate(dist, 'canvas')
    if (action === 'rotate:anchor') onRotate(dist, 'anchor')

    eventStatus.lastPoint = inp.point
    ev.preventDefault()
  }

  const onUp = (ev: PointerEvent, dist: PointsDist) => {
    if (!enabled) return
    const action = eventStatus.activeEvent
    const canvasP = event2viewPoint(ev)
    const hasPaint =
      action === 'draw' || action === 'draw:line' || action === 'draw:stamp'
    if (action === 'draw') {
      continueStroke(canvasP, ev.pressure || 0)
    }
    if (action === 'draw:line') {
      clearCanvas(strokeCanvas)
      const current = eventStatus.currentStroke
      const pressure = current ? getStrokeEndPressure(current.inputs) : 0.5
      continueStroke(canvasP, pressure)
      if (current) {
        current.inputs.length = 1
        current.inputs[0].pressure = pressure
        const last = { point: canvasP, pressure }
        current.inputs.push(last, last)
      }
    }
    if (action === 'draw:stamp' && canvas.stamp) {
      clearCanvas(strokeCanvas)
      const dp = canvasP.sub(eventStatus.startPoint)
      const stampScale = dp.length / 100
      putStroke(
        canvas.stamp,
        eventStatus.startPoint,
        stampScale,
        dp.angle,
        false
      )
    }

    if (
      (action === 'draw' || action === 'draw:line') &&
      eventStatus.isCapturing
    ) {
      canvas.stamp = eventStatus.currentStroke?.flatten
      endStroke(false)
      rePaint()
      return
    }

    if (action === 'scroll') onScroll(dist, 'canvas')
    if (action === 'scroll:anchor') onScroll(dist, 'anchor')
    if (action === 'rotate') onRotate(dist, 'canvas')
    if (action === 'rotate:anchor') onRotate(dist, 'anchor')

    endStroke(hasPaint)
  }

  /**
   * ストロークを開始します。
   * 一時キャンバスを有効にし、新規ストロークの記録を開始します。
   */
  const startStroke = (viewPoint: Point) => {
    const canvasPoint = canvas.view2canvasPos(viewPoint, 'start')
    strokeCanvas.coord = new Coordinate()
    strokeCanvas.ctx.lineWidth = canvas.style.penSize

    const penColor = () => {
      if (eventStatus.isCapturing) return '#0044aa'
      if (canvas.penKind === 'eraser') return canvas.backgroundColor
      return canvas.style.color
    }
    strokeCanvas.ctx.fillStyle = penColor()

    // ストロークの記録を開始
    eventStatus.currentStroke = canvas.startHistory()
    eventStatus.currentStroke.addPoint(canvasPoint, 0)
  }

  /**
   * 現在のストロークに座標を入力してストロークを継続します。
   * スクロークは一時キャンバスを経由して描画されます。
   * 履歴に座標を追加します。
   */
  const continueStroke = (viewPoint: Point, pressure = 0.5) => {
    const action = eventStatus.activeEvent
    const canvasPoint = canvas.view2canvasPos(viewPoint, 'start')
    const stroke = eventStatus.currentStroke
    if (!stroke) return
    stroke.addPoint(canvasPoint, pressure)
    if (action === 'draw:line') {
      const start = { point: stroke.inputs[0].point, pressure }
      const last = stroke.inputs[stroke.inputs.length - 1]
      const inps = [start, last, last]
      eventStatus.pen.drawStrokes(strokeCanvas, [inps])
    } else {
      eventStatus.pen.drawStrokes(strokeCanvas, [stroke.inputs])
    }
    rePaint()
  }

  /**
   * 現在のストロークを終了します。
   * @param commitStroke ストロークを確定するか？確定しない場合、現在のストロークは破棄されます。
   */
  const endStroke = (commitStroke: boolean) => {
    canvas.endHistory(commitStroke, strokeCanvas)
    clearCanvas(strokeCanvas)
    eventStatus.activeEvent = undefined
  }

  /**
   * 記録したストロークを現在のペンで描画します。
   * @param rec 配置するストローク
   * @param p 配置座標
   * @param scale スケール
   * @param angle 角度
   * @param isPreview プレビューモードで描画するか？プレビューモードを使用すると高速に描画できる代わりに筆圧固定になります
   */
  const putStroke = (
    rec: StrokeRecord,
    p: Point,
    scale: number,
    angle: number,
    isPreview: boolean
  ) => {
    const pen = new Pen()
    pen.state = eventStatus.pen.state

    const previewStyle = canvas.style.clone({
      color:
        canvas.penKind === 'eraser'
          ? canvas.backgroundColor
          : canvas.style.color,
    })

    const canvasP = p
    const stampRec = new StrokeRecord(
      canvas.coord,
      pen.state,
      isPreview ? previewStyle : canvas.style,
      rec.tool
    )
    const movedInps = rec.inputs.map((inp) => ({
      point: inp.point.scale(scale).rotate(angle).move(canvasP),
      pressure: inp.pressure,
    }))
    stampRec.inputs.push(...movedInps)
    replayPenStroke(strokeCanvas, stampRec)
    rePaint()

    const current = eventStatus.currentStroke
    if (!isPreview && current) {
      current.clearPoints()
      current.inputs.push(...stampRec.inputs)
    }
  }

  /** 現在のストロークがあればそれをキャンセルします */
  const cancelStroke = () => {
    endStroke(false)
  }


  const onScroll = (dist: PointsDist, target: TransformTarget) => {
    const anchorIndex = canvas.hasSubPen ? 1 : 0
    const targetCoord = {
      canvas: eventStatus.startCoord,
      anchor: eventStatus.startAnchor[anchorIndex],
    }[target]
    const scroll = targetCoord.scroll.move(
      dist.distance
        .scale((-1 / canvas.coord.scale) * canvas.resolution)
        .rotate(-canvas.coord.angle)
        .scale(target === 'anchor' ? -1 : 1)
    )
    handler.onScroll(scroll, target)
  }

  const onRotate = (dist: PointsDist, target: TransformTarget) => {
    const anchorIndex = canvas.hasSubPen ? 1 : 0
    const targetCoord = {
      canvas: eventStatus.startCoord,
      anchor: eventStatus.startAnchor[anchorIndex],
    }[target]
    const angle = targetCoord.angle + dist.angle
    handler.onRotate(normalizeAngle(angle), target )
  }

  /**
   * キャンバスに再描画を要求し、合わせて現在のストローク（引いている途中の線）を描画します
   */
  const rePaint = () => {
    canvas.rePaint((ctx: CanvasRenderingContext2D) => {
      strokeCanvas.ctx.save()
      strokeCanvas.coord = canvas.coord
      strokeCanvas.output(ctx, { alpha: canvas.style.alpha })
      strokeCanvas.ctx.restore()
    })
  }

  const strokeState: StrokeState = {
    get enabled() {
      return enabled
    },
    set enabled(v) {
      enabled = v
      if (!enabled) {
        cancelStroke()
      }
    },
    get startCoord() {
      return eventStatus.startCoord
    },
    get startAnchor() {
      return eventStatus.startAnchor
    },
  }

  return {
    onDown,
    onDrag,
    onUp,
    strokeState,
  }
}
