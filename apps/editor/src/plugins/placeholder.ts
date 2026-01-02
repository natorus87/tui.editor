import { Plugin } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import addClass from 'tui-code-snippet/domUtil/addClass';

interface Options {
  text?: string;
  className?: string;
}

export function placeholder(options: Options) {
  return new Plugin({
    props: {
      decorations(state) {
        const { doc } = state;

        if (
          options.text &&
          doc.childCount === 1 &&
          doc.firstChild!.isTextblock &&
          doc.firstChild!.content.size === 0
        ) {
          return DecorationSet.create(doc, [
            Decoration.node(0, doc.firstChild!.nodeSize, {
              class: `${options.className ? `${options.className} ` : ''}placeholder`,
              'data-placeholder': options.text,
            }),
          ]);
        }
        return null;
      },
    },
  });
}
