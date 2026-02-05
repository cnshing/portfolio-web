import { AltFromSrcPipe } from './accessibility';

describe('AltFromSrcPipe', () => {
  let pipe: AltFromSrcPipe;

  beforeEach(() => {
    pipe = new AltFromSrcPipe();
  });

  it('returns an empty string for undefined input', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns an empty string for empty string input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('derives alt text from a simple path', () => {
    expect(
      pipe.transform('path/to/logo.png')
    ).toBe('Logo');
  });

  it('handles filenames without a path', () => {
    expect(
      pipe.transform('logo.png')
    ).toBe('Logo');
  });

  it('handles filenames without an extension', () => {
    expect(
      pipe.transform('path/to/logo')
    ).toBe('Logo');
  });

  it('handles filenames with multiple dots', () => {
    expect(
      pipe.transform('path/to/my.company.logo.png')
    ).toBe('My Company Logo');
  });

  it('handles query strings', () => {
    expect(
      pipe.transform('path/to/logo-name.png?v=123')
    ).toBe('Logo Name');
  });

  it('replaces hyphens with spaces', () => {
    expect(
      pipe.transform('path/to/my-awesome-logo.png')
    ).toBe('My Awesome Logo');
  });

  it('replaces underscores with spaces', () => {
    expect(
      pipe.transform('path/to/my_awesome_logo.png')
    ).toBe('My Awesome Logo');
  });

  it('collapses multiple separators using the regex', () => {
    expect(
      pipe.transform('path/to/my---awesome__logo.png')
    ).toBe('My Awesome Logo');
  });

  it('trims leading and trailing separators', () => {
    expect(
      pipe.transform('path/to/---logo___.png')
    ).toBe('Logo');
  });

  it('capitalizes each word', () => {
    expect(
      pipe.transform('path/to/user-profile-avatar.png')
    ).toBe('User Profile Avatar');
  });
});
