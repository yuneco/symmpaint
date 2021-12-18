import { AbstractCanvas } from './AbstractCanvas'
import { Coordinate } from '../coords/Coordinate'
import { PaintEvent } from '../events/PaintEvent'
import {
  clearCanvas,
  fillCanvas,
  paintKaraidGrid,
} from './strokeFuncs/canvasPaintFuncs'
import { Point } from '../coords/Point'
import { CanvasToolName } from './CanvasToolName'
import { CanvasHistory } from './CanvasHistory'
import { Pen } from './Pen'
import { StrokeStyle } from './StrokeStyle'
import { StrokeRecord } from './StrokeRecord'
import { cursorForTool } from '../events/cursorForTool'
import { useDragEvent } from '../events/useDragEvent'
import { TouchTransform, useTouchTransform } from '../events/useTouchTransform'
import { isSameArray } from '../misc/ArrayUtil'
import { StrokeState, useStrokeTools } from './toolFuncs/useStrokeTools'
import { CanvasEventParm, PaintCanvasEvent } from './PaintCanvasEvent'
import { createPen } from './penFuncs/createPen'

// Retina対応: 固定でx2
const RESOLUTION = 2 //window.devicePixelRatio

/** カーソル移動を検出する最低距離(px) */
const MIN_CURSOR_MOVE = 3.5

const PENKIND2COMPOSITION = {
  normal: '',
  eraser: 'destination-out',
}

export class PaintCanvas {
  readonly width: number
  readonly height: number
  readonly resolution = RESOLUTION

  /** 描画バッファCanvas */
  private readonly canvas: AbstractCanvas
  /** 表示用Canvas */
  private readonly view: AbstractCanvas
  /** 履歴 */
  private readonly history: CanvasHistory
  /** 現在のストロークの状態 */
  private strokeState: StrokeState

  // 変更通知イベント
  private readonly events: PaintCanvasEvent = {
    requestChangeZoom: new PaintEvent(),
    requestScrollTo: new PaintEvent(),
    requestRotateTo: new PaintEvent(),
    requestUndo: new PaintEvent(),
    requestAnchorTransform: new PaintEvent(),
    requestAnchorReset: new PaintEvent(),
  } as const

  readonly pen: Pen = new Pen()
  style: StrokeStyle = new StrokeStyle()
  stamp?: StrokeRecord
  private _tool: CanvasToolName = 'draw'
  private _backgroundColor = '#ffffff'
  private _anchor: [Coordinate, Coordinate] = [
    new Coordinate(),
    new Coordinate(),
  ]
  private _penCount: [number, number] = [1, 0]
  private _isKaleido: [boolean, boolean] = [false, false]

