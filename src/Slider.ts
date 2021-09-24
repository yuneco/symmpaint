export class Slider {
  private elOuter: HTMLDivElement
  private elSlider: HTMLInputElement

  constructor(label: string, min = 0, max = 100, value = 0) {
    const elOuter = (this.elOuter = document.createElement('div'))
    const elSlider = (this.elSlider = document.createElement('input'))
    const elLabel = document.createElement('label')
    const elLabelText = document.createElement('span')
    const elText = document.createElement('span')

    elOuter.appendChild(elLabel)
    elLabel.appendChild(elLabelText)
    elLabel.appendChild(elText)
    elLabel.appendChild(elSlider)

    elSlider.type = 'range'
    elSlider.min = String(min)
    elSlider.max = String(max)
    elSlider.value = String(value)
    elLabelText.textContent = `${label}: `
    elText.textContent = elSlider.value

    elSlider.addEventListener('input', () => {
      elText.textContent = elSlider.value
    })
  }

  get el() {
    return this.elOuter
  }

  get slider() {
    return this.elSlider
  }

  get value() {
    return this.slider.valueAsNumber
  }
}
