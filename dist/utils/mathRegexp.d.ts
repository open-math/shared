/**
 * Builds a Unicode RegExp that matches **exactly** one of the given expressions,
 * while allowing arbitrary whitespace:
 * - around common math operators and delimiters
 * - and wherever the input already contains whitespace
 *
 * Additionally, wherever a digit is directly adjacent to a Unicode letter or `(`
 * with no space/operator between them (implicit multiplication, e.g. `2x` or
 * `2(x+1)`), the pattern also accepts an explicit `*` with optional surrounding
 * whitespace (e.g. `2*x`, `2 * x`, `2*(x+1)`, `2 * (x+1)`).
 *
 * All RegExp metacharacters in the input are treated literally.
 */
export declare function mathRegexp(...expressions: string[]): RegExp;
