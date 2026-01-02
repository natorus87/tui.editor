import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2659: Switch between markdown and wysiwyg mode cause the page to jump', () => {
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

  it('should preserve scroll position when switching modes', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    });

    // Set some content
    editor.setMarkdown(new Array(100).fill('line').join('\n'));

    // Mock getScrollTop on the public API (which delegates to internal editor)
    // Since we can't easily scroll JSDOM, we mock the return value.
    // We need to spy on the internal method or the public one.

    // We spy on `editor.getScrollTop` and `editor.setScrollTop`.
    // Note: editor.getScrollTop() calls editorCore.getScrollTop().

    const getScrollTopSpy = jest.spyOn(editor, 'getScrollTop').mockReturnValue(500);
    const setScrollTopSpy = jest.spyOn(editor, 'setScrollTop');

    // Also need to ensure the internal editors support this without erroring in JSDOM?
    // editor.setScrollTop calls getCurrentModeEditor().setScrollTop().
    // We might need to spy on that too if we want to confirm propagation,
    // but spying on public interface is enough to see if *logic* attempts to restore it.

    // Switch mode
    editor.changeMode('wysiwyg');

    // Expectation: logic should capture scroll top (getScrollTop called)
    // and restore it (setScrollTop called).

    expect(getScrollTopSpy).toHaveBeenCalled();
    expect(setScrollTopSpy).toHaveBeenCalledWith(500);
  });
});
