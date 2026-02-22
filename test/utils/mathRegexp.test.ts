import { describe, expect, it } from 'vitest';
import { mathRegexp } from '@src/utils/mathRegexp.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Assert that every string in `values` is matched by `re`. */
function expectMatch(re: RegExp, values: string[]) {
  for (const v of values) {
    expect(re.test(v), `expected "${v}" to match ${re}`).toBe(true);
  }
}

/** Assert that every string in `values` is NOT matched by `re`. */
function expectNoMatch(re: RegExp, values: string[]) {
  for (const v of values) {
    expect(re.test(v), `expected "${v}" NOT to match ${re}`).toBe(false);
  }
}

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('mathRegexp – edge cases', () => {
  it('returns /^$/ for zero arguments', () => {
    const re = mathRegexp();
    expect(re.source).toBe('^$');
    expect(re.test('')).toBe(true);
    expect(re.test('x')).toBe(false);
  });

  it('matches the empty string when given an empty expression', () => {
    const re = mathRegexp('');
    expect(re.test('')).toBe(true);
    expect(re.test('   ')).toBe(true); // only whitespace is fine
  });
});

// ---------------------------------------------------------------------------
// Whitespace flexibility – plain expressions
// ---------------------------------------------------------------------------

describe('mathRegexp – whitespace around operators', () => {
  it('allows arbitrary spaces around +', () => {
    const re = mathRegexp('a + b');
    expectMatch(re, ['a + b', 'a+b', 'a +b', 'a+ b', 'a   +   b', '  a+b  ']);
    expectNoMatch(re, ['a - b', 'a + c']);
  });

  it('allows arbitrary spaces around -', () => {
    const re = mathRegexp('x - 1');
    expectMatch(re, ['x - 1', 'x-1', 'x  -  1', '  x-1  ']);
    expectNoMatch(re, ['x + 1', 'x - 2']);
  });

  it('allows arbitrary spaces around *', () => {
    const re = mathRegexp('a * b');
    expectMatch(re, ['a * b', 'a*b', 'a  *  b']);
    expectNoMatch(re, ['a + b']);
  });

  it('allows arbitrary spaces around /', () => {
    const re = mathRegexp('a / b');
    expectMatch(re, ['a / b', 'a/b', 'a  /  b']);
    expectNoMatch(re, ['a / c']);
  });

  it('allows arbitrary spaces around =', () => {
    const re = mathRegexp('x = 5');
    expectMatch(re, ['x = 5', 'x=5', 'x  =  5', '  x=5  ']);
    expectNoMatch(re, ['x = 6']);
  });

  it('allows arbitrary spaces around ^', () => {
    const re = mathRegexp('x^2');
    expectMatch(re, ['x^2', 'x ^ 2', 'x  ^  2']);
    expectNoMatch(re, ['x^3']);
  });

  it('allows arbitrary spaces inside and outside parentheses', () => {
    const re = mathRegexp('f(x)');
    expectMatch(re, ['f(x)', 'f( x)', 'f(x )', 'f( x )', 'f  (  x  )']);
    expectNoMatch(re, ['f(y)', 'f()']);
  });

  it('allows arbitrary spaces around commas', () => {
    const re = mathRegexp('f(a, b)');
    expectMatch(re, ['f(a, b)', 'f(a,b)', 'f( a , b )', 'f(a  ,  b)']);
    expectNoMatch(re, ['f(a, c)']);
  });
});

// ---------------------------------------------------------------------------
// Implicit multiplication: digit → letter
// ---------------------------------------------------------------------------

