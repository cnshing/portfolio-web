import { Component, computed, inject, signal, Signal } from '@angular/core';

import { environment } from '@environments/environment';

import {
  LandingSkillCardComponent,
  LandingSkillCardInput,
} from '@features/landing/skills/landing-skills-card';

import { SSGMarkdownParser } from '@features/ssg/services/ssg-markdown-parser.service';
import { isReduceMotion, isTouchDevice } from '@shared/utils/accessibility';
import { ConfettiComponent } from '@shared/components/animate/confetti/confetti-component';
/**
 * Section containing user's career experience.
 *
 * @export
 * @class LandingSkillsComponent
 * @typedef {LandingSkillsComponent}
 */
@Component({
  selector: 'landing-skills',
  standalone: true,
  providers: [],
  imports: [LandingSkillCardComponent, ConfettiComponent],
  template: `
    <section class="relative flex flex-col gap-2xl">
      <div
        class="flex flex-wrap gap-x-2xl gap-y-xs text-center justify-center min-[27rem]:justify-between min-[27rem]:text-left items-center"
      >
        <h1>Skills</h1>
        <p class="max-w-[calc(var(--spacing-line-length)/1.5)] text-pretty">
          Here are the tools I use for development. They include website design, CI/CD pipelines,
          and hypervisor-based home lab environments.
        </p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,var(--spacing-2xl))] gap-lg justify-evenly">
        @for (skill of skills(); track skill.name) { @if (skill.name === 'Three.JS') {
        <landing-skill-card
          class="[&>z-card]:brightness-140"
          [name]="skill.name"
          [logoImg]="skill.logoImg"
          [description]="skill.description"
          (mouseenter)="isTouchDevice ? null : this.confettiExploding.set(true)"
          (mouseleave)="isTouchDevice ? null : this.confettiExploding.set(false)"
          (touchstart)="this.confettiExploding.set(true)"
          (touchend)="this.confettiExploding.set(false)"
        />
        } @else {
        <landing-skill-card
          [name]="skill.name"
          [logoImg]="skill.logoImg"
          [description]="skill.description"
        />
        } }
      </div>
      @defer (on viewport) {
      <threejs-confetti
        class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-[11] h-screen w-screen m-auto "
        [colors]="['#39FF14', '#00E5FF', '#FF2ED1', '#FFD400']"
        [areaHeight]="1.5"
        [areaWidth]="1.5"
        [radius]="5"
        [amount]="isReduceMotion ? 85 / 2 : 85"
        [rate]="isReduceMotion ? 0.75 : 1"
        [fallingSpeed]="isReduceMotion ? 1 / 1_000_000 : 0.0001"
        [pieceSpin]="4"
        [pieceSize]="isTouchDevice ? 0.03 * 3 : 0.03"
        [fallingSpeed]="isReduceMotion ? 0.75 : 1.25"
        [isExploding]="confettiExploding()"
        [explodeDuration]="isReduceMotion ? 1.0 : 1.0"
      />
      } @placeholder {
      <div class="absolute size-full"></div>
      }
    </section>
  `,
})
export default class LandingSkillsComponent {
  /**
   * Helper service required to load career experience content
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly markdownParser = inject(SSGMarkdownParser);

  /**
   * Parsed content containing the necessary inputs to render `LandingSkillCardInput` components.
   *
   * @protected
   * @readonly
   * @type {Signal<LandingSkillCardInput[]>}
   */
  protected readonly skills: Signal<LandingSkillCardInput[]> = computed(() =>
    environment.landingSkillsContentMDs.map((md) =>
      this.markdownParser.parseMarkdown<LandingSkillCardInput>(md, {
        bodyKey: 'description',
      })
    )
  );

  protected readonly isReduceMotion = isReduceMotion();
  protected readonly isTouchDevice = isTouchDevice();
  protected readonly confettiExploding = signal<boolean>(false);
}
