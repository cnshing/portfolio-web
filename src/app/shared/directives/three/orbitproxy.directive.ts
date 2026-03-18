import { Directive, input } from "@angular/core";
import { EventProxyDirective, EventPreprocessors } from "@shared/directives/three/proxy.directive";
import { OrbitControls } from "three/addons";
import { type Camera } from "three/webgpu";

export interface OrbitPointerEvent {
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  button: number;
  pointerId: number;
  pointerType: string;
  pageX: number;
  pageY: number;
}

export interface OrbitWheelEvent {
  clientX: number;
  clientY: number;
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  ctrlKey: boolean;
}

export interface OrbitKeyEvent {
  code: string;
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface OrbitProxyWorker {
  onPointerdown(event: OrbitPointerEvent): void;
  onPointermove(event: OrbitPointerEvent): void;
  onPointerup(event: OrbitPointerEvent): void;
  onPointercancel(event: OrbitPointerEvent): void;

  onMousedown?(event: OrbitPointerEvent): void;
  onMousemove?(event: OrbitPointerEvent): void;
  onMouseup?(event: OrbitPointerEvent): void;

  onWheel(event: OrbitWheelEvent): void;

  onKeydown(event: OrbitKeyEvent): void;

  onResize(rect: DOMRectReadOnly): void;
  onContextmenu(event: OrbitPointerEvent): void;
}


export class DummyOrbitWorker implements OrbitProxyWorker {

  onPointerdown(_: OrbitPointerEvent): void {}
  onPointermove(_: OrbitPointerEvent): void {}
  onPointerup(_: OrbitPointerEvent): void {}
  onPointercancel(_: OrbitPointerEvent): void {}

  onMousedown?(_: OrbitPointerEvent): void {}
  onMousemove?(_: OrbitPointerEvent): void {}
  onMouseup?(_: OrbitPointerEvent): void {}

  onWheel(_: OrbitWheelEvent): void {}

  onKeydown(_: OrbitKeyEvent): void {}

  onResize(_: DOMRectReadOnly): void {}

  onContextmenu(_: OrbitPointerEvent): void {}
}

export class OrbitElement {
  constructor(private canvas: OffscreenCanvas) {}

  style: {
    cursor?: string
    touchAction?: string
  } = {}

  get ownerDocument() {
    return this.canvas
  }

  left = 0
  top = 0
  width = 0
  height = 0

  addEventListener(...args: Parameters<typeof this.canvas.addEventListener>) {
    this.canvas.addEventListener(...args)
  }

  removeEventListener(...args: Parameters<typeof this.canvas.removeEventListener>) {
    this.canvas.removeEventListener(...args)
  }

  dispatchEvent(event: Event) {
    return this.canvas.dispatchEvent(event)
  }

  getRootNode() {
    return this.canvas
  }

  get clientWidth() {
    return this.canvas.width
  }

  get clientHeight() {
    return this.canvas.height
  }

  getBoundingClientRect() {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      right: this.left + this.width,
      bottom: this.top + this.height
    }
  }

  setPointerCapture(_: number) {}
  releasePointerCapture(_: number) {}
}


function pointerPreprocessor(event: PointerEvent): OrbitPointerEvent {
  return {
    clientX: event.clientX,
    clientY: event.clientY,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    button: event.button,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    pageX: event.pageX,
    pageY: event.pageY,
  };
}

function wheelPreprocessor(event: WheelEvent): OrbitWheelEvent {
  return {
    clientX: event.clientX,
    clientY: event.clientY,
    deltaX: event.deltaX,
    deltaY: event.deltaY,
    deltaMode: event.deltaMode,
    ctrlKey: event.ctrlKey,
  };
}

function keydownPreprocessor(event: KeyboardEvent): OrbitKeyEvent {
  const orbitKeys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];

  if (orbitKeys.includes(event.key)) {
    event.preventDefault();
  }

  return {
    code: event.code,
    key: event.key,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
  };
}


