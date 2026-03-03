/**
 * Check whether a numeric result is an integer or a "nice" fraction
 * (denominator ≤ 1000). Such values are common textbook answers
 * and should be checked for exact equality.
 */
export declare function isNiceFraction(value: number): boolean;
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
export declare function mAnswer(correct: string | number, input: string, tolerance?: number): boolean;
