interface Window {
  ResizeObserver: ResizeObserverConstructor;
}

interface ResizeObserverConstructor {
  new (callback: ResizeObserverCallback): ResizeObserver;
}

interface ResizeObserver {
  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
  disconnect: () => void;
}

declare const ResizeObserver: ResizeObserverConstructor;

interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}

interface ResizeObserverEntryConstructor {
  new (target: Element): ResizeObserverEntry;
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
}

declare const ResizeObserverEntry: ResizeObserverEntryConstructor;

interface DOMRectReadOnly {
  fromRect(other: DOMRectInit | undefined): DOMRectReadOnly;

  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;

  toJSON: () => any;
}
