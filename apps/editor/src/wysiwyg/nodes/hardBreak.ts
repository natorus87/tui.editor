import { DOMOutputSpec } from 'prosemirror-model';
import NodeSchema from '@/spec/node';

export class HardBreak extends NodeSchema {
  get name() {
    return 'hardBreak';
  }

  get schema() {
    return {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM(): DOMOutputSpec {
        return ['br'];
      },
    };
  }
}
