import { describe, expect, it } from 'vitest';
import { create, all } from 'mathjs';

import { mValueCheck, mExprCheck, complexity } from '@src/math.js';

const math = create(all);

// ---------------------------------------------------------------------------
// mValueCheck – constant (numeric) equivalence
// ---------------------------------------------------------------------------

describe('mValueCheck – constants', () => {
  it.each([
    ['1/2', '0.5', true],
    ['2/4', '1/2', true],
    ['sqrt(2)', '1.4142', true],
    ['sqrt(2)', '2^(1/2)', true],
    ['1/sqrt(2)', 'sqrt(2)/2', true],
    ['sin(pi/6)', '1/2', true],
    ['2 + 3', '5', true],
    ['-(2 - sqrt(2))/sqrt(5)', '(-2 + sqrt(2))/sqrt(5)', true],
    ['1/3', '0.33', false],
    ['sqrt(2)', '1.41', false],
    ['1', '2', false],
    ['1.0000', '1.0002', false],
    // Direct numbers
    ['3', '3', true],
    ['-3', '-3', true],
    ['3', '-3', false],
    ['.5', '0.5', true],
    ['-.5', '-0.5', true],
    ['-.5', '.5', false],
    ['-0.5', '-1/2', true],
  ])('%s ≡ %s → %s', (a, b, expected) => {
    expect(mValueCheck(a, b)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// mValueCheck – variable expressions (Monte Carlo)
// ---------------------------------------------------------------------------

describe('mValueCheck – variables', () => {
  it.each([
    ['2x + x', '3x', true],
    ['a + b', 'b + a', true],
    ['(a + b)^2', 'a^2 + 2ab + b^2', true],
    ['a(b + c)', 'ab + ac', true],
    ['x^2 - 1', '(x - 1)(x + 1)', true],
    ['sin(x)^2 + cos(x)^2', '1', true],
    ['xy + yx', '2xy', true],
    ['x + 1', 'x + 2', false],
    ['x^2', 'x^3', false],
  ])('%s ≡ %s → %s', (a, b, expected) => {
    expect(mValueCheck(a, b)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// mValueCheck – implicit multiplication
// ---------------------------------------------------------------------------

describe('mValueCheck – implicit multiplication', () => {
  it.each([
    ['xy', 'x * y', true],
    ['2xy', '2 * x * y', true],
    ['abc', 'a * b * c', true],
    ['2x', 'x + x', true],
    ['xy', 'x + y', false],
  ])('%s ≡ %s → %s', (a, b, expected) => {
    expect(mValueCheck(a, b)).toBe(expected);
  });

  it('preserves function names (sin is not s*i*n)', () => {
    expect(mValueCheck('sin(x)', 'sin(x)')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// mValueCheck – whitespace tolerance
// ---------------------------------------------------------------------------

describe('mValueCheck – whitespace tolerance', () => {
  it.each([
    ['4', '  4  ', true],
    ['2x+3', '2 x + 3', true],
    ['sqrt(2)', 'sqrt( 2 )', true],
    ['(x+1)^2', '( x + 1 ) ^ 2', true],
    ['(x+1)^2', 'x ^  2  +  2 * x  + 1', true],
    ['1', 'sin(  x  ) ^ 2   +   cos( x ) ^ 2', true],
    ['2xy', 'x  *  y  +  y  *  x', true],
    ['sqrt(2)/2', 'sqrt(  2  )  /  2', true],
    ['a+b', 'a   +   b', true],
    ['(a+b)(a-b)', '(  a +  b  ) * (  a -  b  )', true],
  ])('"%s" vs "%s" → %s', (a, b, expected) => {
    expect(mValueCheck(a, b)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// mValueCheck – custom tolerance
// ---------------------------------------------------------------------------

describe('mValueCheck – custom tolerance', () => {
  it('accepts imprecise input with loose tolerance', () => {
    // sqrt(2) ≈ 1.41421… — with tolerance 0.01, "1.41" should pass
    expect(mValueCheck('sqrt(2)', '1.41', { tolerance: 0.01 })).toBe(true);
  });

  it('rejects imprecise input with default tolerance', () => {
    // Default tolerance is 1e-4 — "1.41" differs by ~0.004, should fail
    expect(mValueCheck('sqrt(2)', '1.41')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// mValueCheck – edge cases
// ---------------------------------------------------------------------------

describe('mValueCheck – edge cases', () => {
  it.each([
    ['', '1', false],
    ['1', '', false],
    ['???', '1', false],
    ['!!!', '???', false],
  ])('"%s" vs "%s" → %s', (a, b, expected) => {
    expect(mValueCheck(a, b)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// complexity
// ---------------------------------------------------------------------------

describe('complexity', () => {
  it('scores a single variable as 1', () => {
    expect(complexity(math.parse('x'))).toBe(1);
  });

  it('scores a constant as 1', () => {
    expect(complexity(math.parse('42'))).toBe(1);
  });

  it('scores (a+b)^2 lower than a^2 + 2*a*b + b^2', () => {
    const compact = complexity(math.parse('(a + b) ^ 2'));
    const expanded = complexity(math.parse('a ^ 2 + 2 * a * b + b ^ 2'));
    expect(compact).toBeLessThan(expanded);
  });

  it('scores sin(x) as function(3) + 2×symbol(1) = 5', () => {
    // FunctionNode(3) + SymbolNode for 'sin'(1) + SymbolNode for 'x'(1)
    expect(complexity(math.parse('sin(x)'))).toBe(5);
  });

  it('scores a + b as operator(2) + 2 symbols(1) = 4', () => {
    expect(complexity(math.parse('a + b'))).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// mExprCheck – structural form enforcement
// ---------------------------------------------------------------------------

describe('mExprCheck – factoring & expansion', () => {
  it.each([
    // Compact submitted matches compact expected
    ['(a+b)^2', '(a+b)^2', true],
    ['(a+b)^2', '(b+a)^2', true],
    ['a^2 + 2ab + b^2', 'a^2 + 2ab + b^2', true],
    // Distributing / collecting
    ['2(x+1)', '2x + 2', true],
    ['(x-1)(x+1)', 'x^2 - 1', false],
    ['x^2 - 1', '(x-1)(x+1)', false],
    ['(x-3)^2', 'x^2 - 6x + 9', false],
    ['(x+2)(x+3)', 'x^2 + 5x + 6', false],
    // Expansion too complex → rejected
    ['(a+b)^2', 'a^2 + 2ab + b^2', false],
    ['a^2 + 2ab + b^2', '(a+b)^2', false],
    // Difference / sum of cubes → ratio > 2
    ['a^3 - b^3', '(a-b)(a^2 + ab + b^2)', false],
    ['(a-b)(a^2 + ab + b^2)', 'a^3 - b^3', false],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – cubic special products', () => {
  it.each([
    // Cube of sum/difference — compact matches itself or commuted
    ['(a+b)^3', '(a+b)^3', true],
    ['(a-b)^3', '(a-b)^3', true],
    ['(a+b)^3', '(b+a)^3', true],
    // Sum of cubes factored ↔ expanded — ratio > 2
    ['a^3 + b^3', '(a+b)(a^2 - ab + b^2)', false],
    ['(a+b)(a^2 - ab + b^2)', 'a^3 + b^3', false],
    // Full expansion of (a+b)^3 — ratio >> 2
    ['(a+b)^3', 'a^3 + 3a^2b + 3ab^2 + b^3', false],
    ['a^3 + 3a^2b + 3ab^2 + b^3', '(a+b)^3', false],
    // Full expansion of (a-b)^3 — ratio >> 2
    ['(a-b)^3', 'a^3 - 3a^2b + 3ab^2 - b^3', false],
    ['a^3 - 3a^2b + 3ab^2 - b^3', '(a-b)^3', false],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – number coefficients', () => {
  it.each([
    // Simple distribution with coefficients
    ['5(x+3)', '5x + 15', true],
    ['2(3x - 4)', '6x - 8', false],
    // Product of conjugates with coefficients
    ['(3x-2)(3x+2)', '9x^2 - 4', false],
    ['9x^2 - 4', '(3x-2)(3x+2)', false],
    ['(5x-1)(5x+1)', '25x^2 - 1', false],
    // Square with coefficients — rejected
    ['(2x+1)^2', '4x^2 + 4x + 1', false],
    ['(2x+3)^2', '4x^2 + 12x + 9', false],
    ['(3x-1)^2', '9x^2 - 6x + 1', false],
    // Factored form with leading coefficient
    ['3(x+2)(x-1)', '3x^2 + 3x - 6', false],
    ['2(x-3)(x+3)', '2x^2 - 18', false],
    // Cubic with coefficients — too complex
    ['(2x+1)^3', '8x^3 + 12x^2 + 6x + 1', false],
    ['8x^3 + 12x^2 + 6x + 1', '(2x+1)^3', false],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – commuted / reordered forms', () => {
  it.each([
    // Swapped factors
    ['(3x-2)(3x+2)', '(3x+2)(3x-2)', true],
    ['(x-1)(x+1)', '(x+1)(x-1)', true],
    ['(a-b)(a+b)', '(a+b)(a-b)', true],
    // Reordered terms within factors
    ['(3x-2)(3x+2)', '(-2+3x)(2+3x)', true],
    ['(x+2)(x+3)', '(2+x)(3+x)', true],
    // Negated factor order (sign absorbed)
    ['(a-b)', '-(b-a)', true],
    // Squares with reordered base
    ['(2x+1)^2', '(1+2x)^2', true],
    ['(3x-5)^2', '(-5+3x)^2', true],
    ['(a+b)^2', '(b+a)^2', true],
    ['(2a-3b)^2', '(-3b+2a)^2', true],
    // Cubes with reordered base
    ['(x+1)^3', '(1+x)^3', true],
    ['(2x-3)^3', '(-3+2x)^3', true],
    // Complex products with reordered terms
    ['(2x+3)(x-4)', '(x-4)(3+2x)', true],
    ['(5x-1)(2x+7)', '(7+2x)(-1+5x)', true],
    ['(x+1)(x-1)(x+2)', '(x+2)(x-1)(x+1)', true],
    // Fractions with reordered numerator/denominator terms
    ['(x+1)/(x-1)', '(1+x)/(-1+x)', true],
    ['(2x+3)/(x-5)', '(3+2x)/(-5+x)', true],
    ['(a+b)/(a-b)', '(b+a)/(a-b)', true],
    // Mixed: squared fraction with reordering
    ['((x+1)/(x-1))^2', '((1+x)/(-1+x))^2', true],
    // Coefficient pulled out with reordered factor
    ['3(x+2)', '3(2+x)', true],
    ['5(2x-7)(x+3)', '5(3+x)(-7+2x)', true],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – radicals', () => {
  it.each([
    ['sqrt(2)', '2^(1/2)', false],
    ['sqrt(8)', '2sqrt(2)', false],
    ['2sqrt(2)', 'sqrt(8)', false],
    ['sqrt(12)', '2sqrt(3)', false],
    ['2sqrt(3)', 'sqrt(12)', false],
    ['1/sqrt(2)', 'sqrt(2)/2', true],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – trig identities', () => {
  it.each([
    // Double-angle ↔ product form — rejected
    ['2sin(x)cos(x)', 'sin(2x)', false],
    ['sin(2x)', '2sin(x)cos(x)', false],
    // Pythagorean ↔ 1 — huge complexity gap
    ['sin(x)^2 + cos(x)^2', '1', false],
    ['1', 'sin(x)^2 + cos(x)^2', false],
    // cos double-angle ↔ difference of squares — ratio > 2
    ['cos(2x)', 'cos(x)^2 - sin(x)^2', false],
    ['cos(x)^2 - sin(x)^2', 'cos(2x)', false],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – logarithmic identities', () => {
  it.each([
    ['2log(x)', 'log(x^2)', true],
    ['log(x^2)', '2log(x)', true],
    ['3log(x)', 'log(x^3)', true],
    ['log(x^3)', '3log(x)', true],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – irreducible fractions', () => {
  it.each([
    ['1/2', '1/2', true],
    ['3/4', '3/4', true],
    ['1/7', '1/7', true],
    ['-1/2', '-1/2', true],
    ['1/2', '2/4', false],
    ['3/4', '6/8', false],
    ['1/3', '5/15', false],
    ['-1/2', '-2/4', false],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });

  it('both reducible with same form → matches (symmetric penalty)', () => {
    expect(mExprCheck('2/4', '2/4')).toBe(true);
  });
});

describe('mExprCheck – non-equivalent expressions', () => {
  it.each([
    ['x + 1', 'x + 2', false],
    ['x^2', 'x^3', false],
    ['a + b', 'a - b', false],
    ['sin(x)', 'cos(x)', false],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

describe('mExprCheck – custom exprDiffRatio', () => {
  it.each([
    // High ratio accepts expanded forms
    ['(a+b)^2', 'a^2 + 2ab + b^2', { exprDiffRatio: 10 }, true],
    // Ratio 1.0 rejects any complexity difference
    ['3x', '2x + x', { exprDiffRatio: 1.0 }, false],
    // Default ratio rejects structural differences
    ['(x-1)(x+1)', 'x^2 - 1', {}, false],
  ])('%s vs %s %j → %s', (expected, input, opts, result) => {
    expect(mExprCheck(expected, input, opts)).toBe(result);
  });
});

describe('mExprCheck – edge cases', () => {
  it.each([
    ['(a+b)^2', '???', false],
    ['(a+b)^2', '', false],
    ['4', '2 + 2', false],
    ['2 + 2', '1 + 3', true],
  ])('%s vs %s → %s', (expected, input, result) => {
    expect(mExprCheck(expected, input)).toBe(result);
  });
});

// ---------------------------------------------------------------------------
// mValueCheck – custom definitions
// ---------------------------------------------------------------------------

describe('mValueCheck – custom definitions', () => {
  it('replaces a single definition with a constant', () => {
    expect(mValueCheck('alpha', '5', { definitions: { alpha: '5' } })).toBe(
      true,
    );
  });

  it('replaces multiple definitions', () => {
    expect(
      mValueCheck('alpha + beta', '8', {
        definitions: { alpha: '3', beta: '5' },
      }),
    ).toBe(true);
  });

  it('replaces a multi-letter name with an expression', () => {
    expect(
      mValueCheck('coeff * x', '6x', { definitions: { coeff: '6' } }),
    ).toBe(true);
  });

  it('replaces definitions in both expected and input', () => {
    expect(mValueCheck('f + 1', 'f + 1', { definitions: { f: 'x^2' } })).toBe(
      true,
    );
  });

  it('handles expression-valued definitions', () => {
    expect(
      mValueCheck('val', 'x^2 + 1', { definitions: { val: 'x^2 + 1' } }),
    ).toBe(true);
  });

  it('longer key is matched first (no partial collision)', () => {
    expect(
      mValueCheck('ab + abc', '13', {
        definitions: { ab: '3', abc: '10' },
      }),
    ).toBe(true);
  });

  it('definitions do not affect standard identifiers', () => {
    // "sin" should not be replaced even though it is multi-letter
    expect(
      mValueCheck('sin(x) + k', 'sin(x) + 7', { definitions: { k: '7' } }),
    ).toBe(true);
  });

  it('without definitions behaves as before', () => {
    expect(mValueCheck('2 + 3', '5')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// mExprCheck – custom definitions
// ---------------------------------------------------------------------------

describe('mExprCheck – custom definitions', () => {
  it('replaces definitions and checks structural similarity', () => {
    expect(
      mExprCheck('val', '(a+b)^2', {
        definitions: { val: '(a+b)^2' },
      }),
    ).toBe(true);
  });

  it('rejects structurally different form even with definitions', () => {
    expect(
      mExprCheck('val', 'a^2 + 2ab + b^2', {
        definitions: { val: '(a+b)^2' },
      }),
    ).toBe(false);
  });

  it('works with definitions and custom exprDiffRatio', () => {
    expect(
      mExprCheck('val', 'a^2 + 2ab + b^2', {
        definitions: { val: '(a+b)^2' },
        exprDiffRatio: 10,
      }),
    ).toBe(true);
  });

  it('works with definitions and custom tolerance', () => {
    // val → 3.14, input 3.14 — same constant, tolerance irrelevant but option forwarded
    expect(
      mExprCheck('val', '3.14', {
        definitions: { val: '3.14' },
        tolerance: 0.01,
      }),
    ).toBe(true);
  });
});
