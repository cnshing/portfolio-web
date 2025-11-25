import AgapeOne from '@content/career/agape-1.md' with { loader: 'text' }
import Intelcon from '@content/career/intelcon.md' with { loader: 'text' }
import UCSC from '@content/career/ucsc.md' with { loader: 'text' } // From https://github.com/angular/angular-cli/issues/26575


export const environment = {
  name: "firstName lastName",
  location: "City, State",
  email: "my@email.com",
  githubUsername: "githubName",
  linkedinUsername: "linkedinHandle",
  phoneNumber: "+14155552671",
  landingCareerContentMDs: [AgapeOne, Intelcon, UCSC]
} as const;
