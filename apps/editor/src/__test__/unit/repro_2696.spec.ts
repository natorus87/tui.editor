import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2696: Switching Between HTML/Markdown', () => {
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

  it('should convert WYSIWYG paragraphs to proper Markdown newlines without invalid tags', () => {
    editor = new Editor({
      el: container,
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
    });

    // Simulating:
    // fdsfdsfdsa
    // DFSAfds
    // gfdhdgjhjhg

    // In WYSIWYG terms, these are likely paragraphs if user hits Enter.
    const wwEditor = (editor as any).getCurrentModeEditor();
    const { tr, schema } = wwEditor.view.state;

    // We can use setMarkdown to initialize, but bug says "Type into HTML editor".
    // Let's use setMarkdown to prime the WYSIWYG state, usually it's equivalent.
    // Or we can manipulate the doc directly.

    // Case 1: Paragraphs (Enter)
    // one
    // two
    // three
    editor.setMarkdown('one\n\ntwo\n\nthree');

    // Switch to MD
    editor.changeMode('markdown');
    let md = editor.getMarkdown();

    console.log('Case 1 (Paragraphs) MD:', JSON.stringify(md));

    expect(md).not.toMatch(/<br>/);
    expect(md).not.toMatch(/<div>/);

    // Go back to WYSIWYG
    editor.changeMode('wysiwyg');

    // Case 2: Soft Breaks (Shift+Enter)
    // one\
    // two
    editor.setMarkdown('one\\\ntwo');

    editor.changeMode('markdown');
    md = editor.getMarkdown();
    console.log('Case 2 (Soft Breaks) MD:', JSON.stringify(md));

    // Should probably be matches or spaces at end
    // But definitely not invalid HTML tags like <br> if it's standard MD output,
    // though standard MD uses <br> for breaks if trailing spaces not used.
    // TUI Editor usually outputs space-space-newline or just newline?
    // Actually softbreak convertor usually outputs newline or <br> depending on settings.

    // The issue says "invalid html tags". Maybe it's inserting `<div>`.
  });

  it('should handle HTML content with "natural line breaks" correctly', () => {
    // The user might mean they pasted something that ended up as:
    // <div>line1</div><div>line2</div> in the DOM?

    // Editor API:
    editor = new Editor({
      el: container,
      initialEditType: 'wysiwyg',
    });

    // Let's manually set the content to simulate "divs" which happens sometimes on paste
    editor.setHTML('<div>line1</div><div>line2</div>');

    editor.changeMode('markdown');
    const md = editor.getMarkdown();

    console.log('Case 3 (Divs) MD:', JSON.stringify(md));

    // Case 3 (Divs)
    expect(md).not.toMatch(/<div>/);

    // Case 4: Plain text with newlines (Natural line breaks)
    // If I paste or set HTML that is just text with \n
    editor.setHTML('line1\nline2\nline3');
    editor.changeMode('markdown');
    const mdTotal = editor.getMarkdown();

    console.log('Case 4 (Plain Text newlines):', JSON.stringify(mdTotal));

    // Browsers collapse this to "line1 line2 line3" usually in WYSIWYG
    // So MD should be "line1 line2 line3"
    // Unless pre-white-space is involved.

    // Case 5: Br tags
    editor.setHTML('line1<br>line2<br>line3');
    editor.changeMode('markdown');
    const mdBr = editor.getMarkdown();

    console.log('Case 5 (BR tags):', JSON.stringify(mdBr));

    // If MD contains <br>, user might complain "invalid markdown" if they expect \n
    // But <br> is valid CommonMark.
    // However, if they want "natural" markdown, they want \n or "  \n".
  });
});
