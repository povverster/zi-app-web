import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="page not-found">
      <p className="eyebrow">404</p>
      <h1>{t('notFound.title')}</h1>
      <p className="intro-copy">{t('notFound.body')}</p>
      <Button asChild>
        <Link to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          {t('common.back')}
        </Link>
      </Button>
    </div>
  )
}
