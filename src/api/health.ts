export type HealthStatus = 'healthy' | 'unavailable'
export type HealthResult = { api: HealthStatus; database: HealthStatus }

export async function checkHealth(signal?: AbortSignal): Promise<HealthResult> {
  const bounded = AbortSignal.any([
    AbortSignal.timeout(5000),
    ...(signal ? [signal] : []),
  ])
  const read = async (path: string): Promise<HealthStatus> => {
    try {
      const response = await fetch(path, {
        signal: bounded,
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        headers: { Accept: 'text/plain' },
      })
      return response.ok && (await response.text()).trim() === 'Healthy'
        ? 'healthy'
        : 'unavailable'
    } catch {
      return 'unavailable'
    }
  }
  const [api, database] = await Promise.all([
    read('/health/live'),
    read('/health'),
  ])
  return { api, database }
}
