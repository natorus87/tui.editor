import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';
import { Parser } from '@licium/toastmark';

describe('Bug #3265: Ordered List broken by Code Block', () => {
  let em: EventEmitter;
  let wwe: WysiwygEditor;
  let convertor: Convertor;
  let parser: Parser;

  beforeEach(() => {
    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor: {} as any });
    convertor = new Convertor(wwe.schema, {}, {}, em);
    parser = new Parser();
  });

  it('should maintain ordered list continuity when an item contains a code block', () => {
    // Markdown Input:
    // 1. Item 1
    // 2. Item 2
    //    ```
    //    code
    //    ```
    // 3. Item 3

    const inputMd = ['1. Item 1', '2. Item 2', '    ```', '    code', '    ```', '3. Item 3'].join(
      '\n'
    );

    // Parse to see AST
    const mdNode = parser.parse(inputMd);

    // Convert to WYSIWYG
    const wwNodes = convertor.toWysiwygModel(mdNode);

    // Convert back to Markdown
    const outputMd = convertor.toMarkdownText(wwNodes!);

    console.log('Output MD:', outputMd);

    // Expectation:
    // Item 3 should be '3. Item 3' (or '1. Item 3' if list is split).
    // If broken, it might look like:
    // 1. Item 1
    // 2. Item 2
    // ```...```
    // 1. Item 3 (New list started)

    // Check for continuity
    expect(outputMd).toContain('3. Item 3');
    // Check that code block is indented (part of Item 2)
    // Note: Fenced block inside list item usually indented by 4 spaces (or 3?).
    // TUI Editor Convertor usually produces indentation.
  });

  it('should maintain ordered list continuity when code block is INTERLEAVED (Indent issue?)', () => {
    // Maybe the bug is about loose lists?
  });
});
