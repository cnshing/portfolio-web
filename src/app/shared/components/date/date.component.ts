import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { dateVariants, ZardDateVariants } from './date.variants';
import type { ClassValue } from '@shared/utils/merge-classes';
import { ZardIconComponent } from '../icon/icon.component';
import { mergeClasses } from '@shared/utils/merge-classes';

export type { ZardDateVariants };

@Component({
  selector: 'z-date, [z-date]',
  exportAs: 'zDate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardIconComponent],
  host: {},
  template: `
      <z-icon zType="calendar" [zSize]="zSize()" />
      <span [class]="classes()">
        {{ displayText() }}
      </span>

  `,
  providers: [DatePipe],
})
export class ZardDateComponent {
  private readonly datePipe = inject(DatePipe);
  readonly class = input<ClassValue>('');
  readonly zType = input<ZardDateVariants['zType']>('outline');
  readonly zSize = input<ZardDateVariants['zSize']>('default');
  readonly value = input.required<Date>();
  readonly zFormat = input<string>('MMMM d, yyyy');

  protected readonly classes = computed(() =>
    mergeClasses(
      dateVariants({
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );

  protected readonly displayText = computed(() => {
    const date = this.value()
    return this.formatDate(date, this.zFormat())
  });

  private formatDate(date: Date, format: string): string {
    return this.datePipe.transform(date, format) || '';
  }
}
