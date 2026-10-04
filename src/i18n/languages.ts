export const languages = [
  { code: 'en', label: 'English', apiValue: 'English' },
  { code: 'uk', label: 'Українська', apiValue: 'Ukrainian' },
  { code: 'ru', label: 'Русский', apiValue: 'Russian' },
] as const
export type Language = (typeof languages)[number]['code']
export type ApiLanguage = (typeof languages)[number]['apiValue']
export const languageStorageKey = 'ziapp.language'
export const isLanguage = (value: unknown): value is Language =>
  languages.some((language) => language.code === value)
export function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(languageStorageKey)
    if (isLanguage(stored)) return stored
  } catch {
    /* Browsing with storage disabled must still work. */
  }
  const browserLanguage = navigator.language.toLowerCase().split('-')[0]
  return isLanguage(browserLanguage) ? browserLanguage : 'en'
}
export function toApiLanguage(language: Language): ApiLanguage {
  return languages.find((item) => item.code === language)!.apiValue
}
export function fromApiLanguage(language: unknown): Language | undefined {
  return languages.find((item) => item.apiValue === language)?.code
}
