import { jsx as _jsx } from "tsprose/jsx-runtime";
import { P } from '@erudit-js/prose/elements/paragraph/core';
import { M } from '@erudit-js/prose/elements/math/inliner';
export function QED(_props) {
    return (_jsx(P, { children: _jsx(M, { children: "\\blacksquare" }) }));
}
