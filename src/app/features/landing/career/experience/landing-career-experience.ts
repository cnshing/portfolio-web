import { Component, computed, input } from '@angular/core';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardDateComponent } from '@shared/components/date/date.component';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { ZardBlockQuoteComponent } from '@shared/components/blockquote/blockquote.component';
import { MMMYYYY } from '@features/landing/career/experience/landing-career-experience.types';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';

/**
 * A career experience card containing information about a position.
 *
 * @export
 * @class LandingCareerPositionComponent
 * @typedef {LandingCareerPositionComponent}
 */
@Component({
  selector: 'landing-career-position',
  standalone: true,
  providers: [provideMarkdown()],
  imports: [
    ZardCardComponent,
    ZardDateComponent,
    ZardAvatarComponent,
    ZardBadgeComponent,
    ZardIconComponent,
    ZardBlockQuoteComponent,
    MarkdownComponent,
    ZardDividerComponent,
  ],
  template: `
    <z-card
      [zTitle]="this.company()"
      [zDescription]="this.position()"
      [zAvatarOrIcon]="companyIcon"
      [zLabel]="positionTenure"
    >
      <ng-template #companyIcon>
        <z-avatar
          class="bg-white-0 rounded-sm p-sm *:[&_img]:p-[5%]"
          zFallback="CMP"
          [zSrc]="companyLogoImg()"
          zSize="md"
          zShape="none"
        />
      </ng-template>
      <ng-template #positionTenure>
        <div class="flex flex-wrap text-color-tertiary gap-x-xs font-tertiary items-center text-center">
          <z-icon [zType]="'calendar'" class="text-inherit" zSize="lg" />
          <z-date [value]="this.fromDate()" zFormat="MMM yyyy" />
          <span class="text-lg">-</span>
          <z-date [value]="this.toDate()" zFormat="MMM yyyy"></z-date>
        </div>
      </ng-template>
      <div class="flex flex-col gap-md">
        <p class="m-b-auto text-color-default">{{ summary() }}</p>
        <blockquote z-blockquote class="text-lg">
          <div
            markdown
            class="max-w-line-length text-color-default"
            [data]="this.highlights()"
          ></div>
        </blockquote>
      </div>
      <z-divider
        class="opacity-25 mt-[calc(var(--spacing-lg)*0.75)] mb-[calc(var(--spacing-lg)*0.75)]"
        zSpacing="none"
      />
      <div class="flex flex-wrap justify-start gap-md m-t-auto">
        @for (skill of skills(); track $index) {
        <z-badge zShape="square" zType="secondary" class="text-md">{{ skill }}</z-badge>
        }
      </div>
    </z-card>
  `,
})
export default class LandingCareerPositionComponent {
  /**
   * Company worked for.
   *
   * @readonly
   * @type {*}
   */
  readonly company = input.required<string>();
  /**
   * Position title.
   *
   * @readonly
   * @type {*}
   */
  readonly position = input.required<string>();
  /**
   * A short summary describing the essence of your work.
   *
   * @readonly
   * @type {*}
   */
  readonly summary = input<string>();
  /**
   * A list of skills terminology.
   *
   * @readonly
   * @type {*}
   */
  readonly skills = input<string[]>([]);
  /**
   *
   *
   * @readonly
   * @type {*}
   */
  readonly highlights = input<string>();
  /**
   * When you began the position.
   *
   * @readonly
   * @type {*}
   */
  readonly from = input.required<MMMYYYY>();
  /**
   * When you ended the position, or "Present" if still currently at that position. Defaults to "Present"
   *
   * @readonly
   * @type {*}
   */
  readonly to = input<MMMYYYY | 'Present'>('Present');
  /**
   * A asset retrievable string path of the company's corresponding logo.
   *
   * @readonly
   * @type {*}
   */
  readonly companyLogoImg = input.required<string>();

  /**
   * Computed Date() object from `from`.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly fromDate = computed(() => new Date(this.from()));

  /**
   * Helps compute `toDate()`.
   *
   * @private
   * @param {string} value Any string compatiable with new Date(), or "Present"
   * @returns {Date} A Date object representing "Present" or `value`.
   */
  private parseToDate(value: string): Date {
    return value === 'Present' ? new Date() : new Date(value);
  }

  /**
   * Computed Date() object from `to`.
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly toDate = computed(() => this.parseToDate(this.to()));
}
