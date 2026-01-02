import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #1122: Necessary <br> tags are removed', () => {
  let container: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should preserve <br> tag as hard break during round-trip conversion', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    });

    const inputMarkdown = 'foo<br>bar';

    editor.setMarkdown(inputMarkdown);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // Switch back to Markdown
    editor.changeMode('markdown');

    const outputMarkdown = editor.getMarkdown();

    // Expected: Should contain two spaces + newline OR <br>
    const hasHardBreak = /foo( {2}\n|<br>)bar/.test(outputMarkdown);

    expect(hasHardBreak).toBe(true);
  });
});