  /**
   * キャンバスを生成します
   * @param parent キャンバス挿入先
   */
  constructor(parent: HTMLElement, width: number, height: number) {
    this.width = width
    this.height = height
    // 描画先・表示先を生成
    this.canvas = new AbstractCanvas(
      this.width * RESOLUTION,
      this.height * RESOLUTION
    )
    this.view = new AbstractCanvas(
      this.width * RESOLUTION,
      this.height * RESOLUTION
    )
    this.history = new CanvasHistory(
      this.width * RESOLUTION,
      this.height * RESOLUTION
    )

    // canvas要素をDOMに挿入
    this.view.el.style.width = `${width}px`
    this.view.el.style.height = `${height}px`
    parent.appendChild(this.view.el)

    // デバッグ用に表示
    const debugBox = document.getElementById('debug')
    if (debugBox) {
      const debugScale = 200 / Math.max(width, height)
      this.canvas.el.style.width = `${width * debugScale}px`
      this.canvas.el.style.height = `${height * debugScale}px`
      debugBox.querySelector('.canvas')?.appendChild(this.canvas.el)
    }

    // ストロークイベントの初期化
    const stroke = useStrokeTools(this, {
      onScroll: (point, target) =>
        this.events.requestScrollTo.fire({ point, target }),
      onRotate: (angle, target) =>
        this.events.requestRotateTo.fire({ angle, target }),
      onZoom: (scale) => this.events.requestChangeZoom.fire(scale),
    })
    this.strokeState = stroke.strokeState

    // マルチタッチでのキャンバス操作を初期化
    useTouchTransform(
      this.view.el,
      {
        onStart: () => {
          this.strokeState.enabled = false
        },
        onTransform: (tr, count) =>
          count >= 3
            ? this.onTouchTramsformAnchor(tr)
            : this.onTouchTramsformCanvas(tr),
        onEnd: () => {
          this.strokeState.enabled = true
        },
        onTwoFingerTap: () => this.events.requestUndo.fire(),
        onThreeFingerTap: () => this.events.requestAnchorReset.fire(),
      },
      MIN_CURSOR_MOVE
    )

    // キャンバス上のマウスイベントを初期化
    useDragEvent(
      this.view.el,
      (ev) => stroke.onDown(ev),
      (ev, dist) => stroke.onDrag(ev, dist),
      (ev, dist) => stroke.onUp(ev, dist),
      () =>
        this.tool === 'scroll:anchor' || this.tool === 'rotate:anchor'
          ? this.canvas2displayPos(this.activeAnchor.scroll, 'start')
          : undefined,
      MIN_CURSOR_MOVE
    )

    this.childAnchor = new Coordinate({ scroll: new Point(300, 0), angle: 0 })
    this.tool = 'draw'
    this.clear(false)
  }

  get coord() {
    return this.canvas.coord
  }

  set coord(c: Coordinate) {
    this.canvas.coord = c
    this.rePaint()
  }

  get tool() {
    return this._tool
  }

  set tool(v) {
    this._tool = v
    this.view.el.style.cursor = cursorForTool(v)
  }

  get isKaleido(): [boolean, boolean] {
    return [...this._isKaleido]
  }

  set isKaleido(v) {
    if (isSameArray(this.isKaleido, v)) return
    this._isKaleido = [...v]
    this.rebuildPen()
    this.rePaint()
  }

  get penCount(): [number, number] {
    return this._penCount
  }
  set penCount(count) {
    if (isSameArray(this.penCount, count)) return
    this._penCount = [...count]
    this.rebuildPen()
    this.rePaint()
  }

  get hasSubPen() {
    return this.penCount[1] >= 1
  }

  set penWidth(v: number) {
    this.style = this.style.clone({ penSize: v })
  }

  set penColor(v: string) {
    this.style = this.style.clone({ color: v })
  }

  set penAlpha(v: number) {
    this.style = this.style.clone({ alpha: v })
  }

  get penKind(): 'normal' | 'eraser' {
    const comp = this.style.composition
    return comp === '' ? 'normal' : 'eraser'
  }

  set penKind(v: 'normal' | 'eraser') {
    this.style = this.style.clone({ composition: PENKIND2COMPOSITION[v] })
  }

  get hasStamp() {
    return !!this.stamp
  }

  get backgroundColor() {
    return this._backgroundColor
  }

  set backgroundColor(v) {
    if (this._backgroundColor === v) return
    this._backgroundColor = v
    this.rePaint()
  }

  get anchor(): Coordinate {
    return this._anchor[0]
  }

  set anchor(v: Coordinate) {
    this._anchor[0] = v
    this.rebuildPen()
    this.rePaint()
  }

  get childAnchor(): Coordinate {
    return this._anchor[1]
  }

  set childAnchor(v) {
    this._anchor[1] = v
    this.rebuildPen()
    this.rePaint()
  }

  get activeAnchor(): Coordinate {
    return this.hasSubPen ? this.childAnchor : this.anchor
  }

  set activeAnchor(v) {
    this[this.hasSubPen ? 'childAnchor' : 'anchor'] = v
  }

  private rebuildPen() {
    this.pen.state = createPen(
      this._penCount,
      this._anchor,
      this._isKaleido
    ).state
  }

