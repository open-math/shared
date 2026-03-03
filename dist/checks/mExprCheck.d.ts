import type { MExprCheckOptions } from '../math.js';
export declare const mathExpressionCheckDefinition: import("@erudit-js/core/problemCheck").ToProblemCheckDefinition<"math-expression", {
    expr: string;
} & MExprCheckOptions>;
export declare const mExprCheck: (answer: string, options?: MExprCheckOptions) => import("@erudit-js/core/problemCheck").ToProblemCheckObject<import("@erudit-js/core/problemCheck").ToProblemCheckDefinition<"math-expression", {
    expr: string;
} & MExprCheckOptions>>;
declare const _default: import("@erudit-js/core/problemCheck").ToProblemChecker<import("@erudit-js/core/problemCheck").ToProblemCheckDefinition<"math-expression", {
    expr: string;
} & MExprCheckOptions>>;
export default _default;
