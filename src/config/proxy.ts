import type { ProxyOptions } from 'vite'

export function createApiProxy(target: string): Record<string, ProxyOptions> {
  const url = new URL(target)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'API_PROXY_TARGET must be an HTTP(S) origin without credentials or a path.',
    )
  }
  const options: ProxyOptions = {
    target: url.origin,
    changeOrigin: true,
    // Preserve HTTPS certificate validation and HttpOnly/SameSite cookie flags.
    secure: true,
    timeout: 10_000,
    proxyTimeout: 10_000,
  }
  return { '^/api(?:/|$)': options, '^/health(?:/|$)': options }
}
