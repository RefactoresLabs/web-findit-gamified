import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

function createJwtToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.fakesignature`
}

describe('Route Guard', () => {
  beforeEach(() => {
    localStorage.removeItem('auth_token')
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  async function createRouterInstance() {
    const { default: router } = await import('@/router/index')
    return router
  }

  it('redireciona para / quando acessa /explorar sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/explorar')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redireciona para / quando acessa /meus-itens sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/meus-itens')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redireciona para / quando acessa /registrar-item sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/registrar-item')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('permite acesso a / sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('permite acesso a /register sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/register')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/register')
  })

  it('permite acesso a /explorar com token válido', async () => {
    const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
    localStorage.setItem('auth_token', token)
    const router = await createRouterInstance()
    await router.push('/explorar')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/explorar')
  })
})
