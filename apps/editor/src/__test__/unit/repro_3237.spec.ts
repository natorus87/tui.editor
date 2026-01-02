
import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';
import { Parser } from '@toast-ui/toastmark';

describe('Bug #3237: Multiline XML opening tag is not escaped', () => {
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

    it('should parse multiline HTML tag as HTML Block (Standard Behavior)', () => {
        const inputMd = [
            '<div',
            '  id="foo">',
            'content',
            '</div>'
        ].join('\n');

        const mdNode = parser.parse(inputMd);

        // Check AST. Should be `htmlBlock`?
        // Or `paragraph` with text?

        let type = '';
        let literal = '';

        // Traverse
        const walker = mdNode.walker();
        let event;
        while ((event = walker.next())) {
            const { node, entering } = event;
            if (entering && node.type !== 'document') {
                type = node.type;
                literal = node.literal || '';
                break;
            }
        }

        console.log(`Parsed Type: ${type}`);
        console.log(`Literal: ${JSON.stringify(literal)}`);

        // If Logic is correct: Should be 'htmlBlock'.
        // If it is 'paragraph', then it was escaped/treated as text.

        // Conversion
        const wwNodes = convertor.toWysiwygModel(mdNode);
        const outputMd = convertor.toMarkdownText(wwNodes!);

        console.log('Output MD:', outputMd);

        // If bug is "Not escaped", maybe it refers to unexpected rendering?
    });

    it('should ESCAPE multiline XML tag in WYSIWYG -> Markdown conversion', () => {
        // WYSIWYG: Paragraph with text "<custom-xml\n attr='val'>"
        const { doc, paragraph } = wwe.schema.nodes;
        const textContent = "<custom-xml\n attr='val'>";
        const wwDoc = doc.create({}, [
            paragraph.create({}, [wwe.schema.text(textContent)])
        ]);

        const outputMd = convertor.toMarkdownText(wwDoc);
        console.log('WYSIWYG Multiline XML -> MD:', outputMd);

        // Expectation: Should escape the opening bracket to prevent Raw HTML parsing.
        // MD: "\<custom-xml\n attr='val'>"
        // If it outputs "<custom-xml...", then Parser will read it as Raw HTML (Inline).

        expect(outputMd).toContain('\\<custom-xml');
    });
});
