import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory, RouterLink } from 'vue-router'
import type { ComponentPublicInstance } from 'vue'

type LoginVM = ComponentPublicInstance & {
  email: string
  password: string
  showPassword: boolean
  isLoading: boolean
  rememberMe: boolean
  errorMessage: string
}

function createJwtToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.fakesignature`
}

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/explorar', component: { template: '<div />' } },
  ],
})

describe('LoginView.vue', () => {
  let wrapper: VueWrapper
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    localStorage.removeItem('auth_token')
    fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    vi.resetModules()

    const module = await import('@/views/LoginView.vue')
    wrapper = mount(module.default, {
      global: { plugins: [mockRouter] },
    })
    await mockRouter.push('/')
    await mockRouter.isReady()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Renderização
  it('renderiza título e subtítulo corretamente', () => {
    expect(wrapper.find('h1').text()).toBe('Bem-vindo de volta')
    expect(wrapper.find('.form-header p').text()).toBe('Entre com sua conta universitária para continuar')
  })

  it('renderiza todos os inputs', () => {
    expect(wrapper.find('[data-testid="input-email"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-password"]').exists()).toBe(true)
  })

  // Inputs
  it('atualiza os valores via v-model', async () => {
    await wrapper.find('[data-testid="input-email"]').setValue('teste@undb.edu.br')
    await wrapper.find('[data-testid="input-password"]').setValue('senha123')

    const vm = wrapper.vm as LoginVM
    expect(vm.email).toBe('teste@undb.edu.br')
    expect(vm.password).toBe('senha123')
  })

  // Toggle senha
  it('toggle de senha funciona corretamente', async () => {
    const toggle = wrapper.find('[data-testid="toggle-password"]')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('password')

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('text')

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('password')
  })

  // Login com sucesso
  it('login sucesso → salva token e redireciona para /explorar', async () => {
    const token = createJwtToken({ user_id: 1, email: 'test@undb.edu.br' })
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token }),
    })

    await wrapper.find('[data-testid="input-email"]').setValue('test@undb.edu.br')
    await wrapper.find('[data-testid="input-password"]').setValue('senha123')
    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBe(token)
    })

    expect(mockRouter.currentRoute.value.path).toBe('/explorar')
  })

  // Login com erro
  it('login falha → mostra mensagem de erro', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS_ERROR' }),
    })

    await wrapper.find('[data-testid="input-email"]').setValue('wrong@email.com')
    await wrapper.find('[data-testid="input-password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect((wrapper.vm as LoginVM).isLoading).toBe(false)
    })

    expect((wrapper.vm as LoginVM).errorMessage).toBeTruthy()
    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
  })

  // Loading state
  it('ativa loading ao submeter formulário', async () => {
    fetchSpy.mockReturnValue(new Promise(() => {}))

    await wrapper.find('form').trigger('submit')
    expect((wrapper.vm as LoginVM).isLoading).toBe(true)
  })

  it('botão fica desabilitado durante loading', async () => {
    fetchSpy.mockReturnValue(new Promise(() => {}))

    await wrapper.find('form').trigger('submit')
    const btn = wrapper.find('[data-testid="login-button"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  // Link
  it('renderiza link para cadastro corretamente', () => {
    const link = wrapper.findComponent(RouterLink)
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Criar conta gratuita')
    expect(link.props('to')).toBe('/register')
  })

  // Estado inicial
  it('estado inicial está correto', () => {
    const vm = wrapper.vm as LoginVM
    expect(vm.email).toBe('')
    expect(vm.password).toBe('')
    expect(vm.showPassword).toBe(false)
    expect(vm.isLoading).toBe(false)
    expect(vm.errorMessage).toBe('')
  })
})
