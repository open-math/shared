import { create, all } from 'mathjs';
const math = create(all);
const DEFAULT_TOLERANCE = 1e-4;
const DEFAULT_MAX_COMPLEXITY_RATIO = 1.1;
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
 * - `"a(b+c)"` → `"a * (b+c)"` (implicit multiplication, not a call)
 */
function normalizeExpression(expr) {
    // 1. Split multi-letter non-known identifiers into single letters
    let result = expr.replace(/[a-zA-Z_]\w*/g, (match) => {
        // Preserve known function and constant names
        if (KNOWN_NAMES.has(match))
            return match;
        // Single character – nothing to split
        if (match.length <= 1)
            return match;
        // Only split pure-letter identifiers (no digits or underscores)
        if (!/^[a-zA-Z]+$/.test(match))
            return match;
        // Split into individual characters: "xy" → "x * y"
        return match.split('').join(' * ');
    });
    // 2. Insert explicit * between a non-function identifier and '('
    //    e.g. "a(b+c)" → "a * (b+c)", but "sin(x)" stays unchanged
    result = result.replace(/([a-zA-Z_]\w*)\s*\(/g, (match, name) => {
        if (KNOWN_NAMES.has(name))
            return match;
        return `${name} * (`;
    });
    return result;
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
// ---------------------------------------------------------------------------
// Internals: numeric equivalence
// ---------------------------------------------------------------------------
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
/**
 * Textually substitute custom definitions in an expression string.
 *
 * Each key in `definitions` is replaced (as a whole-word match) with
 * its value wrapped in parentheses.  Keys are processed longest-first
 * to avoid partial-match collisions.
 */
function applyDefinitions(expr, definitions) {
    const keys = Object.keys(definitions).sort((a, b) => b.length - a.length);
    for (const key of keys) {
        const pattern = new RegExp(`\\b${key}\\b`, 'g');
        expr = expr.replace(pattern, `(${definitions[key]})`);
    }
    return expr;
}
/**
 * Parse and check numeric equivalence of two expressions.
 * Returns the parsed nodes on success, or `null` if not equivalent.
 */
function checkEquivalence(a, b, tolerance, definitions) {
    let nodeA;
    let nodeB;
    if (definitions && Object.keys(definitions).length > 0) {
        a = applyDefinitions(a, definitions);
        b = applyDefinitions(b, definitions);
    }
    try {
        nodeA = math.parse(normalizeExpression(a));
        nodeB = math.parse(normalizeExpression(b));
    }
    catch {
        return null;
    }
    const vars = freeVars(nodeA, nodeB);
    const equivalent = vars.size === 0
        ? compareConstant(nodeA, nodeB, a, b, tolerance)
        : compareMonteCarlo(nodeA, nodeB, [...vars], tolerance);
    return equivalent ? { nodeA, nodeB } : null;
}
// ---------------------------------------------------------------------------
// Internals: structural form helpers
// ---------------------------------------------------------------------------
/**
 * Unwrap a potential unary-minus wrapper, returning the inner node
 * and a flag indicating whether a minus was present.
 */
function unwrapUnaryMinus(node) {
    if (node.type === 'OperatorNode' &&
        node.op === '-' &&
        node.fn === 'unaryMinus' &&
        node.args.length === 1) {
        return { inner: node.args[0], negative: true };
    }
    return { inner: node, negative: false };
}
/**
 * Return the integer value of a `ConstantNode`, or `null` if the node
 * is not an integer constant.
 */
function integerValue(node) {
    if (node.type === 'ConstantNode') {
        const val = node.value;
        if (typeof val === 'number' && Number.isInteger(val))
            return val;
    }
    return null;
}
/**
 * Scan the AST for reducible integer fractions `a/b` (where `gcd(|a|, b) > 1`)
 * and return a penalty score. Each reducible fraction adds +10, which is large
 * enough to push the complexity ratio past the default 2.0 threshold for simple
 * fraction expressions.
 */
function reducibleFractionPenalty(node) {
    let penalty = 0;
    node.traverse((n) => {
        if (n.type !== 'OperatorNode' ||
            n.op !== '/' ||
            n.args?.length !== 2) {
            return;
        }
        const [numNode, denNode] = n.args;
        const { inner: rawNum } = unwrapUnaryMinus(numNode);
        const num = integerValue(rawNum);
        const den = integerValue(denNode);
        if (num === null || den === null || den <= 0)
            return;
        if (Number(math.gcd(Math.abs(num), den)) > 1) {
            penalty += 10;
        }
    });
    return penalty;
}
// ---------------------------------------------------------------------------
// Internals: AST complexity scoring
// ---------------------------------------------------------------------------
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
export function complexity(node) {
    let score = 0;
    node.traverse((n) => {
        switch (n.type) {
            case 'OperatorNode':
                // Skip unary minus — it's cosmetic sign placement, not
                // structural complexity (e.g. (-2+3x) vs (3x-2)).
                if (n.fn !== 'unaryMinus') {
                    score += 2;
                }
                break;
            case 'FunctionNode':
                score += 3;
                break;
            case 'SymbolNode':
                score += 1;
                break;
            case 'ConstantNode':
                score += 1;
                break;
        }
    });
    score += reducibleFractionPenalty(node);
    return score;
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
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
export function mValueCheck(answer, input, options) {
    const tolerance = options?.tolerance ?? DEFAULT_TOLERANCE;
    const definitions = options?.definitions;
    return checkEquivalence(answer, input, tolerance, definitions) !== null;
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
export function mExprCheck(expected, input, options) {
    const tolerance = options?.tolerance ?? DEFAULT_TOLERANCE;
    const exprDiffRatio = options?.exprDiffRatio ?? DEFAULT_MAX_COMPLEXITY_RATIO;
    const definitions = options?.definitions;
    const result = checkEquivalence(expected, input, tolerance, definitions);
    if (!result)
        return false;
    const { nodeA, nodeB } = result;
    const scoreA = complexity(nodeA);
    const scoreB = complexity(nodeB);
    // Avoid division by zero: if both are zero-complexity (e.g. single
    // constant vs single constant), they match trivially.
    if (scoreA === 0 && scoreB === 0)
        return true;
    if (scoreA === 0 || scoreB === 0)
        return false;
    const ratio = scoreB / scoreA;
    return ratio >= 1 / exprDiffRatio && ratio <= exprDiffRatio;
}
