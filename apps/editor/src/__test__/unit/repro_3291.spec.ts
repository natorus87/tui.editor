import '@/i18n/en-us';
import Editor from '@/editor';
import { oneLineTrim } from 'common-tags';

describe('Bug #3291: Formatted WYSIWYG Viewer Not clearing view', () => {
  let container: HTMLElement, editor: Editor;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new Editor({
      el: container,
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should clear unformatted text when setting HTML header', () => {
    editor.setMarkdown('unformatted text');
    expect(editor.getHTML()).toContain('unformatted text');
    editor.setMarkdown('<h1>Header</h1>');
    const html = editor.getHTML();

    expect(html).toContain('<h1>Header</h1>');
    expect(html).not.toContain('unformatted text');
  });

  it('should handle mixed content correctly', () => {
    editor.setMarkdown('unformatted text\n<h1>Header</h1>');
    const html = editor.getHTML();

    expect(html).toContain('unformatted text');
    expect(html).toContain('<h1>Header</h1>');
  });

  it('should clear view when using setHTML', () => {
    editor.setHTML('<p>unformatted text</p>');
    expect(editor.getHTML()).toContain('unformatted text');
    editor.setHTML('<h1>Header</h1>');
    const html = editor.getHTML();

    expect(html).toContain('<h1>Header</h1>');
    expect(html).not.toContain('unformatted text');
  });

  it('should handle roundtrip with inline HTML block tags correctly', () => {
    const input = 'this is a test with <h1>a html header element </h1>';

    editor.setMarkdown(input);

    // Verify WYSIWYG content
    const wwParams = editor.getHTML();

    expect(wwParams).toContain('this is a test with');
    expect(wwParams).toMatch(/<h1>a html header element\s*<\/h1>/);

    // Switch to Markdown
    editor.changeMode('markdown');
    // Expect content to be present, allowing for block formatting newlines
    const md = editor.getMarkdown();

    expect(md).toContain('this is a test with');
    expect(md).toMatch(/<h1>a html header element\s*<\/h1>/);

    // Switch back to WYSIWYG
    editor.changeMode('wysiwyg');

    const html = editor.getHTML();

    expect(html).toContain('this is a test with');
    expect(html).toMatch(/<h1>a html header element\s*<\/h1>/);
  });
});
