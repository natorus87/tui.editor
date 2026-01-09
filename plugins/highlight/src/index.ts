import ColorPicker from 'tui-color-picker';
import type { PluginContext, PluginInfo, HTMLMdNode, I18n } from '@licium/editor';
import { addLangs } from './i18n/langs';
import { findParentByClassName } from './utils/dom';
import './css/plugin.css';

// Shim for missing types
declare module 'tui-color-picker';

interface PluginOptions {
  preset?: string[];
}

const PREFIX = 'toastui-editor-';

function createApplyButton(text: string) {
  const button = document.createElement('button');

  button.setAttribute('type', 'button');
  button.textContent = text;
  button.style.marginRight = '5px';

  return button;
}

function createToolbarItemOption(container: HTMLDivElement, i18n: I18n) {
  return {
    name: 'highlight',
    tooltip: i18n.get('Highlight'),
    className: `${PREFIX}toolbar-icons highlight`,
    popup: {
      className: `${PREFIX}popup-highlight`,
      body: container,
      style: { width: 'auto' },
    },
  };
}

function getCurrentEditorEl(colorPickerEl: HTMLElement, containerClassName: string) {
  const editorDefaultEl = findParentByClassName(colorPickerEl, `${PREFIX}defaultUI`)!;

  return editorDefaultEl.querySelector<HTMLElement>(`.${containerClassName} .ProseMirror`)!;
}

interface ColorPickerOption {
  container: HTMLDivElement;
  preset?: Array<string>;
  usageStatistics: boolean;
}

export default function highlightPlugin(
  context: PluginContext,
  options: PluginOptions = {}
): PluginInfo {
  const { eventEmitter, i18n, usageStatistics = true } = context;
  const { preset } = options;
  const container = document.createElement('div');
  const colorPickerOption: ColorPickerOption = { container, usageStatistics };

  let containerClassName: string;
  let currentEditorEl: HTMLElement;

  addLangs(i18n);

  if (preset) {
    colorPickerOption.preset = preset;
  }

  const colorPicker = ColorPicker.create(colorPickerOption);
  const button = createApplyButton(i18n.get('OK'));
  const clearButton = createApplyButton(i18n.get('Reset'));

  eventEmitter.listen('focus', (editType) => {
    containerClassName = `${PREFIX}${editType === 'markdown' ? 'md' : 'ww'}-container`;
  });

  container.addEventListener('click', (ev) => {
    if ((ev.target as HTMLElement).getAttribute('type') === 'button') {
      const target = ev.target as HTMLElement;
      let selectedColor = colorPicker.getColor();

      if (target.textContent === i18n.get('Reset')) {
        selectedColor = '';
      }

      currentEditorEl = getCurrentEditorEl(container, containerClassName);

      eventEmitter.emit('command', 'setHighlight', { color: selectedColor });
      eventEmitter.emit('closePopup');
      currentEditorEl.focus({ preventScroll: true });
    }
  });

  colorPicker.slider.toggle(true);

  const buttonContainer = document.createElement('div');

  buttonContainer.className = `${PREFIX}button-container`;
  buttonContainer.appendChild(button);
  buttonContainer.appendChild(clearButton);
  container.appendChild(buttonContainer);

  const toolbarItem = createToolbarItemOption(container, i18n);

  return {
    markdownCommands: {
      setHighlight: ({ color }, { tr, selection, schema }, dispatch) => {
        // Remove logic: strip <mark> tags with background-color style
        const slice = selection.content();
        const textContent = slice.content.textBetween(0, slice.content.size, '\n');

        if (!color) {
          // Regex to match <mark style="background-color: ..."> and </mark>
          const openTagRegex = /<mark style="background-color: [^"]+">/g;
          const closeTagRegex = /<\/mark>/g;

          const unhighlighted = textContent.replace(openTagRegex, '').replace(closeTagRegex, '');

          tr.replaceSelectionWith(schema.text(unhighlighted));
          dispatch!(tr);
          return true;
        }

        // Apply logic: wrap in <mark style="background-color: color">
        const openTag = `<mark style="background-color: ${color}">`;
        const closeTag = `</mark>`;
        const highlighted = `${openTag}${textContent}${closeTag}`;

        tr.replaceSelectionWith(schema.text(highlighted));
        dispatch!(tr);
        return true;
      },
    },
    wysiwygCommands: {
      setHighlight: ({ color }, { tr, selection, schema }, dispatch) => {
        const { from, to } = selection;
        const markType = schema.marks.mark; // Reusing 'mark' since we use custom renderer below

        if (!color) {
          tr.removeMark(from, to, markType);
        } else {
          const attrs = { htmlAttrs: { style: `background-color: ${color}` } };
          const mark = markType.create(attrs);

          tr.addMark(from, to, mark);
        }
        dispatch!(tr);
        return true;
      },
    },
    toolbarItems: [
      {
        groupIndex: 0,
        itemIndex: 4,
        item: toolbarItem,
      },
    ],
    toHTMLRenderers: {
      htmlInline: {
        mark(node: HTMLMdNode, { entering }) {
          if (entering) {
            return {
              type: 'openTag',
              tagName: 'mark',
              attributes: node.attrs || {},
            };
          }
          return { type: 'closeTag', tagName: 'mark' };
        },
      },
    },
  };
}
