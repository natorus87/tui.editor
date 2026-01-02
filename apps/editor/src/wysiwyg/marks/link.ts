import { Mark as ProsemirrorMark, DOMOutputSpec } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import Mark from '@/spec/mark';
import { escapeXml } from '@/utils/common';
import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';
import { createTextNode } from '@/helper/manipulation';
import { getCustomAttrs, getDefaultCustomAttrs } from '@/wysiwyg/helper/node';

import { EditorCommand } from '@t/spec';
import { LinkAttributes } from '@t/editor';

export class Link extends Mark {
  private linkAttributes: LinkAttributes;

  constructor(linkAttributes: LinkAttributes) {
    super();
    this.linkAttributes = linkAttributes;
  }

  get name() {
    return 'link';
  }

  get schema() {
    return {
      attrs: {
        linkUrl: { default: '' },
        title: { default: null },
        rawHTML: { default: null },
        target: { default: null },
        rel: { default: null },
        class: { default: null },
        id: { default: null },
        ...getDefaultCustomAttrs(),
      },

      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom: Node | string) {
            const sanitizedDOM = sanitizeHTML<DocumentFragment>(dom, { RETURN_DOM_FRAGMENT: true })
              .firstChild as HTMLElement;
            const href = sanitizedDOM.getAttribute('href') || '';
            const title = sanitizedDOM.getAttribute('title') || '';
            const rawHTML = sanitizedDOM.getAttribute('data-raw-html');
            const target = sanitizedDOM.getAttribute('target');
            const rel = sanitizedDOM.getAttribute('rel');
            const className = sanitizedDOM.getAttribute('class');
            const id = sanitizedDOM.getAttribute('id');

            return {
              linkUrl: href,
              title,
              ...(rawHTML && { rawHTML }),
              ...(target && { target }),
              ...(rel && { rel }),
              ...(className && { class: className }),
              ...(id && { id }),
            };
          },
        },
      ],
      toDOM: ({ attrs }: ProsemirrorMark): DOMOutputSpec => [
        attrs.rawHTML || 'a',
        {
          href: /^(vb|java)script:/.test(attrs.linkUrl) ? '#' : escapeXml(attrs.linkUrl),
          ...this.linkAttributes,
          ...getCustomAttrs(attrs),
          ...(attrs.target && { target: attrs.target }),
          ...(attrs.rel && { rel: attrs.rel }),
          ...(attrs.class && { class: attrs.class }),
          ...(attrs.id && { id: attrs.id }),
        },
      ],
    };
  }

  private addLink(): EditorCommand {
    return (payload) => (state, dispatch) => {
      const { linkUrl, linkText = '' } = payload!;
      const { schema, tr, selection } = state;
      const { empty, from, to } = selection;

      if (from && to && linkUrl) {
        const attrs = { linkUrl };
        const mark = schema.mark('link', attrs);
        const selectedText = state.doc.textBetween(from, to);

        if (linkText && linkText !== selectedText) {
          const node = createTextNode(schema, linkText, [mark]);

          tr.replaceRangeWith(from, to, node);
        } else {
          tr.addMark(from, to, mark);
        }

        dispatch!(tr.scrollIntoView());

        return true;
      }

      return false;
    };
  }

  private toggleLink(): EditorCommand {
    return (payload) => (state, dispatch) =>
      toggleMark(state.schema.marks.link, payload)(state, dispatch);
  }

  commands() {
    return {
      addLink: this.addLink(),
      toggleLink: this.toggleLink(),
    };
  }
}
