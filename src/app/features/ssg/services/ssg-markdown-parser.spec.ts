import { TestBed } from '@angular/core/testing';

import { SSGMarkdownParser } from './ssg-markdown-parser.service';
import { LandingCareerExperienceInput } from '@features/landing/career/experience/landing-career-experience.types';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SSGMarkdownParser', () => {
  let service: SSGMarkdownParser;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(SSGMarkdownParser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  /**
   * Converts any key-value object into a markdown string with front-matter.
   *
   * @param {Record<string, any>} obj The key-value object to convert
   * @param {string} [body] Optional body content to include after the front-matter
   * @returns {string} Markdown string with front-matter
   */
  function generateMarkdown(obj: Record<string, any>, body: string = ''): string {
    const lines = Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map((item) => `  - "${item}"`).join('\n')}`;
        }
        return `${key}: "${value}"`;
      });

    return `---
${lines.join('\n')}
---
${body}`;
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

    const { highlights, ...frontmatter } = dummyCareer;
    const markdown = generateMarkdown(frontmatter, highlights);
    const result = service.parseMarkdown<LandingCareerExperienceInput>(markdown, {
      bodyKey: 'highlights',
    });

    expect(dummyCareer).toEqual(result);
  });

  it('should sanity check correctly parse front matter even with optional keys not written in', () => {
    const frontmatter: LandingCareerExperienceInput = {
      company: 'MiniCorp',
      companyLogoImg: '/mini.svg',
      position: 'Intern',
      from: 'Feb 2021',
      to: 'Present',
    };
    const markdown = generateMarkdown(frontmatter, 'Basic highlight');

    const result = service.parseMarkdown<LandingCareerExperienceInput>(markdown, {
      bodyKey: 'highlights',
    });

    expect(result).toEqual({
      ...frontmatter,
      highlights: 'Basic highlight'
    })
  });

  it('should work with custom interfaces and different body keys', () => {
    interface BlogPost {
      title: string;
      author: string;
      date: string;
      content?: string;
    }

    const frontmatter: BlogPost = {
      title: 'My First Post',
      author: 'Jane Developer',
      date: 'Dec 2024',
    };
    const markdown = generateMarkdown(frontmatter, 'This is the blog post content.');

    const result = service.parseMarkdown<BlogPost>(markdown, {
      bodyKey: 'content',
    });

    expect(result).toEqual({
      ...frontmatter,
      content: 'This is the blog post content.',
    });
  });

  it('should work without specifying a body key', () => {
    interface Metadata {
      title: string;
      version: string;
    }

    const frontmatter: Metadata = {
      title: 'Documentation',
      version: '1.0.0',
    };
    const markdown = generateMarkdown(frontmatter, 'This content will be ignored.');

    const result = service.parseMarkdown<Metadata>(markdown);

    expect(result).toEqual(frontmatter);
  });

  it('should maintain backward compatibility with parseCareerMarkdown', () => {
    const dummyCareer: LandingCareerExperienceInput = {
      company: 'BackCompat Inc',
      companyLogoImg: '/logo.png',
      position: 'Developer',
      from: 'Jan 2023',
      to: 'Present',
      highlights: 'Built amazing things.',
    };

    // Include highlights in frontmatter when not using bodyKey
    const markdown = generateMarkdown(dummyCareer);
    const result = service.parseMarkdown<LandingCareerExperienceInput>(markdown);

    expect(dummyCareer).toEqual(result);
  });
});
