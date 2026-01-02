import { htmlToWwConvertors } from '@/convertors/toWysiwyg/htmlToWwConvertors';
import Editor from '@/editor';

describe('Bug #3012: Empty Code Block Crash in htmlToWwConvertors', () => {
  it('should not crash when converting pre tag with empty content', () => {
    const stateMock = {
      schema: {
        nodes: {
          codeBlock: 'codeBlock',
        },
      },
      openNode: jest.fn(),
      addText: jest.fn(),
      closeNode: jest.fn(),
    };

    // Mock node with empty content structure that might cause literal to be undefined
    const node = {
      literal: '<pre></pre>',
    };

    // Simulate pre converter call
    // The key in map is 'pre'
    const preConverter = htmlToWwConvertors.pre;

    expect(preConverter).toBeDefined();

    // This should throw if bug exists
    preConverter(stateMock as any, node as any, 'pre');
    expect(stateMock.addText).toHaveBeenCalledWith('');
  });
});
