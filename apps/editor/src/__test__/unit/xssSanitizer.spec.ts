import { sanitizeHTML } from '../../sanitizer/htmlSanitizer';

describe('HTML Sanitizer XSS Reproduction', () => {
  it('should strip onload attribute from svg', () => {
    const xss = '<svg onload="alert(1)"></svg>';
    const result = sanitizeHTML(xss);

    expect(result).not.toContain('onload');
    expect(result).not.toContain('alert(1)');
  });

  it('should strip onerror attribute from img', () => {
    const xss = '<img src=x onerror="alert(1)">';
    const result = sanitizeHTML(xss);

    expect(result).not.toContain('onerror');
  });

  it('should strip javascript protocol', () => {
    const xss = '<a href="javascript:alert(1)">link</a>';
    const result = sanitizeHTML(xss);

    expect(result).not.toContain('javascript:');
  });

  it('should strip mixed case attributes', () => {
    const xss = '<svg ONLOAD="alert(1)"></svg>';
    const result = sanitizeHTML(xss);

    expect(result).not.toContain('ONLOAD');
    expect(result).not.toContain('alert(1)');
  });

  it('should strip fuzzy attributes', () => {
    const xss = '<svg/onload=alert(1)>';
    const result = sanitizeHTML(xss);

    expect(result).not.toContain('onload');
    expect(result).not.toContain('alert(1)');
  });

  it('should strip svg tag', () => {
    const html = '<svg onload="alert(1)" width="100"></svg>';
    const result = sanitizeHTML(html);

    expect(result).not.toContain('<svg');
    expect(result).not.toContain('onload');
  });

  it('should strip svg animate events', () => {
    const xss = '<svg><animate onbegin=alert(1) attributeName=x dur=1s>';
    const result = sanitizeHTML(xss);

    expect(result).not.toContain('onbegin');
  });
});
