import {  phosphorAcornDuotone, phosphorSphereDuotone, phosphorReadCvLogoDuotone,
  phosphorCalendarBlankDuotone
 } from '@ng-icons/phosphor-icons/duotone'

export const ZARD_ICONS = {
  acorn: phosphorAcornDuotone,
  sphere: phosphorSphereDuotone,
  resume: phosphorReadCvLogoDuotone,
  calendar: phosphorCalendarBlankDuotone
} as const;

export declare type ZardIcon = keyof typeof ZARD_ICONS;
