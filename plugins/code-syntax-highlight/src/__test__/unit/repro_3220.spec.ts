import { getHTMLRenderers } from '../../renderers/toHTMLRenderers';
import { PrismJs } from '@t/index';

describe('Bug #3220: XML Entities not escaped in syntax highlighter', () => {
    const mockPrism: PrismJs = {
        languages: {},
        highlight: jest.fn(),
        plugins: {},
    } as any;

    it('should escape entities when language is not specified', () => {
        const renderer = getHTMLRenderers(mockPrism);
        const node = {
            literal: '<div id="test"></div>',
            fenceLength: 3,
            info: '',
        } as any;

        const tokens = renderer.codeBlock(node);
        const contentToken = tokens.find(t => t.type === 'html');

        expect(contentToken).toBeDefined();
        // Expect escaped content
        expect((contentToken as any).content).toBe('&lt;div id=&quot;test&quot;&gt;&lt;/div&gt;');
    });

    it('should escape entities when language is unknown (not registered)', () => {
        const renderer = getHTMLRenderers(mockPrism);
        const node = {
            literal: '<script>alert(1)</script>',
            fenceLength: 3,
            info: 'unknownlang',
        } as any;

        // mockPrism.languages['unknownlang'] is undefined

        const tokens = renderer.codeBlock(node);
        const contentToken = tokens.find(t => t.type === 'html');

        expect((contentToken as any).content).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });
});
