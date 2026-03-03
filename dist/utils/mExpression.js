import { create, all } from 'mathjs';
const math = create(all);
const DEFAULT_TOLERANCE = 1e-4;
/** Constants and well-known symbols that are NOT free variables. */
const BUILTIN_SYMBOLS = new Set([
    'pi',
    'e',
    'i',
    'Infinity',
    'NaN',
    'true',
    'false',
    'null',
    'undefined',
]);
/** Well-known mathjs function and constant names to preserve during normalization. */
const KNOWN_NAMES = new Set([
    ...BUILTIN_SYMBOLS,
    // Trig
    'sin',
    'cos',
    'tan',
    'sec',
    'csc',
    'cot',
    'asin',
    'acos',
    'atan',
    'atan2',
    'sinh',
    'cosh',
    'tanh',
    'asinh',
    'acosh',
    'atanh',
    // Roots / exponents / logarithms
    'sqrt',
    'cbrt',
    'nthRoot',
    'log',
    'log2',
    'log10',
    'ln',
    'exp',
    // Rounding / misc
    'abs',
    'ceil',
    'floor',
    'round',
    'sign',
    'min',
    'max',
    'mod',
    'gcd',
    'lcm',
    'factorial',
    'gamma',
    // Linear algebra / complex
    'det',
    'inv',
    'transpose',
    're',
    'im',
    'conj',
    'arg',
    // Greek letters – capitalised to avoid clashes with variable combos
    // (e.g. lowercase "xi" would block "x * i", "nu" → "n * u", etc.)
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
    'Lambda',
    'Mu',
    'Nu',
    'Xi',
    'Omicron',
    'Rho',
    'Sigma',
    'Tau',
    'Upsilon',
    'Phi',
    'Chi',
    'Psi',
    'Omega',
]);
/**
 * Normalize implicit multiplication in student expressions.
 *
 * Splits multi-character identifiers that consist entirely of letters and
 * are not known function / constant names into individual single-letter
 * variables joined by explicit `*`.
 *
 * Examples:
 * - `"2xy"` → `"2x * y"` (mathjs already handles `2x` → `2 * x`)
 * - `"abc"` → `"a * b * c"`
 * - `"sin"` → `"sin"` (preserved)
 */
function normalizeExpression(expr) {
    return expr.replace(/[a-zA-Z_]\w*/g, (match, offset) => {
        // Preserve known function and constant names
        if (KNOWN_NAMES.has(match))
            return match;
        // Single character – nothing to split
        if (match.length <= 1)
            return match;
        // Only split pure-letter identifiers (no digits or underscores)
        if (!/^[a-zA-Z]+$/.test(match))
            return match;
        // If followed by '(' treat as a function call – don't split
        const afterMatch = expr.slice(offset + match.length);
        if (/^\s*\(/.test(afterMatch))
            return match;
        // Split into individual characters: "xy" → "x * y"
        return match.split('').join(' * ');
    });
}
/**
 * Extract free variables from one or more parsed expression trees.
 * Function names (like `sin`, `cos`, `sqrt`) and built-in constants
 * (`pi`, `e`) are excluded.
 */
function freeVars(...nodes) {
    const fnNames = new Set();
    const allSyms = new Set();
    for (const node of nodes) {
        node.traverse((n) => {
            if (n.type === 'FunctionNode') {
                fnNames.add(n.fn.name);
            }
            if (n.type === 'SymbolNode') {
                allSyms.add(n.name);
            }
        });
    }
    const vars = new Set();
    for (const s of allSyms) {
        if (!fnNames.has(s) && !BUILTIN_SYMBOLS.has(s)) {
            vars.add(s);
        }
    }
    return vars;
}
/**
 * Diverse test points for Monte Carlo variable substitution.
 * Chosen to catch many classes of non-equivalence while avoiding
 * common singularities (0, ±1 have special algebraic properties).
 */
const TEST_VALUES = [0.37, -1.73, 2.19, -0.58, 5.03, -3.41, 0.91, -7.12];
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
export function mExpression(a, b, tolerance = DEFAULT_TOLERANCE) {
    let nodeA;
    let nodeB;
    try {
        nodeA = math.parse(normalizeExpression(a));
        nodeB = math.parse(normalizeExpression(b));
    }
    catch {
        return false;
    }
    const vars = freeVars(nodeA, nodeB);
    if (vars.size === 0) {
        return compareConstant(nodeA, nodeB, a, b, tolerance);
    }
    return compareMonteCarlo(nodeA, nodeB, [...vars], tolerance);
}
/**
 * Compare two constant (variable-free) expressions.
 */
function compareConstant(nodeA, nodeB, rawA, rawB, tolerance) {
    // Try symbolic simplification first
    try {
        const diff = math.simplify(`(${rawA}) - (${rawB})`);
        const simplified = diff.toString();
        if (simplified === '0')
            return true;
        // Try evaluating the simplified form
        const val = diff.evaluate();
        if (typeof val === 'number' && Number.isFinite(val)) {
            return Math.abs(val) < tolerance;
        }
    }
    catch {
        // Fall through to direct numeric evaluation
    }
    // Direct numeric evaluation
    try {
        const valA = nodeA.evaluate();
        const valB = nodeB.evaluate();
        if (typeof valA === 'number' &&
            typeof valB === 'number' &&
            Number.isFinite(valA) &&
            Number.isFinite(valB)) {
            return Math.abs(valA - valB) < tolerance;
        }
    }
    catch {
        // Both evaluations failed
    }
    return false;
}
/**
 * Compare two expressions with free variables using Monte Carlo evaluation.
 */
function compareMonteCarlo(nodeA, nodeB, vars, tolerance) {
    const compiled_a = nodeA.compile();
    const compiled_b = nodeB.compile();
    let matchCount = 0;
    let skipCount = 0;
    const maxSkips = 4;
    for (let i = 0; i < TEST_VALUES.length; i++) {
        const scope = {};
        for (let v = 0; v < vars.length; v++) {
            // Use offset indices so different variables get different values
            scope[vars[v]] = TEST_VALUES[(i + v * 3) % TEST_VALUES.length];
        }
        try {
            const valA = compiled_a.evaluate(scope);
            const valB = compiled_b.evaluate(scope);
            if (typeof valA !== 'number' || typeof valB !== 'number') {
                skipCount++;
                if (skipCount > maxSkips)
                    return false;
                continue;
            }
            if (!Number.isFinite(valA) || !Number.isFinite(valB)) {
                // Both non-finite in the same way is OK (e.g. both Infinity)
                if (!Number.isFinite(valA) && !Number.isFinite(valB)) {
                    if (valA === valB) {
                        matchCount++;
                        continue;
                    }
                }
                skipCount++;
                if (skipCount > maxSkips)
                    return false;
                continue;
            }
            if (Math.abs(valA - valB) >= tolerance) {
                return false;
            }
            matchCount++;
        }
        catch {
            skipCount++;
            if (skipCount > maxSkips)
                return false;
        }
    }
    // Need at least 4 successful match points to be confident
    return matchCount >= 4;
}
