import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Register from '@/views/RegisterUserView.vue'

// Stub do router-link
const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

function mountComponent(): VueWrapper {
  return mount(Register, {
    global: {
      components: { RouterLink: RouterLinkStub },
    },
  })
}

describe('RegisterView.vue', () => {
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
    expect(wrapper.find('h1').text()).toBe('Criar conta')
    expect(wrapper.find('.form-header p').text()).toBe('Preencha os dados abaixo')
  })

  it('renderiza todos os inputs', () => {
    expect(wrapper.find('[data-testid="input-name"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-email"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-phone"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-password"]').exists()).toBe(true)
  })

  // ✍️ Inputs
  it('atualiza os valores via v-model', async () => {
    await wrapper.find('[data-testid="input-name"]').setValue('Chris')
    await wrapper.find('[data-testid="input-email"]').setValue('teste@email.com')
    await wrapper.find('[data-testid="input-phone"]').setValue('999999999')
    await wrapper.find('[data-testid="input-password"]').setValue('123456')

    const vm = wrapper.vm as any

    expect(vm.name).toBe('Chris')
    expect(vm.email).toBe('teste@email.com')
    expect(vm.phone).toBe('999999999')
    expect(vm.password).toBe('123456')
  })

  // 🔍 Tipos dos inputs
  it('inputs possuem tipos corretos', () => {
    expect(wrapper.find('[data-testid="input-name"]').attributes('type')).toBe('text')
    expect(wrapper.find('[data-testid="input-email"]').attributes('type')).toBe('email')
    expect(wrapper.find('[data-testid="input-phone"]').attributes('type')).toBe('tel')
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

  // 🔘 Submit
  it('ativa loading ao submeter formulário', async () => {
    await wrapper.find('form').trigger('submit')

    expect((wrapper.vm as any).isLoading).toBe(true)
  })

  it('botão fica desabilitado durante loading', async () => {
    await wrapper.find('form').trigger('submit')

    const btn = wrapper.find('[data-testid="register-button"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('texto do botão muda para "Carregando..."', async () => {
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('[data-testid="register-button"]').text()).toBe('Carregando...')
  })

  it('após 1500ms loading volta ao normal', async () => {
    await wrapper.find('form').trigger('submit')

    vi.advanceTimersByTime(1500)
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).isLoading).toBe(false)
    expect(wrapper.find('[data-testid="register-button"]').text()).toBe('Cadastrar')
  })

  // 🔗 Link
  it('renderiza link para login corretamente', () => {
    const link = wrapper.findComponent(RouterLinkStub)

    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Fazer login')
    expect(link.props('to')).toBe('/')
  })

  // 🧠 Estado inicial
  it('estado inicial está correto', () => {
    const vm = wrapper.vm as any

    expect(vm.name).toBe('')
    expect(vm.email).toBe('')
    expect(vm.phone).toBe('')
    expect(vm.password).toBe('')
    expect(vm.showPassword).toBe(false)
    expect(vm.isLoading).toBe(false)
  })
})