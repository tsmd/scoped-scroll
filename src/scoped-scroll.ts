import { throttle } from 'underscore'

export class ScopedScroll {
  private disabled = false

  private document: Document
  private window: Window

  private resizeObserver?: ResizeObserver
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
    if (this.isOverscrollBehaviorSupported()) {
      this.setOverscrollBehavior('contain')
      return
    }

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(this._onResize)
      this.resizeObserver.observe(this.element)
    } else {
      this.window.addEventListener('resize', this._onResize, false)

      if ('MutationObserver' in this.window) {
        this.mutationObserver = new MutationObserver(this._onResize)
        this.mutationObserver.observe(this.element, {
          childList: true,
          attributes: true,
          characterData: true,
          subtree: true
        })
      }
    }

    this.element.addEventListener('wheel', this._onWheel, false)
    this.element.addEventListener('touchstart', this._onTouchStart, false)
    this.element.addEventListener('touchmove', this._onTouchMove, false)

    this.refreshMetrics()
  }

  destroy () {
    this.window.removeEventListener('resize', this._onResize)
    this.element.removeEventListener('wheel', this._onWheel)
    this.element.removeEventListener('touchstart', this._onTouchStart)
    this.element.removeEventListener('touchmove', this._onTouchMove)

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }
  }

  refreshMetrics () {
    this.scrollHeight = this.element.scrollHeight
    this.clientHeight = this.element.clientHeight
  }

  enable () {
    this.disabled = false
    this.setOverscrollBehavior('contain')
  }

  disable () {
    this.disabled = true
    this.setOverscrollBehavior('')
  }

  isOverscrollBehaviorSupported () {
    return 'overscrollBehavior' in this.element.style
  }

  setOverscrollBehavior (value: string) {
    if (this.isOverscrollBehaviorSupported()) {
      const elementStyle = this.element.style as any
      elementStyle.overscrollBehavior = value
    }
  }

  private _onResize () {
    this.refreshMetrics()
  }

  private _onWheel (e: WheelEvent) {
    if (this.disabled) {
      return
    }

    const scrollTop = this.element.scrollTop
    const isTop = scrollTop === 0
    const isBottom = scrollTop >= this.scrollHeight! - this.clientHeight!
    if (isTop && e.deltaY < 0 || isBottom && e.deltaY > 0) {
      e.preventDefault()
    }
  }

  private _onTouchStart (e: TouchEvent) {
    if (this.disabled) {
      return
    }

    if (e.targetTouches.length === 1) {
      this.clientY = e.targetTouches[0].clientY
    }
  }

  private _onTouchMove (e: TouchEvent) {
    if (this.disabled) {
      return
    }

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
