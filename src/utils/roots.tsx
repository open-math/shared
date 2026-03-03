import type { XOR } from 'ts-xor';
import {
  ProblemCheck,
  type ProblemCheckValueDefined,
} from '@erudit-js/prose/elements/problem/problemCheck';

import { mValueCheck } from '../checks/mValueCheck.js';

export interface RootsCheckLabels {
  hasRoots: string;
  roots: string;
  root: string;
}

type Value =
  | ProblemCheckValueDefined
  | [ProblemCheckValueDefined, ...ProblemCheckValueDefined[]];
interface EmptyRoots {
  /** No roots */
  empty: true;
}
interface HasRoots {
  /** Add parent "has roots?" check */
  has?: true;
}
interface SingleRoot extends HasRoots {
  /** Single root */
  root: Value;
}
interface MultipleRoots extends HasRoots {
  /** Multiple roots */
  roots: Value | [Value, ...Value[]];
}
type RootsCheckProps = {
  children?: undefined;
} & XOR<EmptyRoots, SingleRoot, MultipleRoots>;

function toFlexibleValue(
  value: ProblemCheckValueDefined,
): ProblemCheckValueDefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return mValueCheck(String(value));
  }

  return value;
}

function normalizeValue(value: Value): Value {
  if (Array.isArray(value)) {
    return value.map(toFlexibleValue) as [
      ProblemCheckValueDefined,
      ...ProblemCheckValueDefined[],
    ];
  }

  return toFlexibleValue(value);
}
/**
 * Creates a `RootsCheck` component with localized labels.
 *
 * The returned component has 3 mutually exclusive modes:
 * - `empty`: the equation has no roots (renders only the "has roots?" check with `no`)
 * - `root`: check a single root
 * - `roots`: check multiple roots
 *
 * When `has` is set (only with `root`/`roots`), the root check is wrapped into a parent
 * "Has roots?" check with `yes`.
 *
 * @param labels - Localized label strings for the checks.
 * @returns A `RootsCheck` component bound to the provided labels.
 *
 * @example
 * const RootsCheck = createRootsCheck({ hasRoots: 'Has roots?', roots: 'Equation roots', root: 'Equation root' });
 *
 * // No roots
 * <RootsCheck empty />
 *
 * @example
 * // One root
 * <RootsCheck root={2} />
 *
 * @example
 * // One root (accepting multiple any-of values), but also explicitly check that roots exist
 * <RootsCheck has root={[0.2, '2/10']} />
 *
 * @example
 * // Multiple roots
 * <RootsCheck roots={[1, 2, 3]} />
 *
 * @example
 * // Multiple roots with parent "has roots?" check
 * <RootsCheck has roots={[1, 2, 3]} />
 */
export function createRootsCheck(labels: RootsCheckLabels) {
  return function RootsCheck(props: RootsCheckProps) {
    if ('empty' in props) {
      return <ProblemCheck label={labels.hasRoots} no />;
    } else if ('root' in props) {
      const rootCheck = (
        <ProblemCheck
          label={labels.root}
          answer={normalizeValue(props.root!)}
        />
      );

      if (!props.has) {
        return rootCheck;
      }

      return (
        <ProblemCheck label={labels.hasRoots} yes>
          {rootCheck}
        </ProblemCheck>
      );
    } else {
      const roots = Array.isArray(props.roots) ? props.roots : [props.roots];
      const rootsCheck = (
        <ProblemCheck
          label={labels.roots}
          answers={roots.map((r) => normalizeValue(r!))}
        />
      );

      if (!props.has) {
        return rootsCheck;
      }

      return (
        <ProblemCheck label={labels.hasRoots} yes>
          {rootsCheck}
        </ProblemCheck>
      );
    }
  };
}
