import { useEffect, useRef } from 'react'
import {
  Activity,
  ArrowUpRight,
  ChartNoAxesCombined,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  Wallet,
} from 'lucide-react'
import { NavLink, Outlet, Route, Routes, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LanguagePicker } from '../components/language-picker'
import { OverviewPage } from '../pages/overview'
import { ConnectionPage } from '../pages/connection'
import { NotFoundPage } from '../pages/not-found'
function Layout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const pageKey =
    pathname === '/'
      ? 'nav.overview'
      : pathname === '/connection'
        ? 'nav.system'
        : 'notFound.title'
  useEffect(() => {
    document.title = t(pageKey) + ' · ZiApp'
  }, [t, pageKey])
  useEffect(() => {
    if (previousPath.current !== pathname)
      document.getElementById('main-content')?.focus()
    previousPath.current = pathname
  }, [pathname])
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {t('common.skip')}
      </a>
      <aside className="sidebar">
        <NavLink to="/" className="brand" aria-label="ZiApp">
          <span className="brand-mark" aria-hidden="true">
            Z<span>i</span>
          </span>
          <span>
            <strong>
              ZiApp<span className="brand-dot">.</span>
            </strong>
            <small>{t('brand.subtitle')}</small>
          </span>
        </NavLink>
        <nav aria-label={t('nav.label')}>
          <p className="nav-caption">{t('nav.workspace')}</p>
          <NavLink to="/" end className="nav-item">
            <LayoutDashboard size={19} aria-hidden="true" />
            {t('nav.overview')}
          </NavLink>
          <NavLink to="/connection" className="nav-item">
            <Activity size={19} aria-hidden="true" />
            {t('nav.system')}
          </NavLink>
        </nav>
        <div className="up-next">
          <p className="nav-caption">{t('nav.upNext')}</p>
          {(
            [
              [Wallet, 'nav.portfolios'],
              [ChartNoAxesCombined, 'nav.trades'],
              [FileText, 'nav.reports'],
            ] as const
          ).map(([Icon, key]) => (
            <div className="future-item" key={key}>
              <Icon size={18} aria-hidden="true" />
              <span>{t(key)}</span>
              <small>{t('nav.soon')}</small>
            </div>
          ))}
        </div>
        <div className="sidebar-note">
          <LockKeyhole size={20} aria-hidden="true" />
          <strong>{t('nav.note')}</strong>
          <p>{t('nav.noteBody')}</p>
        </div>
        <div className="sidebar-bottom">
          ZI / 01 <ArrowUpRight size={16} aria-hidden="true" />
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="breadcrumb">
            {t('brand.subtitle')} <span>/</span> <strong>{t(pageKey)}</strong>
          </span>
          <LanguagePicker />
        </header>
        <main id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <footer>
          <span className="preview-dot" aria-hidden="true" />
          {t('common.preview')}
          <span className="footer-note">{t('common.footer')}</span>
        </footer>
      </div>
    </div>
  )
}
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<OverviewPage />} />
        <Route path="connection" element={<ConnectionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
