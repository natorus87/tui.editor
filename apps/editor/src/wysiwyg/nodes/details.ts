import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';
import NodeSchema from '@/spec/node';
import { getDefaultCustomAttrs, getCustomAttrs } from '@/wysiwyg/helper/node';

export class Details extends NodeSchema {
  get name() {
    return 'details';
  }

  get schema() {
    return {
      content: 'summary block+',
      group: 'block',
      defining: true,
      isolating: true,
      attrs: {
        ...getDefaultCustomAttrs(),
        open: { default: true }, // Default to open for editing? or follows attribute
      },
      parseDOM: [
        {
          tag: 'details',
          getAttrs(dom: Node | string) {
            return {
              open: false, // Always collapse on load/switch to prevent unresponsive state
            };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        const domAttrs = getCustomAttrs(attrs) as Record<string, any>;

        if (attrs.open) {
          domAttrs.open = '';
        }
        return ['details', domAttrs, 0];
      },
    };
  }
}
