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
import { DotLottieWorker, PlayEvent } from '@lottiefiles/dotlottie-web';
import { DotLottieComponent, DotLottieWorkerComponent } from 'ngx-lottie/dotlottie-web';

/**
 * Shows a poster preview of the dotLottie component before the dotLottie is fully loaded. Helpful in reducing the bundle size when a dotLottie component is not immediately neccesary to render. Due to Angular implementation, dotlottie components are only able to be deferred on viewport. Do not under any circumstance make the host display not relative.
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
    <div [attr.data-show-lottie-soon]="showLottie()" class="hidden"></div>
    <ng-container *ngTemplateOutlet="dotLottieTemplate()"></ng-container>

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

  /**
   * Minimium number of milliseconds to wait until it transitions to the dotLottie element once it is ready.
   *
   * @readonly
   * @type {*}
   */
  readonly deferTransitionMS = input<number>(375);

  /** Swaps the placeholder with the lottie element. */
  protected readonly showLottie = () => {
    setTimeout(() => {
      const poster = this.host.nativeElement.firstElementChild;
      poster?.setAttribute('style', 'display:none ');
      const lottie = this.host.nativeElement.lastElementChild;
      lottie?.setAttribute('style', 'opacity: 1');
    }, this.deferTransitionMS());
  };

  protected readonly classes = computed(() => mergeClasses('relative', this.class()));
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

  onPlay(event: PlayEvent) {
    this.onPlayEvent.emit(event);
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
