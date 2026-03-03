import { createProblemCheckObject, defineProblemCheck, defineProblemChecker, } from '@erudit-js/core/problemCheck';
export const mathValueCheckDefinition = defineProblemCheck('math-value')();
export const mValueCheck = (answer, options) => {
    return createProblemCheckObject(mathValueCheckDefinition, {
        expr: answer,
        tolerance: options?.tolerance,
        definitions: options?.definitions,
    });
};
export default defineProblemChecker(mathValueCheckDefinition, async (data, input) => {
    const { expr, tolerance, definitions } = data;
    const _mValueCheck = (await import('../math.js')).mValueCheck;
    return _mValueCheck(expr, input, { tolerance, definitions });
});
