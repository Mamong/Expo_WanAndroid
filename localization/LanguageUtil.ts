import { I18n } from 'i18n-js';
import en from './language/en';
import zhHans from './language/zh-Hans';
import zhHant from './language/zh-Hant';

const i18n = new I18n({
  en,
  zhHans,
  zhHant,
});

i18n.defaultLocale = 'zhHans';

i18n.enableFallback = true;

// we just only need simple translation for original text.
// so we should use other separator instead of dot.
i18n.defaultSeparator = "$"

i18n.translations = {
  en,
  zhHans,
  zhHant,
};

export default i18n;