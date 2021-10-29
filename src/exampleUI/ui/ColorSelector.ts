import './colorSelector.scss'

export class colorSelector {
  readonly el: HTMLDivElement
  readonly elColor: HTMLInputElement

  constructor(label: string, value = false, ) {
    const elOuter = (this.el = document.createElement('div'))
    const elColor = (this.elColor = document.createElement('input'))
    const elLabel = document.createElement('label')
    const elLabelText = document.createElement('span')

    elOuter.appendChild(elLabel)
    elLabel.appendChild(elColor)
    elLabel.appendChild(elLabelText)

    elOuter.className = 'ColorSelector'
    elColor.type = 'color'
    elColor.checked = value
    elLabelText.textContent = label
   }

  get value() {
    return this.elColor.value
  }

  set value(v) {
    this.elColor.value = v
  }

  addEventListener(
    ...params: Parameters<HTMLInputElement['addEventListener']>
  ) {
    return this.elColor.addEventListener(...params)
  }
  removeEventListener(
    ...params: Parameters<HTMLInputElement['removeEventListener']>
  ) {
    return this.elColor.removeEventListener(...params)
  }
}