  /** ズーム変更操作発生時のリスナーを登録します。ズームを行うにはリスナー側で座標系(coord.scale)を変更します */
  listenRequestZoom(fn: (p: CanvasEventParm<'requestChangeZoom'>) => void) {
    this.events['requestChangeZoom'].listen(fn)
  }

  /** スクロール操作発生時のリスナーを登録します。スクロールを行うにはリスナー側で座標系(coord.scroll)を変更します */
  listenRequestScrollTo(fn: (p: CanvasEventParm<'requestScrollTo'>) => void) {
    this.events['requestScrollTo'].listen(fn)
  }

  /** 回転操作発生時のリスナーを登録します。回転を行うにはリスナー側で座標系(coord.angle)を変更します */
  listenRequestRotateTo(fn: (p: CanvasEventParm<'requestRotateTo'>) => void) {
    this.events['requestRotateTo'].listen(fn)
  }

  /** Undo操作発生時のリスナーを登録します。Undoを行うにはリスナー側でundoメソッドを呼び出します */
  listenRequestUndo(fn: (p: CanvasEventParm<'requestUndo'>) => void) {
    this.events['requestUndo'].listen(fn)
  }

  /** アンカー移動/回転操作発生時のリスナーを登録します。アンカー移動を行うにはリスナー側でanchorプロパティを変更します */
  listenRequestAnchorTransform(
    fn: (p: CanvasEventParm<'requestAnchorTransform'>) => void
  ) {
    this.events['requestAnchorTransform'].listen(fn)
  }

  /** アンカーリセット操作発生時のリスナーを登録します。アンカーリセットを行うにはリスナー側でanchorプロパティを変更します */
  listenRequestAnchorReset(
    fn: (p: CanvasEventParm<'requestAnchorReset'>) => void
  ) {
    this.events['requestAnchorReset'].listen(fn)
  }

  /** キャンバスをクリアします */
  clear(isSaveHistory = true) {
    if (isSaveHistory) {
      this.history.start(this.coord, this.pen.state, this.style, 'clearAll')
      this.history.commit(this.canvas)
    }
    clearCanvas(this.canvas)
    this.rePaint()
  }

  /** 最後のストロークを取り消します */
  undo() {
    if (!this.history.undoable) return
    this.clear(false)
    this.history.undo(this.canvas)
    this.rePaint()
  }

  startHistory() {
    return this.history.start(this.coord, this.pen.state, this.style)
  }

  endHistory(commit: boolean, strokeCanvas?: AbstractCanvas) {
    if (!commit) {
      this.history.rollback()
      return
    }
    this.history.commit(this.canvas)
    strokeCanvas?.copy(this.canvas.ctx, {
      alpha: this.style.alpha,
      composition: this.style.composition,
    })
    this.rePaint()
  }

  async toImgBlob() {
    return new Promise<Blob>((resolve, reject) => {
      this.canvas.el.toBlob((blob) => (blob ? resolve(blob) : reject()))
    })
  }

  view2canvasPos = (vp: Point, coordType: 'start' | 'current'): Point => {
    const coord =
      coordType === 'start' ? this.strokeState.startCoord : this.coord
    const cp = vp
      .scale(1 / coord.scale)
      .rotate(-coord.angle)
      .move(coord.scroll)
    return cp
  }
  canvas2viewPos = (cp: Point, coordType: 'start' | 'current'): Point => {
    const coord =
      coordType === 'start' ? this.strokeState.startCoord : this.coord
    const vp = cp
      .move(coord.scroll.invert)
      .rotate(coord.angle)
      .scale(coord.scale)
    return vp
  }
  canvas2displayPos = (cp: Point, coordType: 'start' | 'current'): Point => {
    return this.canvas2viewPos(cp, coordType)
      .move(new Point(this.width, this.height))
      .scale(1 / RESOLUTION)
  }

