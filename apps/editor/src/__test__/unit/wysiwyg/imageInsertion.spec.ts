import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';

describe('Image Insertion Bug #3230', () => {
  let wwe: WysiwygEditor, em: EventEmitter, cmd: CommandManager;

  beforeEach(() => {
    const toDOMAdaptor = new WwToDOMAdaptor({}, {});

    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor });
    cmd = new CommandManager(em, {}, wwe.commands, () => 'wysiwyg');
  });

  afterEach(() => {
    wwe.destroy();
  });

  it('should insert image with URL correctly', () => {
    cmd.exec('addImage', {
      imageUrl: 'https://example.com/image.png',
      altText: 'Test Image',
    });

    const html = wwe.getHTML();

    expect(html).toContain('<img src="https://example.com/image.png" alt="Test Image">');
  });

  it('should insert image without altText correctly', () => {
    cmd.exec('addImage', {
      imageUrl: 'https://example.com/image.png',
    });

    const html = wwe.getHTML();

    expect(html).toContain('<img src="https://example.com/image.png">');
  });
});
