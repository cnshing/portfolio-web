# Static Site Generation

The Angular application is built and deployed statically. Simply run `pnpm run build` and configure the build output directory to `dist/portfolio-web` with the CDN of your choice. This project's current CDN of choice is [Cloudflare Pages](https://pages.cloudflare.com/) through their GitHub integration.

The site leverages *partial* Static Site Generation, meaning some parts of the website can be changed through Markdown files, while other parts cannot.

## Updating your career

To add, for example, a new skill, you must first define a new `.md` file in the `skills` folder, including the frontmatter for your skill name, logo, and description. Afterwards, you must import and add the reference to the `landingSkillsContentMDs` array. Perhaps in the future, it could be modified so that you won't need to touch `environment.ts` to make changes.

Currently, the career section, skills section, and privacy policy page are convertible to Angular components. There is no support yet for dynamic data binding within the Markdown files themselves.

## Environment.ts

Certain sections of the site are templatable, allowing you to directly update the site with your own name, contact information, and social media links via a single configuration file.

Under the hood, the contents from `environment.ts` are imported throughout the application and rendered into HTML on a need-to-know basis.
