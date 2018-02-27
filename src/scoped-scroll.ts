import { throttle } from 'underscore'

export class ScopedScroll {

  private document: Document
  private window: Window

  private mutationObserver?: MutationObserver

  private scrollHeight? = Infinity
  private clientHeight? = Infinity
  private clientY?: number

  constructor (private element: HTMLElement) {
    this.document = element.ownerDocument
    this.window = this.document.defaultView

    this._onResize = throttle(this._onResize.bind(this), 200)
    this._onWheel = this._onWheel.bind(this)
    this._onTouchStart = this._onTouchStart.bind(this)
    this._onTouchMove = this._onTouchMove.bind(this)
  }

  init () {
    if ('overscrollBehavior' in this.element.style) {
      const elementStyle = this.element.style as any
      elementStyle.overscrollBehavior = 'contain'
      return
    }

    this.window.addEventListener('resize', this._onResize, false)
    this.element.addEventListener('wheel', this._onWheel, false)
    this.element.addEventListener('touchstart', this._onTouchStart, false)
    this.element.addEventListener('touchmove', this._onTouchMove, false)

    // FIXME ほんとうは ResizeObserver を使いたいが、対応しているブラウザがない.
    if ('MutationObserver' in this.window) {
      this.mutationObserver = new MutationObserver(this._onResize)
      this.mutationObserver.observe(this.element, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
      })
    }

    this.refreshMetrics()
  }

  destroy () {
    this.window.removeEventListener('resize', this._onResize)
    this.element.removeEventListener('wheel', this._onWheel)
    this.element.removeEventListener('touchstart', this._onTouchStart)
    this.element.removeEventListener('touchmove', this._onTouchMove)

    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }
  }

  refreshMetrics () {
    this.scrollHeight = this.element.scrollHeight
    this.clientHeight = this.element.clientHeight
  }

  private _onResize () {
    this.refreshMetrics()

  }

  private _onWheel (e: WheelEvent) {
    const scrollTop = this.element.scrollTop
    const isTop = scrollTop === 0
    const isBottom = scrollTop >= this.scrollHeight! - this.clientHeight!
    if (isTop && e.deltaY < 0 || isBottom && e.deltaY > 0) {
      e.preventDefault()
    }
  }

  private _onTouchStart (e: TouchEvent) {
    if (e.targetTouches.length === 1) {
      this.clientY = e.targetTouches[0].clientY
    }
  }

  private _onTouchMove (e: TouchEvent) {
    if (e.targetTouches.length === 1) {
      const clientY = e.targetTouches[0].clientY - this.clientY!
      const scrollTop = this.element.scrollTop
      const isTop = scrollTop === 0
      const isBottom = scrollTop >= this.scrollHeight! - this.clientHeight!
      if (isTop && clientY > 0 || isBottom && clientY < 0) {
        e.preventDefault()
      }
    }
  }

}
