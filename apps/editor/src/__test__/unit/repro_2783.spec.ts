import { toMdConvertors } from '@/convertors/toMarkdown/toMdConvertors';

describe('Bug #2783: Norwegian links parsing', () => {
  it('should escape/encode UTF-8 characters in link URL correctly', () => {
    const linkUrl = 'https://www.korsbakken.no/kjøkkenkraner';
    const linkText = 'https://www.korsbakken.no/kjøkkenkraner';

    // Mock Node structure
    const node = {
      attrs: {
        linkUrl,
        title: null,
        target: null,
        rawHTML: null,
      },
      childCount: 1,
      // Minimal structure to pass converter checks if any
    };

    const result = toMdConvertors.link!({ node: node as any }, { entering: false } as any);

    if (!result) {
      throw new Error('Converter returned undefined');
    }

    // Expected behavior: Should produce valid markdown link
    // Either [url](url) or encoded [url](encoded_url)
    // The issue claims "wrong parsing". If result is broken, we repro.
    console.log('Converted Link Result:', result);
    // Expect encoded URL: kjøkkenkraner -> kj%C3%B8kkenkraner
    // If we assume encoding is required.
    expect(result.delim).toContain('https://www.korsbakken.no/kj%C3%B8kkenkraner');

    // We expect basic structure
    // If toMdConvertors returns delim: `](${linkUrl})`
    // result.delim should be checking
  });
});
