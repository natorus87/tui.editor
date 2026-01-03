import type { PluginContext, PluginInfo, HTMLMdNode, I18n } from '@licium/editor';
import { PluginOptions } from '@t/index';
import { addLangs } from './i18n/langs';
import './css/plugin.css';
const PREFIX = 'toastui-editor-';

function createToolbarItemOption(text: string, commandName: string, i18n: I18n) {
  return {
    name: commandName,
    command: commandName,
    tooltip: i18n.get(commandName),
    text,
    className: `${PREFIX}toolbar-icons ${commandName}`,
  };
}

export default function textAlignPlugin(
  context: PluginContext,
  options: PluginOptions = {}
): PluginInfo {
  const { i18n, eventEmitter, usageStatistics = true } = context;

  addLangs(i18n);

  // Active state listener
  eventEmitter.listen('caretChange', () => {
    updateToolbarState();
  });

  return {
    markdownCommands: {
      alignLeft: (payload, { tr, selection, schema }, dispatch) =>
        execMarkdownAlign('left', selection, schema, tr, dispatch),
      alignCenter: (payload, { tr, selection, schema }, dispatch) =>
        execMarkdownAlign('center', selection, schema, tr, dispatch),
      alignRight: (payload, { tr, selection, schema }, dispatch) =>
        execMarkdownAlign('right', selection, schema, tr, dispatch),
    },
    wysiwygCommands: {
      alignLeft: (payload, { tr, selection, schema }, dispatch) =>
        execWysiwygAlign('left', selection, schema, tr, dispatch),
      alignCenter: (payload, { tr, selection, schema }, dispatch) =>
        execWysiwygAlign('center', selection, schema, tr, dispatch),
      alignRight: (payload, { tr, selection, schema }, dispatch) =>
        execWysiwygAlign('right', selection, schema, tr, dispatch),
    },
    toolbarItems: [
      {
        groupIndex: 0,
        itemIndex: 3,
        item: createToolbarItemOption('', 'alignLeft', i18n),
      },
      {
        groupIndex: 0,
        itemIndex: 4,
        item: createToolbarItemOption('', 'alignCenter', i18n),
      },
      {
        groupIndex: 0,
        itemIndex: 5,
        item: createToolbarItemOption('', 'alignRight', i18n),
      },
    ],
    toHTMLRenderers: {
      htmlInline: {
        span(node: HTMLMdNode, { entering, origin }) {
          const style = node.attrs ? node.attrs.style : null;

          if (style && style.indexOf('text-align') > -1) {
            return entering
              ? { type: 'openTag', tagName: 'span', attributes: { style } }
              : { type: 'closeTag', tagName: 'span' };
          }
          return origin!();
        },
      },
    },
  };
}

