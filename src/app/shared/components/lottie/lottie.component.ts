import {
  Component,
  computed,
  input,
  TemplateRef,
  NgZone,
  booleanAttribute,
  output,
  ElementRef,
  inject,
} from '@angular/core';
import type { ClassValue } from 'clsx';
import { mergeClasses } from '@shared/utils/merge-classes';
import { NgTemplateOutlet } from '@angular/common';
import { DotLottieWorker, LoadEvent, PlayEvent } from '@lottiefiles/dotlottie-web';
import { DotLottieComponent, DotLottieWorkerComponent } from 'ngx-lottie/dotlottie-web';

/**
 * Shows a poster preview of the dotLottie component before the dotLottie is fully loaded. Helpful in reducing the bundle size when a dotLottie component is not immediately neccesary to render. Due to Angular implementation, dotlottie components are only able to be deferred on viewport.
 *
 * IMPORTANT: Do not under any circumstance make the host display not relative.
 *
 * IMPORTANT: You must bind to this component's `onLoadShowLottie` to the lottie's `(load)` for this component to work!
 *
 * @export
 * @class PreviewLottieComponent
 * @typedef {PreviewLottieComponent}
 */
@Component({
  selector: 'lottie-with-poster',
  exportAs: 'posterLottie',
  template: `
    <div class="absolute size-full">
      <ng-container *ngTemplateOutlet="poster()"></ng-container>
    </div>

    @defer (on viewport) {
    <ng-container *ngTemplateOutlet="dotLottieTemplate()"></ng-container> <!-- TODO: Figure out how to implicitly bind output onLoadShowLottie to (load) within component scope. -->

    } @placeholder {
    <div class="absolute size-full"></div>
    }
  `,
  host: {
    '[class]': 'classes()',
  },
  imports: [NgTemplateOutlet],
})
export class PreviewLottieComponent {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly class = input<ClassValue>('');
  /**
   * Element to render while the dotLottie is loading.
   *
   * @readonly
   * @type {*}
   */
  readonly poster = input.required<TemplateRef<any>>();

  /**
   * Template to render the dotLottie.
   *
   * @readonly
   * @type {*}
   */
  readonly dotLottieTemplate =
    input.required<TemplateRef<DotLottieWorkerComponent | DotLottieComponent>>();

  /** Swaps the placeholder with the lottie element. IMPORTANT: You must bind to the dotLottie's `(load)` for this component to work! */
  readonly onLoadShowLottie = () => {
    const poster = this.host.nativeElement.firstElementChild;
    const lottie = this.host.nativeElement.lastElementChild;
    poster?.setAttribute('style', 'display:none ');
    lottie?.setAttribute('style', 'opacity: 1');
  };

  protected readonly classes = computed(() => mergeClasses('relative size-full', this.class()));
}

/**
 * 'Optimized' Lottie component modified from the ngx-lottie [documentation](https://github.com/ngx-lottie/ngx-lottie/blob/master/docs/ngx-lottie-dotlottie.md#optimizations)
 *
 * @export
 * @class OptimizedLottieComponent
 * @typedef {OptimizedLottieComponent}
 */
@Component({
  selector: 'optimized-lottie',
  exportAs: 'optimizedLottie',
  imports: [DotLottieWorkerComponent],
  template: `
    <ng-dotlottie-worker
      [src]="src()"
      [loop]="loop()"
      [speed]="speed()"
      [mode]="mode()"
      [autoplay]="autoplay()"
      (play)="onPlay($event)"
      (load)="onLoad($event)"
      (dotLottieCreated)="onCreated($event)"
    />
  `,
})
export class OptimizedLottieComponent {
  protected dotLottie: DotLottieWorker | null = null;
  constructor(private ngZone: NgZone) {}
  readonly src = input<string>();
  readonly loop = input(false, { transform: booleanAttribute });
  readonly speed = input<number>(1.0);
  readonly autoplay = input(false, { transform: booleanAttribute });
  readonly mode = input<'forward' | 'reverse' | 'bounce' | 'reverse-bounce'>('forward');
  readonly onPlayEvent = output<PlayEvent>({ alias: 'play' });
  readonly onLoadEvent = output<LoadEvent>({ alias: 'load' });

  onPlay(event: PlayEvent) {
    this.onPlayEvent.emit(event);
  }

  onLoad(event: LoadEvent) {
    this.onLoadEvent.emit(event);
  }

  onCreated(dotLottie: DotLottieWorker): void {
    this.dotLottie = dotLottie;
  }

  /**
   * Helper to retrieve dotLottie state.
   *
   * @param {("Frozen" | "Loaded" | "Paused" | "Playing" | "Ready" | "Stopped")} key
   * @returns {*}
   */
  protected readonly getIs = (
    key: 'Frozen' | 'Loaded' | 'Paused' | 'Playing' | 'Ready' | 'Stopped'
  ) => {
    return this.ngZone.runOutsideAngular(() => {
      return this.dotLottie ? this.dotLottie[`is${key}`] : false;
    });
  };

  get isPlaying(): boolean {
    return this.getIs('Playing');
  }

  get isPaused(): boolean {
    return this.getIs('Paused');
  }

  /** Plays animation. */
  play(): void {
    this.ngZone.runOutsideAngular(() => {
      this.dotLottie?.play();
    });
  }

  /** Pauses animation. */
  pause(): void {
    this.ngZone.runOutsideAngular(() => {
      this.dotLottie?.pause();
    });
  }
}
