import { Component } from '@angular/core';
import { PlaygroundCardComponent } from '@features/playground/playground-card';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';
import { ZardAvatarGroupComponent } from '@shared/components/avatar/avatar-group.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { RAW_ZARD_ICONS } from '@shared/components/icon/icons';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardSkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardLoaderComponent } from '@shared/components/loader/loader.component';
import { ZardDateComponent } from '@shared/components/date/date.component';
import { PlaygroundSectionComponent } from '@features/playground/playground-section';
import { ZardTooltipModule } from '@shared/components/tooltip/tooltip';
import { ZardBlockQuoteComponent } from '@shared/components/blockquote/blockquote.component';

/**
 * Playground Page to visually display all primitive components.
 *
 * @export
 * @class PlaygroundPageComponent
 * @typedef {PlaygroundPageComponent}
 */
@Component({
  selector: 'playground-page',
  standalone: true,
  imports: [
    PlaygroundSectionComponent,
    PlaygroundCardComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardBlockQuoteComponent,
    ZardAvatarComponent,
    ZardAvatarGroupComponent,
    ZardIconComponent,
    ZardCardComponent,
    ZardDividerComponent,
    ZardSkeletonComponent,
    ZardLoaderComponent,
    ZardDateComponent,
    ZardTooltipModule
],
  templateUrl: './playground-page.html',
})
export class PlaygroundPageComponent {
  /**
   * Sample date data for `today`.
   *
   * @readonly
   * @type {*}
   */
  readonly currentDate = new Date();
  /**
   * Sample date data.
   *
   * @readonly
   * @type {*}
   */
  readonly specificDate = new Date('2024-01-01');
  /**
   * Dynamic list of all available icon names for `ZardIconComponent`.
   *
   * @protected
   * @readonly
   * @type {{}}
   */
  protected readonly ZARD_ICON_ZTYPES = Object.keys(
    RAW_ZARD_ICONS
  ) as (keyof typeof RAW_ZARD_ICONS)[];
}
