import { LitElement, html, customElement, property } from 'lit-element'
import './d3-cloud-element'
@customElement('demo-element')
export default class DemoElement extends LitElement {
  data: any = []

  @property({ type: Number })
  width = 700

  constructor() {
    super()
    const str = 'Exercitation duis ex laboris laboris est aliqua Lorem veniam ad. Minim aliqua enim do exercitation duis eiusmod sunt do exercitation qui ex. Aliqua velit sunt in commodo anim. Sunt labore sunt dolor exercitation non commodo laboris culpa culpa exercitation ex proident laborum.\n\nId dolore commodo occaecat in velit. Aliqua mollit ea qui ad aute est excepteur non aliqua occaecat ad non ea. Labore incididunt excepteur tempor culpa proident ex commodo. Nisi nostrud tempor deserunt ipsum adipisicing aute do adipisicing.\n\nOfficia pariatur eiusmod tempor magna occaecat. Ut proident anim aute aliquip pariatur et. Pariatur ad ea sint ut excepteur amet id do. Labore eu velit non cillum nulla.\n\nIncididunt duis tempor sunt dolor magna occaecat esse elit consequat. Ea sint et labore amet ullamco non tempor. Ad voluptate nisi duis minim elit in adipisicing et laboris nulla culpa ad'
    this.data = str.split(' ').map((d) => {
      return { text: d, value: 10 + Math.random() * 90, fill: '0' };
    })
  }

  @property({ type: Boolean })
  useWordMouseOverEvent = true

  updateProps() {
    this.width = 900
    this.useWordMouseOverEvent = false
  }

  onWordClick (e: Event) {
    console.log(e)
  }
  render() {
    return html`
      <button
        @click=${this.updateProps}
      >
        Update Props
      </button>
      <d3-cloud-element
        .width="${this.width}"
        .height="${600}"
        .data="${this.data}"
        .autoFill="${true}"
        .useWordClickEvent=${false}
        .useWordMouseOverEvent=${this.useWordMouseOverEvent}
        @wordMouseOver="${this.onWordClick}"
      ></d3-cloud-element>
    `
  }
}
