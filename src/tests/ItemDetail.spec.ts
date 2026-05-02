import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ItemDetailView from '@/views/ItemDetailView.vue'

// MOCK GLOBAL DO ROUTER
let mockId = 1

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: mockId },
  }),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

// MOCK SIDEBAR (evita erro)
vi.mock('@/components/layout/AppSidebar.vue', () => ({
  default: {
    template: '<div />',
  },
}))

describe('ItemDetailView', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar item perdido corretamente', async () => {
    mockId = 1 // MacBook (perdido)

    const wrapper = mount(ItemDetailView)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('MacBook Pro')
    expect(wrapper.text()).toContain('Biblioteca Central')
    expect(wrapper.text()).toContain('Perdido')
  })

  it('deve mostrar botão de confirmar entrega para item encontrado', async () => {
    mockId = 4 // Carteira (encontrado)

    const wrapper = mount(ItemDetailView)

    await new Promise(resolve => setTimeout(resolve, 0))

    const button = wrapper.find('.confirm-btn')
    expect(button.exists()).toBe(true)
  })

  it('não deve mostrar botão para item perdido', async () => {
    mockId = 1 // perdido

    const wrapper = mount(ItemDetailView)

    await new Promise(resolve => setTimeout(resolve, 0))

    const button = wrapper.find('.confirm-btn')
    expect(button.exists()).toBe(false)
  })

  it('deve chamar alert ao clicar em confirmar entrega', async () => {
    mockId = 4 // encontrado

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const wrapper = mount(ItemDetailView)

    await new Promise(resolve => setTimeout(resolve, 0))

    const button = wrapper.find('.confirm-btn')
    await button.trigger('click')

    expect(alertMock).toHaveBeenCalled()
  })
})