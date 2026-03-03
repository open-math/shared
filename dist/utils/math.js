import { jsx as _jsx, Fragment as _Fragment } from "tsprose/jsx-runtime";
import { ProblemCheck } from '@erudit-js/prose/elements/problem/problemCheck';
import { mValueCheck } from '../checks/mValueCheck.js';
import { mExprCheck } from '../checks/mExprCheck.js';
function wrapValue(value, options) {
    return mValueCheck(String(value), options);
}
function wrapAnswer(value, options) {
    if (Array.isArray(value)) {
        return value.map((v) => wrapValue(v, options));
    }
    return wrapValue(value, options);
}
function wrapExprValue(value, options) {
    return mExprCheck(String(value), options);
}
function wrapExprAnswer(value, options) {
    if (Array.isArray(value)) {
        return value.map((v) => wrapExprValue(v, options));
    }
    return wrapExprValue(value, options);
}
export function MathValueCheck(props) {
    const options = {
        tolerance: props.tolerance,
        definitions: props.definitions,
    };
    if ('answer' in props) {
        return (_jsx(_Fragment, { children: _jsx(ProblemCheck, { answer: wrapAnswer(props.answer, options) }) }));
    }
    else {
        return (_jsx(_Fragment, { children: _jsx(ProblemCheck, { answers: props.answers.map((a) => wrapAnswer(a, options)) }) }));
    }
}
export function MathExpressionCheck(props) {
    const options = {
        tolerance: props.tolerance,
        exprDiffRatio: props.exprDiffRatio,
        definitions: props.definitions,
    };
    if ('answer' in props) {
        return (_jsx(_Fragment, { children: _jsx(ProblemCheck, { answer: wrapExprAnswer(props.answer, options) }) }));
    }
    else {
        return (_jsx(_Fragment, { children: _jsx(ProblemCheck, { answers: props.answers.map((a) => wrapExprAnswer(a, options)) }) }));
    }
}
