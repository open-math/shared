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
export function mathRegexp(...expressions: string[]): RegExp {
  /** Placeholder that becomes `\s*` in the final pattern. */
  const anySpaceSymbol = '\uE000';
  /** Placeholder that becomes `\s*(?:\*\s*)?` in the final pattern. */
  const optMultSymbol = '\uE001';

  const anyNumberOfSpacesPattern = '\\s*';
  const optMultPattern = '\\s*(?:\\*\\s*)?';

  const escapeRegExp = (value: string): string =>
    value.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

  const toSpaceFlexibleExpression = (expression: string): string => {
    let value = expression.trim();

    // Implicit multiplication: digit directly adjacent to a Unicode letter or '('
    // → insert optional-multiply placeholder so that e.g. "2x" also matches "2*x".
    value = value.replace(/(\d)(\p{L}|\()/gu, `$1${optMultSymbol}$2`);

    // Convert any existing whitespace into a space placeholder.
    value = value.replace(/\s+/gu, anySpaceSymbol);

    // Allow whitespace around common math delimiters/operators.
    value = value
      .replace(/\(/gu, `${anySpaceSymbol}(${anySpaceSymbol}`)
      .replace(/\)/gu, `${anySpaceSymbol})${anySpaceSymbol}`)
      .replace(/,/gu, `${anySpaceSymbol},${anySpaceSymbol}`)
      .replace(/([+*/=^:-])/gu, `${anySpaceSymbol}$1${anySpaceSymbol}`);

    // Collapse consecutive space-placeholders (but keep \uE001 distinct).
    value = value.replace(/+/gu, anySpaceSymbol);

    // Absorb any adjacent space-placeholders into an opt-mult placeholder.
    value = value.replace(/**/gu, optMultSymbol);

    // Also allow leading/trailing whitespace.
    return `${anySpaceSymbol}${value}${anySpaceSymbol}`.replace(
      /+/gu,
      anySpaceSymbol,
    );
  };

  const toPattern = (expression: string): string => {
    const normalized = toSpaceFlexibleExpression(expression);

    // Split on placeholders, preserving which separator was used.
    const segments = normalized.split(/[]/u);
    const separators = normalized.match(/[]/gu) ?? [];

    let result = escapeRegExp(segments[0]);
    for (let i = 0; i < separators.length; i++) {
      result +=
        separators[i] === optMultSymbol
          ? optMultPattern
          : anyNumberOfSpacesPattern;
      result += escapeRegExp(segments[i + 1]);
    }
    return result;
  };

  if (expressions.length === 0) {
    return /^$/u;
  }

  const alternatives = expressions.map(toPattern).join('|');
  return new RegExp(`^(?:${alternatives})$`, 'u');
}
