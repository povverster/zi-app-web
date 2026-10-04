import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'
import {
  initialLanguage,
  isLanguage,
  languageStorageKey,
  type Language,
} from './languages'
export function createAppI18n(language: Language = initialLanguage()) {
  const instance = createInstance()
  void instance.use(initReactI18next).init({
    resources,
    lng: language,
    supportedLngs: ['en', 'uk', 'ru'],
    fallbackLng: 'en',
    keySeparator: false,
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  return instance
}
export const i18n = createAppI18n()
function syncLanguage(language: string) {
  if (!isLanguage(language)) return
  document.documentElement.lang = language
  try {
    localStorage.setItem(languageStorageKey, language)
  } catch {
    /* In-memory language still works. */
  }
}
i18n.on('languageChanged', syncLanguage)
syncLanguage(i18n.language)
