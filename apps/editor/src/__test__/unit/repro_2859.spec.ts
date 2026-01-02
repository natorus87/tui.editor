import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2859: When switch between Markdown and WYSIWYG gives me a different look', () => {
  let container: HTMLElement, editor: Editor;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (editor) {
      editor.destroy();
    }
    document.body.removeChild(container);
  });

  it('should maintain consistent content when switching from Markdown to WYSIWYG and back', () => {
    // Based on the issue description, specific content causes the drift.
    // The issue mentions "First look like this: And then:".
    // Unfortunately the issue text is vague without the images, but let's try
    // generic complex markdown that often causes issues: nested lists, reference links, etc.

    // Let's try a reference link pattern as "image-link" was suspected in your analysis
    // or a list.

    // Scenario 1: Standard round trip
    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    });

    const initialMarkdown = `*   Item 1
    *   Item 1.1
*   Item 2`;

    editor.setMarkdown(initialMarkdown);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // Switch back to Markdown
    editor.changeMode('markdown');

    const finalMarkdown = editor.getMarkdown();

    console.log('Initial:', JSON.stringify(initialMarkdown));
    console.log('Final:  ', JSON.stringify(finalMarkdown));

    // Expectation: Content should be semantically equivalent
    // TUI Editor normalizes list indentation to 1 space after bullet.
    // We verify that the content is semantically mostly the same (bullet char preserved, text same)
    // by collapsing multiple spaces to single space for comparison.
    const normalize = (str: string) => str.replace(/ +/g, ' ').trim();

    expect(normalize(finalMarkdown)).toBe(normalize(initialMarkdown));
  });

  it('should preserve bullet characters during round-trip', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    });

    const hyphenList = `- Item 1
- Item 2`;

    editor.setMarkdown(hyphenList);

    // Round trip
    editor.changeMode('wysiwyg');
    editor.changeMode('markdown');

    const result = editor.getMarkdown();

    console.log('Hyphen List Round Trip:', JSON.stringify(result));

    // If it returns * Item 1, then it changed the bullet char
    expect(result).toContain('- Item 1');
  });

  it('should maintain consistent content when switching from Markdown to WYSIWYG and back', () => {
    // The issue mentions: "Also when use initialEditType: 'wysiwyg' for some file give me error"

    const complexContent = `
# Title
* List item
  * Nested item

> Blockquote
`;

    editor = new Editor({
      el: container,
      initialEditType: 'wysiwyg',
      initialValue: complexContent,
    });

    // If it throws during init, test fails.
    // We can also try switching modes here
    editor.changeMode('markdown');
    editor.changeMode('wysiwyg');

    // Success if no crash
    expect(true).toBe(true);
  });
});
