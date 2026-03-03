/** Greatest common divisor (always non-negative). */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/** Check whether `n` is a perfect square (non-negative integer whose square root is an integer). */
export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const s = Math.round(Math.sqrt(n));
  return s * s === n;
}

/**
 * Simplify the fraction n/d, keeping d > 0.
 * Returns [numerator, denominator].
 */
export function simplifyFraction(n: number, d: number): [number, number] {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(Math.abs(n), d);
  return [n / g, d / g];
}

/**
 * Simplify √n into k√r where k is the largest perfect-square factor.
 * Returns [k, r] such that √n = k·√r and r is square-free.
 */
export function simplifySqrt(n: number): [number, number] {
  let k = 1;
  let r = n;
  for (let f = 2; f * f <= r; f++) {
    while (r % (f * f) === 0) {
      k *= f;
      r /= f * f;
    }
  }
  return [k, r];
}
