import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isLanguage, languages } from '../i18n/languages'
export function LanguagePicker() {
  const { t, i18n } = useTranslation()
  return (
    <div className="language-picker">
      <Languages size={17} aria-hidden="true" />
      <label className="sr-only" htmlFor="language">
        {t('common.language')}
      </label>
      <select
        id="language"
        value={i18n.resolvedLanguage ?? 'en'}
        onChange={(event) => {
          if (isLanguage(event.target.value))
            void i18n.changeLanguage(event.target.value)
        }}
      >
        {languages.map(({ code, label }) => (
          <option key={code} value={code} lang={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
