import { type MathNode } from 'mathjs';
/**
 * Compute a weighted complexity score for a parsed expression tree.
 *
 * Weights:
 * - `OperatorNode`  → 2  (arithmetic ops: +, -, *, /, ^)
 * - `FunctionNode`  → 3  (sin, sqrt, log, …)
 * - `SymbolNode`    → 1  (variables & named constants)
 * - `ConstantNode`  → 1  (numeric literals)
 * - All other nodes → 0  (parentheses, accessors, etc.)
 *
 * A compact form like `(a+b)^2` scores lower than its expansion
 * `a^2 + 2*a*b + b^2`, making the score a useful proxy for
 * structural simplicity.
 *
 * Reducible integer fractions (e.g. `2/4` instead of `1/2`) receive
 * a +10 penalty per occurrence, so they are naturally rejected by
 * the complexity-ratio check in {@link mExprCheck}.
 */
export declare function complexity(node: MathNode): number;
/**
 * Check two math expressions for **value equivalence**.
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
 * @param answer - The expected (correct) expression string.
 * @param input - The input expression string to validate.
 * @param options - Optional settings for tolerance and custom definitions.
 * @returns `true` if the expressions are numerically equivalent.
 */
export declare function mValueCheck(answer: string, input: string, options?: MValueCheckOptions): boolean;
export interface MValueCheckOptions {
    /** Absolute tolerance for numeric comparison (default `1e-4`). */
    tolerance?: number;
    /**
     * Custom name → expression definitions.
     * Each key is textually replaced (whole-word) with `(value)` in both
     * the expected and input strings before parsing.
     */
    definitions?: Record<string, string>;
}
export interface MExprCheckOptions {
    /** Absolute tolerance for numeric comparison (default `1e-4`). */
    tolerance?: number;
    /** Maximum allowed complexity ratio between the two expressions (default `2.0`). */
    exprDiffRatio?: number;
    /**
     * Custom name → expression definitions.
     * Each key is textually replaced (whole-word) with `(value)` in both
     * the expected and input strings before parsing.
     */
    definitions?: Record<string, string>;
}
/**
 * Check two math expressions for **value equivalence AND structural
 * similarity** (expression-form check).
 *
 * First verifies that the expressions are numerically equivalent (same
 * logic as {@link mValueCheck}). Then compares the AST complexity of
 * both expressions: the student's answer must have a complexity score
 * within `exprDiffRatio` of the expected answer.
 *
 * The ratio check is **bidirectional** — it rejects answers that are
 * *too expanded* (e.g. `a² + 2ab + b²` when `(a+b)²` is expected) as
 * well as answers that are *too compacted* (the reverse).
 *
 * @param expected - The expected (correct) expression string.
 * @param input  - The input expression string to validate.
 * @param options  - Optional settings for tolerance and complexity ratio.
 * @returns `true` if the expressions are equivalent **and** structurally
 *   similar within the allowed ratio.
 */
export declare function mExprCheck(expected: string, input: string, options?: MExprCheckOptions): boolean;