  private onTouchTramsformCanvas(transform: TouchTransform) {
    const startCoord = this.strokeState.startCoord
    const { center, scroll, scale, angle } = transform

    // viewキャンバスの距離（移動量）を実キャンバスの座標系に変換します
    const view2canvasDist = (vp: Point): Point => {
      const cp = vp.rotate(-startCoord.angle).scale(1 / startCoord.scale)
      return cp
    }

    // タッチ中心 @ viewキャンバス座標系
    const posView = new Point(
      (center.x - this.width / 2) * RESOLUTION,
      (center.y - this.height / 2) * RESOLUTION
    )
    // タッチ中心 @ 実キャンバス座標系
    const posCanvas = this.view2canvasPos(posView, 'start')

    // 画面中心 @ viewキャンバス座標系
    const viewCenter = new Point(0, 0)

    // 画面中心 @ 実キャンバス座標系
    const viewCenterAtCanvas = this.view2canvasPos(viewCenter, 'start')

    // タッチ中心 - 画面中心 @ 実キャンバス座標系
    const posCanvasFromCenter = posCanvas.sub(viewCenterAtCanvas)

    // タッチ操作（回転・スケール）での移動量 @ 実キャンバス座標系
    const posMoved = posCanvasFromCenter.rotate(-angle).scale(1 / scale)
    const posSub = posMoved.sub(posCanvasFromCenter)

    // タッチ操作スクロール量 @ viewキャンバス座標系
    const viewScroll = scroll.scale(RESOLUTION)
    // タッチ操作スクロール量 @ 実キャンバス座標系
    const canvasScroll = view2canvasDist(viewScroll)

    this.events.requestRotateTo.fire({
      angle: startCoord.angle + angle,
      target: 'canvas',
    })
    this.events.requestChangeZoom.fire(startCoord.scale * scale)
    this.events.requestScrollTo.fire({
      point: startCoord.scroll.sub(posSub).sub(canvasScroll),
      target: 'canvas',
    })
  }

  private onTouchTramsformAnchor(transform: TouchTransform) {
    const targetAnchor = this.strokeState.startAnchor[this.hasSubPen ? 1 : 0]

    const angle = transform.angle + targetAnchor.angle
    const scroll = transform.scroll
      .scale((1 / this.strokeState.startCoord.scale) * RESOLUTION)
      .rotate(-this.strokeState.startCoord.angle)
      .move(targetAnchor.scroll)

    this.events.requestAnchorTransform.fire(
      targetAnchor.clone({ scroll, angle })
    )
  }

  private paintGrid() {
    const [countParent, countChild] = this.penCount
    const [hasParentGrid, hasChildGrid] = [countParent >= 2, countChild >= 2]
    if (hasParentGrid) {
      // root coord
      paintKaraidGrid(
        this.view,
        countParent * (this.isKaleido[0] ? 2 : 1),
        this.isKaleido[0],
        new Coordinate({
          scroll: this.coord.scroll.invert
            .move(this.anchor.scroll)
            .scale(this.canvas.coord.scale)
            .rotate(this.coord.angle),
          angle: this.coord.angle + this.anchor.angle,
        }),
        hasChildGrid ? '#cccccc' : undefined
      )
    }
    if (hasChildGrid) {
      // child coord
      paintKaraidGrid(
        this.view,
        countChild * (this.isKaleido[1] ? 2 : 1),
        this.isKaleido[1],
        new Coordinate({
          scroll: this.coord.scroll.invert
            .move(this.childAnchor.scroll)
            .scale(this.canvas.coord.scale)
            .rotate(this.coord.angle),
          angle: this.coord.angle + this.anchor.angle + this.childAnchor.angle,
        }),
        '#eeaabb'
      )
    }
  }

  rePaint(customPaint?: (ctx: CanvasRenderingContext2D) => void) {
    fillCanvas(this.view, '#cccccc')
    this.canvas.output(this.view.ctx, { background: this.backgroundColor })
    customPaint?.(this.view.ctx)
    this.paintGrid()
  }
}
