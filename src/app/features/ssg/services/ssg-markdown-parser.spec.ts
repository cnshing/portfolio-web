import { TestBed } from '@angular/core/testing';

import { LandingCareerMarkdown } from '@features/landing/career/services/landing-career-markdown.service';
import { LandingCareerExperienceInput } from '@features/landing/career/experience/landing-career-experience.types';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LandingCareerMarkdown', () => {
  let service: LandingCareerMarkdown;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(LandingCareerMarkdown);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  /**
   * Converts an career experience input into string mock data.
   *
   * @param {LandingCareerExperienceInput} career Any `LandingCareerExperienceInput`
   * @returns {string} String front-matter representation of `career` compatiable with `LandingCareerMarkdown.parseMarkdown()`
   */
  function generateMarkdown(
    career: LandingCareerExperienceInput
  ): string {
    return `---
company: "${career.company}"
companyLogoImg: "${career.companyLogoImg}"
position: "${career.position}"
${career.description ? `description: "${career.description}"` : ''}
${career.summary ? `summary: "${career.summary}"` : ''}
from: "${career.from}"
to: "${career.to}"
${
  career.skills
    ? `skills:
${career.skills.map((s) => `  - "${s}"`).join('\n')}`
    : ''
}
---
${career.highlights ?? ''}`;
  }

  it('should sanity check correctly parse front matter from sample md', () => {
    const dummyCareer: LandingCareerExperienceInput = {
      company: 'DummyCorp',
      companyLogoImg: '/assets/logo.svg',
      position: 'QA Lead',
      description: 'Testing everything thoroughly.',
      summary: 'Ensured system-wide stability.',
      from: 'Jan 2020',
      to: 'Dec 2024',
      skills: ['Angular', 'TypeScript', 'Testing'],
      highlights: 'Performed extensive test automation and tooling.',
    };

    const markdown = generateMarkdown(dummyCareer);
    const result = service.parseMarkdown(markdown);

    expect(dummyCareer).toEqual(result);
  });

  it('should sanity check correctly parse front matter even with optional keys not written in', () => {
    const dummyCareer: LandingCareerExperienceInput = {
      company: 'MiniCorp',
      companyLogoImg: '/mini.svg',
      position: 'Intern',
      from: 'Feb 2021',
      to: 'Present',
      skills: undefined,
      summary: undefined,
      description: undefined,
      highlights: 'Basic highlight',
    };

    const markdown = generateMarkdown(dummyCareer);
    const result = service.parseMarkdown(markdown);

    expect(dummyCareer).toEqual(result)

  });
});
