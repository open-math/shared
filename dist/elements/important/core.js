import { defineAccentCore } from '@erudit-js/prose/elements/accent/core';
import { defineProseCoreElements } from '@erudit-js/prose';
export const importantAccent = defineAccentCore({
    name: 'important',
    sectionNames: [],
});
export default defineProseCoreElements(importantAccent.accent.coreElement, importantAccent.main.coreElement);
