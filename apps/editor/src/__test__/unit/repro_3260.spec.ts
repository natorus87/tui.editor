import { Schema } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { Link } from '@/wysiwyg/marks/link';
import { createTextNode } from '@/helper/manipulation';

describe('Bug #3260: Link Text Update', () => {
    let schema: Schema;
    let linkMark: Link;
    let state: EditorState;
    let dispatch: jest.Mock;

    beforeEach(() => {
        // minimalistic schema setup mimicking TUI Editor
        schema = new Schema({
            nodes: {
                doc: { content: 'paragraph+' },
                paragraph: { content: 'text*', toDOM: () => ['p', 0] },
                text: { group: 'inline' },
            },
            marks: {
                link: {
                    attrs: {
                        linkUrl: { default: '' },
                        title: { default: null },
                        rawHTML: { default: null },
                        target: { default: null },
                        rel: { default: null },
                        class: { default: null },
                        id: { default: null },
                    },
                    toDOM: (mark) => ['a', mark.attrs],
                },
            },
        });

        linkMark = new Link({ linkAttribute: {} } as any);

        // Create state with "example"
        state = EditorState.create({
            schema,
            doc: schema.node('doc', null, [
                schema.node('paragraph', null, [schema.text('example')])
            ]),
        });

        dispatch = jest.fn((tr) => {
            state = state.apply(tr);
        });
    });

    it('should replace selected text with new link text if different', () => {
        // Select "example" (1 to 8)
        const sel = TextSelection.create(state.doc, 1, 8);
        state = state.apply(state.tr.setSelection(sel));

        const command = linkMark.commands().addLink;
        const result = command({ linkUrl: 'https://test.com', linkText: 'Works' })(state, dispatch);

        expect(result).toBe(true);
        // Expect content to be "Works"
        expect(state.doc.textContent).toBe('Works');

        // Expect "Works" to have link mark
        const textNode = state.doc.nodeAt(1);
        expect(textNode?.text).toBe('Works');
        expect(textNode?.marks[0].type.name).toBe('link');
        expect(textNode?.marks[0].attrs.linkUrl).toBe('https://test.com');
    });

    it('should preserve text if linkText matches selection', () => {
        // Select "example"
        const sel = TextSelection.create(state.doc, 1, 8);
        state = state.apply(state.tr.setSelection(sel));

        const command = linkMark.commands().addLink;
        const result = command({ linkUrl: 'https://test.com', linkText: 'example' })(state, dispatch);

        expect(result).toBe(true);
        expect(state.doc.textContent).toBe('example');
    });
});
