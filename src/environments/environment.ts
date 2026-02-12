import AgapeOne from '@content/career/agape-1.md' with { loader: 'text' }
import Intelcon from '@content/career/intelcon.md' with { loader: 'text' }
import UCSC from '@content/career/ucsc.md' with { loader: 'text' } // From https://github.com/angular/angular-cli/issues/26575
import Docker from '@content/skills/docker.md' with { loader: 'text' }
import NextJS from '@content/skills/nextjs.md' with { loader: 'text' }
import Svelte from '@content/skills/svelte.md' with { loader: 'text' }
import GithubActions from '@content/skills/gh-actions.md' with { loader: 'text' }
import Python from '@content/skills/python.md' with { loader: 'text' }
import Typescript from '@content/skills/typescript.md' with { loader: 'text' }
import Proxmox from '@content/skills/proxmox.md' with { loader: 'text' }
import React from '@content/skills/react.md' with { loader: 'text' }
import Angular from '@content/skills/angular.md' with { loader: 'text' }
import Figma from '@content/skills/figma.md' with { loader: 'text' }
import GSAP from '@content/skills/gsap.md' with { loader: 'text' }
import PrivacyPolicy from "@content/legal/privacypolicy.md"  with { loader: 'text' }

export const environment = {
  name: "firstName lastName",
  location: "City, State",
  email: "my@email.com",
  githubUsername: "githubName",
  linkedinUsername: "linkedinHandle",
  phoneNumber: "+14155552671",
  landingCareerContentMDs: [AgapeOne, Intelcon, UCSC],
  landingSkillsContentMDs: [
    Docker, NextJS, Svelte, GithubActions, Python, Typescript, Proxmox, React, Angular, Figma, GSAP
  ],
  legalPrivacyPolicyMD: PrivacyPolicy
} as const;
