import type { XOR } from 'ts-xor';
import { ProblemCheck } from '@erudit-js/prose/elements/problem/problemCheck';

import { mValueCheck } from '../checks/mValueCheck.js';
import { mExprCheck } from '../checks/mExprCheck.js';
import type { MValueCheckOptions, MExprCheckOptions } from '../math.js';

type SingleValue = string | number;
type AnyOfValue = SingleValue[];
type AnswerValue = SingleValue | AnyOfValue;

function wrapValue(value: SingleValue, options?: MValueCheckOptions) {
  return mValueCheck(String(value), options);
}

function wrapAnswer(value: AnswerValue, options?: MValueCheckOptions) {
  if (Array.isArray(value)) {
    return value.map((v) => wrapValue(v, options));
  }
  return wrapValue(value, options);
}

function wrapExprValue(value: SingleValue, options?: MExprCheckOptions) {
  return mExprCheck(String(value), options);
}

function wrapExprAnswer(value: AnswerValue, options?: MExprCheckOptions) {
  if (Array.isArray(value)) {
    return value.map((v) => wrapExprValue(v, options));
  }
  return wrapExprValue(value, options);
}

export function MathValueCheck(
  props: MValueCheckOptions & {
    label?: string;
    hint?: string;
    placeholder?: string;
    children?: undefined;
  } & XOR<{ answer: AnswerValue }, { answers: AnswerValue[] }>,
) {
  const options = {
    tolerance: props.tolerance,
    definitions: props.definitions,
  };

  if ('answer' in props) {
    return (
      <>
        <ProblemCheck
          answer={wrapAnswer(props.answer!, options)}
          label={props.label}
          hint={props.hint}
          placeholder={props.placeholder}
        />
      </>
    );
  } else {
    return (
      <>
        <ProblemCheck
          answers={props.answers.map((a) => wrapAnswer(a, options))}
          label={props.label}
          hint={props.hint}
          placeholder={props.placeholder}
        />
      </>
    );
  }
}

export function MathExpressionCheck(
  props: MExprCheckOptions & {
    label?: string;
    hint?: string;
    placeholder?: string;
    children?: undefined;
  } & XOR<{ answer: AnswerValue }, { answers: AnswerValue[] }>,
) {
  const options = {
    tolerance: props.tolerance,
    exprDiffRatio: props.exprDiffRatio,
    definitions: props.definitions,
  };

  if ('answer' in props) {
    return (
      <>
        <ProblemCheck
          answer={wrapExprAnswer(props.answer!, options)}
          label={props.label}
          hint={props.hint}
          placeholder={props.placeholder}
        />
      </>
    );
  } else {
    return (
      <>
        <ProblemCheck
          answers={props.answers.map((a) => wrapExprAnswer(a, options))}
          label={props.label}
          hint={props.hint}
          placeholder={props.placeholder}
        />
      </>
    );
  }
}
