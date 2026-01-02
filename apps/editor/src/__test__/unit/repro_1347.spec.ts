import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #1347: Newlines in WYSIWYG are not correctly converted to markdown', () => {
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

  it('should preserve hard break (two spaces + newline) during round-trip conversion', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'markdown', // Start in MD
      previewStyle: 'vertical',
    });

    // Set Markdown with a hard break (two spaces)
    // Note: multiple spaces are collapsed in JS string if not careful? No.
    const originalMd = 'foo bar  \nfoo bar';

    editor.setMarkdown(originalMd);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // Check internal structure (Optional debug)

    // Switch back to Markdown
    editor.changeMode('markdown');

    const outputMarkdown = editor.getMarkdown();

    const hasTwoSpaces = /foo bar {2}\nfoo bar/.test(outputMarkdown);
    const hasBackslash = /foo bar\\\nfoo bar/.test(outputMarkdown);

    expect(hasTwoSpaces || hasBackslash).toBe(true);
  });
});
