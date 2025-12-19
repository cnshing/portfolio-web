import AgapeOne from '@content/career/agape-1.md' with { loader: 'text' }
import Intelcon from '@content/career/intelcon.md' with { loader: 'text' }
import UCSC from '@content/career/ucsc.md' with { loader: 'text' } // From https://github.com/angular/angular-cli/issues/26575
import { LandingSkillCardInput } from '@features/landing/skills/landing-skills-card';


export const environment = {
  name: "firstName lastName",
  location: "City, State",
  email: "my@email.com",
  githubUsername: "githubName",
  linkedinUsername: "linkedinHandle",
  phoneNumber: "+14155552671",
  landingCareerContentMDs: [AgapeOne, Intelcon, UCSC],
  landingSkillsContent: [
    {
      name: "Docker",
      skillImg: "assets/icons/docker-mark-blue.svg",
      description: "Test description"
    },
    {
      name: "Next.JS",
      skillImg: "assets/icons/nextjs-icon-light-background.svg"
    },
    {
      name: "Figma",
      skillImg: "assets/icons/Figma Icon (Full-color).svg",
      description: "Designed this site with Figma."
    }
  ] as LandingSkillCardInput[]
} as const;
