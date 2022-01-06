import { PaintEvent } from '../../core/events/PaintEvent'
import { Checkbox } from './Checkbox'
import './radioGroup.scss'

type SelItem = {
  cb: Checkbox
  key: string
}

export class RadioGroup<K extends readonly string[]> {
  private checks: SelItem[]
  private _value: K[number]
  readonly el: HTMLElement

  private _updating = false
  private onChange = new PaintEvent<K[number]>()

  constructor(items: { [key in K[number]]: string }, initial: K[number]) {
    const keys = Object.keys(items) as K[number][]
    this.checks = keys.map((key) => ({
      cb: new Checkbox(items[key]),
      key,
    }))
    this.value = initial
    this._value = initial
    this.checks.forEach((check) => {
      check.cb.addEventListener('change', () => {
        if (this._updating) return
        if (check.cb.value) {
          this.value = check.key
        }
      })
    })

    const el = (this.el = document.createElement('div'))
    el.className = 'RadioGroup'
    this.checks.forEach((check) => {
      el.appendChild(check.cb.el)
    })
  }

  get value() {
    return this._value
  }

  set value(v: K[number]) {
    const hasChanged = this._value !== v
    this._value = v
    this.updateChecked()
    if (!hasChanged) return
    this.onChange.fire(v)
  }

  private updateChecked() {
    this._updating = true
    this.checks.forEach((check) => (check.cb.value = check.key === this.value))
    this._updating = false
  }

  listenChange(...params: Parameters<typeof this.onChange.listen>) {
    this.onChange.listen(...params)
  }
}
