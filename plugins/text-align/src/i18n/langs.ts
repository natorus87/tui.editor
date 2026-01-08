import type { I18n } from '@licium/editor';

export function addLangs(i18n: I18n) {
  i18n.setLanguage(['en', 'en-US'], {
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
  });

  i18n.setLanguage(['ar', 'ar-AR'], {
    alignLeft: 'محاذاة لليسار',
    alignCenter: 'محاذاة للوسط',
    alignRight: 'محاذاة لليمين',
  });

  i18n.setLanguage(['cs', 'cs-CZ'], {
    alignLeft: 'Zarovnat vlevo',
    alignCenter: 'Zarovnat na střed',
    alignRight: 'Zarovnat vpravo',
  });

  i18n.setLanguage(['de', 'de-DE'], {
    alignLeft: 'Linksbündig',
    alignCenter: 'Zentriert',
    alignRight: 'Rechtsbündig',
  });

  i18n.setLanguage(['es', 'es-ES'], {
    alignLeft: 'Alinear a la izquierda',
    alignCenter: 'Alinear al centro',
    alignRight: 'Alinear a la derecha',
  });

  i18n.setLanguage(['fi', 'fi-FI'], {
    alignLeft: 'Tasaa vasemmalle',
    alignCenter: 'Keskitä',
    alignRight: 'Tasaa oikealle',
  });

  i18n.setLanguage(['fr', 'fr-FR'], {
    alignLeft: 'Aligner à gauche',
    alignCenter: 'Aligner au centre',
    alignRight: 'Aligner à droite',
  });

  i18n.setLanguage(['gl', 'gl-ES'], {
    alignLeft: 'Aliñar á esquerda',
    alignCenter: 'Aliñar ao centro',
    alignRight: 'Aliñar á dereita',
  });

  i18n.setLanguage(['hr', 'hr-HR'], {
    alignLeft: 'Poravnaj lijevo',
    alignCenter: 'Poravnaj središnje',
    alignRight: 'Poravnaj desno',
  });

  i18n.setLanguage(['it', 'it-IT'], {
    alignLeft: 'Allinea a sinistra',
    alignCenter: 'Allinea al centro',
    alignRight: 'Allinea a destra',
  });

  i18n.setLanguage(['ja', 'ja-JP'], {
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
  });

  i18n.setLanguage(['ko', 'ko-KR'], {
    alignLeft: '왼쪽 정렬',
    alignCenter: '가운데 정렬',
    alignRight: '오른쪽 정렬',
  });

  i18n.setLanguage(['nb', 'nb-NO'], {
    alignLeft: 'Venstrejuster',
    alignCenter: 'Midtstill',
    alignRight: 'Høyrejuster',
  });

  i18n.setLanguage(['nl', 'nl-NL'], {
    alignLeft: 'Links uitlijnen',
    alignCenter: 'Centreren',
    alignRight: 'Rechts uitlijnen',
  });

  i18n.setLanguage(['pl', 'pl-PL'], {
    alignLeft: 'Wyrównaj do lewej',
    alignCenter: 'Wyśrodkuj',
    alignRight: 'Wyrównaj do prawej',
  });

  i18n.setLanguage(['pt', 'pt-BR'], {
    alignLeft: 'Alinhar à esquerda',
    alignCenter: 'Alinhar ao centro',
    alignRight: 'Alinhar à direita',
  });

  i18n.setLanguage(['ru', 'ru-RU'], {
    alignLeft: 'По левому краю',
    alignCenter: 'По центру',
    alignRight: 'По правому краю',
  });

  i18n.setLanguage(['sv', 'sv-SE'], {
    alignLeft: 'Vänsterjustera',
    alignCenter: 'Centrera',
    alignRight: 'Högerjustera',
  });

  i18n.setLanguage(['tr', 'tr-TR'], {
    alignLeft: 'Sola hizala',
    alignCenter: 'Ortala',
    alignRight: 'Sağa hizala',
  });

  i18n.setLanguage(['uk', 'uk-UA'], {
    alignLeft: 'По лівому краю',
    alignCenter: 'По центру',
    alignRight: 'По правому краю',
  });

  i18n.setLanguage(['zh', 'zh-CN'], {
    alignLeft: '左对齐',
    alignCenter: '居中对齐',
    alignRight: '右对齐',
  });

  i18n.setLanguage(['zh-TW'], {
    alignLeft: '靠左對齊',
    alignCenter: '置中對齊',
    alignRight: '靠右對齊',
  });
}
