# Optimizations

This section covers various optimization tricks to improve the performance of the site.

## Deferrence

Deferrence is heavily used for components that would contribute to a significantly larger bundle size. Sometimes, it is more important to creatively use deferrence to create a sense of perceived performance rather than focusing on the numbers.

Here is a following simplified example directly from the codebase on how deferrence is used to load the hero motorcyclist. When the page loads, a 3D motorcyclist will appear from the left side of the screen, and scrolling up and down allows you to "drive" the motorcyclist.

```ts
/**
 * Motorcyclist element with built-in animations.
 *
 * @export
 * @class LandingHeroMotorcyclistComponent
 * @typedef {LandingHeroMotorcyclistComponent}
 */
@Component({
  selector: 'landing-hero-motorcyclist',
  standalone: true,
  imports: [NgOptimizedImage, LandingMotorcyclistSceneComponent],
  template: `
    <div
      class="*:duration-0 *:ease-in"
      #scrollHero
      [class.animate-(--animate-motorcyclist-enter)]="!animationModuleReady()"
      [style.animation-composition]="animationModuleReady() ? null : 'add'"
    >
      <img
        class=""
        ngSrc="/assets/models/motorcycle/motorcycle-opt.png"
        width="4096"
        height="2160"
        sizes="auto"
        decoding="async"
        alt="Motorcyclist"
        priority
        [class.opacity-100]="!SceneReady()"
        [class.hidden]="SceneReady()"
      />
      @defer (on immediate) {
      <landing-hero-motorcyclist-scene
        (onLoad)="SceneReady.set(true)"
        [class.opacity-0]="!SceneReady()"
        [class.opacity-100]="SceneReady()"
      />
      } @placeholder {
        <div class="absolute size-full"></div>
      }
    </div>
  `,
  host: {
    '[style.--enter-duration]': 'enterDurationSecs()'
  },
  styleUrl: 'landing-hero-motorcyclist-animation.sass',
})
export class LandingHeroMotorcyclistComponent {

  constructor() {
    afterNextRender(async () => {
      const vehcile = this.motorcyclist().nativeElement;
      vehcile.addEventListener(
        'animationend',
        async (_: AnimationEvent) => {
          const { animateMotorcycle } = await import('./landing-hero-motorcyclist-animation');
          this.animationModuleReady.set(true);
          this.animate.set(animateMotorcycle(vehcile, this.enterDurationSecs()));
        },
        { once: true }
      );
      await import('./landing-hero-motorcyclist-animation');
    });

  }

  protected readonly animate = signal<any>(null);

  readonly enterDurationSecs = input<number>(2.0);

  protected readonly animationModuleReady = signal<boolean>(false);

  protected readonly SceneReady = signal<boolean>(false);

  protected readonly motorcyclist = viewChild.required<ElementRef<HTMLElement>>('scrollHero');
}
```

At first glance, these features seem to require both GSAP and Three.js to be loaded at the same time. In practice, however, a few visual techniques can make everything feel instant.

The first step is avoiding an abrupt appearance. Instead of popping into view, the motorcycle slides in from offscreen, effectively tricking the user into thinking something was happening, even though, in reality, it was just buying time to load libraries.

But that leads to an obvious question: if those libraries are needed to render the motorcyclist, how can anything appear before they’re ready? The answer is a second illusion—poster previews. When done right, they can closely resemble the final render at a fraction of the initial bundle size.

You may have noticed that an `<img>` was initially displayed in place of the actual 3D element. The image is a perfect pixel snapshot of the 3D model captured from the exact same perspective and carefully positioned with CSS so it aligns perfectly with where the model will eventually appear. Combined with the fact that it's harder for humans to spot details during motion, it would be extremely difficult for anyone to notice the motorcyclist was, in fact, a moving PNG.

In a similar vein, a replica CSS animation was used in place of the opening sequence as GSAP was loading. By the time the CSS animation finishes, GSAP is ready to take over, creating a seamless handoff that goes unnoticed by the user.

As part of maintaining the illusion, the handoff between each element was not able to be implemented with `@defer` and was instead substituted with opacity changes. The reason is that there is an obvious flicker when Angular decides to insert and replace the placeholder with the new DOM element.

## Asset Generation

It is generally a good idea to compress your assets in the name of performance. Unfortunately, the assets were manually generated and added to the repository rather than using a Vite [plugin](https://github.com/alloc/vite-plugin-compress).

The asset folder contains two scripts, `compress_video.sh` and `downscale_assets.sh`, to help automate this process. The first file is an FFmpeg wrapper that allows you to input a video and a desired bitrate/size. The second file is another FFmpeg wrapper that automatically searches for any `.png` files and generates various densities of the same image, suffixed with a new extension: `@0.25x.avif`, `@0.5x.avif`, etc.

To utilize these compressed assets, import `NgOptimizedImage` and provide the `width` and an offset parameter to `loaderParams`:

```ts
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'optimized-image',
  standalone: true,
  providers: [],
  imports: [NgOptimizedImage],
  template: `
      <img
          class="relative w-[max(62.5%,var(--spacing-2xl)*2.5)]"
          ngSrc="/assets/icons/my-image.png"
          [loaderParams]="{baseWidth: 1552, stepDownOffset: 1}"
          width="1552"
          height="780"
          sizes="auto"
          loading="auto"
          decoding="async"
          alt="Alt Image"
      />
  `,
})
export class NgOptimizedImageExampleComponent {}
```

All `NgOptimizedImage`s will first automatically select the image with the closest available density before stepping down resolutions by `stepDownOffset` for its final selection. In this case, if `@0.5x` was the closest resolution to `1552px` in width, then it will choose the resolution one step down from that, `@0.25x`.
