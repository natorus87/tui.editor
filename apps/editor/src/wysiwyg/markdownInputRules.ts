import { InputRule, wrappingInputRule, textblockTypeInputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';

export function createMarkdownInputRules(schema: Schema) {
  const rules: InputRule[] = [];

  // Heading (#, ##, etc.)
  if (schema.nodes.heading) {
    rules.push(
      textblockTypeInputRule(/^(#{1,6})\s$/, schema.nodes.heading, (match) => {
        return {
          level: match[1].length,
        };
      })
    );
  }

  // Blockquote (> )
  if (schema.nodes.blockQuote) {
    rules.push(wrappingInputRule(/^>\s$/, schema.nodes.blockQuote));
  }

  // Bullet List (* , - )
  if (schema.nodes.bulletList) {
    rules.push(wrappingInputRule(/^\s*([-*])\s$/, schema.nodes.bulletList));
  }

  // Ordered List (1. )
  if (schema.nodes.orderedList) {
    rules.push(
      wrappingInputRule(
        /^\s*(\d+)\.\s$/,
        schema.nodes.orderedList,
        (match) => {
          return { order: Number(match[1]) };
        },
        (match, node) => node.childCount + node.attrs.order === Number(match[1])
      )
    );
  }

  return rules;
}
