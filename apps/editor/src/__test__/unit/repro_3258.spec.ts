import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #3258: Copy Pasted content saves as markdown when using getHtml()', () => {
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

  it('should return pure HTML without markdown syntax after pasting', () => {
    // Simulate pasting formatted content
    // When users paste from websites, it comes as HTML
    const pastedHTML =
      '<p>This is <strong>bold</strong> text and <em>italic</em> text.</p><h1>Heading</h1>';

    editor.setHTML(pastedHTML);

    // getHTML() should return pure HTML, not markdown
    const html = editor.getHTML();

    // Should NOT contain markdown syntax like ** or #
    expect(html).not.toMatch(/\*\*/);
    expect(html).not.toMatch(/^#\s/m);

    // Should contain proper HTML
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
    expect(html).toContain('<h1>');

    console.log('getHTML() output:', html);
  });

  it('should handle complex pasted content without converting to markdown', () => {
    // Simulate more complex pasted HTML
    const complexHTML = `
            <h2>Computer</h2>
            <p>A <strong>computer</strong> is a <em>machine</em> that can be programmed.</p>
            <ul>
                <li>Input devices</li>
                <li>Output devices</li>
            </ul>
        `;

    editor.setHTML(complexHTML);
    const html = editor.getHTML();

    // Verify no markdown syntax leaked into HTML
    expect(html).not.toMatch(/##/);
    expect(html).not.toMatch(/\*\*/);
    expect(html).not.toMatch(/^\s*[-*]\s/m);

    console.log('Complex HTML output:', html);
  });
});
