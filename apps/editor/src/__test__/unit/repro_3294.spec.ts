import ToastUIEditor from '@/editorCore';

describe('Bug #3294: Inconsistent cursor position when switching between Markdown and WYSIWYG', () => {
  let container: HTMLElement;
  let editor: ToastUIEditor;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    editor = new ToastUIEditor({
      el: container,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      initialValue: 'Hello **World**',
    });
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should maintain cursor position in the middle of a word when switching modes', () => {
    // Markdown: Hello **World**
    // Cursor at "Wo|rld" -> line 1, char 10 (0-indexed: "H" is 0)
    // "Hello **Wo" length is 6 + 2 + 2 = 10?
    // "Hello " = 6 chars. "**" = 2 chars. "Wo" = 2 chars. Total 10.
    // So cursor at [1, 11] (1-indexed line, 1-indexed char? No usually 1-indexed line, 1-indexed char in some editors, let's check doc)

    // Using setSelection with [start, end]
    // In editorCore.ts `setSelection` calls `mdEditor.setSelection` which takes `MdPos`
    // `MdPos` is [line, ch] (1-indexed line, 1-indexed ch)

    // "Hello **World**"
    // H e l l o   * * W o r l d * *
    // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    // To be after "Wo", we are at 11. (1, 11)

    editor.setSelection([1, 11], [1, 11]);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');

    // WYSIWYG Structure: <p>Hello <strong>World</strong></p>
    // ProseMirror Text: "Hello World" (plus paragraph node start)
    // P(1) "Hello "(6) Strong(1) "World"(5) StrongEnd(1) PEnd(1)
    // Start of doc = 0.
    // Start of P = 1.
    // "Hello " = 1 + 6 = 7.
    // Start of Strong = 7.
    // "Wo" = 7 + 2 = 9.
    // Cursor should be at 9. Maybe 10 if strong mark boundary counts?
    // Let's rely on text content matching.

    const wwSelection = editor.getSelection();
    const [start, end] = wwSelection;

    // Check if empty selection
    expect(start).toBe(end);

    // To verify position, let's insert text and see where it goes
    editor.insertText('INSERTED');

    // Expect: Hello **WoINSERTEDrld** in Markdown, or "Hello WoINSERTEDrld" bolded in WYSIWYG.
    const html = editor.getHTML();

    expect(html).toContain('<strong>Wo</strong>INSERTED<strong>rld</strong>');

    // Switch back
    editor.changeMode('markdown');

    // Cursor should still be after INSERTED? No, let's reset and test roundtrip without mutation first.
  });

  it('should preserve cursor position roundtrip without modification', () => {
    // Setup: Markdown
    editor.setSelection([1, 11], [1, 11]); // "Hello **Wo|rld**"

    editor.changeMode('wysiwyg');

    // We expect it to be somewhere valid. Let's record it.
    const wwSelection = editor.getSelection();

    editor.changeMode('markdown');

    const mdSelection = editor.getSelection();

    // Should be back at [1, 11]
    expect(mdSelection).toEqual([
      [1, 11],
      [1, 11],
    ]);
  });
});
