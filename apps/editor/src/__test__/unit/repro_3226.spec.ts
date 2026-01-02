import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';
import { Parser } from '@licium/toastmark';

describe('Bug #3226: Numbered List with code blocks', () => {
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

  it('should maintain correct numbering in ordered list with code blocks', () => {
    // Markdown with numbered list containing code blocks
    const inputMd = `1. First item
2. Second item

    \`\`\`
    code block
    \`\`\`

3. Third item
4. Fourth item

    \`\`\`
    another code
    \`\`\`

5. Fifth item`;

    console.log('Parsing numbered list with code blocks...');
    const mdNode = parser.parse(inputMd);

    console.log('Converting to WYSIWYG...');
    const wwNodes = convertor.toWysiwygModel(mdNode);

    console.log('Converting back to Markdown...');
    const outputMd = convertor.toMarkdownText(wwNodes!);

    console.log('Output MD:', outputMd);

    // Check that all items are numbered correctly
    expect(outputMd).toContain('1. First item');
    expect(outputMd).toContain('2. Second item');
    expect(outputMd).toContain('3. Third item');
    expect(outputMd).toContain('4. Fourth item');
    expect(outputMd).toContain('5. Fifth item');

    // Should NOT restart numbering
    expect(outputMd).not.toMatch(/3\. Third item[\s\S]*1\. Fourth item/);
  });

  it('should preserve list structure with fenced code blocks', () => {
    const inputMd = `1. Step 1
2. Step 2
3. Code example:

    \`\`\`bash
    echo "test"
    \`\`\`

4. Step 4
5. Step 5`;

    const mdNode = parser.parse(inputMd);
    const wwNodes = convertor.toWysiwygModel(mdNode);
    const outputMd = convertor.toMarkdownText(wwNodes!);

    console.log('Output with fenced blocks:', outputMd);

    // Verify numbering continues correctly
    expect(outputMd).toMatch(/4\. Step 4/);
    expect(outputMd).toMatch(/5\. Step 5/);
  });
});
