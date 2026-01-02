import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';
import { Parser } from '@toast-ui/toastmark';

describe('Bug #3240: <pre> in <li> breaks WYSIWYG', () => {
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

    it('should handle <pre> with line break inside <li> without crashing', () => {
        // Input HTML that causes the crash
        const inputMd = '<ul><li> <pre> first line second line </pre> </li></ul>';

        console.log('Parsing Markdown...');
        const mdNode = parser.parse(inputMd);
        console.log('MD Node:', mdNode.type);

        console.log('Converting to WYSIWYG...');
        // This should not throw "Cannot read properties of undefined (reading 'length')"
        expect(() => {
            const wwNodes = convertor.toWysiwygModel(mdNode);
            console.log('WYSIWYG conversion succeeded');
        }).not.toThrow();
    });

    it('should handle <pre> with actual newline inside <li>', () => {
        // With actual newline character
        const inputMd = `<ul><li> <pre>first line
second line</pre> </li></ul>`;

        console.log('Parsing with newline...');
        const mdNode = parser.parse(inputMd);

        console.log('Converting to WYSIWYG...');
        expect(() => {
            const wwNodes = convertor.toWysiwygModel(mdNode);
            console.log('Conversion with newline succeeded');
        }).not.toThrow();
    });
});
