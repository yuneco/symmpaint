import { AbstractCanvas } from './AbstractCanvas'
import { Coordinate } from '../coords/Coordinate'
import { PaintEvent } from '../events/PaintEvent'
import { clearCanvas, fillCanvas } from './strokeFuncs/canvasPaintFuncs'
import { Point } from '../coords/Point'
import { CanvasHistory } from './CanvasHistory'
import { Pen } from './Pen'
import { StrokeStyle } from './StrokeStyle'
import { cursorForTool } from '../events/cursorForTool'
import { useDragEvent } from '../events/useDragEvent'
import { TouchTransform, useTouchTransform } from '../events/useTouchTransform'
import { isSameArray } from '../misc/ArrayUtil'
import { StrokeState, useStrokeTools } from './canvasFuncs/useStrokeTools'
import { CanvasEventParm, PaintCanvasEvent } from './PaintCanvasEvent'
import { createPen } from './penFuncs/createPen'
import { PaintCanvasSetting } from './PaintCanvasSetting'
import { paintCanvasKaleidoAnchor } from './canvasFuncs/paintCanvasKaleidoAnchor'

// Retina対応: 固定でx2
const RESOLUTION = 2 //window.devicePixelRatio

/** カーソル移動を検出する最低距離(px) */
const MIN_CURSOR_MOVE = 3.5

