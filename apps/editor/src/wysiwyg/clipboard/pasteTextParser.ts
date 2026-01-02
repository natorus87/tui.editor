import { Slice, Fragment, Schema, ResolvedPos } from 'prosemirror-model';

export function clipboardTextParser(text: string, $context: ResolvedPos) {
  const schema = $context.parent.type.schema as Schema;
  const lines = text.split(/\r\n|\r|\n/);
  const nodes = lines.map((line) =>
    schema.nodes.paragraph.create(null, line ? schema.text(line) : [])
  );

  return new Slice(Fragment.from(nodes), 1, 1);
}