describe('mathRegexp – implicit multiplication (digit × letter)', () => {
  it('2x also matches 2*x with various spacing', () => {
    const re = mathRegexp('2x');
    expectMatch(re, [
      '2x',
      '2*x',
      '2 * x',
      '2 *x',
      '2* x',
      '2   *   x',
      '  2x  ',
      '  2 * x  ',
    ]);
    expectNoMatch(re, ['2y', '3x', '2**x', 'x2']);
  });

  it('3a also matches 3*a variants', () => {
    const re = mathRegexp('3a');
    expectMatch(re, ['3a', '3*a', '3 * a', '3  *  a']);
    expectNoMatch(re, ['3b', '4a']);
  });

  it('works with Unicode letters (e.g. 2α)', () => {
    const re = mathRegexp('2α');
    expectMatch(re, ['2α', '2*α', '2 * α', '2  *  α']);
    expectNoMatch(re, ['2β', '3α']);
  });

  it('multiple implicit multiplications in one expression', () => {
    const re = mathRegexp('2x + 3y');
    expectMatch(re, ['2x + 3y', '2*x + 3*y', '2 * x + 3 * y', '2*x+3*y']);
    expectNoMatch(re, ['2x + 3z', '2x - 3y']);
  });

  it('explicit * in expression is still accepted', () => {
    const re = mathRegexp('2*x');
    expectMatch(re, ['2*x', '2 * x', '2  *  x']);
    // "2x" (without *) should NOT match "2*x" pattern — the * was explicit
    expectNoMatch(re, ['2x']);
  });
});

// ---------------------------------------------------------------------------
// Implicit multiplication: digit → (
// ---------------------------------------------------------------------------

describe('mathRegexp – implicit multiplication (digit × open-paren)', () => {
  it('2(x+1) also matches 2*(x+1) variants', () => {
    const re = mathRegexp('2(x+1)');
    expectMatch(re, [
      '2(x+1)',
      '2*(x+1)',
      '2 * (x+1)',
      '2*(x + 1)',
      '2 * ( x + 1 )',
      '2   *   (x+1)',
    ]);
    expectNoMatch(re, ['2(x+2)', '3(x+1)']);
  });

  it('3(a-b) also matches 3*(a-b) variants', () => {
    const re = mathRegexp('3(a-b)');
    expectMatch(re, ['3(a-b)', '3*(a-b)', '3 * (a - b)']);
    expectNoMatch(re, ['3(a+b)', '2(a-b)']);
  });
});

// ---------------------------------------------------------------------------
// Multiple alternative expressions
// ---------------------------------------------------------------------------

describe('mathRegexp – multiple alternatives', () => {
  it('accepts any of the provided expressions', () => {
    const re = mathRegexp('x + 1', 'x - 1', 'x');
    expectMatch(re, ['x + 1', 'x+1', 'x - 1', 'x-1', 'x', '  x  ']);
    expectNoMatch(re, ['x + 2', 'y']);
  });

  it('alternatives with implicit multiplication', () => {
    const re = mathRegexp('2x', '3x');
    expectMatch(re, ['2x', '2*x', '3x', '3*x', '3 * x']);
    expectNoMatch(re, ['4x', '2y']);
  });
});

// ---------------------------------------------------------------------------
// Whitespace in original expression is flexible too
// ---------------------------------------------------------------------------

describe('mathRegexp – whitespace in the expression itself', () => {
  it('existing space in expression becomes flexible', () => {
    const re = mathRegexp('x y');
    // The space between x and y is flexible (0 or more spaces)
    expectMatch(re, ['x y', 'x  y', 'xy', '  x y  ']);
    expectNoMatch(re, ['x z']);
  });
});

// ---------------------------------------------------------------------------
// Special RegExp metacharacters are treated literally
// ---------------------------------------------------------------------------

describe('mathRegexp – metacharacter escaping', () => {
  it('dots and brackets in expression are not treated as regex wildcards', () => {
    const re = mathRegexp('x.y');
    expect(re.test('x.y')).toBe(true);
    expect(re.test('xay')).toBe(false); // . is literal
  });

  it('caret in expression is treated as operator (space-flexible), not anchor', () => {
    const re = mathRegexp('x^2 + 1');
    expectMatch(re, ['x^2 + 1', 'x ^ 2 + 1', 'x^2+1']);
    expectNoMatch(re, ['x^3 + 1']);
  });
});
