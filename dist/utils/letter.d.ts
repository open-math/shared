import type { ProblemRandom } from '@erudit-js/prose/elements/problem/rng';
export interface GetRandomLatinLetterOptions {
    casing?: 'lower' | 'upper' | 'any';
    skip?: string[];
}
export declare function getRandomLatinLetter(random: ProblemRandom, options?: GetRandomLatinLetterOptions): string;
