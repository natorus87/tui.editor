import type { I18n } from '@licium/editor';

export function addLangs(i18n: I18n) {
  i18n.setLanguage(['en', 'en-US'], {
    details: 'Collapsible Block',
    summary: 'Summary header',
    content: 'Hidden content',
  });

  i18n.setLanguage(['de', 'de-DE'], {
    details: 'Aufklappbarer Block',
    summary: 'Klick mich zum Aufklappen',
    content: 'Hier steht der versteckte Inhalt',
  });
}
