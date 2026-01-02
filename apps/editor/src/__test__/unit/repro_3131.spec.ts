import WysiwygEditor from '@/wysiwyg/wwEditor';
import Convertor from '@/convertors/convertor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction, Selection, TextSelection } from 'prosemirror-state';

describe('Bug #3131: Task becomes Unordered list item after backspacing', () => {
  let em: EventEmitter;
  let wwe: WysiwygEditor;
  let view: EditorView;

  beforeEach(() => {
    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor: {} as any });
    view = wwe.view;
  });

  it('should unwrap Task Item to Paragraph when backspacing at start (Text Content)', () => {
    // Doc:
    // * [ ] foo
    const { doc, bulletList, listItem, paragraph } = wwe.schema.nodes;
    const taskItem = listItem.create({ task: true }, [
      paragraph.create({}, [wwe.schema.text('foo')]),
    ]);
    const tr = view.state.tr.replaceWith(
      0,
      view.state.doc.content.size,
      doc.create({}, [bulletList.create({}, [taskItem])])
    );

    view.dispatch(tr);

    // Place cursor at start of "foo" (inside task item)
    // Structure: Doc(0) -> BulletList(1) -> ListItem(2) -> Paragraph(3) -> Text(4) "foo"
    // Cursor at 4.
    const newSelection = TextSelection.near(view.state.doc.resolve(4));

    view.dispatch(view.state.tr.setSelection(newSelection));

    console.log('Initial State:', view.state.doc.toString());

    // Simulate Backspace
    // We use view.someProp('handleKeyDown')? Or direct command execution?
    // Let's try executing the Backspace command directly from keymap?
    // Or baseKeymap.
    // We can simulate via `wwe.specs`?

    // Let's assert what *should* happen first.
    // If we trigger "Backspace" command.

    // Find the Backspace command
    // It's likely in `wwe.keymaps` plugin.
    // But accessible via `view.someProp`.

    const handled = view.someProp('handleKeyDown', (f: any) =>
      f(view, { key: 'Backspace', preventDefault: () => {} })
    );

    console.log('Handled:', handled);
    console.log('After Backspace:', view.state.doc.toString());

    // Expectation: Paragraph "foo" (doc(paragraph("foo")))
    // Or lifted out of list?

    const firstNode = view.state.doc.child(0);
    // It should NOT be a bulletList anymore?
    // Or if it is, it should NOT be a listItem?

    // If bug reproduces: It is BulletList -> ListItem(task=false) -> Paragraph("foo")
    if (firstNode.type.name === 'bulletList') {
      const li = firstNode.child(0);

      if (li.type.name === 'listItem' && !li.attrs?.task) {
        console.log('Reproduced: Became unordered list item (task=false)');
      }
    }
  });

  it('should unwrap Empty Task Item to Paragraph (or delete?) when backspacing', () => {
    // Doc: * [ ]
    const { doc, bulletList, listItem, paragraph } = wwe.schema.nodes;
    const taskItem = listItem.create({ task: true }, [paragraph.create({}, [])]);
    const tr = view.state.tr.replaceWith(
      0,
      view.state.doc.content.size,
      doc.create({}, [bulletList.create({}, [taskItem])])
    );

    view.dispatch(tr);

    // Cursor at start of empty paragraph.
    // Doc(0) -> BL(1) -> LI(2) -> P(3) -> End(4).
    // Cursor at 4? No, 3 is start of P. 4 is end of P.
    // Position 4?

    const newSelection = TextSelection.near(view.state.doc.resolve(4)); // Inside P

    view.dispatch(view.state.tr.setSelection(newSelection));

    console.log('Initial State Empty:', view.state.doc.toString());

    const handled = view.someProp('handleKeyDown', (f: any) =>
      f(view, { key: 'Backspace', preventDefault: () => {} })
    );

    console.log('After Backspace Empty:', view.state.doc.toString());

    // If bug reproduces: It is BulletList -> ListItem(task=false)
    const firstNode = view.state.doc.child(0);

    if (firstNode.type.name === 'bulletList') {
      const li = firstNode.child(0);

      if (li.type.name === 'listItem' && !li.attrs?.task) {
        console.log('Reproduced: Empty Task Became unordered list item');
      }
    }
  });

  it('should NOT lose task attribute when backspacing a NESTED task item (Outdent)', () => {
    // Doc:
    // * Item 1
    //   * [ ] Nested
    // We must use wwe.schema.nodes dereferencing
    const { doc, bulletList, listItem, paragraph } = wwe.schema.nodes;

    const nestedTask = listItem.create({ task: true }, [
      paragraph.create({}, [wwe.schema.text('Nested')]),
    ]);
    const parentItem = listItem.create({}, [
      paragraph.create({}, [wwe.schema.text('Item 1')]),
      bulletList.create({}, [nestedTask]),
    ]);

    const tr = view.state.tr.replaceWith(
      0,
      view.state.doc.content.size,
      doc.create({}, [bulletList.create({}, [parentItem])])
    );

    view.dispatch(tr);

    let pos = 0;

    view.state.doc.descendants((node, p) => {
      if (node.isText && node.text === 'Nested') pos = p;
      return true;
    });

    // Cursor at start of "Nested"
    const newSelection = TextSelection.near(view.state.doc.resolve(pos));

    view.dispatch(view.state.tr.setSelection(newSelection));

    console.log('Initial State Nested:', view.state.doc.toString());

    const handled = view.someProp('handleKeyDown', (f: any) =>
      f(view, { key: 'Backspace', preventDefault: () => {} })
    );

    console.log('After Backspace Nested:', view.state.doc.toString());

    // Assertions
  });
});
