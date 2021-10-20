import './checkbox.scss'

export class Checkbox {
  readonly el: HTMLDivElement
  readonly elCheck: HTMLInputElement

  constructor(label: string, value = false, ) {
    const elOuter = (this.el = document.createElement('div'))
    const elCheck = (this.elCheck = document.createElement('input'))
    const elLabel = document.createElement('label')
    const elLabelText = document.createElement('span')

    elOuter.appendChild(elLabel)
    elLabel.appendChild(elCheck)
    elLabel.appendChild(elLabelText)

    elCheck.type = 'checkbox'
    elCheck.className = 'Checkbox'
    elCheck.checked = value
    elLabelText.textContent = label
   }

  get value() {
    return this.elCheck.checked
  }

  set value(v) {
    this.elCheck.checked = v
  }

  addEventListener(
    ...params: Parameters<HTMLInputElement['addEventListener']>
  ) {
    return this.elCheck.addEventListener(...params)
  }
  removeEventListener(
    ...params: Parameters<HTMLInputElement['removeEventListener']>
  ) {
    return this.elCheck.removeEventListener(...params)
  }
}
