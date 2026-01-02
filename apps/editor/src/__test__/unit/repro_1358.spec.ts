import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #1358: Title from image tag is removed from MD when switching to MD Editor Mode', () => {
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

  it('should preserve image title during round-trip conversion', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    });

    // Image with title
    const initialMarkdown = '![alt text](https://via.placeholder.com/150 "Image Title")';

    editor.setMarkdown(initialMarkdown);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // Switch back to Markdown
    editor.changeMode('markdown');

    const outputMarkdown = editor.getMarkdown();

    // Expect title to be preserved
    expect(outputMarkdown).toContain('"Image Title"');
    expect(outputMarkdown).toBe(initialMarkdown);
  });
});
