import { describe, expect, it, vi } from 'vitest'
import {
  fromApiLanguage,
  initialLanguage,
  languages,
  languageStorageKey,
  toApiLanguage,
} from './languages'
import { resources } from './resources'

describe('supported languages', () => {
  it.each(languages)(
    'maps $code explicitly to the backend enum and back',
    (language) => {
      expect(toApiLanguage(language.code)).toBe(language.apiValue)
      expect(fromApiLanguage(language.apiValue)).toBe(language.code)
    },
  )
  it('does not silently reinterpret unknown backend values', () => {
    expect(fromApiLanguage('uk')).toBeUndefined()
    expect(fromApiLanguage(null)).toBeUndefined()
  })
  it('has a nonempty translation for every English key in every language', () => {
    for (const language of languages) {
      const translation = resources[language.code].translation
      expect(Object.keys(translation).sort()).toEqual(
        Object.keys(resources.en.translation).sort(),
      )
      expect(
        Object.values(translation).every((value) => value.trim().length > 0),
      ).toBe(true)
    }
  })
  it('prefers the valid saved choice', () => {
    localStorage.setItem(languageStorageKey, 'ru')
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('uk-UA')
    expect(initialLanguage()).toBe('ru')
  })
  it('uses the browser language when the saved choice is unsupported', () => {
    localStorage.setItem(languageStorageKey, 'unsupported')
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('uk-UA')
    expect(initialLanguage()).toBe('uk')
  })
  it('falls back to English for an unsupported browser locale', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    expect(initialLanguage()).toBe('en')
  })
  it('works when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('ru-RU')
    expect(initialLanguage()).toBe('ru')
  })
})
