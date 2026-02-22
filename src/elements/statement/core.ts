import { defineAccentCore } from '@erudit-js/prose/elements/accent/core';
import { defineProseCoreElements } from '@erudit-js/prose';

export const statementAccent = defineAccentCore({
  name: 'statement',
  sectionNames: ['proof'],
});

export default defineProseCoreElements(
  statementAccent.accent.coreElement,
  statementAccent.main.coreElement,
  statementAccent.section.coreElement,
);
