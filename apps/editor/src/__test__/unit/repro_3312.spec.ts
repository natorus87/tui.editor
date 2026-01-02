
import WysiwygEditor from '@/wysiwyg/wwEditor';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';

describe('Bug #3312: Preserve trailing white space', () => {
    let container: HTMLElement;
    let em: EventEmitter;
    let wwe: WysiwygEditor;
    let mde: MarkdownEditor;

    function createEditors() {
        container = document.createElement('div');
        document.body.appendChild(container);
        em = new EventEmitter();

        // Mocking minimal options stuff if needed, but standard init usually works for unit tests if we mock ToDOMAdaptor?
        // Actually, integration test using EditorCore / ToastUIEditor class is better for roundtrip, 
        // but here we can manually invoke converters or use WW/MD editors.
        // Let's use the editors directly if possible or Convertor class.
        // Convertor class is best for RoundTrip testing without UI overhead.
    }

    // We'll use Convertor for this test as it isolates the logic.
});

// Implementation using Convertor
import Convertor from '@/convertors/convertor';
import { Schema } from 'prosemirror-model';
import { createWwConvertors } from '@/convertors/toWysiwyg/toWwConvertors';
import { createMdConvertors } from '@/convertors/toMarkdown/toMdConvertors';
import { Parser } from '@toast-ui/toastmark';
// We need the ACTUAL schema used by editor.
// Usually we can get it from a WysiwygEditor instance.

import { source } from 'common-tags';

describe('Bug #3312: Preserve trailing white space logic', () => {
    let em: EventEmitter;
    let schema: Schema;
    let convertor: Convertor;
    let container: HTMLElement;
    let wwe: WysiwygEditor;
    let parser: Parser;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        em = new EventEmitter();
        // We need a real editor to initialize schema cleanly
        wwe = new WysiwygEditor(em, { toDOMAdaptor: {} as any });
        schema = wwe.schema;

        // Initialize Convertor
        // Convertor constructor: (schema, toMdConvertors, toHTMLConvertors, eventEmitter)
        // We pass empty objects for custom convertors to use defaults.
        convertor = new Convertor(schema, {}, {}, em);
        parser = new Parser();
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('should preserve trailing 2 spaces (Hard Break) in Markdown -> WYSIWYG -> Markdown', () => {
        const inputMd = 'foo  \nbar';
        const mdNode = parser.parse(inputMd);
        const wwNodes = convertor.toWysiwygModel(mdNode);
        const outputMd = convertor.toMarkdownText(wwNodes!);

        expect(outputMd).toBe(inputMd);
    });

    it('should preserve trailing 1 space in Paragraph (WYSIWYG -> Markdown)', () => {
        // Create WYSIWYG doc with "foo "
        const { doc, paragraph, text } = schema.nodes;
        const wwDoc = doc.create({}, [
            paragraph.create({}, [schema.text('foo ')])
        ]);

        const outputMd = convertor.toMarkdownText(wwDoc);
        console.log('WYSIWYG "foo " -> Markdown:', `'${outputMd}'`);

        // If it outputs "foo ", that's good for writer.
        // But if we want it to survive round trip, it needs escaping.
        // Let's see what currently happens.
        expect(outputMd).toContain('foo ');
    });

    it('should preserve trailing space in Code Block', () => {
        const { doc, codeBlock, text } = schema.nodes;
        const inputCode = 'console.log("foo"); '; // Trailing space
        const wwDoc = doc.create({}, [
            codeBlock.create({}, [schema.text(inputCode)])
        ]);

        const outputMd = convertor.toMarkdownText(wwDoc);
        console.log('CodeBlock trailing space:', `'${outputMd}'`);
        // Code Block should preserve        expect(outputMd).toContain(inputCode);
    });

    it('should preserve escaped space in Markdown -> WYSIWYG (Hypothesis)', () => {
        const inputMd = 'foo\\ '; // Escaped space
        const mdNode = parser.parse(inputMd);
        const wwNodes = convertor.toWysiwygModel(mdNode);

        // We verify what text node we get.
        // If parser respects escaped space, we should get 'foo '
        console.log('Parsed "foo\\ ":', JSON.stringify(wwNodes));
    });
});
