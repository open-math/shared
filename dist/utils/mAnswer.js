import { create, all } from 'mathjs';
const math = create(all);
const NICE_DENOMINATOR_LIMIT = 1000n;
const DEFAULT_TOLERANCE = 1e-4;
/**
 * Check whether a numeric result is an integer or a "nice" fraction
 * (denominator ≤ 1000). Such values are common textbook answers
 * and should be checked for exact equality.
 */
export function isNiceFraction(value) {
    if (!Number.isFinite(value))
        return false;
    if (Number.isInteger(value))
        return true;
    try {
        const f = math.fraction(value);
        return f.d <= NICE_DENOMINATOR_LIMIT;
    }
    catch {
        return false;
    }
}
/**
 * Safely evaluate a math expression string, returning a finite number or `null`.
 */
function safeEval(expr) {
    try {
        const result = math.evaluate(expr);
        if (typeof result === 'number' && Number.isFinite(result))
            return result;
        return null;
    }
    catch {
        return null;
    }
}
/**
 * Check whether a student's `input` matches the `correct` answer.
 *
 * - For exact integers and "nice" fractions (denominator ≤ 1000),
 *   the check compares as fractions for strict equality.
 * - For irrational / transcendental results (e.g. `sqrt(2)`, `pi`),
 *   the check uses approximate numeric comparison within `tolerance`.
 *
 * @param correct - The correct answer expression (number or string like `"1/3"`, `"sqrt(2)"`).
 * @param input   - The student's raw text input.
 * @param tolerance - Absolute tolerance for approximate comparison (default `1e-4`).
 * @returns `true` if the student's answer matches.
 */
export function mAnswer(correct, input, tolerance = DEFAULT_TOLERANCE) {
    if (typeof input !== 'string' || input.trim() === '')
        return false;
    const correctExpr = typeof correct === 'number' ? String(correct) : correct;
    const correctValue = safeEval(correctExpr);
    if (correctValue === null)
        return false;
    const inputValue = safeEval(input.trim());
    if (inputValue === null)
        return false;
    // Exact mode: integers and nice fractions
    if (isNiceFraction(correctValue)) {
        try {
            const correctFrac = math.fraction(correctValue);
            const inputFrac = math.fraction(inputValue);
            if (correctFrac.equals(inputFrac))
                return true;
        }
        catch {
            // Fall through to approximate comparison
        }
        // Also allow approximate match within tolerance
        // (student might type a decimal for a fraction)
        return Math.abs(correctValue - inputValue) < tolerance;
    }
    // Approximate mode: irrational / transcendental results
    return Math.abs(correctValue - inputValue) < tolerance;
}
