import { Component, computed, input, TemplateRef, NgZone, booleanAttribute } from '@angular/core';
import type { ClassValue } from 'clsx';
import { mergeClasses } from '@shared/utils/merge-classes';
import { NgTemplateOutlet } from '@angular/common';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { DotLottieWorkerComponent } from 'ngx-lottie/dotlottie-web';

@Component({
  selector: 'deferred-lottie',
  exportAs: 'deferredLottie',
  template: `
    <ng-container *ngTemplateOutlet="placeholder()"></ng-container>

    @defer (on viewport) {
    <div class="show-dotlottie">
      <ng-container *ngTemplateOutlet="content()"></ng-container>
    </div>
    } @placeholder {
    <div class="absolute size-full"></div>
    }
  `,
  host: {
    '[class]': 'classes()',
  },
  imports: [NgTemplateOutlet],
  styleUrl: 'lottie.component.sass',
})
export class DeferredLottieComponent {
  readonly class = input<ClassValue>('');
  readonly placeholder = input.required<TemplateRef<any>>();
  readonly content = input.required<TemplateRef<any>>();

  protected readonly classes = computed(() =>
    mergeClasses(
      'relative has-[ng-dotlottie-worker]:[&>*:first-child]:invisible has-[ng-dotlottie-worker]:[&>*:first-child]:absolute [&>*:first-child]:delay-[0.1s]',
      this.class()
    )
  );
}

@Component({
  selector: 'optimized-lottie',
  exportAs: 'optimizedLottie',
  imports: [DotLottieWorkerComponent],
  template: `
    <ng-dotlottie-worker
      [src]="src()"
      [loop]="loop()"
      [speed]="speed()"
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

  onCreated(dotLottie: DotLottieWorker): void {
    this.dotLottie = dotLottie;
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
