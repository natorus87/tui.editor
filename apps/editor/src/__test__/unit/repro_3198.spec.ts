import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';
import { Parser } from '@toast-ui/toastmark';

describe('Bug #3198: Widgets in table not rendered', () => {
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

    it('should preserve widget syntax in table cells during MD->WYSIWYG->MD conversion', () => {
        // Markdown with widget in table cell
        const inputMd = `| Header |
| --- |
| $$widget$$ |`;

        console.log('Parsing table with widget...');
        const mdNode = parser.parse(inputMd);

        console.log('Converting to WYSIWYG...');
        const wwNodes = convertor.toWysiwygModel(mdNode);

        console.log('Converting back to Markdown...');
        const outputMd = convertor.toMarkdownText(wwNodes!);

        console.log('Input MD:', inputMd);
        console.log('Output MD:', outputMd);

        // Widget syntax should be preserved
        expect(outputMd).toContain('$$widget$$');
    });

    it('should handle custom inline widgets in table cells', () => {
        const inputMd = `| Col1 | Col2 |
| --- | --- |
| Regular text | $$customWidget$$ |
| $$widget1$$ | $$widget2$$ |`;

        const mdNode = parser.parse(inputMd);
        const wwNodes = convertor.toWysiwygModel(mdNode);
        const outputMd = convertor.toMarkdownText(wwNodes!);

        console.log('Multi-widget output:', outputMd);

        // All widgets should be preserved (note: minor whitespace differences may occur)
        expect(outputMd).toMatch(/\$\$customWidget\s?\$\$/);
        expect(outputMd).toMatch(/\$\$widget1\s?\$\$/);
        expect(outputMd).toMatch(/\$\$widget2\s?\$\$/);
    });

    it('should handle widgets with content in table cells', () => {
        const inputMd = `| Data |
| --- |
| $$chart type=bar$$ |`;

        const mdNode = parser.parse(inputMd);
        const wwNodes = convertor.toWysiwygModel(mdNode);
        const outputMd = convertor.toMarkdownText(wwNodes!);

        console.log('Widget with content:', outputMd);

        expect(outputMd).toContain('$$chart type=bar$$');
    });
});
