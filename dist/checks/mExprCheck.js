import { createProblemCheckObject, defineProblemCheck, defineProblemChecker, } from '@erudit-js/core/problemCheck';
export const mathExpressionCheckDefinition = defineProblemCheck('math-expression')();
export const mExprCheck = (answer, options) => {
    return createProblemCheckObject(mathExpressionCheckDefinition, {
        expr: answer,
        tolerance: options?.tolerance,
        exprDiffRatio: options?.exprDiffRatio,
        definitions: options?.definitions,
    });
};
export default defineProblemChecker(mathExpressionCheckDefinition, async (data, input) => {
    const { expr, tolerance, exprDiffRatio, definitions } = data;
    const _mExprCheck = (await import('../math.js')).mExprCheck;
    return _mExprCheck(expr, input, { tolerance, exprDiffRatio, definitions });
});
