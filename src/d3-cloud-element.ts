import { LitElement, html, customElement, property, query } from 'lit-element'
import cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const fill = scaleOrdinal(schemeCategory10);
const defaultFontSizeMapper = (word: any) => word.value;
@customElement('d3-cloud-element')
export default class D3CloudElement extends LitElement {
  static TAG = '[D3CloudElement]'

  @query('#wordcloud')
  private wordcloud?: HTMLDivElement

  @property({ type: Array })
  data: any[] = []

  @property({ type: Number })
  width?: number = 700

  @property({ type: Number })
  height?: number = 600

  @property()
  padding?: number | ((datum: cloud.Word, index: number) => number) = 5

  @property()
  font?: string | ((datum: cloud.Word, index: number) => string) = 'serif'

  @property()
  fontSizeMapper?: (datum: cloud.Word, index: number) => number = defaultFontSizeMapper

  @property()
  rotate?: number | ((datum: cloud.Word, index: number) => number) = 0

  @property({ type: Boolean })
  autoFill?: boolean = true
  
  @property({ type: Boolean })
  useWordClickEvent?: boolean = true

  @property({ type: Boolean })
  useWordMouseOverEvent?: boolean = true

  @property({ type: Boolean })
  useWordMouseOutEvent?: boolean = true

  validateProps() {
    if (!this.data || !Array.isArray(this.data)) {
      throw new TypeError(`${D3CloudElement.TAG}: [data] must be an array. Current value is: [${this.data}]`);
    }

    if (this.height === null || this.height === undefined || isNaN(this.height) || this.height <= 0) {
      throw new TypeError(`${D3CloudElement.TAG}: [height] must be a positive number (greater than 0). Current value is: [${this.height}]`)
    }

    if (this.width === null || this.width === undefined || isNaN(this.width) || this.width <= 0) {
      throw new TypeError(`${D3CloudElement.TAG}: [width] must be a positive number (greater than 0). Current value is: [${this.width}]`)
    }

    if (this.padding == null || this.padding === undefined || !['number', 'function'].includes(typeof this.padding) || this.padding <= 0) {
      throw new TypeError(`${D3CloudElement.TAG}: [padding] must be a positive number (greater than 0) or function. Current value is: [${this.padding}]`)
    }

    if (this.font === null || this.font === undefined || !['string', 'function'].includes(typeof this.font)) {
      throw new TypeError(`${D3CloudElement.TAG}: [font] must be a positive string or function. Current value is: [${this.font}]`)
    }

    if (!this.fontSizeMapper || typeof this.fontSizeMapper !== 'function') {
      throw new TypeError(`${D3CloudElement.TAG}: [fontSizeMapper] must be a function. Current value is: [${this.fontSizeMapper}]`)
    }

    if (this.rotate === null || this.rotate === undefined || !['number', 'function'].includes(typeof this.rotate) || this.rotate < 0) {
      throw new TypeError(`${D3CloudElement.TAG}: [rotate] must be a positive number or function. Current value is: [${this.rotate}]`)
    }

    if (this.autoFill === null || this.autoFill === undefined || typeof this.autoFill !== 'boolean') {
      throw new TypeError(`${D3CloudElement.TAG}: [autoFill] must be boolean. Current value is: [${this.autoFill}]`)
    }

    if (this.useWordClickEvent === null || this.useWordClickEvent === undefined || typeof this.useWordClickEvent !== 'boolean') {
      throw new TypeError(`${D3CloudElement.TAG}: [useWordClickEvent] must be boolean. Current value is: [${this.useWordClickEvent}]`)
    }

    if (this.useWordMouseOverEvent === null || this.useWordMouseOverEvent === undefined || typeof this.useWordMouseOverEvent !== 'boolean') {
      throw new TypeError(`${D3CloudElement.TAG}: [useWordMouseOverEvent] must be boolean. Current value is: [${this.useWordMouseOverEvent}]`)
    }

    if (this.useWordMouseOutEvent === null || this.useWordMouseOutEvent === undefined || typeof this.useWordMouseOutEvent !== 'boolean') {
      throw new TypeError(`${D3CloudElement.TAG}: [useWordMouseOutEvent] must be boolean. Current value is: [${this.useWordMouseOutEvent}]`)
    }
  }
  
  firstUpdated() {
    this.renderCloud()
  }

  mouseEvent(type: string, event: MouseEvent, word: cloud.Word) {
    const e = new CustomEvent(type, {
      detail: {
        event, word
      }
    });
    this.dispatchEvent(e);
  }

  renderCloud() {
    this.validateProps()
    select(this.wordcloud!)
      .selectAll('*')
      .remove();

    const layout = cloud()
      .size([this.width!, this.height!])
      .font(this.font as any)
      .words(this.data)
      .padding(this.padding as any)
      .rotate(this.rotate as any)
      .fontSize(this.fontSizeMapper as any)
      .on('end', (words: any) => {
        const texts = select(this.wordcloud!)
          .append('svg')
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr(
            'transform',
            `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
          )
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', (d: any) => `${d.size}px`)
          .style('font-family', this.font as any)
          .style('fill', (_word, i) => {
            if (this.autoFill) {
              return fill(i.toString())
            } else {
              return null
            }
          })
          .attr('text-anchor', 'middle')
          .attr('transform', (d: any) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .text((d: any) => d.text)
        
      
        if (this.useWordClickEvent) {
          texts.on('click', (event: MouseEvent, word: any) => {
            this.mouseEvent('wordClick', event, word)
          })
        }

        if (this.useWordMouseOverEvent) {
          texts.on('mouseover', (event: MouseEvent, word: any) => {
            this.mouseEvent('wordMouseOver', event, word)
          })
        }

        if (this.useWordMouseOutEvent) {
          texts.on('mouseout', (event: MouseEvent, word: any) => {
            this.mouseEvent('wordMouseOut', event, word)
          })
        }
      })

    layout.start()
  }

  render() {
    if (this.wordcloud) {
      this.renderCloud()
    }
    return html`
      <div id="wordcloud"></div>
    `;
  }
}