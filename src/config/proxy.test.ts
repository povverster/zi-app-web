import { describe, expect, it } from 'vitest'
import { createApiProxy } from './proxy'

describe('same-origin development proxy', () => {
  it('proxies only API and health boundaries without rewrites or insecure TLS', () => {
    const config = createApiProxy('http://localhost:5050')
    const patterns = Object.keys(config).map((key) => new RegExp(key))
    for (const path of ['/api', '/api/auth/me', '/health', '/health/live']) {
      expect(patterns.some((pattern) => pattern.test(path))).toBe(true)
    }
    for (const path of [
      '/',
      '/connection',
      '/apiary',
      '/healthy',
      '/src/main.tsx',
    ]) {
      expect(patterns.some((pattern) => pattern.test(path))).toBe(false)
    }
    expect(Object.values(config)[0]).toMatchObject({
      target: 'http://localhost:5050',
      secure: true,
    })
    expect(Object.values(config)[0]).not.toHaveProperty('rewrite')
  })
  it.each([
    'file:///tmp/api',
    'http://user:secret@localhost:5050',
    'https://example.com/api',
    'https://example.com?x=1',
    'https://example.com#fragment',
    'not a URL',
  ])('rejects an invalid origin: %s', (target) => {
    expect(() => createApiProxy(target)).toThrow()
  })
})
