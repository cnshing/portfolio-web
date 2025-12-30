import { Component, computed, inject } from '@angular/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { environment } from '@environments/environment';
import { SSGMarkdownParser } from '@features/ssg/services/ssg-markdown-parser.service';
import { LegalPrivacyPolicyContent } from '@features/legal/legal-privacy-policy.types';
import { ZardDividerComponent } from "@shared/components/divider/divider.component";

/**
 * A career experience card containing information about a position.
 *
 * @export
 * @class LegalPrivacyPolicyComponent
 * @typedef {LegalPrivacyPolicyComponent}
 */
@Component({
  selector: 'legal-privacy-policy',
  standalone: true,
  providers: [provideMarkdown()],
  imports: [MarkdownComponent, ZardDividerComponent],
  template: `
    <z-divider />
    <p class="text-center">Last Updated: <time class="text-color-secondary"> {{ lastUpdatedDate().toLocaleDateString('en-CA') }}</time></p>
    <z-divider />
    <markdown [data]="this.policy().content"></markdown>
  `,
  host: {
    'class': 'flex flex-col w-full bg-color-page min-h-[100vh] ul',
  },
  styles: `
  ::ng-deep ul   /** NOTE: This can be refactored as something to render/prettify generic markdown content*/
    font-weight: var(--font-weight-secondary)
    color: var(--text-color-tertiary)
    font-size: var(--text-lg)
    display: flex
    flex-direction: column
    padding: var(--spacing-sm) var(--spacing-sm)
    gap: var(--spacing-sm)
    list-style: inside
  `
})
export class LegalPrivacyPolicyComponent {
  /**
   * Helper service required to load policy content.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly markdownParser = inject(SSGMarkdownParser);

  /**
   * Policy content.
   *
   * @protected
   * @readonly
   * @type {*}
   */
  protected readonly policy = computed(() =>
    this.markdownParser.parseMarkdown<LegalPrivacyPolicyContent>(
      environment.legalPrivacyPolicyMD, { 'bodyKey': 'content'}
    )
  );

  /**
   * Date representation of `lastUpdated`
   *
   * @protected
   * @readonly
   * @type {Date}
   */
  protected readonly lastUpdatedDate = computed(() => new Date(this.policy().lastUpdated))
}
