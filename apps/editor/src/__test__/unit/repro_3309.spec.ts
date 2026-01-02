import { Parser } from '@licium/toastmark';
import { Renderer } from '@licium/toastmark';

describe('Bug #3309: HTML rendered in code block with incorrect language', () => {
  it('should escape HTML tags in code block with unknown language', () => {
    const parser = new Parser();
    const renderer = new Renderer({
      gfm: true,
      convertors: {}, // Default convertors
    });

    const markdown = ['```unknown', '<div>vulnerable</div>', '```'].join('\n');

    const mdNode = parser.parse(markdown);
    const html = renderer.render(mdNode);

    console.log('Rendered HTML:', html);

    // Expectation: HTML tags should be escaped.
    // Good: &lt;div&gt;vulnerable&lt;/div&gt;
    // Bad: <div>vulnerable</div>
    expect(html).toContain('&lt;div&gt;');
    expect(html).not.toContain('<div>vulnerable</div>');
  });

  it('should escape HTML tags in code block with NO language', () => {
    const parser = new Parser();
    const renderer = new Renderer();

    const markdown = ['```', '<div>vulnerable</div>', '```'].join('\n');

    const mdNode = parser.parse(markdown);
    const html = renderer.render(mdNode);

    // Expectation: HTML tags should be escaped.
    expect(html).toContain('&lt;div&gt;');
  });
});
