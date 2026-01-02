import { MdNode } from '@licium/toastmark';
import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';

import {
  HTMLToWwConvertorMap,
  FlattenHTMLToWwConvertorMap,
  ToWwConvertorState,
} from '@t/convertor';
import { includes } from '@/utils/common';
import { reHTMLTag } from '@/utils/constants';

export function getTextWithoutTrailingNewline(text: string) {
  return text[text.length - 1] === '\n' ? text.slice(0, text.length - 1) : text;
}

export function isCustomInline(node: MdNode) {
  return node.type === 'customInline';
}

export function isCustomHTMLInlineNode({ schema }: ToWwConvertorState, node: MdNode) {
  const html = node.literal;

  // Handle widgets and other nodes without literal content
  if (!html) {
    return false;
  }

  const matched = html.match(reHTMLTag);

  if (matched) {
    const [, openTagName, , closeTagName] = matched;
    const typeName = (openTagName || closeTagName).toLowerCase();

    return node.type === 'htmlInline' && !!(schema.marks[typeName] || schema.nodes[typeName]);
  }
  return false;
}

export function isInlineNode({ type }: MdNode) {
  return includes(['text', 'strong', 'emph', 'strike', 'image', 'link', 'code'], type);
}

function isSoftbreak(mdNode: MdNode | null) {
  return mdNode?.type === 'softbreak';
}

function isListNode({ type, literal }: MdNode) {
  const matched = type === 'htmlInline' && literal!.match(reHTMLTag);

  if (matched) {
    const [, openTagName, , closeTagName] = matched;
    const tagName = openTagName || closeTagName;

    if (tagName) {
      return includes(['ul', 'ol', 'li'], tagName.toLowerCase());
    }
  }

  return false;
}

function getListItemAttrs({ literal }: MdNode) {
  const task = /data-task/.test(literal!);
  const checked = /data-task-checked/.test(literal!);

  return { task, checked };
}

function getMatchedAttributeValue(rawHTML: string, ...attrNames: string[]) {
  const wrapper = document.createElement('div');

  wrapper.innerHTML = sanitizeHTML(rawHTML);

  const el = wrapper.firstChild as HTMLElement;

  return attrNames.map((attrName) => el.getAttribute(attrName) || '');
}

function createConvertors(convertors: HTMLToWwConvertorMap) {
  const convertorMap: FlattenHTMLToWwConvertorMap = {};

  Object.keys(convertors).forEach((key) => {
    const tagNames = key.split(', ');

    tagNames.forEach((tagName) => {
      const name = tagName.toLowerCase();

      convertorMap[name] = convertors[key]!;
    });
  });

  return convertorMap;
}

const convertors: HTMLToWwConvertorMap = {
  'b, strong': (state, _, openTagName) => {
    const { strong } = state.schema.marks;

    if (openTagName) {
      state.openMark(strong.create());
    } else {
      state.closeMark(strong);
    }
  },

  'i, em': (state, _, openTagName) => {
    const { emph } = state.schema.marks;

    if (openTagName) {
      state.openMark(emph.create());
    } else {
      state.closeMark(emph);
    }
  },

  's, del': (state, _, openTagName) => {
    const { strike } = state.schema.marks;

    if (openTagName) {
      state.openMark(strike.create());
    } else {
      state.closeMark(strike);
    }
  },

  code: (state, _, openTagName) => {
    const { code } = state.schema.marks;

    if (openTagName) {
      state.openMark(code.create());
    } else {
      state.closeMark(code);
    }
  },

  a: (state, node, openTagName) => {
    const tag = node.literal!;
    const { link } = state.schema.marks;

    if (openTagName) {
      const [linkUrl] = getMatchedAttributeValue(tag, 'href');

      state.openMark(
        link.create({
          linkUrl,
          rawHTML: openTagName,
        })
      );
    } else {
      state.closeMark(link);
    }
  },

  img: (state, node, openTagName) => {
    const tag = node.literal!;

    if (openTagName) {
      const [imageUrl, altText] = getMatchedAttributeValue(tag, 'src', 'alt');
      const { image } = state.schema.nodes;

      state.addNode(image, {
        rawHTML: openTagName,
        imageUrl,
        ...(altText && { altText }),
      });
    }
  },

  hr: (state, _, openTagName) => {
    state.addNode(state.schema.nodes.thematicBreak, { rawHTML: openTagName });
  },

  br: (state) => {
    const { hardBreak } = state.schema.nodes;

    if (hardBreak) {
      state.addNode(hardBreak);
    }
  },

  pre: (state, node, openTagName) => {
    const container = document.createElement('div');

    container.innerHTML = node.literal!;

    const literal = container.firstChild?.firstChild?.textContent;

    state.openNode(state.schema.nodes.codeBlock, { rawHTML: openTagName });
    state.addText(getTextWithoutTrailingNewline(literal || ''));
    state.closeNode();
  },

  'ul, ol': (state, node, openTagName) => {
    // in the table cell, '<ul>', '<ol>' is parsed as 'htmlInline' node
    if (node.parent!.type === 'tableCell') {
      const { bulletList, orderedList, paragraph } = state.schema.nodes;
      const list = openTagName === 'ul' ? bulletList : orderedList;

      if (openTagName) {
        if (node.prev && !isListNode(node.prev)) {
          state.closeNode();
        }

        state.openNode(list, { rawHTML: openTagName });
      } else {
        state.closeNode();

        if (node.next && !isListNode(node.next)) {
          state.openNode(paragraph);
        }
      }
    }
  },

  li: (state, node, openTagName) => {
    // ... existing li logic ...
    // Note: I will just append the new handler after li or before it.
    // To minimize context matching issues, I will append at the end of the object.
    // But replace_file_content needs start/end.
    // I will target the end of the object.
    // But 'li' is the last one visible in file view.
    // Let's rewrite 'li' to be sure or just insert before.
    // Actually, I can insert after 'li'.
    if (node.parent?.type === 'tableCell') {
      const { listItem, paragraph } = state.schema.nodes;

      if (openTagName) {
        const attrs = getListItemAttrs(node);

        if (node.prev && !isListNode(node.prev)) {
          state.closeNode();
        }

        state.openNode(listItem, { rawHTML: openTagName, ...attrs });

        if (node.next && !isListNode(node.next)) {
          state.openNode(paragraph);
        }
      } else {
        if (node.prev && !isListNode(node.prev)) {
          state.closeNode();
        }

        state.closeNode();
      }
    }
  },

  'h1, h2, h3, h4, h5, h6': (state, node, openTagName) => {
    const { heading, paragraph } = state.schema.nodes;

    if (openTagName) {
      if (state.top().type.name === 'paragraph') {
        state.closeNode();
      }

      const level = Number(openTagName[1]);

      state.openNode(heading, { level, rawHTML: openTagName });
    } else {
      state.closeNode();
      state.openNode(paragraph);
    }
  },
};

export const htmlToWwConvertors = createConvertors(convertors);
