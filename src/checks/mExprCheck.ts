import {
  createProblemCheckObject,
  defineProblemCheck,
  defineProblemChecker,
} from '@erudit-js/core/problemCheck';

import type { MExprCheckOptions } from '../math.js';

export const mathExpressionCheckDefinition = defineProblemCheck(
  'math-expression',
)<{ expr: string } & MExprCheckOptions>();

export const mExprCheck = (answer: string, options?: MExprCheckOptions) => {
  return createProblemCheckObject(mathExpressionCheckDefinition, {
    expr: answer,
    tolerance: options?.tolerance,
    exprDiffRatio: options?.exprDiffRatio,
    definitions: options?.definitions,
  });
};

export default defineProblemChecker(
  mathExpressionCheckDefinition,
  async (data, input) => {
    const { expr, tolerance, exprDiffRatio, definitions } = data;
    const _mExprCheck = (await import('../math.js')).mExprCheck;
    return _mExprCheck(expr, input, { tolerance, exprDiffRatio, definitions });
  },
);
