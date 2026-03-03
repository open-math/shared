declare const MATH_CHECK_TYPE = "math";
/**
 * Serializable descriptor for math answer checks.
 *
 * This object is plain JSON — safe for server→client transport.
 * The `__eruditCheck` field acts as a discriminator so that the
 * erudit plugin check registry (on the client) can dispatch to the
 * correct comparison logic without erudit knowing anything about math.
 *
 * @example
 * ```ts
 * const check = mathCheck('sqrt(2)');
 * // { __eruditCheck: 'math', expr: 'sqrt(2)' }
 *
 * validateMathCheck(check, '1.4142'); // true
 * ```
 */
export interface MathCheck {
    __eruditCheck: typeof MATH_CHECK_TYPE;
    expr: string;
    tolerance?: number;
}
/**
 * Type guard to check if a value is a `MathCheck` descriptor.
 */
export declare function isMathCheck(value: unknown): value is MathCheck;
/**
 * Create a serializable `MathCheck` descriptor from a math expression.
 *
 * @param expr - A math expression string or number (e.g. `"1/3"`, `"sqrt(2)"`, `3`, `-0.5`).
 * @param tolerance - Optional absolute tolerance for numeric comparison.
 *   When omitted, the default tolerance from `mExpression` (`1e-4`) is used.
 * @returns A `MathCheck` plain object, safe for JSON serialization.
 */
export declare function mathCheck(expr: string | number, tolerance?: number): MathCheck;
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
export declare function validateMathCheck(check: MathCheck, input: string): boolean;
export {};
