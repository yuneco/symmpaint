import { PaintEvent } from "./PaintEvent"

export class KeyPressWatcher {
  private readonly target: HTMLElement
  private readonly _keys: { [k: string]: true } = {}
  private readonly _removeEvents: () => void
  private readonly onChange = new PaintEvent<{key: string, isDown: boolean}>()

  constructor(el?: HTMLElement) {
    this.target = el ?? document.body

    const onDown = (ev: KeyboardEvent) => {
      const name = ev.key
      this._keys[name] = true
      this.onChange.fire({key: name, isDown: true})
    }
    const onUp = (ev: KeyboardEvent) => {
      const name = ev.key
      delete this._keys[name]
      this.onChange.fire({key: name, isDown: false})
    }
    this.target.addEventListener('keydown', onDown)
    this.target.addEventListener('keyup', onUp)
    this._removeEvents = () => {
      this.target.removeEventListener('keydown', onDown)
      this.target.removeEventListener('keyup', onUp)
    }
  }

  listen(...params: Parameters<typeof this.onChange['listen']>) {
    this.onChange.listen(...params)
  }

  destroy() {
    this._removeEvents()
    this.onChange.clear()
  }

  key(name: string): boolean {
    return !!this._keys[name]
  }

  get keys(): string[] {
    return Object.keys(this._keys)
  }
}