function updateToolbarState() {
  // 1. Reset all buttons
  const buttons = document.querySelectorAll(
    '.toastui-editor-toolbar-icons.alignLeft, .toastui-editor-toolbar-icons.alignCenter, .toastui-editor-toolbar-icons.alignRight'
  );

  buttons.forEach((btn) => btn.classList.remove('active'));

  // 2. Determine active state
  // Getting state from plugin context is hard.
  // For Markdown: Parse current line of cursor?
  // For WYSIWYG: Parse selection marks?

  // Naive checker for demo quality:
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  let container = range.commonAncestorContainer;

  if (container.nodeType === 3) container = container.parentElement!; // Text node -> Element

  const el = container as HTMLElement;

  // Check for span with style
  let activeAlign = null;
  let current = el;

  // Walk up a few levels to find span
  while (
    current &&
    current.classList &&
    !current.classList.contains('ProseMirror') &&
    !current.classList.contains('toastui-editor-contents')
  ) {
    if (current.tagName === 'SPAN' && current.style.textAlign) {
      activeAlign = current.style.textAlign;
      break;
    }
    current = current.parentElement as HTMLElement;
  }

  if (!activeAlign) {
    // Check inner text if in Markdown mode (Textarea)
    // This is very hard because DOM is just text.
    // We skip Markdown active state highlight for this iteration,
    // focusing on WYSIWYG visual feedback.
  }

  if (activeAlign) {
    const activeBtn = document.querySelector(
      `.toastui-editor-toolbar-icons.align${capitalize(activeAlign)}`
    );

    if (activeBtn) activeBtn.classList.add('active');
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function execMarkdownAlign(alignType: string, selection: any, schema: any, tr: any, dispatch: any) {
  const { doc } = tr;
  const { from, to } = selection;

  // Always expand to full line(s) to avoid nesting inside words
  const $from = doc.resolve(from);
  const $to = doc.resolve(to);

  // In Markdown mode (CodeMirror-like), we usually want to operate on lines.
  // We can use doc.resolve(from).blockRange() -> this gives the text block (paragraph).
  // This is safer than char-level selection for block alignment.

  const fromLine = $from.pos - $from.parentOffset; // Start of line
  const toLine = $to.pos + ($to.parent.content.size - $to.parentOffset); // End of line

  // Wait, doc.resolve in Markdown mode... TUI's internal doc structure for Markdown is just a series of blocks?
  // Let's rely on blockRange() which TUI implementation respects.

  const blockRange = $from.blockRange($to);
  let targetFrom = from;
  let targetTo = to;

  if (blockRange) {
    targetFrom = blockRange.start + 1; // +1 to skip start token? No, text nodes.
    targetTo = blockRange.end - 1;

    // Actually, let's look at the Slice content.
    // If we use blockRange, we get the whole "Paragraph" structure.
  }

  // Fallback: If no blockRange (rare), use raw selection.
  // But to fix the "nesting" issue, we MUST select the whole line content including any existing HTML tags.
  // In TUI Markdown, each line is likely a textblock.

  // Let's try to grab the whole block content.
  const resolvedFrom = doc.resolve(from);
  const startPos = resolvedFrom.start();
  const endPos = resolvedFrom.end();

  targetFrom = startPos;
  targetTo = endPos;

  const slice = doc.slice(targetFrom, targetTo);
  const textContent = slice.content.textBetween(0, slice.content.size, '\n');

  // Looser regex to match existing tags
  // Matches: <span ...> ... </span>
  const regex = /^\s*<span\s+[^>]*style="[^"]*text-align:\s*(left|center|right)[^"]*"[^>]*>([\s\S]*?)<\/span>\s*$/i;
  const match = textContent.match(regex);

  let newText = textContent;
  let currentAlign = null;

  if (match) {
    currentAlign = match[1].toLowerCase();
    newText = match[2]; // Inner content
  }

  let finalWrapped = newText;

  if (currentAlign === alignType) {
    // Toggle off: Just return the inner text (unwrap)
    // newText is already stripped of the span
  } else {
    // Apply new alignment
    const style = `display: block; text-align: ${alignType}`;

    finalWrapped = `<span style="${style}">${newText}</span>`;
  }

  try {
    tr.replaceWith(targetFrom, targetTo, schema.text(finalWrapped));
    dispatch!(tr);
    return true;
  } catch (e) {
    return false;
  }
}

function execWysiwygAlign(alignType: string, selection: any, schema: any, tr: any, dispatch: any) {
  const { empty } = selection;
  const styleBase = 'display: block; text-align: ';

  let targetFrom = selection.from;
  let targetTo = selection.to;

  const markType = schema.marks.span;

  if (!markType) return false;

  if (empty) {
    const { $from } = selection;
    const blockRange = $from.blockRange();

    if (blockRange) {
      targetFrom = blockRange.start;
      targetTo = blockRange.end;
    }
  }

  let existingMark = null;
  let existingAlign = null;

  tr.doc.nodesBetween(targetFrom, targetTo, (node) => {
    if (existingMark) return false;
    node.marks.forEach((mark) => {
      if (mark.type === markType && mark.attrs.style && mark.attrs.style.indexOf(styleBase) > -1) {
        existingMark = mark;
        const match = mark.attrs.style.match(/text-align: (left|center|right)/);

        if (match) existingAlign = match[1];
      }
    });
    return true;
  });

  if (existingMark) {
    tr.removeMark(targetFrom, targetTo, existingMark);
  }

  if (existingAlign === alignType) {
    dispatch(tr);
    return true;
  }

  const style = `${styleBase}${alignType}`;
  const attrs = { htmlAttrs: { style } };
  const mark = markType.create(attrs);

  tr.addMark(targetFrom, targetTo, mark);

  dispatch(tr);
  return true;
}
