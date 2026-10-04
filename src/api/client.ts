export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code?: string,
  ) {
    super('The API request failed.')
    this.name = 'ApiError'
  }
}

export async function getApiJson<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  // Keep future authenticated reads same-origin. Mutations/CSRF belong to the auth stage.
  if (
    !path.startsWith('/api/') ||
    /[\\#]/.test(path) ||
    path
      .split('?')[0]!
      .split('/')
      .some((part) => {
        try {
          return ['.', '..'].includes(decodeURIComponent(part))
        } catch {
          return true
        }
      })
  ) {
    throw new Error('Use a same-origin /api/ path.')
  }
  const response = await fetch(path, {
    credentials: 'same-origin',
    cache: 'no-store',
    redirect: 'error',
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    const problem: unknown = await response.json().catch(() => null)
    const code =
      problem &&
      typeof problem === 'object' &&
      'code' in problem &&
      typeof problem.code === 'string'
        ? problem.code
        : undefined
    throw new ApiError(response.status, code)
  }
  return (await response.json()) as T
}
