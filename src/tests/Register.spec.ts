import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

type RegisterVM = ComponentPublicInstance & {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  showPassword: boolean
  isLoading: boolean
  errorMessage: string
  successMessage: string
}

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/register', component: { template: '<div />' } },
  ],
})

describe('RegisterView.vue', () => {
  let wrapper: VueWrapper<RegisterVM>
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    localStorage.removeItem('auth_token')
    fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    vi.resetModules()

    const module = await import('@/views/RegisterUserView.vue')
    wrapper = mount(module.default, {
      global: {
        plugins: [mockRouter],
        components: { RouterLink: RouterLinkStub },
      },
    }) as VueWrapper<RegisterVM>
    await mockRouter.push('/register')
    await mockRouter.isReady()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Renderização
  it('renderiza título e subtítulo corretamente', () => {
    expect(wrapper.find('h1').text()).toBe('Criar conta')
    expect(wrapper.find('.form-header p').text()).toBe('Preencha os dados abaixo')
  })

  it('renderiza todos os inputs incluindo confirmar senha', () => {
    expect(wrapper.find('[data-testid="input-name"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-email"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-phone"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-password"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-confirm-password"]').exists()).toBe(true)
  })

  // Inputs
  it('atualiza os valores via v-model', async () => {
    await wrapper.find('[data-testid="input-name"]').setValue('Chris')
    await wrapper.find('[data-testid="input-email"]').setValue('teste@email.com')
    await wrapper.find('[data-testid="input-phone"]').setValue('999999999')
    await wrapper.find('[data-testid="input-password"]').setValue('123456')
    await wrapper.find('[data-testid="input-confirm-password"]').setValue('123456')

    const vm = wrapper.vm
    expect(vm.name).toBe('Chris')
    expect(vm.email).toBe('teste@email.com')
    expect(vm.phone).toBe('999999999')
    expect(vm.password).toBe('123456')
    expect(vm.confirmPassword).toBe('123456')
  })

  // Toggle senha
  it('toggle de senha funciona corretamente', async () => {
    const toggle = wrapper.find('[data-testid="toggle-password"]')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('password')

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('text')
  })

  // Registro com sucesso
  it('registro sucesso → mostra mensagem de sucesso', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ message: 'Conta de usuário registrada com sucesso' }),
    })

    await wrapper.find('[data-testid="input-name"]').setValue('Maria')
    await wrapper.find('[data-testid="input-email"]').setValue('maria@undb.edu.br')
    await wrapper.find('[data-testid="input-phone"]').setValue('99999')
    await wrapper.find('[data-testid="input-password"]').setValue('123')
    await wrapper.find('[data-testid="input-confirm-password"]').setValue('123')
    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.vm.isLoading).toBe(false)
    })

    expect(wrapper.vm.successMessage).toBeTruthy()
    expect(wrapper.find('[data-testid="success-message"]').exists()).toBe(true)
  })

  it('registro sucesso → envia confirm_password no body', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ message: 'Conta de usuário registrada com sucesso' }),
    })

    await wrapper.find('[data-testid="input-name"]').setValue('Maria')
    await wrapper.find('[data-testid="input-email"]').setValue('maria@undb.edu.br')
    await wrapper.find('[data-testid="input-phone"]').setValue('99999')
    await wrapper.find('[data-testid="input-password"]').setValue('123')
    await wrapper.find('[data-testid="input-confirm-password"]').setValue('123')
    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.vm.isLoading).toBe(false)
    })

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body)
    expect(body.confirm_password).toBe('123')
  })

  // Registro com erro
  it('registro falha → mostra mensagem de erro', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ message: 'Email already exists', code: 'EMAIL_ALREADY_EXISTS_ERROR' }),
    })

    await wrapper.find('[data-testid="input-name"]').setValue('Maria')
    await wrapper.find('[data-testid="input-email"]').setValue('maria@undb.edu.br')
    await wrapper.find('[data-testid="input-phone"]').setValue('99999')
    await wrapper.find('[data-testid="input-password"]').setValue('123')
    await wrapper.find('[data-testid="input-confirm-password"]').setValue('123')
    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.vm.isLoading).toBe(false)
    })

    expect(wrapper.vm.errorMessage).toBeTruthy()
    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
  })

  // Loading
  it('ativa loading ao submeter formulário', async () => {
    fetchSpy.mockReturnValue(new Promise(() => {}))
    await wrapper.find('form').trigger('submit')
    expect(wrapper.vm.isLoading).toBe(true)
  })

  it('botão fica desabilitado durante loading', async () => {
    fetchSpy.mockReturnValue(new Promise(() => {}))
    await wrapper.find('form').trigger('submit')
    const btn = wrapper.find('[data-testid="register-button"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  // Link
  it('renderiza link para login corretamente', () => {
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Fazer login')
    expect(link.props('to')).toBe('/')
  })

  // Estado inicial
  it('estado inicial está correto', () => {
    const vm = wrapper.vm
    expect(vm.name).toBe('')
    expect(vm.email).toBe('')
    expect(vm.phone).toBe('')
    expect(vm.password).toBe('')
    expect(vm.confirmPassword).toBe('')
    expect(vm.showPassword).toBe(false)
    expect(vm.isLoading).toBe(false)
    expect(vm.errorMessage).toBe('')
    expect(vm.successMessage).toBe('')
  })
})
