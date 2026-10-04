import { describe, expect, it, vi } from 'vitest'
import { checkHealth } from './health'

describe('connection checks', () => {
  it('checks liveness and readiness with credentials and a bounded signal', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(' Healthy \n'))
    // Each request must get its own readable response body.
    fetcher.mockImplementation(async () => new Response(' Healthy \n'))
    vi.stubGlobal('fetch', fetcher)
    expect(await checkHealth()).toEqual({ api: 'healthy', database: 'healthy' })
    expect(fetcher.mock.calls.map(([path]) => path)).toEqual([
      '/health/live',
      '/health',
    ])
    expect(fetcher).toHaveBeenCalledWith(
      '/health',
      expect.objectContaining({
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it.each([
    [503, 'Unhealthy'],
    [200, '<html>SPA fallback</html>'],
    [200, 'Degraded'],
  ])(
    'does not treat status %s and body %s as readiness',
    async (status, body) => {
      vi.stubGlobal(
        'fetch',
        vi.fn(
          async (path: string) =>
            new Response(path === '/health/live' ? 'Healthy' : body, {
              status: path === '/health/live' ? 200 : status,
            }),
        ),
      )
      expect(await checkHealth()).toEqual({
        api: 'healthy',
        database: 'unavailable',
      })
    },
  )

  it('handles network errors without leaking raw error details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('private upstream details')),
    )
    expect(await checkHealth()).toEqual({
      api: 'unavailable',
      database: 'unavailable',
    })
  })

  it('propagates cancellation to both checks', async () => {
    const controller = new AbortController()
    controller.abort()
    const fetcher = vi.fn(async (_path: string, init: RequestInit) => {
      expect(init.signal?.aborted).toBe(true)
      throw new DOMException('Aborted', 'AbortError')
    })
    vi.stubGlobal('fetch', fetcher)
    expect(await checkHealth(controller.signal)).toEqual({
      api: 'unavailable',
      database: 'unavailable',
    })
  })
})
