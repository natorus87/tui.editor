import Viewer from '@/viewer';
import colorSyntaxPlugin from '../../../../../plugins/color-syntax/src/index';

describe('Bug #3255: Key OK is missing from en_us in Viewer + ColorSyntaxPlugin', () => {
  let container: HTMLElement;
  let viewer: Viewer;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (viewer) {
      viewer.destroy();
    }
    document.body.removeChild(container);
  });

  it('should not throw error when initializing Viewer with ColorSyntaxPlugin', () => {
    // This should throw error if 'OK' is missing
    try {
      viewer = new Viewer({
        el: container,
        initialValue: 'test',
        plugins: [colorSyntaxPlugin],
      });
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });

  it('should render successfully', () => {
    expect(() => {
      viewer = new Viewer({
        el: container,
        initialValue: 'test',
        plugins: [colorSyntaxPlugin],
      });
    }).not.toThrow();
  });
});
