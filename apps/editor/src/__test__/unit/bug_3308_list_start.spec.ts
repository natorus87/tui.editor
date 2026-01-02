import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import Convertor from '@/convertors/convertor';
import { toMdConvertors } from '@/convertors/toMarkdown/toMdConvertors';
import { ToDOMAdaptor } from '@t/convertor';

describe('Bug #3308: Ordered list start numbering in Table', () => {
  let container: HTMLElement;
  let em: EventEmitter;
  let wwe: WysiwygEditor;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor: {} as any });
    container.appendChild(wwe.el);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should preserve start attribute for ordered list inside table', () => {
    // 1. Manually inject the node to be sure we are testing toMarkdown.
    const { schema } = wwe.view.state;
    const {
      table,
      tableRow,
      tableBody,
      tableHead,
      tableHeadCell,
      tableBodyCell,
      orderedList,
      listItem,
      paragraph,
      text,
    } = schema.nodes;

    // Structure: Table > TableHead > Row > Cell | TableBody > Row > Cell > OL(order=3) > LI > P > Text
    const doc = schema.nodes.doc.create({}, [
      table.create({}, [
        tableHead.create({}, [
          tableRow.create({}, [
            tableHeadCell.create({}, [paragraph.create({}, [schema.text('Header')])]),
          ]),
        ]),
        tableBody.create({}, [
          tableRow.create({}, [
            tableBodyCell.create({}, [
              orderedList.create({ order: 3 }, [
                listItem.create({}, [paragraph.create({}, [schema.text('Item 3')])]),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]);

    // 2. Convert to Markdown using Convertor
    const convertor = new Convertor(schema, {}, {}, em);
    const markdown = convertor.toMarkdownText(doc);

    console.log('Markdown output:', markdown);

    // 3. Expect <ol start="3">
    // Since it's in a table, it renders as HTML.
    expect(markdown).toContain('<ol start="3">');
  });
});
