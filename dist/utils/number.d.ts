/** Greatest common divisor (always non-negative). */
export declare function gcd(a: number, b: number): number;
/** Check whether `n` is a perfect square (non-negative integer whose square root is an integer). */
export declare function isPerfectSquare(n: number): boolean;
/**
 * Simplify the fraction n/d, keeping d > 0.
 * Returns [numerator, denominator].
 */
export declare function simplifyFraction(n: number, d: number): [number, number];
/**
 * Simplify √n into k√r where k is the largest perfect-square factor.
 * Returns [k, r] such that √n = k·√r and r is square-free.
 */
export declare function simplifySqrt(n: number): [number, number];
