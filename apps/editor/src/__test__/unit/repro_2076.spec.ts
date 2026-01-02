import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2076: Switching between markdown mode and WYSIWYG mode causes format confusion (Word Paste)', () => {
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

  it('should simplify Word-style HTML and preserve structure during round-trip conversion', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
    });

    const wordContent = `
          <p class=MsoNormal style='margin-bottom:0in;line-height:normal'>
            <b><span style='font-size:12.0pt;font-family:"Arial",sans-serif;color:red'>Bold Red Text From Word</span></b>
          </p>
          <ul>
            <li><span style='mso-list:Ignore'>List Item 1</span></li>
            <li><span style='mso-list:Ignore'>List Item 2</span></li>
          </ul>
        `;

    editor.setHTML(wordContent);

    // Check Initial WYSIWYG simplification (should be clean list and bold)
    let html = editor.getHTML();

    // Editor wrappers logic simplifies to standard HTML (strong, li/p)
    expect(html).toContain('<strong>Bold Red Text From Word</strong>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li><p>List Item 1</p></li>');

    // Switch to Markdown
    editor.changeMode('markdown');
    const markdown = editor.getMarkdown();

    // Expect valid markdown structure
    expect(markdown).toContain('**Bold Red Text From Word**');
    expect(markdown).toMatch(/\* List Item 1/);

    // Switch back to WYSIWYG
    editor.changeMode('wysiwyg');

    // Verify format is not "disordered"
    html = editor.getHTML();
    expect(html).toContain('<strong>Bold Red Text From Word</strong>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li><p>List Item 1</p></li>');
  });
});
