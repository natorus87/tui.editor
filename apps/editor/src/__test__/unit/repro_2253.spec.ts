import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2253: Switching between WYSIWYG and Markdown mode expands viewing area beyond widget', () => {
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

  it('should maintain fixed height when switching modes', () => {
    editor = new Editor({
      el: container,
      height: '500px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
    });

    // setHeight puts height on the container (el)
    expect(container.style.height).toBe('500px');

    // Switch to Markdown
    editor.changeMode('markdown');

    expect(container.style.height).toBe('500px');

    // Switch back
    editor.changeMode('wysiwyg');
    expect(container.style.height).toBe('500px');
  });

  it('should respect height: auto if set', () => {
    editor = new Editor({
      el: container,
      height: 'auto',
      initialEditType: 'wysiwyg',
    });

    expect(container.style.height).toBe('auto');

    editor.changeMode('markdown');
    expect(container.style.height).toBe('auto');
  });
});
