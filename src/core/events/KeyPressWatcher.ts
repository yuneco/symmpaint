import { PaintEvent } from './PaintEvent'

type KeyChangeEvent = PaintEvent<{ key: string; isDown: boolean }>

/**
 * キーの押下状態を監視・保持します
 */
export class KeyPressWatcher {
  private readonly target: HTMLElement
  private readonly _keys: { [k: string]: true } = {}
  private readonly _removeEvents: () => void
  private readonly onChange: KeyChangeEvent = new PaintEvent()

  /**
   * キー操作の監視インスタンス話生成
   * @param el イベント監視対象の要素。省略時はbody
   */
  constructor(el?: HTMLElement) {
    this.target = el ?? document.body

    const onDown = (ev: KeyboardEvent) => {
      const name = ev.key
      this._keys[name] = true
      this.onChange.fire({ key: name, isDown: true })
    }
    const onUp = (ev: KeyboardEvent) => {
      const name = ev.key
      delete this._keys[name]
      this.onChange.fire({ key: name, isDown: false })
    }
    this.target.addEventListener('keydown', onDown)
    this.target.addEventListener('keyup', onUp)
    this._removeEvents = () => {
      this.target.removeEventListener('keydown', onDown)
      this.target.removeEventListener('keyup', onUp)
    }
  }

  /**
   * キー押下状態の変更を受け取るリスナーを追加します
   * @param params リスナー
   */
  listen(...params: Parameters<KeyChangeEvent['listen']>) {
    this.onChange.listen(...params)
  }

  /** 監視を終了します */
  destroy() {
    this._removeEvents()
    this.onChange.clear()
  }

  /** 指定したキーが押されているか判定します */
  key(name: string): boolean {
    return !!this._keys[name]
  }

  /** 押されているキーの一覧を返します */
  get keys(): string[] {
    return Object.keys(this._keys)
  }
}
