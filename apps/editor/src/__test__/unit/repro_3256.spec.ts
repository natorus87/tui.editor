import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';

describe('Bug #3256: Unexpected escaping of hyphen at start of line', () => {
  let em: EventEmitter;
  let wwe: WysiwygEditor;
  let convertor: Convertor;

  beforeEach(() => {
    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor: {} as any });
    convertor = new Convertor(wwe.schema, {}, {}, em);
  });

  it('should NOT escape hyphen if it does not form a list marker (-foo)', () => {
    // WYSIWYG: Paragraph text "-foo"
    const { doc, paragraph } = wwe.schema.nodes;
    const wwDoc = doc.create({}, [paragraph.create({}, [wwe.schema.text('-foo')])]);

    const outputMd = convertor.toMarkdownText(wwDoc);

    console.log('"-foo" -> MD:', outputMd);

    // Expected: "-foo"
    // If it escapes, it will be "\-foo"
    expect(outputMd).toBe('-foo');
  });

  it('should escape hyphen if it looks like a list marker but is a paragraph (- foo)', () => {
    // WYSIWYG: Paragraph text "- foo"
    const { doc, paragraph } = wwe.schema.nodes;
    const wwDoc = doc.create({}, [paragraph.create({}, [wwe.schema.text('- foo')])]);

    const outputMd = convertor.toMarkdownText(wwDoc);

    console.log('"- foo" -> MD:', outputMd);

    // Expected: "\- foo" (to avoid becoming a list)
    expect(outputMd).toBe('\\- foo');
  });

  it('should escape asterisk if it looks like a list marker but is a paragraph (* foo)', () => {
    const { doc, paragraph } = wwe.schema.nodes;
    const wwDoc = doc.create({}, [paragraph.create({}, [wwe.schema.text('* foo')])]);

    const outputMd = convertor.toMarkdownText(wwDoc);

    // Expected: "\* foo"
    expect(outputMd).toBe('\\* foo');
  });
});
