import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { resources } from '../../src/i18n/resources'
import { languages } from '../../src/i18n/languages'

test('language choice persists; all locales fit and pass automated accessibility checks', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  for (const language of languages) {
    const text = resources[language.code].translation
    await page.getByRole('combobox').selectOption(language.code)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      text['home.title'],
    )
    await expect(page.locator('html')).toHaveAttribute('lang', language.code)
    await page.reload()
    await expect(page.getByRole('combobox')).toHaveValue(language.code)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      text['home.title'],
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([])
    await page.screenshot({
      path: testInfo.outputPath('overview-' + language.code + '.png'),
      fullPage: true,
    })
  }
})

test('deep links reload; explicit checks use the real Vite proxy to the isolated stub', async ({
  page,
}, testInfo) => {
  await page.goto('/connection')
  await page.reload()
  await expect(page.getByText('Not checked', { exact: true })).toHaveCount(2)
  await page.getByRole('button', { name: 'Check connection' }).click()
  await expect(page.getByRole('status')).toContainText('Both checks passed')
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.screenshot({
    path: testInfo.outputPath('connection.png'),
    fullPage: true,
  })
})

test('connection failure, in-flight state and recovery are visible', async ({
  page,
}) => {
  let release: (() => void) | undefined
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/health{,/live}', async (route) => {
    await gate
    await route.fulfill({
      status: 503,
      contentType: 'text/plain',
      body: 'Unhealthy',
    })
  })
  await page.goto('/connection')
  await page.getByRole('button', { name: 'Check connection' }).click()
  await expect(page.getByRole('button', { name: 'Checking…' })).toBeDisabled()
  release?.()
  await expect(page.getByRole('status')).toContainText(
    'The API could not be reached',
  )
  await page.unroute('**/health{,/live}')
  await page.getByRole('button', { name: 'Check again' }).click()
  await expect(page.getByRole('status')).toContainText('Both checks passed')
})

test('keyboard skip link, route focus and unknown routes work', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.getByRole('link', { name: 'Connection', exact: true }).click()
  await expect(page.getByRole('main')).toBeFocused()
  await page.goto('/not-built')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'This page is not here yet.',
  )
  await page.getByRole('link', { name: 'Back to overview' }).click()
  await expect(page).toHaveURL('/')
})

test('proxy preserves HttpOnly cookie flags, request headers and decimal strings', async ({
  page,
  context,
}) => {
  await page.goto('/')
  const probe = () =>
    page.evaluate(async () => {
      const response = await fetch('/api/test-proxy', {
        credentials: 'same-origin',
        headers: { 'X-CSRF-TOKEN': 'test-only-token' },
      })
      return response.json() as Promise<{
        cookieReceived: boolean
        csrfReceived: boolean
        exactValue: string
      }>
    })
  expect((await probe()).cookieReceived).toBe(false)
  const result = await probe()
  expect(result.cookieReceived).toBe(true)
  expect(result.csrfReceived).toBe(true)
  expect(result.exactValue).toBe('-10000.000000000000000000000000001')
  expect(
    (await context.cookies()).find((cookie) => cookie.name === 'ziapp_test'),
  ).toMatchObject({
    httpOnly: true,
    sameSite: 'Lax',
  })
  expect(await page.evaluate(() => document.cookie)).not.toContain('ziapp_test')
})

test('all languages fit a 320px viewport on both pages', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  for (const path of ['/', '/connection']) {
    await page.goto(path)
    for (const language of languages) {
      await page.getByRole('combobox').selectOption(language.code)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true)
    }
  }
})
