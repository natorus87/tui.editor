import WysiwygEditor from '@/wysiwyg/wwEditor';
import MdEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import { ToDOMAdaptor } from '@t/convertor';

describe('Bug #3289: keydown preventDefault support', () => {
  let em: EventEmitter;
  let wwEditor: WysiwygEditor;
  let mdEditor: MdEditor;

  beforeEach(() => {
    em = new EventEmitter();
    // Mock minimal options
    wwEditor = new WysiwygEditor(em, {
      toDOMAdaptor: {} as ToDOMAdaptor,
      htmlSchemaMap: { nodes: {}, marks: {} } as any,
      linkAttributes: {},
    });
    // Mock MD options if needed, simpler to just test WW handler first as logic is same
    mdEditor = new MdEditor(em, {
      toastMark: {} as any,
      mdPlugins: [],
    });
  });

  afterEach(() => {
    wwEditor.destroy();
    mdEditor.destroy();
  });

  it('WysiwygEditor: handleKeyDown should return true if event.preventDefault() is called', () => {
    // 1. Register listener that prevents default
    em.listen('keydown', (type, ev) => {
      ev.preventDefault();
    });

    const mockEvent = new KeyboardEvent('keydown', { key: 'a', cancelable: true });

    // Spy on preventDefault to ensuring it works
    jest.spyOn(mockEvent, 'preventDefault');

    // 2. Execute handleKeyDown
    const handled = wwEditor.view.props.handleKeyDown!(wwEditor.view, mockEvent);

    // 3. Verify
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    // Expect handled to be true (ProseMirror respects it)
    expect(handled).toBe(true);
  });

  it('MdEditor: handleKeyDown should return true if event.preventDefault() is called', () => {
    em.listen('keydown', (type, ev) => {
      ev.preventDefault();
    });

    const mockEvent = new KeyboardEvent('keydown', { key: 'a', cancelable: true });

    jest.spyOn(mockEvent, 'preventDefault');

    const handled = mdEditor.view.props.handleKeyDown!(mdEditor.view, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(handled).toBe(true);
  });
});
