import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { App } from './app'
import { createAppI18n } from '../i18n'
import { languages, type Language } from '../i18n/languages'
import { resources } from '../i18n/resources'

function renderApp(path = '/', language: Language = 'en') {
  return render(
    <I18nextProvider i18n={createAppI18n(language)}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </I18nextProvider>,
  )
}

describe('app foundation', () => {
  it.each(languages)(
    'renders a translated overview in $code without loading investments',
    (language) => {
      const fetcher = vi.fn()
      vi.stubGlobal('fetch', fetcher)
      renderApp('/', language.code)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        resources[language.code].translation['home.title'],
      )
      expect(
        screen.getByText(resources[language.code].translation['common.footer']),
      ).toBeVisible()
      expect(fetcher).not.toHaveBeenCalled()
    },
  )
  it('switches languages without losing the current route', async () => {
    renderApp('/connection')
    await userEvent.selectOptions(screen.getByRole('combobox'), 'uk')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      resources.uk.translation['system.title'],
    )
    await userEvent.selectOptions(screen.getByRole('combobox'), 'ru')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      resources.ru.translation['system.title'],
    )
  })
  it('provides a route back from an unknown page', async () => {
    renderApp('/unknown')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'This page is not here yet.',
    )
    await userEvent.click(
      screen.getByRole('link', { name: 'Back to overview' }),
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Clarity for every investment.',
    )
    expect(screen.getByRole('main')).toHaveFocus()
  })
  it('starts unchecked, disables repeated checks while loading and reports success', async () => {
    let finish: (() => void) | undefined
    const gate = new Promise<void>((resolve) => {
      finish = resolve
    })
    const fetcher = vi.fn(async () => {
      await gate
      return new Response('Healthy')
    })
    vi.stubGlobal('fetch', fetcher)
    renderApp('/connection')
    expect(fetcher).not.toHaveBeenCalled()
    expect(screen.getAllByText('Not checked')).toHaveLength(2)
    await userEvent.click(
      screen.getByRole('button', { name: 'Check connection' }),
    )
    expect(screen.getByRole('button', { name: 'Checking…' })).toBeDisabled()
    await act(async () => {
      finish?.()
    })
    expect(screen.getByRole('status')).toHaveTextContent('Both checks passed')
    expect(screen.getAllByText('Available')).toHaveLength(2)
  })
  it('shows an offline state and can retry successfully', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('offline'))
    vi.stubGlobal('fetch', fetcher)
    renderApp('/connection')
    await userEvent.click(
      screen.getByRole('button', { name: 'Check connection' }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent(
      'The API could not be reached',
    )
    fetcher.mockImplementation(async () => new Response('Healthy'))
    await userEvent.click(screen.getByRole('button', { name: 'Check again' }))
    expect(screen.getByRole('status')).toHaveTextContent('Both checks passed')
  })
  it('distinguishes database failure from API liveness', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async (path: string) =>
          new Response(path === '/health/live' ? 'Healthy' : 'Unhealthy', {
            status: path === '/health/live' ? 200 : 503,
          }),
      ),
    )
    renderApp('/connection')
    await userEvent.click(
      screen.getByRole('button', { name: 'Check connection' }),
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'database readiness failed',
    )
  })
  it('cancels checks when leaving the page', async () => {
    const signals: AbortSignal[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn((_path: string, init: RequestInit) => {
        signals.push(init.signal!)
        return new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          )
        })
      }),
    )
    const view = renderApp('/connection')
    await userEvent.click(
      screen.getByRole('button', { name: 'Check connection' }),
    )
    view.unmount()
    expect(signals).toHaveLength(2)
    expect(signals.every((signal) => signal.aborted)).toBe(true)
  })
})
