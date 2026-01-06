import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';
import NodeSchema from '@/spec/node';
import { getDefaultCustomAttrs, getCustomAttrs } from '@/wysiwyg/helper/node';

export class Summary extends NodeSchema {
  get name() {
    return 'summary';
  }

  get schema() {
    return {
      content: 'inline*',
      group: 'block', // Summary is technically a block-level container for phrasing content usually? Chrome treats it as block.
      defining: true,
      isolating: true, // Prevents accidentally deleting it when backspacing?
      attrs: {
        ...getDefaultCustomAttrs(),
      },
      parseDOM: [{ tag: 'summary' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return ['summary', getCustomAttrs(attrs), 0];
      },
    };
  }
}
