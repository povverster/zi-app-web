import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  Database,
  RefreshCw,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { checkHealth, type HealthResult } from '../api/health'
import { Button } from '../components/ui/button'
export function ConnectionPage() {
  const { t } = useTranslation()
  const [result, setResult] = useState<HealthResult | null>(null)
  const [checking, setChecking] = useState(false)
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => request.current?.abort(), [])
  async function check() {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setChecking(true)
    const next = await checkHealth(controller.signal)
    if (!controller.signal.aborted) {
      setResult(next)
      setChecking(false)
    }
  }
  const message = checking
    ? 'system.checking'
    : !result
      ? 'system.before'
      : result.api !== 'healthy'
        ? 'system.offline'
        : result.database !== 'healthy'
          ? 'system.dbOffline'
          : 'system.ok'
  return (
    <div className="page">
      <div className="page-intro">
        <p className="eyebrow">{t('system.eyebrow')}</p>
        <h1>{t('system.title')}</h1>
        <p className="intro-copy">{t('system.subtitle')}</p>
      </div>
      <div className="connection-controls">
        <Button onClick={() => void check()} disabled={checking}>
          <RefreshCw
            size={17}
            className={checking ? 'spin' : ''}
            aria-hidden="true"
          />
          {t(
            checking
              ? 'system.checking'
              : result
                ? 'system.retry'
                : 'system.action',
          )}
        </Button>
      </div>
      <div className="health-grid">
        {(
          [
            [Activity, 'api'],
            [Database, 'database'],
          ] as const
        ).map(([Icon, key]) => {
          const status = checking ? 'checking' : (result?.[key] ?? 'unchecked')
          return (
            <section
              className="health-card"
              key={key}
              aria-labelledby={key + '-title'}
            >
              <Icon size={26} aria-hidden="true" />
              <h2 id={key + '-title'}>{t('system.' + key)}</h2>
              <p>{t('system.' + key + 'Body')}</p>
              <span className={'health-badge ' + status}>
                {t('system.' + status)}
              </span>
            </section>
          )
        })}
      </div>
      <p className="connection-message" role="status" aria-live="polite">
        {t(message)}
      </p>
      <div className="info-grid">
        {(
          [
            [Terminal, 'local'],
            [ShieldCheck, 'limit'],
          ] as const
        ).map(([Icon, key]) => (
          <section className="info-card" key={key}>
            <Icon size={20} aria-hidden="true" />
            <h2>{t('system.' + key + 'Title')}</h2>
            <p>{t('system.' + key + 'Body')}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
