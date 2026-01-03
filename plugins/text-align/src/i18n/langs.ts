import type { I18n } from '@licium/editor';

export function addLangs(i18n: I18n) {
  i18n.setLanguage(['en', 'en-US'], {
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
  });

  i18n.setLanguage(['de', 'de-DE'], {
    alignLeft: 'Linksbündig',
    alignCenter: 'Zentriert',
    alignRight: 'Rechtsbündig',
  });

  // Add other languages as needed
}
