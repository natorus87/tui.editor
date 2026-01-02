import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #3011: HTML entered in markdown mode disappears when switching to wysiwyg', () => {
  let container: HTMLElement, editor: Editor;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should preserve iframe when switching from Markdown to WYSIWYG and back', () => {
    const iframeHtml =
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/YDiSFS-yHwk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';

    editor.setMarkdown(iframeHtml);

    // Verify initial Markdown content
    expect(editor.getMarkdown()).toContain(iframeHtml);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // In WYSIWYG, valid HTML block tags should typically be preserved,
    // possibly as an HTML block node or similar.
    const wwHtml = editor.getHTML();

    console.log('WYSIWYG HTML:', wwHtml);

    // Even if it's not rendered as a live iframe in the editor content editable (it might be a placeholder),
    // the data should be structurally present in the model so it can be converted back.
    // For now, let's check if the HTML output contains the iframe.
    expect(wwHtml).toContain('iframe');

    // Switch back to Markdown
    editor.changeMode('markdown');

    const mdHtml = editor.getMarkdown();

    console.log('Final Markdown:', mdHtml);

    // The iframe should be preserved
    expect(mdHtml).toContain('iframe');
    expect(mdHtml).toContain('src="https://www.youtube.com/embed/YDiSFS-yHwk"');
  });
});