const ORBIT_EVENTS = [
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointercancel',
  'wheel',
  'keydown',
  'contextmenu'
] as const;

export type OrbitEvent = typeof ORBIT_EVENTS[number];

@Directive({
  selector: '[offscreen-orbit-controls]',
  standalone: true,
})
export class OffscreenOrbitControlsDirective
  extends EventProxyDirective<OrbitEvent> {

  override events = input<readonly OrbitEvent[]>(ORBIT_EVENTS);

  override preprocessors = input<EventPreprocessors<OrbitEvent>>({
    pointerdown: pointerPreprocessor,
    pointermove: pointerPreprocessor,
    pointerup: pointerPreprocessor,
    pointercancel: pointerPreprocessor,
    wheel: wheelPreprocessor,
    keydown: keydownPreprocessor,
    contextmenu: (_: PointerEvent) => {return {}}
  });

  override eventOptions = input<Partial<Record<OrbitEvent, AddEventListenerOptions | boolean>>>({
    wheel: { passive: false },
  });
}

export function installOrbitControlsProxy(
  worker: OrbitProxyWorker,
  canvas: OffscreenCanvas,
  camera: Camera
) {
  const element = new OrbitElement(canvas);
  const controls = new OrbitControls(camera, element as unknown as HTMLElement);

  const prevPointerdown = worker.onPointerdown;
  worker.onPointerdown = (event) => {
    prevPointerdown?.(event);
    controls.domElement?.dispatchEvent(
      Object.assign(new Event('pointerdown'), event) as PointerEvent
    );
  };

  const prevPointermove = worker.onPointermove;
  worker.onPointermove = (event) => {
    prevPointermove?.(event);
    controls.domElement?.dispatchEvent(
      Object.assign(new Event('pointermove'), event) as PointerEvent
    );
  };

  const prevPointerup = worker.onPointerup;
  worker.onPointerup = (event) => {
    prevPointerup?.(event);
    controls.domElement?.dispatchEvent(
      Object.assign(new Event('pointerup'), event) as PointerEvent
    );
  };

  const prevMousedown = worker.onMousedown;
  worker.onMousedown = (event) => {
    prevMousedown?.(event);
    console.log(event)
    Object.assign(new Event('mousedown'), event) as PointerEvent
  };

  const prevMousemove = worker.onMousemove;
  worker.onMousemove = (event) => {
    prevMousemove?.(event);
    Object.assign(new Event('mousemove'), event) as PointerEvent
  };



  const prevMouseup = worker.onMouseup;
  worker.onMouseup = (event) => {
    prevMouseup?.(event);
    Object.assign(new Event('mouseup'), event) as PointerEvent
  };

  const prevPointercancel = worker.onPointercancel;
  worker.onPointercancel = (event) => {
    prevPointercancel?.(event);
    controls.domElement?.dispatchEvent(
      Object.assign(new Event('pointercancel'), event) as PointerEvent
    );
  };

  const prevWheel = worker.onWheel;
  worker.onWheel = (event) => {
    prevWheel?.(event);
    controls.domElement?.dispatchEvent(
      Object.assign(new Event('wheel'), event) as WheelEvent
    );
  };

  const prevKeydown = worker.onKeydown;
  worker.onKeydown = (event) => {
    prevKeydown?.(event);
    controls.domElement?.dispatchEvent(
      Object.assign(new Event('keydown'), event) as KeyboardEvent
    );
  };

  const prevResize = worker.onResize;
  worker.onResize = (rect) => {
    prevResize?.(rect);
    element.left = rect.left;
    element.top = rect.top;
    element.width = rect.width;
    element.height = rect.height;
  };

  const prevContextmenu = worker.onContextmenu;
  worker.onContextmenu = (event) => {
    prevContextmenu(event)
    controls.domElement?.dispatchEvent(
      Object.assign(new Event('contextmenu'), event) as PointerEvent
    );
  }
  return controls;
}