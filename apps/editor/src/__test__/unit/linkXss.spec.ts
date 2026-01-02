import { Link } from '@/wysiwyg/marks/link';
import { Mark } from 'prosemirror-model';

describe('Link XSS Reproduction', () => {
  it('should not strip javascript protocol in toDOM (vulnerability)', () => {
    const link = new Link({});
    const markMock = ({
      attrs: {
        linkUrl: 'javascript:alert(1)',
        title: null,
      },
    } as unknown) as Mark;

    const domSpec: any = link.schema.toDOM(markMock);

    // domSpec is [ 'a', { href: 'javascript:alert(1)', ... }, 0 ]
    const attrs = domSpec[1];

    expect(attrs.href).toBe('#');
  });

  it('should preserve valid http protocol', () => {
    const link = new Link({});
    const markMock = ({
      attrs: {
        linkUrl: 'http://example.com',
        title: null,
      },
    } as unknown) as Mark;

    const domSpec: any = link.schema.toDOM(markMock);
    const attrs = domSpec[1];

    expect(attrs.href).toBe('http://example.com');
  });
});
