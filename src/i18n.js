import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';
import frLocaleData from 'react-intl/locale-data/fr';
import heLocaleData from 'react-intl/locale-data/he';
import ptLocaleData from 'react-intl/locale-data/pt';
import ruLocaleData from 'react-intl/locale-data/ru';
import hiLocaleData from 'react-intl/locale-data/hi';

addLocaleData([
  ...enLocaleData,
  ...esLocaleData,
  ...frLocaleData,
  ...heLocaleData,
  ...ptLocaleData,
  ...ruLocaleData,
  ...hiLocaleData,
]);

const en = require('./translations/en.json');
const es = require('./translations/es.json');
const fr = require('./translations/fr.json');
const he = require('./translations/he.json');
const pt = require('./translations/pt.json');
const ru = require('./translations/ru.json');
const hi = require('./translations/hi.json');

export const translationMessages = { en, es, fr, he, pt, ru, hi };
export const appLocales = Object.keys(translationMessages);
export const navigatorLanguage = normalizeLanguageCode(navigator.language);
// export const navigatorLanguage = 'ar';
// export const navigatorLanguage = 'en-US';

export function stripRegionCode(language) {
  if (!language) { return; }
  return language.toLowerCase().split(/[_-]+/)[0];
}

export function normalizeLanguageCode(language) {
  let normalizedCode = language.split(/[_-]+/);

  if (normalizedCode.length === 1) {
    normalizedCode = normalizedCode[0].toLowerCase();
  } else {
    normalizedCode[0] = normalizedCode[0].toLowerCase();
    normalizedCode[1] = normalizedCode[1].toUpperCase();
    normalizedCode = normalizedCode.join('-');
  }
  return normalizedCode;
}