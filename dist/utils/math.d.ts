import type { XOR } from 'ts-xor';
import type { MValueCheckOptions, MExprCheckOptions } from '../math.js';
type SingleValue = string | number;
type AnyOfValue = SingleValue[];
type AnswerValue = SingleValue | AnyOfValue;
export declare function MathValueCheck(props: MValueCheckOptions & {
    label?: string;
    hint?: string;
    placeholder?: string;
    children?: undefined;
} & XOR<{
    answer: AnswerValue;
}, {
    answers: AnswerValue[];
}>): {
    schema: import("tsprose").Schema;
    hash: string;
    tagName?: string | undefined;
    slug?: string;
    uniqueName?: string;
    data: any;
    storageKey: string | undefined;
    children: /*elided*/ any[] | undefined;
    __TSPROSE_rawElement: true;
};
export declare function MathExpressionCheck(props: MExprCheckOptions & {
    label?: string;
    hint?: string;
    placeholder?: string;
    children?: undefined;
} & XOR<{
    answer: AnswerValue;
}, {
    answers: AnswerValue[];
}>): {
    schema: import("tsprose").Schema;
    hash: string;
    tagName?: string | undefined;
    slug?: string;
    uniqueName?: string;
    data: any;
    storageKey: string | undefined;
    children: /*elided*/ any[] | undefined;
    __TSPROSE_rawElement: true;
};
export {};
