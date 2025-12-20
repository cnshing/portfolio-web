import { Injectable } from '@angular/core';
import {
  LandingCareerExperienceInput,
  MMMYYYY,
} from '@features/landing/career/experience/landing-career-experience.types';
import fm from 'front-matter';

/**
 *  This service converts raw markdown content as compatible arguments for `LandingCareerExperience` component.
 *
 * @export
 * @class LandingCareerMarkdown
 * @typedef {LandingCareerMarkdown}
 */
@Injectable({
  providedIn: 'root',
})
export class LandingCareerMarkdown {
  /**
   * Parses markdown as typescript input bindings.
   *
   * @param {string} content The raw markdown as a string value.
   * @returns {LandingCareerExperienceInput} Input bindings that can be directly passed to `LandingCareerExperience`.
   */
  parseMarkdown(content: string): LandingCareerExperienceInput {
    const parsed = fm(content, { allowUnsafe: false });
    const frontmatter = parsed.attributes as LandingCareerExperienceInput;
    const company = frontmatter['company'] as string;
    const companyLogoImg = frontmatter['companyLogoImg'] as string;
    const position = frontmatter['position'] as string;
    const description = frontmatter['description'] as string | undefined;
    const summary = frontmatter['summary'] as string | undefined;
    const from = frontmatter['from'] as MMMYYYY;
    const to = frontmatter['to'] as MMMYYYY | "Present";
    const skills = frontmatter['skills'] as string[] | undefined;
    const highlights = parsed.body as string | undefined;
    return {
      company,
      companyLogoImg,
      position,
      description,
      summary,
      from,
      to,
      skills,
      highlights,
    } as LandingCareerExperienceInput;
  }
}
