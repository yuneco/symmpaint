import './slider.scss'

export class Slider {
  readonly el: HTMLDivElement
  readonly elSlider: HTMLInputElement

  constructor(label: string, min = 0, max = 100, value = 0) {
    const elOuter = (this.el = document.createElement('div'))
    const elSlider = (this.elSlider = document.createElement('input'))
    const elLabel = document.createElement('label')
    const elLabelText = document.createElement('span')
    const elText = document.createElement('span')

    elOuter.appendChild(elLabel)
    elLabel.appendChild(elLabelText)
    elLabel.appendChild(elText)
    elLabel.appendChild(elSlider)

    elSlider.type = 'range'
    elSlider.className = 'Slider'
    elSlider.min = String(min)
    elSlider.max = String(max)
    elSlider.value = String(value)
    elLabelText.textContent = `${label}: `
    elText.textContent = elSlider.value

    elSlider.addEventListener('input', () => {
      elText.textContent = elSlider.value
    })
  }

  get value() {
    return this.elSlider.valueAsNumber
  }

  addEventListener(...params: Parameters<HTMLInputElement['addEventListener']>) {
    return this.elSlider.addEventListener(...params)
  }
  removeEventListener(...params: Parameters<HTMLInputElement['removeEventListener']>) {
    return this.elSlider.removeEventListener(...params)
  }
}
