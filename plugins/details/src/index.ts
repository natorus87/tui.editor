/* eslint-disable */
import type { PluginContext, PluginInfo, I18n, MdNode } from '@licium/editor';
import { PluginOptions } from '@t/index';
import { addLangs } from './i18n/langs';
import './css/plugin.css';

const PREFIX = 'toastui-editor-';

function createToolbarItemOption(i18n: I18n) {
  return {
    name: 'details',
    tooltip: i18n.get('details'),
    className: `${PREFIX}toolbar-icons details`,
    command: 'details',
  };
}

function handleDetailsExit(context: PluginContext, event: KeyboardEvent): void {
  const { instance } = context as any;

  if (!instance) {
    console.log('[Details Plugin] No instance found');
    return;
  }

  const editor = instance.getCurrentModeEditor();

  if (!editor || !editor.view) {
    console.log('[Details Plugin] No editor view found');
    return;
  }

  const { view } = editor;
  const { state } = view;
  const { selection } = state;
  const { $from } = selection;

  // Find details node in ancestry
  let detailsDepth = -1;

  for (let d = $from.depth; d > 0; d -= 1) {
    if ($from.node(d).type.name === 'details') {
      detailsDepth = d;
      break;
    }
  }

  if (detailsDepth < 0) {
    return;
  }

  const detailsNode = $from.node(detailsDepth);
  const nodeStart = $from.before(detailsDepth);
  const nodeEnd = nodeStart + detailsNode.nodeSize;
  const afterPara = $from.after();
  const isAtEnd = afterPara >= nodeEnd - 1;

  console.log('[Details Plugin] Inside details:', {
    key: event.key,
    isAtEnd,
    afterPara,
    nodeEnd,
    parentType: $from.parent.type.name,
    parentEmpty: $from.parent.content.size === 0,
  });

  if (!isAtEnd) {
    return;
  }

  const { tr, schema } = state;
  const SelectionClass = state.selection.constructor as any;

  // Enter on empty paragraph
  if (event.key === 'Enter') {
    const isEmptyPara = $from.parent.type.name === 'paragraph' && $from.parent.content.size === 0;

    if (!isEmptyPara) {
      return;
    }

    // Check previous node to see if it's also an empty paragraph
    // $from.index(0) gives the index in the parent details node
    const index = $from.index(detailsDepth);
    const prevNode = detailsNode.child(index - 1);
    const isPrevEmptyPara = prevNode && prevNode.type.name === 'paragraph' && prevNode.content.size === 0;

    if (!isPrevEmptyPara) {
      console.log('[Details Plugin] Allowing one empty line. Not exiting yet.');
      return;
    }

    console.log('[Details Plugin] EXITING via Double Enter (Two empty paras)!');
    event.preventDefault();

    const beforePara = $from.before();

    // delete the current empty para and the previous one? 
    // Usually "Exit" means: Lift the current empty para out.
    // But if we have TWO empty paras, maybe we want to keep one inside?
    // Let's stick to: If two empty paras, we treat it as an exit signal.
    // We should probably remove the *current* empty para and move the cursor out.

    tr.delete(beforePara, afterPara);

    const p = schema.nodes.paragraph.createAndFill()!;
    const insertPos = nodeEnd - (afterPara - beforePara);

    tr.insert(insertPos, p);

    if (SelectionClass.near) {
      tr.setSelection(SelectionClass.near(tr.doc.resolve(insertPos + 1)));
    }

    view.dispatch(tr);
  }

  // ArrowDown at end of content
  if (event.key === 'ArrowDown') {
    const atEndOfParent = $from.parentOffset === $from.parent.content.size;

    if (!atEndOfParent) {
      return;
    }

    console.log('[Details Plugin] EXITING via ArrowDown!');
    event.preventDefault();

    if (nodeEnd < state.doc.content.size) {
      if (SelectionClass.near) {
        tr.setSelection(SelectionClass.near(tr.doc.resolve(nodeEnd)));
        view.dispatch(tr);
      }
    } else {
      const p = schema.nodes.paragraph.createAndFill()!;

      tr.insert(nodeEnd, p);

      if (SelectionClass.near) {
        tr.setSelection(SelectionClass.near(tr.doc.resolve(nodeEnd + 1)));
      }

      view.dispatch(tr);
    }
  }
}

