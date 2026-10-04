import {
  ArrowRight,
  Check,
  FileText,
  FolderOpen,
  Layers,
  Wallet,
  ArrowLeftRight,
} from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
export function OverviewPage() {
  const { t } = useTranslation()
  return (
    <div className="page">
      <div className="page-intro">
        <p className="eyebrow">{t('home.eyebrow')}</p>
        <h1>{t('home.title')}</h1>
        <p className="intro-copy">{t('home.subtitle')}</p>
      </div>
      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <span className="pill">
            <Check size={14} aria-hidden="true" />
            {t('home.badge')}
          </span>
          <h2 id="welcome-title">{t('home.cardTitle')}</h2>
          <p>{t('home.cardBody')}</p>
          <Button asChild>
            <Link to="/connection">
              {t('home.action')}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="empty-preview">
          <div className="portfolio-art" aria-hidden="true">
            <div className="art-card back">
              <Layers size={21} />
            </div>
            <div className="art-card front">
              <FolderOpen size={31} />
              <span />
              <span />
            </div>
          </div>
          <strong>{t('home.empty')}</strong>
          <p>{t('home.emptyNote')}</p>
        </div>
      </section>
      <section className="feature-section" aria-labelledby="features-title">
        <h2 className="eyebrow" id="features-title">
          {t('home.details')}
        </h2>
        <div className="feature-grid">
          {(
            [
              [Wallet, 'portfolios'],
              [ArrowLeftRight, 'trades'],
              [FileText, 'reports'],
            ] as const
          ).map(([Icon, key], index) => (
            <article className="feature-card" key={key}>
              <div className="feature-heading">
                <Icon size={22} aria-hidden="true" />
                <span>0{index + 1}</span>
              </div>
              <h3>{t('home.' + key + 'Title')}</h3>
              <p>{t('home.' + key + 'Body')}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="roadmap" aria-labelledby="roadmap-title">
        <div className="section-heading">
          <div>
            <h2 id="roadmap-title">{t('home.roadmap')}</h2>
            <p>{t('home.roadmapNote')}</p>
          </div>
          <span className="stage-count">
            01 <span>/ 04</span>
          </span>
        </div>
        <ol className="steps">
          {([1, 2, 3, 4] as const).map((step) => (
            <li key={step}>
              <span
                className={'step-number ' + (step === 1 ? 'completed' : '')}
                aria-hidden="true"
              >
                {step === 1 ? <Check size={16} /> : '0' + step}
              </span>
              <div>
                <h3>{t('home.step' + step)}</h3>
                <p>{t('home.step' + step + 'Body')}</p>
              </div>
              {step < 3 && (
                <span className={'step-label ' + (step === 1 ? 'ready' : '')}>
                  {t(step === 1 ? 'home.ready' : 'home.next')}
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
