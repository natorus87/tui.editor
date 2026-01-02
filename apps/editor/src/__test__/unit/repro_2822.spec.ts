import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2822: In certain cases the text produced by the WYSIWYG editor mixes Markdown and HTML', () => {
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

  it('should generate consistent Markdown when applying Bold and Strike styles', () => {
    // Reproduce steps:
    // 1. Open the editor in WISIWYG mode
    // 2. type "one two three"
    // 3. select the entire value and apply Strike formatting
    // 4. select just the word two and remove Strike formatting
    // 5. select just the word one and apply Bold formatting

    // Expected: Markdown is always used for starting and ending tags.
    // Actual reported: **~~one </del></strong>two <del>three</del>
    // Note: The specific output `**~~one </del></strong>` implies inconsistent tag opening/closing.

    editor = new Editor({
      el: container,
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
    });

    // 2. type "one two three"
    editor.setMarkdown('one two three');

    const wwEditor = (editor as any).getCurrentModeEditor(); // Access internal WYSIWYG editor
    const { tr, schema } = wwEditor.view.state;

    // Helper to get transaction
    const getTr = () => wwEditor.view.state.tr;
    const dispatch = (transaction: any) => wwEditor.view.dispatch(transaction);

    // We need to manipulate the selection and apply marks programmatically to simulate user action
    // or use editor commands if available. TUI editor exposes commands.

    // But setMarkdown overwrites everything. In WYSIWYG, setMarkdown parses MD into PM doc.
    // 'one two three' -> Paragraph(Text("one two three"))

    // 3. select the entire value and apply Strike formatting
    // "one two three" -> 13 chars
    // From 1 to 14
    wwEditor.setSelection(1, 14);
    editor.exec('strike');

    // 4. select just the word two and remove Strike formatting
    // "one |two| three"
    // 1234 567 890123
    // one  two  three
    // one: 1-4
    // space: 4-5
    // two: 5-8
    wwEditor.setSelection(5, 8);
    editor.exec('strike'); // Toggle off

    // 5. select just the word one and apply Bold formatting
    // one: 1-4
    wwEditor.setSelection(1, 4);
    editor.exec('bold');

    // 8. Notice generated value
    const markdown = editor.getMarkdown();

    console.log('Resulting Markdown:', markdown);

    // Check for mixed tags like `</del>` or `</strong>` which shouldn't appear in standard MD output
    // unless raw HTML was intended (which it isn't here).
    expect(markdown).not.toMatch(/<\/del>/);
    expect(markdown).not.toMatch(/<\/strong>/);
    expect(markdown).not.toMatch(/<del>/);
    expect(markdown).not.toMatch(/<strong>/);

    // Ideally it should be: **~~one~~** two ~~three~~
    // Or similar valid markdown.
  });
});
