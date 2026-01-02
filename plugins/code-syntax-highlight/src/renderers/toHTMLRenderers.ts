import type { MdNode, CodeBlockMdNode } from '@licium/editor';
import type { HTMLToken } from '@licium/toastmark';
import { PrismJs } from '@t/index';

const BACKTICK_COUNT = 3;

function escape(text: string) {
  return text.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return c;
    }
  });
}

export function getHTMLRenderers(prism: PrismJs) {
  return {
    codeBlock(node: MdNode): HTMLToken[] {
      const { fenceLength, info } = node as CodeBlockMdNode;
      const infoWords = info ? info.split(/\s+/) : [];
      const preClasses = [];
      const codeAttrs: Record<string, any> = {};

      if (fenceLength > BACKTICK_COUNT) {
        codeAttrs['data-backticks'] = fenceLength;
      }

      let content = escape(node.literal!);

      if (infoWords.length && infoWords[0].length) {
        const [lang] = infoWords;

        preClasses.push(`lang-${lang}`);
        codeAttrs['data-language'] = lang;

        const registeredLang = prism.languages[lang];

        if (registeredLang) {
          content = prism.highlight(node.literal!, registeredLang, lang);
        }
      }

      return [
        { type: 'openTag', tagName: 'pre', classNames: preClasses },
        { type: 'openTag', tagName: 'code', attributes: codeAttrs },
        { type: 'html', content },
        { type: 'closeTag', tagName: 'code' },
        { type: 'closeTag', tagName: 'pre' },
      ];
    },
  };
}
