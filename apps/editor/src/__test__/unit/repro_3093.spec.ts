import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #3093: Losing formatting when switching between markdown and WYSIWYG', () => {
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

  it('should preserve BR tags when switching modes multiple times', () => {
    // Start with 5 BR tags in WYSIWYG
    const initialHTML = '<p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>';

    editor.setHTML(initialHTML);

    // Count initial BR tags
    const html1 = editor.getHTML();
    const brCount1 = (html1.match(/<br>/g) || []).length;

    console.log('Initial BR count:', brCount1, html1);
    expect(brCount1).toBe(5);

    // Switch to Markdown
    editor.changeMode('markdown');
    const md1 = editor.getMarkdown();
    const brCountMd1 = (md1.match(/<br\s*\/?>/gi) || []).length;

    console.log('After 1st switch to MD, BR count:', brCountMd1, md1);

    // Switch back to WYSIWYG
    editor.changeMode('wysiwyg');
    const html2 = editor.getHTML();
    const brCount2 = (html2.match(/<br>/g) || []).length;

    console.log('After switch back to WW, BR count:', brCount2, html2);

    // Bug: BR count should still be 5, not 4
    expect(brCount2).toBe(5);

    // Switch to Markdown again
    editor.changeMode('markdown');
    const md2 = editor.getMarkdown();
    const brCountMd2 = (md2.match(/<br\s*\/?>/gi) || []).length;

    console.log('After 2nd switch to MD, BR count:', brCountMd2, md2);

    // Switch back to WYSIWYG again
    editor.changeMode('wysiwyg');
    const html3 = editor.getHTML();
    const brCount3 = (html3.match(/<br>/g) || []).length;

    console.log('After 2nd switch back to WW, BR count:', brCount3, html3);

    // Bug: BR count should still be 5, not 3
    expect(brCount3).toBe(5);
  });

  it('should preserve empty paragraphs during mode switches', () => {
    // Alternative test: empty paragraphs
    editor.setMarkdown('\n\n\n\n\n');

    const md1 = editor.getMarkdown();

    console.log('Initial MD:', md1);

    // Switch to WYSIWYG
    editor.changeMode('wysiwyg');
    const html1 = editor.getHTML();

    console.log('After switch to WW:', html1);

    // Switch back to Markdown
    editor.changeMode('markdown');
    const md2 = editor.getMarkdown();

    console.log('After switch back to MD:', md2);

    // Content should be stable
    expect(md2).toBe(md1);
  });
});
