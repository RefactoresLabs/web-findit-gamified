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

  it('redireciona para / quando acessa /negociacoes sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/negociacoes')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redireciona para / quando acessa /negociacao/1 sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/negociacao/1')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redireciona para / quando acessa /selecionar-item sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/selecionar-item')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redireciona para / quando acessa /negociacao/1/ativar-codigo sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/negociacao/1/ativar-codigo')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('redireciona para / quando acessa /negociacao/1/codigo-ativado sem token', async () => {
    const router = await createRouterInstance()
    await router.push('/negociacao/1/codigo-ativado')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('permite acesso a /negociacoes com token válido', async () => {
    const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
    localStorage.setItem('auth_token', token)
    const router = await createRouterInstance()
    await router.push('/negociacoes')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/negociacoes')
    expect(router.currentRoute.value.name).toBe('negociacoes')
  })

  it('permite acesso a /negociacao/:id com token válido', async () => {
    const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
    localStorage.setItem('auth_token', token)
    const router = await createRouterInstance()
    await router.push('/negociacao/5')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/negociacao/5')
    expect(router.currentRoute.value.params.id).toBe('5')
  })

  it('permite acesso a /selecionar-item com token válido', async () => {
    const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
    localStorage.setItem('auth_token', token)
    const router = await createRouterInstance()
    await router.push('/selecionar-item')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/selecionar-item')
  })

  it('permite acesso a /negociacao/:id/ativar-codigo com token válido', async () => {
    const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
    localStorage.setItem('auth_token', token)
    const router = await createRouterInstance()
    await router.push('/negociacao/5/ativar-codigo')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/negociacao/5/ativar-codigo')
  })

  it('permite acesso a /negociacao/:id/codigo-ativado com token válido', async () => {
    const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
    localStorage.setItem('auth_token', token)
    const router = await createRouterInstance()
    await router.push('/negociacao/5/codigo-ativado')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/negociacao/5/codigo-ativado')
  })
})
