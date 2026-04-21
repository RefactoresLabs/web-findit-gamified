import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory, RouterLink } from 'vue-router'
import Login from '@/views/LoginView.vue'

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/explorar', component: { template: '<div />' } },
  ],
})

function mountComponent(): VueWrapper {
  return mount(Login, {
    global: {
      plugins: [mockRouter],
    },
  })
}

describe('LoginView.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mountComponent()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // 🧪 Renderização
  it('renderiza título e subtítulo corretamente', () => {
    expect(wrapper.find('h1').text()).toBe('Bem-vindo de volta')
    expect(wrapper.find('.form-header p').text()).toBe('Entre com sua conta universitária para continuar')
  })

  it('renderiza todos os inputs', () => {
    expect(wrapper.find('[data-testid="input-email"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-password"]').exists()).toBe(true)
  })

  // ✍️ Inputs
  it('atualiza os valores via v-model', async () => {
    await wrapper.find('[data-testid="input-email"]').setValue('teste@undb.edu.br')
    await wrapper.find('[data-testid="input-password"]').setValue('senha123')

    const vm = wrapper.vm as any

    expect(vm.email).toBe('teste@undb.edu.br')
    expect(vm.password).toBe('senha123')
  })

  // 🔍 Tipos dos inputs
  it('inputs possuem tipos corretos', () => {
    expect(wrapper.find('[data-testid="input-email"]').attributes('type')).toBe('email')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('password')
  })

  // 👁️ Toggle senha
  it('toggle de senha funciona corretamente', async () => {
    const toggle = wrapper.find('[data-testid="toggle-password"]')

    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('password')

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('text')

    await toggle.trigger('click')
    expect(wrapper.find('[data-testid="input-password"]').attributes('type')).toBe('password')
  })

  it('aria-label do toggle muda corretamente', async () => {
    const toggle = wrapper.find('[data-testid="toggle-password"]')

    expect(toggle.attributes('aria-label')).toBe('Mostrar senha')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-label')).toBe('Ocultar senha')
  })

  // ☑️ Checkbox lembrar-me
  it('checkbox lembrar-me atualiza rememberMe', async () => {
    const vm = wrapper.vm as any
    expect(vm.rememberMe).toBe(false)

    await wrapper.find('#remember-checkbox').setValue(true)
    expect(vm.rememberMe).toBe(true)
  })

  // 🔘 Submit
  it('ativa loading ao submeter formulário', async () => {
    await wrapper.find('form').trigger('submit')

    expect((wrapper.vm as any).isLoading).toBe(true)
  })

  it('botão fica desabilitado durante loading', async () => {
    await wrapper.find('form').trigger('submit')

    const btn = wrapper.find('[data-testid="login-button"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('spinner aparece durante loading', async () => {
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.btn-spinner').exists()).toBe(true)
    expect(wrapper.find('.btn-text').exists()).toBe(false)
  })

  it('após 1500ms loading volta ao normal', async () => {
    await wrapper.find('form').trigger('submit')

    vi.advanceTimersByTime(1500)
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).isLoading).toBe(false)
    expect(wrapper.find('.btn-text').exists()).toBe(true)
    expect(wrapper.find('.btn-spinner').exists()).toBe(false)
  })

  // 🔗 Link
  it('renderiza link para cadastro corretamente', () => {
    const link = wrapper.findComponent(RouterLink)

    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Criar conta gratuita')
    expect(link.props('to')).toBe('/register')
  })

  // 🧠 Estado inicial
  it('estado inicial está correto', () => {
    const vm = wrapper.vm as any

    expect(vm.email).toBe('')
    expect(vm.password).toBe('')
    expect(vm.showPassword).toBe(false)
    expect(vm.isLoading).toBe(false)
    expect(vm.rememberMe).toBe(false)
  })
})
