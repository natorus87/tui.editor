import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';
import { Parser } from '@toast-ui/toastmark';

describe('Bug #2663: Widget syntax unwrapping in WYSIWYG', () => {
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

    it('should preserve widget syntax in markdown conversion', () => {
        // Input markdown with widget
        const inputMd = '$$widget1 data$$';

        console.log('Parsing widget markdown...');
        const mdNode = parser.parse(inputMd);

        console.log('Converting to WYSIWYG...');
        const wwNodes = convertor.toWysiwygModel(mdNode);

        console.log('Converting back to Markdown...');
        const outputMd = convertor.toMarkdownText(wwNodes!);

        console.log('Input:', inputMd);
        console.log('Output:', outputMd);

        // Widget syntax should be preserved
        // This is EXPECTED behavior - widgets ARE markdown syntax
        expect(outputMd).toContain('$$widget');
    });

    it('should handle widget with multiple lines', () => {
        const inputMd = `Text before

$$myWidget param1 param2$$

Text after`;

        const mdNode = parser.parse(inputMd);
        const wwNodes = convertor.toWysiwygModel(mdNode);
        const outputMd = convertor.toMarkdownText(wwNodes!);

        console.log('Multi-line output:', outputMd);

        // Widget should be preserved
        expect(outputMd).toContain('$$myWidget');
    });
});
