import { describe, expect, it, vi } from 'vitest'
import { ApiError, getApiJson } from './client'

describe('read-only API client', () => {
  it('keeps same-origin credentials and exact decimal strings', async () => {
    const body = {
      lossUah: '-10000',
      totalTaxUah: '0.00',
      quantity: '0.1234567890123456789012345678',
    }
    const fetcher = vi.fn().mockResolvedValue(Response.json(body))
    vi.stubGlobal('fetch', fetcher)
    expect(await getApiJson('/api/reports/example')).toEqual(body)
    expect(fetcher).toHaveBeenCalledWith(
      '/api/reports/example',
      expect.objectContaining({
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
      }),
    )
  })

  it.each([
    'https://example.com/api/me',
    '//example.com/api/me',
    '/other',
    '/api/../secret',
    '/api/%2e%2e/secret',
    '/api/./me',
    '/api/bad%ZZ',
    '/api/me#fragment',
    '/api/\\other',
  ])('rejects paths outside the API boundary: %s', async (path) => {
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    await expect(getApiJson(path)).rejects.toThrow('same-origin')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it.each([401, 403, 409, 500])(
    'retains status %s and machine code, not server details',
    async (status) => {
      vi.stubGlobal(
        'fetch',
        vi
          .fn()
          .mockResolvedValue(
            Response.json(
              { code: 'ExampleCode', detail: 'Sensitive server diagnostic' },
              { status },
            ),
          ),
      )
      await expect(getApiJson('/api/example')).rejects.toMatchObject({
        name: 'ApiError',
        status,
        code: 'ExampleCode',
        message: 'The API request failed.',
      })
    },
  )

  it('handles non-JSON failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response('Gateway failed', { status: 502 })),
    )
    await expect(getApiJson('/api/example')).rejects.toEqual(new ApiError(502))
  })
})
