import { Injectable } from '@angular/core';
import fm from 'front-matter';

/**
 * Configuration options for parsing markdown with front-matter.
 *
 * @export
 * @interface MarkdownParseOptions
 * @template T The type of the output object
 */
export interface MarkdownParseOptions<T> {
  /**
   * The key in the output object where the parsed body content should be assigned.
   * If not provided, the body will not be included in the output.
   */
  bodyKey?: keyof T
}


/**
 * A generic service for parsing markdown files with front-matter into typed objects.
 *
 * This service automatically conforms front-matter attributes 1-to-1 with the provided
 * interface type, and allows specifying which key should receive the parsed body content.
 *
 * @export
 * @class SSGMarkdownParser
 * @typedef {SSGMarkdownParser}
 */
@Injectable({
  providedIn: 'root',
})
export class SSGMarkdownParser {
  /**
   * Parses markdown content with front-matter into a typed object.
   *
   * The front-matter attributes are automatically mapped 1-to-1 to the output type,
   * and the markdown body can optionally be assigned to a specific key.
   *
   * @template T The type of the output object
   * @param {string} content The raw markdown content as a string
   * @param {MarkdownParseOptions<T>} [options] Configuration options for parsing
   * @returns {T} The parsed object conforming to type T
   *
   * @example
   * ```typescript
   * interface BlogPost {
   *   title: string;
   *   author: string;
   *   content?: string;
   * }
   *
   * const markdown = `---
   * title: "My Post"
   * author: "John Doe"
   * ---
   * This is the post content.`;
   *
   * const post = service.parseMarkdown<BlogPost>(markdown, { bodyKey: 'content' });
   * // Result: { title: "My Post", author: "John Doe", content: "This is the post content." }
   * ```
   */
  parseMarkdown<T>(
    content: string,
    options?: MarkdownParseOptions<T>
  ): T {
    const parsed = fm<T>(content, { allowUnsafe: false });
    const result = { ...parsed.attributes }

    // If a bodyKey is specified, assign the parsed body to that key
    if (options?.bodyKey && parsed.body != null) {
      (result as any)[options.bodyKey] = parsed.body // Assert result[options.bodyKey] is string value
    }

    return result;
  }
}
