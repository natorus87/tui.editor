import { deepMergedCopy, assign } from '@/utils/common';

describe('Prototype Pollution Vulnerability', () => {
  it('deepMergedCopy should prevent constructor shadowing (Fixed)', () => {
    const payload = JSON.parse('{"constructor": {"prototype": {"isAdmin": true}}}');
    const result = deepMergedCopy({}, payload);

    // Assert that constructor is NOT shadowed (it remains Object)
    expect(result.constructor).toBe(Object);
    // Assert that we didn't manage to pollute anything down that path
    expect((result as any).isAdmin).toBeUndefined();
  });

  it('assign should prevent function prototype pollution (Fixed)', () => {
    class TestClass {}
    const payload = JSON.parse('{"prototype": {"polluted": true}}');

    assign(TestClass, payload);

    // Assert that prototype was NOT polluted
    expect((TestClass.prototype as any).polluted).toBeUndefined();
  });

  it('deepMergedCopy should prevent __proto__ pollution', () => {
    const payload = JSON.parse('{"__proto__": {"polluted": true}}');
    const result = deepMergedCopy({}, payload);

    expect((result as any).polluted).toBeUndefined();
    expect(({} as any).polluted).toBeUndefined();
  });
});
