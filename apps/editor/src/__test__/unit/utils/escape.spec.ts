import { escape } from '@/utils/common';

describe('escape util', () => {
  it('should escape HTML tags by prefixing with backslash', () => {
    expect(escape('<div>')).toBe('\\<div>');
    expect(escape('<span>text</span>')).toBe('\\<span>text\\</span>');
    expect(escape('<a href="test">')).toBe('\\<a href="test">');
  });

  it('should escape HTML comments', () => {
    expect(escape('<!-- comment -->')).toBe('\\<!-- comment -->');
  });

  it('should escape self-closing tags', () => {
    expect(escape('<br/>')).toBe('\\<br/>');
    expect(escape('<img src="x" />')).toBe('\\<img src="x" />');
  });

  it('should handle attributes with spaces (Regression Check)', () => {
    const html = '<div class="foo bar" id="baz">';

    expect(escape(html)).toBe('\\<div class="foo bar" id="baz">');
  });
});
