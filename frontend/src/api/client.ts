const BASE = '/api'

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error ?? res.statusText)
  return data as T
}

export const api = {
  getDrops: () => request<{ drops: import('../types').Drop[] }>('/drops'),
  createDrop: (body: { name: string; priceCents: number; totalStock: number; startsAt?: string; endsAt?: string }) =>
    request<{ drop: import('../types').Drop }>('/drops', { method: 'POST', body: JSON.stringify(body) }),
  getOrCreateUser: (username: string) =>
    request<{ user: import('../types').User }>('/users/get-or-create', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),
  reserve: (dropId: number, userId: number) =>
    request<{ reservation: import('../types').Reservation; newStock: number }>(
      `/drops/${dropId}/reserve`,
      { method: 'POST', body: JSON.stringify({ userId }) }
    ),
  purchase: (dropId: number, userId: number) =>
    request<{ purchase: unknown; newStock: number; purchaser: import('../types').User }>(
      `/drops/${dropId}/purchase`,
      { method: 'POST', body: JSON.stringify({ userId }) }
    ),
}