// ペンのモードごとの合成モード
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
    strokeStart: new PaintEvent(),
    strokeEnd: new PaintEvent(),
  } as const

  // キャンバスの設定
  private setting: PaintCanvasSetting = {
    style: new StrokeStyle(),
    stamp: undefined,
    tool: 'draw',
    backgroundColor: '#ffffff',
    anchor: [new Coordinate(), new Coordinate()],
    penCount: [1, 0],
    isKaleido: [false, false],
    anchorColor: ['#91bccc', '#eeaabb'],
    enableCapure: true
  }

  /**
   * 描画用のペン
   * キャンバスの設定を変更した際はrebuildPenで再生成してください
   */
  private readonly pen: Pen = new Pen()

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
      (ev) => {
        const onStarted = stroke.onDown(ev)
        if (onStarted) this.events.strokeStart.fire()
        return onStarted
      },
      (ev, dist) => stroke.onDrag(ev, dist),
      (ev, dist) => {
        const isPainted = stroke.onUp(ev, dist)
        this.events.strokeEnd.fire(isPainted)
      },
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

  get canvasPen() {
    return this.pen.clone()
  }

  get coord() {
    return this.canvas.coord
  }

  set coord(c: Coordinate) {
    this.canvas.coord = c
    this.rePaint()
  }

  get tool() {
    return this.setting.tool
  }

  set tool(v) {
    this.setting.tool = v
    this.view.el.style.cursor = cursorForTool(v)
  }

  get isKaleido(): [boolean, boolean] {
    return [...this.setting.isKaleido]
  }

  set isKaleido(v) {
    if (isSameArray(this.isKaleido, v)) return
    this.setting.isKaleido = [...v]
    this.rebuildPen()
    this.rePaint()
  }

  get penCount(): [number, number] {
    return this.setting.penCount
  }
  set penCount(count) {
    if (isSameArray(this.penCount, count)) return
    this.setting.penCount = [...count]
    this.rebuildPen()
    this.rePaint()
  }

  get hasSubPen() {
    return this.penCount[1] >= 1
  }

  set penWidth(v: number) {
    this.setting.style = this.setting.style.clone({ penSize: v })
  }

  set penColor(v: string) {
    this.setting.style = this.setting.style.clone({ color: v })
  }

  set penAlpha(v: number) {
    this.setting.style = this.setting.style.clone({ alpha: v })
  }

  get penKind(): 'normal' | 'eraser' {
    const comp = this.setting.style.composition
    return comp === '' ? 'normal' : 'eraser'
  }

  set penKind(v: 'normal' | 'eraser') {
    this.setting.style = this.setting.style.clone({
      composition: PENKIND2COMPOSITION[v],
    })
  }

  get stamp() {
    return this.setting.stamp
  }

  set stamp(v) {
    this.setting.stamp = v
  }

  get backgroundColor() {
    return this.setting.backgroundColor
  }

  set backgroundColor(v) {
    if (this.setting.backgroundColor === v) return
    this.setting.backgroundColor = v
    this.rePaint()
  }

  get anchor(): Coordinate {
    return this.setting.anchor[0]
  }

  set anchor(v: Coordinate) {
    this.setting.anchor[0] = v
    this.rebuildPen()
    this.rePaint()
  }

  get childAnchor(): Coordinate {
    return this.setting.anchor[1]
  }

  set childAnchor(v) {
    this.setting.anchor[1] = v
    this.rebuildPen()
    this.rePaint()
  }

  get activeAnchor(): Coordinate {
    return this.hasSubPen ? this.childAnchor : this.anchor
  }

  set activeAnchor(v) {
    this[this.hasSubPen ? 'childAnchor' : 'anchor'] = v
  }

  get style() {
    return this.setting.style
  }

  get anchorColor(): [string, string] {
    return [...this.setting.anchorColor]
  }

  set anchorColor(v) {
    this.setting.anchorColor = [...v]
  }

  get enableCapture() {
    return this.setting.enableCapure
  }

  set enableCapture(v) {
    this.setting.enableCapure = v
  }

  private rebuildPen() {
    this.pen.state = createPen(
      this.setting.penCount,
      this.setting.anchor,
      this.setting.isKaleido
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

  /** ストローク開始時のイベントハンドラ */
  listenStrokeStart(
    fn: (p: CanvasEventParm<'strokeStart'>) => void
  ) {
    this.events['strokeStart'].listen(fn)
  }
  /** ストローク終了時のイベントハンドラ */
  listenStrokeEnd(
    fn: (p: CanvasEventParm<'strokeEnd'>) => void
  ) {
    this.events['strokeEnd'].listen(fn)
  }

  /** キャンバスをクリアします */
  clear(isSaveHistory = true) {
    if (isSaveHistory) {
      this.history.start(
        this.coord,
        this.pen.state,
        this.setting.style,
        'clearAll'
      )
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
    return this.history.start(this.coord, this.pen.state, this.setting.style)
  }

  endHistory(commit: boolean, strokeCanvas?: AbstractCanvas) {
    if (!commit) {
      this.history.rollback()
      return
    }
    this.history.commit(this.canvas)
    strokeCanvas?.copy(this.canvas.ctx, {
      alpha: this.setting.style.alpha,
      composition: this.setting.style.composition,
    })
    this.rePaint()
  }

  async toImgBlob() {
    return new Promise<Blob>((resolve, reject) => {
      this.canvas.el.toBlob((blob) => (blob ? resolve(blob) : reject()))
    })
  }

  /**
   * ビュー座標→実キャンバス座標 の変換を行います
   * ビュー座標 : 表示用のキャンバスの座標系。中心が0,0
   * 実キャンバス座標 : データ実体のキャンバスの座標系。中心が0,0
   */
  view2canvasPos = (vp: Point, coordType: 'start' | 'current'): Point => {
    const coord =
      coordType === 'start' ? this.strokeState.startCoord : this.coord
    const cp = vp
      .scale(1 / coord.scale)
      .rotate(-coord.angle)
      .move(coord.scroll)
    return cp
  }
  /**
   * 実キャンバス座標→ビュー座標 の変換を行います
   * ビュー座標 : 表示用のキャンバスの座標系。中心が0,0
   * 実キャンバス座標 : データ実体のキャンバスの座標系。中心が0,0
   */
  canvas2viewPos = (cp: Point, coordType: 'start' | 'current'): Point => {
    const coord =
      coordType === 'start' ? this.strokeState.startCoord : this.coord
    const vp = cp
      .move(coord.scroll.invert)
      .rotate(coord.angle)
      .scale(coord.scale)
    return vp
  }
  /** 
   * 実キャンバス→画面座標 の変換を行います
   * 実キャンバス座標 : データ実体のキャンバスの座標系。中心が0,0
   * 画面座標 : 画面表示されるキャンバスの左上を0,0とした座標
   */
  canvas2displayPos = (cp: Point, coordType: 'start' | 'current'): Point => {
    return this.canvas2viewPos(cp, coordType)
      .move(new Point(this.width, this.height))
      .scale(1 / RESOLUTION)
  }
  /** 
   * 画面座標→実キャンバス の変換を行います
   * 画面座標 : 画面表示されるキャンバスの左上を0,0とした座標
   * 実キャンバス座標 : データ実体のキャンバスの座標系。中心が0,0
   */
  display2canvasPos = (dp: Point, coordType: 'start' | 'current'): Point => {
    return this.canvas2viewPos(
      dp.scale(RESOLUTION).move(new Point(-this.width, -this.height)),
      coordType
    )
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

  private rePaintRequestId = 0
  rePaint(customPaint?: (ctx: CanvasRenderingContext2D) => void) {
    cancelAnimationFrame(this.rePaintRequestId)
    this.rePaintRequestId = requestAnimationFrame(() => {
      this.rePaintRequestId = 0
      fillCanvas(this.view, '#cccccc')
      this.canvas.output(this.view.ctx, { background: this.backgroundColor })
      customPaint?.(this.view.ctx)
      paintCanvasKaleidoAnchor(
        this.view,
        this.coord,
        this.setting.anchor,
        this.isKaleido,
        this.penCount,
        this.setting.anchorColor
      )
    })
  }
}
