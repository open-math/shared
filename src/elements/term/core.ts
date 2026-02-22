import { defineAccentCore } from '@erudit-js/prose/elements/accent/core';
import { defineProseCoreElements } from '@erudit-js/prose';

export const termAccent = defineAccentCore({
  name: 'term',
  sectionNames: [],
});

export default defineProseCoreElements(
  termAccent.accent.coreElement,
  termAccent.main.coreElement,
);
