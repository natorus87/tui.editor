import type { I18n } from '@licium/editor';

export function addLangs(i18n: I18n) {
  i18n.setLanguage(['en', 'en-US'], {
    details: 'Collapsible Block',
    summary: 'Summary header',
    content: 'Hidden content',
  });

  i18n.setLanguage(['ar', 'ar-AR'], {
    details: 'كتلة قابلة للطي',
    summary: 'عنوان الملخص',
    content: 'المحتوى المخفي',
  });

  i18n.setLanguage(['cs', 'cs-CZ'], {
    details: 'Sbalitelný blok',
    summary: 'Záhlaví shrnutí',
    content: 'Skrytý obsah',
  });

  i18n.setLanguage(['de', 'de-DE'], {
    details: 'Aufklappbarer Block',
    summary: 'Klick mich zum Aufklappen',
    content: 'Hier steht der versteckte Inhalt',
  });

  i18n.setLanguage(['es', 'es-ES'], {
    details: 'Bloque plegable',
    summary: 'Encabezado del resumen',
    content: 'Contenido oculto',
  });

  i18n.setLanguage(['fi', 'fi-FI'], {
    details: 'Kokoontaitettava lohko',
    summary: 'Yhteenveto',
    content: 'Piilotettu sisältö',
  });

  i18n.setLanguage(['fr', 'fr-FR'], {
    details: 'Bloc pliable',
    summary: 'Titre du résumé',
    content: 'Contenu masqué',
  });

  i18n.setLanguage(['gl', 'gl-ES'], {
    details: 'Bloque pregable',
    summary: 'Cabeceira do resumo',
    content: 'Contido oculto',
  });

  i18n.setLanguage(['hr', 'hr-HR'], {
    details: 'Sklopivi blok',
    summary: 'Naslov sažetka',
    content: 'Skriveni sadržaj',
  });

  i18n.setLanguage(['it', 'it-IT'], {
    details: 'Blocco comprimibile',
    summary: 'Intestazione riepilogo',
    content: 'Contenuto nascosto',
  });

  i18n.setLanguage(['ja', 'ja-JP'], {
    details: '折りたたみブロック',
    summary: '要約ヘッダー',
    content: '隠しコンテンツ',
  });

  i18n.setLanguage(['ko', 'ko-KR'], {
    details: '접이식 블록',
    summary: '요약 헤더',
    content: '숨겨진 콘텐츠',
  });

  i18n.setLanguage(['nb', 'nb-NO'], {
    details: 'Sammenleggbar blokk',
    summary: 'Sammendrag overskrift',
    content: 'Skjult innhold',
  });

  i18n.setLanguage(['nl', 'nl-NL'], {
    details: 'Inklapbaar blok',
    summary: 'Samenvatting kop',
    content: 'Verborgen inhoud',
  });

  i18n.setLanguage(['pl', 'pl-PL'], {
    details: 'Blok zwijany',
    summary: 'Nagłówek podsumowania',
    content: 'Ukryta treść',
  });

  i18n.setLanguage(['pt', 'pt-BR'], {
    details: 'Bloco recolhível',
    summary: 'Cabeçalho de resumo',
    content: 'Conteúdo oculto',
  });

  i18n.setLanguage(['ru', 'ru-RU'], {
    details: 'Сворачиваемый блок',
    summary: 'Заголовок резюме',
    content: 'Скрытый контент',
  });

  i18n.setLanguage(['sv', 'sv-SE'], {
    details: 'Hopfällbart block',
    summary: 'Sammanfattning rubrik',
    content: 'Dolt innehåll',
  });

  i18n.setLanguage(['tr', 'tr-TR'], {
    details: 'Daraltılabilir blok',
    summary: 'Özet başlığı',
    content: 'Gizli içerik',
  });

  i18n.setLanguage(['uk', 'uk-UA'], {
    details: 'Згортаємий блок',
    summary: 'Заголовок резюме',
    content: 'Прихований вміст',
  });

  i18n.setLanguage(['zh', 'zh-CN'], {
    details: '可折叠块',
    summary: '摘要标题',
    content: '隐藏内容',
  });

  i18n.setLanguage(['zh-TW'], {
    details: '可折疊區塊',
    summary: '摘要標題',
    content: '隱藏內容',
  });
}
