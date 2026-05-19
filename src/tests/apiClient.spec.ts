import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const BASE_URL = 'http://127.0.0.1:10000'

function createMockStorage(): Storage {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
}

describe('API Client: token management', () => {
  let mockStorage: Storage

  beforeEach(() => {
    mockStorage = createMockStorage()
    vi.stubGlobal('localStorage', mockStorage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('setAuthToken salva token no localStorage', async () => {
    const { setAuthToken } = await import('@/services/api')
    setAuthToken('abc123')
    expect(mockStorage.getItem('auth_token')).toBe('abc123')
  })

  it('getAuthToken retorna token do localStorage', async () => {
    const { getAuthToken } = await import('@/services/api')
    mockStorage.setItem('auth_token', 'xyz789')
    expect(getAuthToken()).toBe('xyz789')
  })

  it('getAuthToken retorna null quando não há token', async () => {
    const { getAuthToken } = await import('@/services/api')
    expect(getAuthToken()).toBeNull()
  })

  it('clearAuthToken remove token do localStorage', async () => {
    const { clearAuthToken } = await import('@/services/api')
    mockStorage.setItem('auth_token', 'toremove')
    clearAuthToken()
    expect(mockStorage.getItem('auth_token')).toBeNull()
  })
})

describe('API Client: requests', () => {
  let fetchSpy: ReturnType<typeof vi.fn>
  let mockStorage: Storage

  beforeEach(() => {
    mockStorage = createMockStorage()
    vi.stubGlobal('localStorage', mockStorage)
    fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' }),
    })
    vi.stubGlobal('fetch', fetchSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('faz request com baseURL correto', async () => {
    const { apiClient } = await import('@/services/api')
    await apiClient.get('/lost-items')
    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE_URL}/lost-items`,
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('injeta Authorization header quando token existe', async () => {
    const { apiClient, setAuthToken } = await import('@/services/api')
    setAuthToken('mytoken')
    await apiClient.get('/lost-items')
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mytoken',
        }),
      }),
    )
  })

  it('não injeta Authorization header quando sem token', async () => {
  const { apiClient } = await import('@/services/api')

  await apiClient.get('/lost-items')

  const request = fetchSpy.mock.calls[0]

  expect(request).toBeDefined()

  const callHeaders = (request![1] as RequestInit).headers as Record<string, string>

  expect(callHeaders.Authorization).toBeUndefined()
})
  it('POST envia body como JSON', async () => {
    const { apiClient } = await import('@/services/api')
    const body = { name: 'test', email: 'a@b.com' }
    await apiClient.post('/users', body)
    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE_URL}/users`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('retorna dados JSON da resposta', async () => {
    const { apiClient } = await import('@/services/api')
    const result = await apiClient.get('/lost-items')
    expect(result).toEqual({ data: 'test' })
  })
})

describe('API Client: error handling', () => {
  let fetchSpy: ReturnType<typeof vi.fn>
  let mockStorage: Storage

  beforeEach(() => {
    mockStorage = createMockStorage()
    vi.stubGlobal('localStorage', mockStorage)
    fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('lança erro com body da resposta quando status não-ok', async () => {
    const { apiClient } = await import('@/services/api')
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Campo vazio', code: 'EMPTY_FIELD_ERROR' }),
    })

    await expect(apiClient.get('/lost-items')).rejects.toMatchObject({
      status: 400,
      message: 'Campo vazio',
      code: 'EMPTY_FIELD_ERROR',
    })
  })

  it('limpa token e lança erro 401', async () => {
    const { apiClient, setAuthToken, getAuthToken } = await import('@/services/api')
    setAuthToken('expired')
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS_ERROR' }),
    })

    await expect(apiClient.get('/lost-items')).rejects.toMatchObject({
      status: 401,
    })
    expect(getAuthToken()).toBeNull()
  })
})