export default function detailsPlugin(
  context: PluginContext,
  options: PluginOptions = {}
): PluginInfo {
  const { i18n, eventEmitter } = context;

  addLangs(i18n);

  const toolbarItem = createToolbarItemOption(i18n);

  // Hook into the global keydown event for exit behavior
  eventEmitter.listen('keydown', (editorType: string, event: KeyboardEvent) => {
    console.log('[Details Plugin] keydown via eventEmitter!', { editorType, key: event.key });

    if (editorType !== 'wysiwyg') {
      return;
    }

    if (event.key !== 'Enter' && event.key !== 'ArrowDown') {
      return;
    }

    handleDetailsExit(context, event);
  });

  return {
    toHTMLRenderers: {
      htmlBlock: {
        renderer: (node) => {
          const isDetails = /<(\/)?(details|summary)/i.test(node.literal || '');
          return isDetails
            ? [{ type: 'html', content: node.literal || '' }]
            : [
              { type: 'openTag', tagName: 'div', outerNewLine: true },
              { type: 'html', content: node.literal || '' },
              { type: 'closeTag', tagName: 'div', outerNewLine: true },
            ];
        },
      },
    },
    markdownCommands: {
      details: (payload, { tr, selection, schema }, dispatch) => {
        const slice = selection.content();
        const textContent =
          slice.content.textBetween(0, slice.content.size, '\n') || i18n.get('content');

        const summaryText = i18n.get('summary');
        const openTag = `<details>\n<summary>${summaryText}</summary>\n`;
        const closeTag = `\n</details>`;
        const newText = `${openTag}${textContent}${closeTag}`;

        tr.replaceSelectionWith(schema.text(newText));
        dispatch!(tr);
        return true;
      },
    },


    wysiwygNodeViews: {
      details: (node, view, getPos) => {
        const dom = document.createElement('details');
        const htmlAttrs = (node.attrs && node.attrs.htmlAttrs) || {};
        const isOpenAttr = node.attrs.open; // Core definition uses direct attribute

        // Check both direct attribute (priority) and htmlAttrs (legacy/plugin)
        const isOpen = isOpenAttr === true || (htmlAttrs && htmlAttrs.open !== null && typeof htmlAttrs.open !== 'undefined');

        if (isOpen) {
          dom.open = true;
        }

        dom.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;

          if (target.tagName === 'SUMMARY' || target.closest('summary')) {
            e.preventDefault();

            const pos = getPos();

            if (typeof pos === 'number') {
              const isOpen = htmlAttrs.open !== null && typeof htmlAttrs.open !== 'undefined';
              const newHtmlAttrs = { ...htmlAttrs };

              if (isOpen) {
                delete newHtmlAttrs.open;
              } else {
                newHtmlAttrs.open = '';
              }

              const newAttrs = {
                ...node.attrs,
                htmlAttrs: newHtmlAttrs,
              };

              view.dispatch(view.state.tr.setNodeMarkup(pos, null, newAttrs));
            }
          }
        });

        return { dom, contentDOM: dom };
      },
    },
    wysiwygCommands: {
      details: (payload, { tr, schema }, dispatch) => {
        const summaryText = i18n.get('summary');
        const contentText = i18n.get('content');

        const { details, summary, paragraph } = schema.nodes;

        if (details && summary && paragraph) {
          const summaryNode = summary.create({}, schema.text(summaryText));
          const contentNode = paragraph.create({}, schema.text(contentText));
          const detailsNode = details.create({}, [summaryNode, contentNode]);

          tr.replaceSelectionWith(detailsNode);
          dispatch!(tr);
          return true;
        }

        return false;
      },
    },
    toolbarItems: [
      {
        groupIndex: 4,
        itemIndex: 3,
        item: toolbarItem,
      },
    ],
  };
}
