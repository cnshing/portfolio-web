import {
  phosphorPhoneDuotone, phosphorMapPinDuotone, phosphorReadCvLogoDuotone,
  phosphorCalendarBlankDuotone, phosphorGithubLogoDuotone,
  phosphorLinkedinLogoDuotone,
  phosphorEnvelopeDuotone,
  phosphorEnvelopeOpenDuotone,
} from '@ng-icons/phosphor-icons/duotone'
import {
  phosphorCode,
} from '@ng-icons/phosphor-icons/regular'
export const ZARD_ICONS = {
  resume: phosphorReadCvLogoDuotone,
  calendar: phosphorCalendarBlankDuotone,
  phone: phosphorPhoneDuotone,
  location: phosphorMapPinDuotone,
  githubICO: phosphorGithubLogoDuotone,
  linkedinICO: phosphorLinkedinLogoDuotone,
  email: phosphorEnvelopeDuotone,
  emailOpen: phosphorEnvelopeOpenDuotone,
  code: phosphorCode
} as const;

export declare type ZardIcon = keyof typeof ZARD_ICONS;
