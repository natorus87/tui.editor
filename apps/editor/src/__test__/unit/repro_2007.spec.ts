import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2007: Switching from WYSIWYG to MarkDown mode breaks markup (preformatted text and lists)', () => {
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

  it('should not insert extra newlines between list item and indented code block on mode switch', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    });

    // Tightly coupled code block (no blank line)
    const initialMarkdown = [
      '1. list item 1',
      '2. list item 2',
      '    ```js',
      '    console.log("hello");',
      '    ```',
      '3. list item 3',
    ].join('\n');

    editor.setMarkdown(initialMarkdown);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // Switch back to Markdown
    editor.changeMode('markdown');

    const outputMarkdown = editor.getMarkdown();

    // Expect NO extra newline between "list item 2" and code block
    const expected = [
      '1. list item 1',
      '2. list item 2',
      '    ```js',
      '    console.log("hello");',
      '    ```',
      '3. list item 3',
    ].join('\n');

    expect(outputMarkdown).toBe(expected);
  });
});
