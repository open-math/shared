import { describe, expect, it } from 'vitest';

import {
  gcd,
  isPerfectSquare,
  simplifyFraction,
  simplifySqrt,
} from '@src/utils/number.js';

describe('gcd', () => {
  it.each([
    [12, 8, 4],
    [0, 5, 5],
    [5, 0, 5],
    [0, 0, 0],
    [-6, 9, 3],
    [7, 7, 7],
    [1, 13, 1],
    [100, 75, 25],
    [17, 19, 1],
    [-12, -8, 4],
  ])('gcd(%i, %i) = %i', (a, b, expected) => {
    expect(gcd(a, b)).toBe(expected);
  });
});

describe('isPerfectSquare', () => {
  it.each([
    [0, true],
    [1, true],
    [4, true],
    [9, true],
    [16, true],
    [25, true],
    [100, true],
    [2, false],
    [3, false],
    [5, false],
    [15, false],
    [-1, false],
    [-4, false],
  ])('isPerfectSquare(%i) = %s', (n, expected) => {
    expect(isPerfectSquare(n)).toBe(expected);
  });
});

describe('simplifyFraction', () => {
  it.each<[number, number, [number, number]]>([
    [2, 4, [1, 2]],
    [6, 3, [2, 1]],
    [-3, 6, [-1, 2]],
    [5, -10, [-1, 2]],
    [7, 1, [7, 1]],
    [-4, -6, [2, 3]],
    [0, 5, [0, 1]],
    [3, 7, [3, 7]],
    [-15, 25, [-3, 5]],
    [12, -8, [-3, 2]],
  ])('simplifyFraction(%i, %i) = %j', (n, d, expected) => {
    expect(simplifyFraction(n, d)).toEqual(expected);
  });

  it('always returns positive denominator', () => {
    const [, d] = simplifyFraction(3, -9);
    expect(d).toBeGreaterThan(0);
  });
});

describe('simplifySqrt', () => {
  it.each<[number, [number, number]]>([
    [1, [1, 1]],
    [4, [2, 1]],
    [7, [1, 7]],
    [12, [2, 3]],
    [18, [3, 2]],
    [50, [5, 2]],
    [72, [6, 2]],
    [100, [10, 1]],
    [45, [3, 5]],
    [98, [7, 2]],
  ])('simplifySqrt(%i) = %j', (n, expected) => {
    expect(simplifySqrt(n)).toEqual(expected);
  });

  it('k*k*r equals n', () => {
    for (const n of [2, 3, 8, 12, 18, 48, 75, 200]) {
      const [k, r] = simplifySqrt(n);
      expect(k * k * r).toBe(n);
    }
  });

  it('r is square-free', () => {
    for (const n of [12, 18, 50, 72, 200, 300]) {
      const [, r] = simplifySqrt(n);
      // No perfect square > 1 should divide r
      for (let f = 2; f * f <= r; f++) {
        expect(r % (f * f)).not.toBe(0);
      }
    }
  });
});
