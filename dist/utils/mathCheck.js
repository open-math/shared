import { mExpression } from './mExpression.js';
const MATH_CHECK_TYPE = 'math';
/**
 * Type guard to check if a value is a `MathCheck` descriptor.
 */
export function isMathCheck(value) {
    return (typeof value === 'object' &&
        value !== null &&
        value.__eruditCheck === MATH_CHECK_TYPE &&
        typeof value.expr === 'string' &&
        (typeof value.tolerance === 'number' ||
            value.tolerance === undefined));
}
/**
 * Create a serializable `MathCheck` descriptor from a math expression.
 *
 * @param expr - A math expression string or number (e.g. `"1/3"`, `"sqrt(2)"`, `3`, `-0.5`).
 * @param tolerance - Optional absolute tolerance for numeric comparison.
 *   When omitted, the default tolerance from `mExpression` (`1e-4`) is used.
 * @returns A `MathCheck` plain object, safe for JSON serialization.
 */
export function mathCheck(expr, tolerance) {
    return {
        __eruditCheck: MATH_CHECK_TYPE,
        expr: String(expr),
        ...(tolerance !== undefined && { tolerance }),
    };
}
/**
 * Validate a student's input against a `MathCheck` descriptor.
 *
 * This is the client-side companion — called by the erudit plugin
 * check registry when it encounters a descriptor with `__eruditCheck: 'math'`.
 *
 * @param check - The `MathCheck` descriptor (from the server).
 * @param input - The student's raw text input.
 * @returns `true` if the student's answer matches the expected expression.
 */
export function validateMathCheck(check, input) {
    return mExpression(check.expr, input, check.tolerance);
}
