# Three.JS

[Three.js](https://threejs.org/) is a library that utilizes WebGL/WebGPU to create 3D animations.

## Optimizations

All of the current 3D animations are transferred as [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) instances and loaded with [deference](https://angular.dev/guide/templates/defer) to reduce initial bundle size and prevent the animations from blocking the main thread. 

There are various Three.js-related directives in the codebase to make these requirements easier to handle.

## Creating your first Three.JS component

All current Three.js components are divided into the following mental model:

* An Angular "component" serving as the initializer for the render
* A rendering "worker" file responsible for calling Three.js functions to create the general scene
* A shader file responsible for more specific "look and feel" graphic control
* A "core" file designed to contain the fundamental parts of the 3D animation that are agnostic to any underlying rendering library
* An optional physics file for specific animations that require more complex physics simulations, etc.

At a bare minimum, you will need to have a separate worker file and a component file.

## Using the Three.JS Angular directives

These directives are meant to help automate certain parts of the lifecycle commonly shared across various Three.js components.

Here is a following sample of a component using these Three.js directives:

```ts
import {
  afterNextRender,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { wrap, type Remote, transfer } from 'comlink';
import { type MyWorker } from './my-worker.ts';
import { provideThreeJSDirective, ThreeJSComponent } from '@shared/directives/three/core.directive';
import { ResizableWorker, ResizeWorkerDirective } from '@shared/directives/three/resizes.directive';
import { DPRChangeWorker, DPRChangeDirective } from '@shared/directives/three/dpr.directive';

@Component({
  selector: 'my-scene',
  template: `<canvas #c style="display: block; width: 100%; height: 100%;"></canvas>`,
  standalone: true,
  providers: [provideThreeJSDirective(MyScene)],
  hostDirectives: [ResizeWorkerDirective, DPRChangeDirective]
})
export class MyScene extends ThreeJSComponent<ResizeWorker & DPRChangeWorker> {

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('c');

  threeWorker = signal<Remote<MyWorker> | undefined>(undefined);

  constructor() {
    super();

    afterNextRender(async () => {
      const el = this.canvas().nativeElement;
      const off = el.transferControlToOffscreen();

      const WorkerClass = wrap<typeof MyWorker>(
        new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
      );

      this.threeWorker.set(
        await new WorkerClass(transfer(off, [off]), el.clientWidth, el.clientHeight, devicePixelRatio)
      );

      await this.threeWorker()!.render();
    });
  }
}
```

The directives `ResizeWorkerDirective` and `DPRChangeDirective` will automatically resize the canvas and update the device pixel ratio whenever it changes.

However, they require three things to function properly. As a child of `ThreeJSComponent<ResizeWorker & DPRChangeWorker>`, the component must have a Comlink Three.js worker explicitly named `threeWorker`, and this worker must implement the functions `onResize` and `onDPRChange`. By explicitly extending your `ThreeJSComponent` with the following worker types, TypeScript will automatically check and verify that you have properly implemented the API contract. Lastly, you must import `provideThreeJSDirective(MyScene)`.

It may seem like a lot of work to implement the worker, but besides the boilerplate, many of the required factories are conveniently provided for you in the same file you previously imported the directive from. These factories are designed to be flexible in the sense that they don't force you to use a `class` implementation. Simply choose what you need to resize and connect it to the required functions.

```ts
import { expose } from 'comlink';
import {
  WebGPURenderer,
  Scene,
  PerspectiveCamera
} from 'three/webgpu';

import {
  resizeCanvasFactory,
  resizeRendererFactory,
  resizePerspectiveCameraFactory
} from '@shared/directives/three/resizes.directive';

import { onDPRChangeFactory } from '@shared/directives/three/dpr.directive';

export class MyWorker {
  renderer: WebGPURenderer;
  scene = new Scene();
  camera = new PerspectiveCamera(45, 1, 0.1, 100);

  private resizeCanvas: ReturnType<typeof resizeCanvasFactory>;
  private resizeRenderer: ReturnType<typeof resizeRendererFactory>;
  private resizeCamera: ReturnType<typeof resizePerspectiveCameraFactory>;
  private updateDPR: ReturnType<typeof onDPRChangeFactory>;

  constructor(canvas: OffscreenCanvas, w: number, h: number, dpr: number) {
    this.renderer = new WebGPURenderer({ canvas });

    // factories
    this.resizeCanvas = resizeCanvasFactory(canvas);
    this.resizeRenderer = resizeRendererFactory(this.renderer);
    this.resizeCamera = resizePerspectiveCameraFactory(this.camera);
    this.updateDPR = onDPRChangeFactory(this.renderer);

    // initial setup
    this.onResize(new DOMRectReadOnly(0, 0, w, h));
    this.onDPRChange(dpr);
  }

  async render() {
    await this.renderer.init();
    const loop = () => {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    loop();
  }

  onResize(rect: DOMRectReadOnly) {
    const { width, height } = rect;
    this.resizeCanvas(width, height);
    this.resizeRenderer(width, height, false);
    this.resizeCamera(width, height);
  }

  onDPRChange(dpr: number) {
    this.updateDPR(dpr);
  }
}

expose(MyWorker);
```

All of these directives generally follow this pattern, where the means to bridge the component in the DOM and the worker are already provided, but it is your responsibility to connect them. For example, to automate signal bindings to your worker, you must define a `threeBindings` array of strings at the top level of your component, where each string is the name of the binding. Each binding is expected to have an identical `set` function that is called whenever changes occur in the Angular component, effectively acting as one-way data binding.

```ts
@Component({})
export class BindingComponentExample {
  protected readonly threeBindings = ["amount", "color"]
  readonly amount = input(1)
  readonly color = input("white")
  readonly otherUnrelatedSignal = input("")
}
```

Now in the worker:

```ts
export class BindingWorker {

  set amount(n: number) {
    // Update the Three.js scene with the new amount here
  }

  set color(c: string) {
    // Update the Three.js scene with the new color here
  }

  set otherUnrelatedSignal(str: string) {
    return // `threeBindings` did not specify this variable, so it won't be called by the directive
  }
}
```
