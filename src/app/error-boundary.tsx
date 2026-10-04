import { Component, type ReactNode } from 'react'
import { i18n } from '../i18n'
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="page error-page" role="alert">
        <h1>{i18n.t('error.title')}</h1>
        <p>{i18n.t('error.body')}</p>
        <button type="button" onClick={() => window.location.reload()}>
          {i18n.t('error.reload')}
        </button>
      </main>
    )
  }
}
