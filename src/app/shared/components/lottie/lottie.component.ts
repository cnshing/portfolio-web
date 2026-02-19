import { Component, computed, input, TemplateRef, NgZone, booleanAttribute, output } from '@angular/core';
import type { ClassValue } from 'clsx';
import { mergeClasses } from '@shared/utils/merge-classes';
import { NgTemplateOutlet } from '@angular/common';
import { DotLottieWorker, PlayEvent } from '@lottiefiles/dotlottie-web';
import { DotLottieComponent, DotLottieWorkerComponent } from 'ngx-lottie/dotlottie-web';

/**
 * Shows a poster preview of the dotLottie component before the dotLottie is fully loaded. Helpful in reducing the bundle size when a dotLottie component is not immediately neccesary to render. Due to Angular implementation, dotlottie components are only able to be deferred on viewport.
 *
 * @export
 * @class PreviewLottieComponent
 * @typedef {PreviewLottieComponent}
 */
@Component({
  selector: 'lottie-with-poster',
  exportAs: 'posterLottie',
  template: `
    <ng-container *ngTemplateOutlet="poster()"></ng-container>

    @defer (on viewport) {
    <div class="opacity-0 animate-(--animate-appear)">
      <ng-container *ngTemplateOutlet="dotLottieTemplate()"></ng-container>
    </div>
    } @placeholder {
    <div class="absolute size-full"></div>
    }
  `,
  host: {
    '[class]': 'classes()',
    '[style.--defer-transition]': "deferTransitionMS()+'ms'"
  },
  imports: [NgTemplateOutlet],
  styleUrl: 'lottie.component.sass',
})
export class PreviewLottieComponent {

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
  readonly dotLottieTemplate = input.required<TemplateRef<DotLottieWorkerComponent | DotLottieComponent>>();

  /**
   * Minimium number of milliseconds to wait until it transitions to the dotLottie element once it is ready.
   *
   * @readonly
   * @type {*}
   */
  readonly deferTransitionMS = input<number>(375)

  protected readonly classes = computed(() =>
    mergeClasses(
      'relative has-[ng-dotlottie-worker]:[&>*:first-child]:invisible has-[ng-dotlottie-worker]:[&>*:first-child]:absolute [&>*:first-child]:delay-(--defer-transition)',
      this.class()
    )
  );
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
  readonly mode = input<'forward' | 'reverse' | 'bounce' | 'reverse-bounce'>('forward')
  readonly onPlayEvent = output<PlayEvent>({alias: 'play'})

  onPlay(event: PlayEvent) {
    this.onPlayEvent.emit(event)
  }

  onCreated(dotLottie: DotLottieWorker): void {
    this.dotLottie = dotLottie;
  }

  protected readonly getIs = (key: "Frozen" | "Loaded" | "Paused" | "Playing" | "Ready" | "Stopped") => {
    return this.ngZone.runOutsideAngular(() => {
      return this.dotLottie ? this.dotLottie[`is${key}`] : false
    });
  }


  get isPlaying(): boolean {
    return this.getIs("Playing")
  }

  get isPaused(): boolean {
    return this.getIs("Paused")
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
