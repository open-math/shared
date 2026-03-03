import type { MValueCheckOptions } from '../math.js';
export declare const mathValueCheckDefinition: import("@erudit-js/core/problemCheck").ToProblemCheckDefinition<"math-value", {
    expr: string;
} & MValueCheckOptions>;
export declare const mValueCheck: (answer: string, options?: MValueCheckOptions) => import("@erudit-js/core/problemCheck").ToProblemCheckObject<import("@erudit-js/core/problemCheck").ToProblemCheckDefinition<"math-value", {
    expr: string;
} & MValueCheckOptions>>;
declare const _default: import("@erudit-js/core/problemCheck").ToProblemChecker<import("@erudit-js/core/problemCheck").ToProblemCheckDefinition<"math-value", {
    expr: string;
} & MValueCheckOptions>>;
export default _default;
