import '@/i18n/en-us';
import Editor from '@/editor';

describe('Bug #2994: When HTML code is pasted into Markdown view preview is not working anymore', () => {
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

  it('should update preview correctly when editing pasted HTML content', (done) => {
    // 1. Paste the problematic HTML text
    const initialText =
      '"Hello my friend:<ul><li><b>BUGID</b></li><li>BugAlias</li><li>code_*</li></ul>When we paste text in editor and edit text, content replicates."';

    editor.setMarkdown(initialText);

    // Wait for preview update
    setTimeout(() => {
      // Find preview element in DOM
      // Note: The structure is usually .toastui-editor-md-preview .toastui-editor-contents
      const previewEl = container.querySelector(
        '.toastui-editor-md-preview .toastui-editor-contents'
      );

      if (!previewEl) {
        console.error('Preview element not found!');
        // Dump container HTML to debug if needed, but for now just fail
        // console.log(container.innerHTML);
        expect(true).toBe(false);
        done();
        return;
      }

      const initialHTML = previewEl.innerHTML;

      console.log('Initial Preview HTML:', initialHTML);
      expect(initialHTML).toContain('BUGID');

      // 2. Edit the text (delete last character)
      const newText = initialText.slice(0, -1);

      editor.setMarkdown(newText);

      // Wait for preview update
      setTimeout(() => {
        const updatedHTML = previewEl.innerHTML;

        console.log('Updated Preview HTML:', updatedHTML);

        // Check if preview updated correctly
        // The bug report says "content replicates" or "never deletes"

        expect(updatedHTML).not.toContain(initialText); // Should not have the full original text
        expect(updatedHTML).toContain('replicates'); // Should still have the content

        // If the preview is broken/stuck, it might match initialHTML exactly
        // or contain duplicate content.
        expect(updatedHTML).not.toBe(initialHTML);

        done();
      }, 100);
    }, 100);
  });
});
