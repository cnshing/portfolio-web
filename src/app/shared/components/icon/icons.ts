import {
  phosphorPhoneDuotone, phosphorMapPinDuotone, phosphorReadCvLogoDuotone,
  phosphorCalendarBlankDuotone, phosphorGithubLogoDuotone,
  phosphorLinkedinLogoDuotone,
  phosphorEnvelopeDuotone,
  phosphorEnvelopeOpenDuotone,
  phosphorArrowArcLeftDuotone
} from '@ng-icons/phosphor-icons/duotone'
import {
  phosphorCode,
} from '@ng-icons/phosphor-icons/regular'
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export const RAW_ZARD_ICONS = {
  resume: phosphorReadCvLogoDuotone,
  calendar: phosphorCalendarBlankDuotone,
  phone: phosphorPhoneDuotone,
  location: phosphorMapPinDuotone,
  githubICO: phosphorGithubLogoDuotone,
  linkedinICO: phosphorLinkedinLogoDuotone,
  email: phosphorEnvelopeDuotone,
  emailOpen: phosphorEnvelopeOpenDuotone,
  code: phosphorCode,
  arrowArcLeft: phosphorArrowArcLeftDuotone
} as const;

export const DYNAMIC_ZARD_ICONS = {
  docker: "docker-mark-blue",
  figma: "Figma Icon (Full-color)",
  githubActions: "GitHub Actions",
  github: "github-mark-white",
  angular: "icon_angular_gradient",
  intelcon: "IntelconSVG",
  linkedin: "linkedin",
  nextjs: "nextjs-icon-light-background",
  proxmox: "proxmox-logo-stacked-inverted-color",
  python: "python-logo-only",
  react: "reactjs",
  svelte: "svelte-logo-square",
  typescript: "ts-logo-512",
  vscode: "vscode"
} as const

/**
 * Dynamically retrieves an icon.
 * Modified from https://github.com/ng-icons/ng-icons?tab=readme-ov-file#dynamically-loading-icons
 * @param {string} name Filename of the icon.
 * @returns {Observable(string)} SVG string representation of `name`.
 */
export const dynamicIconLoader = (name: string) => {
  const icon = DYNAMIC_ZARD_ICONS[name as keyof typeof DYNAMIC_ZARD_ICONS]
  const http = inject(HttpClient);
  return http.get(`/assets/icons/${icon}.svg`, { responseType: 'text' });
}


export declare type ZardIcon = keyof (typeof DYNAMIC_ZARD_ICONS & typeof RAW_ZARD_ICONS)
