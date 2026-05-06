import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

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

function createJwtToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.fakesignature`
}

describe('useAuth', () => {
  let mockStorage: Storage
  let fetchSpy: ReturnType<typeof vi.fn>

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

  describe('estado inicial', () => {
    it('isAuthenticated false quando sem token', async () => {
      const { useAuth } = await import('@/composables/useAuth')
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(false)
    })

    it('isAuthenticated true quando token existe', async () => {
      const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
      mockStorage.setItem('auth_token', token)
      const { useAuth } = await import('@/composables/useAuth')
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(true)
    })

    it('userEmail extraído do JWT quando token existe', async () => {
      const token = createJwtToken({ user_id: 1, email: 'maria@undb.edu.br' })
      mockStorage.setItem('auth_token', token)
      const { useAuth } = await import('@/composables/useAuth')
      const { userEmail } = useAuth()
      expect(userEmail.value).toBe('maria@undb.edu.br')
    })

    it('userEmail null quando sem token', async () => {
      const { useAuth } = await import('@/composables/useAuth')
      const { userEmail } = useAuth()
      expect(userEmail.value).toBeNull()
    })

    it('userName extraído do JWT quando token existe', async () => {
      const token = createJwtToken({ user_id: 1, email: 'maria@undb.edu.br', name: 'Maria Silva' })
      mockStorage.setItem('auth_token', token)
      const { useAuth } = await import('@/composables/useAuth')
      const { userName } = useAuth()
      expect(userName.value).toBe('Maria Silva')
    })

    it('userName null quando sem token', async () => {
      const { useAuth } = await import('@/composables/useAuth')
      const { userName } = useAuth()
      expect(userName.value).toBeNull()
    })
  })

  describe('login', () => {
    it('login sucesso → salva token + atualiza estado', async () => {
      const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
      fetchSpy.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ token }),
      })

      const { useAuth } = await import('@/composables/useAuth')
      const { login, isAuthenticated, userEmail } = useAuth()

      await login('test@undb.edu.br', 'senha123')

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@undb.edu.br', password: 'senha123' }),
        }),
      )
      expect(mockStorage.getItem('auth_token')).toBe(token)
      expect(isAuthenticated.value).toBe(true)
      expect(userEmail.value).toBe('test@undb.edu.br')
    })

    it('login falha → lança erro com message da API', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS_ERROR' }),
      })

      const { useAuth } = await import('@/composables/useAuth')
      const { login, isAuthenticated } = useAuth()

      await expect(login('wrong@email.com', 'wrong')).rejects.toMatchObject({
        message: 'Invalid credentials',
      })
      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('register', () => {
    it('register sucesso → resolve sem erro', async () => {
      fetchSpy.mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ message: 'Conta de usuário registrada com sucesso' }),
      })

      const { useAuth } = await import('@/composables/useAuth')
      const { register } = useAuth()

      await expect(
        register({ name: 'Maria', email: 'maria@undb.edu.br', password: '123', confirm_password: '123', phone: '99999' }),
      ).resolves.not.toThrow()

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Maria',
            email: 'maria@undb.edu.br',
            password: '123',
            confirm_password: '123',
            phone: '99999',
          }),
        }),
      )
    })

    it('register falha → lança erro com message da API', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ message: 'Email already exists', code: 'EMAIL_ALREADY_EXISTS_ERROR' }),
      })

      const { useAuth } = await import('@/composables/useAuth')
      const { register } = useAuth()

      await expect(
        register({ name: 'Maria', email: 'maria@undb.edu.br', password: '123', confirm_password: '123', phone: '99999' }),
      ).rejects.toMatchObject({ message: 'Email already exists' })
    })
  })

  describe('logout', () => {
    it('logout limpa token + reseta estado', async () => {
      const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
      mockStorage.setItem('auth_token', token)

      const { useAuth } = await import('@/composables/useAuth')
      const { logout, isAuthenticated, userEmail } = useAuth()

      logout()

      expect(mockStorage.getItem('auth_token')).toBeNull()
      expect(isAuthenticated.value).toBe(false)
      expect(userEmail.value).toBeNull()
    })
  })
})
