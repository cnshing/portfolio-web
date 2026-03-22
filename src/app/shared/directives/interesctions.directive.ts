import {
  Directive,
  ElementRef,
  DestroyRef,
  inject,
  afterNextRender,
  output
} from '@angular/core';

/**
 * Base class that wires a provided IntersectionObserver
 * to the host element and handles lifecycle cleanup.
 */
@Directive()
export abstract class ViewportObserverBase {

  protected el = inject(ElementRef<HTMLElement>);
  protected destroyRef = inject(DestroyRef);

  private observer: IntersectionObserver;

  constructor(observer: IntersectionObserver) {
    this.observer = observer;

    afterNextRender(() => this.initObserver());
  }

  private initObserver(): void {
    const element = this.el.nativeElement;

    this.observer.observe(element);

    this.destroyRef.onDestroy(() => {
      this.observer.disconnect();
    });
  }
}

/**
 * Custom event emitter when the directive host element enters the viewport.
 */
@Directive({
  selector: '[onViewportEnter]',
  standalone: true,
})
export class OnViewportEnterDirective extends ViewportObserverBase {

  readonly viewportenter = output<void>();

  constructor() {
    const observer = new IntersectionObserver(([entry]) => {
      const isIntersecting = entry?.isIntersecting ?? false;


      if (isIntersecting) {
        this.viewportenter.emit();
      }
    });

    super(observer);
  }
}

/**
 * Custom event emitter when the directive host element leaves the viewport
 */
@Directive({
  selector: '[onViewportLeave]',
  standalone: true,
})
export class OnViewportLeaveDirective extends ViewportObserverBase {

  readonly viewportleave = output<void>();

  constructor() {
    const observer = new IntersectionObserver(([entry]) => {
      const isIntersecting = entry?.isIntersecting ?? false;


      if (!isIntersecting) {
        this.viewportleave.emit();
      }
    });

    super(observer);
  }
}