import type { I18n } from '@licium/editor';

export function addLangs(i18n: I18n) {
  i18n.setLanguage(['en', 'en-US'], {
    Highlight: 'Highlight',
    'No fill': 'No fill',
    'Recently used': 'Recently used',
    Colors: 'Colors',
    OK: 'OK',
    Reset: 'Reset',
  });

  i18n.setLanguage(['de', 'de-DE'], {
    Highlight: 'Hervorheben',
    'No fill': 'Keine Füllung',
    'Recently used': 'Zuletzt verwendet',
    Colors: 'Farben',
    OK: 'OK',
    Reset: 'Zurücksetzen',
  });

  i18n.setLanguage(['es', 'es-ES'], {
    Highlight: 'Resaltar',
    'No fill': 'Sin relleno',
    'Recently used': 'Recientes',
    Colors: 'Colores',
    OK: 'OK',
    Reset: 'Restablecer',
  });

  i18n.setLanguage(['fr', 'fr-FR'], {
    Highlight: 'Surligner',
    'No fill': 'Aucun remplissage',
    'Recently used': 'Récemment utilisé',
    Colors: 'Couleurs',
    OK: 'OK',
    Reset: 'Réinitialiser',
  });

  i18n.setLanguage(['ja', 'ja-JP'], {
    Highlight: 'ハイライト',
    'No fill': '塗りつぶしなし',
    'Recently used': '最近使用した色',
    Colors: '色',
    OK: 'OK',
    Reset: 'リセット',
  });

  i18n.setLanguage(['ko', 'ko-KR'], {
    Highlight: '강조',
    'No fill': '채우기 없음',
    'Recently used': '최근 사용한 색',
    Colors: '색상',
    OK: '확인',
    Reset: '초기화',
  });

  i18n.setLanguage(['zh', 'zh-CN'], {
    Highlight: '高亮',
    'No fill': '无填充',
    'Recently used': '最近使用',
    Colors: '颜色',
    OK: '确定',
    Reset: '重置',
  });
}
