import { P } from '@erudit-js/prose/elements/paragraph/core';
import { M } from '@erudit-js/prose/elements/math/inliner';

export function QED(_props: { children?: undefined }) {
  return (
    <P>
      <M>\blacksquare</M>
    </P>
  );
}
