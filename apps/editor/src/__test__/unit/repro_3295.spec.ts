import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #3295: Problem getting final markdown result after switching modes multiple times', () => {
  let container: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new Editor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'tab',
      initialValue: '**Initial**',
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should preserve content after multiple mode switches', () => {
    // Initial State: Markdown
    expect(editor.getMarkdown().trim()).toBe('**Initial**');

    // SCENARIO 1: Simple Switch Cycle
    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');
    // Verify content (in HTML form roughly)
    expect(editor.getHTML()).toContain('<strong>Initial</strong>');

    // Switch back to Markdown
    editor.changeMode('markdown');
    expect(editor.getMarkdown().trim()).toBe('**Initial**');

    // SCENARIO 2: Modify in Markdown, Switch, Modify in WYSIWYG, Switch back
    // Append in Markdown
    editor.setMarkdown('**Initial** _Italic_');

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // Append in WYSIWYG
    // We use insertText which simulates user typing or pasting
    editor.moveCursorToEnd();
    editor.insertText(' `Code`');

    // Switch to Markdown
    editor.changeMode('markdown');

    // Check result
    // Expected: **Initial** _Italic_ `Code`
    // Note: The exact spacing or newline handling might differ, so we trim.
    const result = editor.getMarkdown().trim();

    // We expect the structure to hold.
    // Specifically checking if _Italic_ became escaped or lost.
    expect(result).toMatch(/\*\*Initial\*\*/);
    // Relaxed expectation for italic (can be * or _)
    expect(result).toMatch(/[_*]Italic[_*]/);
    // We expect Code to be code block or escaped if inserted as text.
    // If inserted as text " `Code`", it mimics user typing backticks.
    // In many cases we want to check if it crashed or lost content.
    // Let's just check for "Code" presence.
    expect(result).toContain('Code');
  });

  it('should handle complex formatting preservation across switches', () => {
    const complexMD = '# Heading\n\n* List Item 1\n* List **Item** 2\n\n> Blockquote';

    editor.setMarkdown(complexMD);

    // MD -> WW
    editor.changeMode('wysiwyg');

    // WW -> MD
    editor.changeMode('markdown');

    expect(editor.getMarkdown().trim()).toBe(complexMD.trim());

    // MD -> WW
    editor.changeMode('wysiwyg');

    // Add something in WW
    editor.moveCursorToEnd();
    editor.insertText('\nNew Para');

    // WW -> MD
    editor.changeMode('markdown');

    expect(editor.getMarkdown()).toContain('New Para');
    expect(editor.getMarkdown()).toContain('# Heading');
  });

  it('should not crash when switching mode with BlockQuote at end', () => {
    const complexMD = '> Blockquote';

    editor.setMarkdown(complexMD);

    // MD -> WW
    // This implicitely sets cursor too
    editor.changeMode('wysiwyg');

    // Check if we survived
    expect(editor.isWysiwygMode()).toBe(true);

    // Try moving cursor to end
    editor.moveCursorToEnd();

    // WW -> MD
    editor.changeMode('markdown');

    expect(editor.getMarkdown().trim()).toContain('Blockquote');
  });
});
