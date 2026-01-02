import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { Parser } from '@licium/toastmark';

describe('Bug #3072: XML Declaration causes crash in getHTML', () => {
  let em: EventEmitter;
  let wwe: WysiwygEditor;
  let convertor: Convertor;
  let parser: Parser;

  beforeEach(() => {
    em = new EventEmitter();
    // @ts-ignore
    wwe = new WysiwygEditor(em, { toDOMAdaptor: {} });
    convertor = new Convertor(wwe.schema, {}, {}, em);
    parser = new Parser();
  });

  it('should NOT crash when converting XML declaration to WYSIWYG', () => {
    const inputMd = '<?xml version="1.0" encoding="UTF-8"?>';
    const mdNode = parser.parse(inputMd);

    console.log('MD Node Type:', mdNode.firstChild?.type);
    console.log('MD Node Literal:', mdNode.firstChild?.literal);

    let result;

    try {
      result = convertor.toWysiwygModel(mdNode);
      console.log('Conversion success');
    } catch (e) {
      console.error('ERROR IN toWysiwygModel:', e);
      throw e;
    }
  });
});
