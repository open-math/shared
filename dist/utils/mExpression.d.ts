/**
 * Compare two math expressions for equivalence.
 *
 * - **Constant expressions** (no free variables): first tries symbolic
 *   simplification of `a − b` to check for exact `0`, then falls back
 *   to numeric evaluation within `tolerance`.
 * - **Variable expressions**: detects free variables and uses Monte Carlo
 *   evaluation at 8 diverse substitution points. If all differences are
 *   within `tolerance`, the expressions are considered equivalent.
 *
 * Supports all standard mathjs functions (`sqrt`, `sin`, `cos`, `log`, etc.)
 * and implicit multiplication (`2x` = `2 * x`).
 *
 * @param a - First expression string.
 * @param b - Second expression string.
 * @param tolerance - Absolute tolerance for numeric comparison (default `1e-4`).
 * @returns `true` if the expressions are equivalent.
 */
export declare function mExpression(a: string, b: string, tolerance?: number): boolean;
