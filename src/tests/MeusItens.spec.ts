import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import type { FeedItem } from '@/types/item'
import { ref } from 'vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const mockMyLostItems: FeedItem[] = [
  {
    id: 10,
    name: 'Meu Notebook',
    userName: 'André',
    categoryName: 'Material Escolar',
    locationName: 'Sala 206',
    imageUrl: 'http://example.com/notebook.jpg',
    type: 'perdido',
  },
]

const mockMyFoundItems: FeedItem[] = [
  {
    id: 20,
    name: 'Carteira encontrada',
    userName: 'André',
    categoryName: 'Acessório Pessoal',
    locationName: 'Recepção',
    imageUrl: 'http://example.com/carteira.jpg',
    type: 'encontrado',
  },
]

const mockFetchMyItems = vi.fn()
const mockLoading = ref(false)
const mockError = ref<string | null>(null)
const mockLostRef = ref<FeedItem[]>(mockMyLostItems)
const mockFoundRef = ref<FeedItem[]>(mockMyFoundItems)

vi.mock('@/composables/useMyItems', () => ({
  useMyItems: () => ({
    myLostItems: mockLostRef,
    myFoundItems: mockFoundRef,
    loading: mockLoading,
    error: mockError,
    fetchMyItems: mockFetchMyItems,
  }),
}))
 


describe('MeusItensView', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockLoading.value = false
    mockError.value = null
    mockLostRef.value = mockMyLostItems
    mockFoundRef.value = mockMyFoundItems

    const MeusItensView = (await import('@/views/MeusItensView.vue')).default
    wrapper = mount(MeusItensView, {
      global: {
        stubs: {
          AppSidebar: {
            template: '<div data-testid="sidebar"></div>',
          },
        },
      },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza título e subtítulo', () => {
    expect(wrapper.find('.page-title').text()).toBe('Meus Itens')
    expect(wrapper.find('.page-sub').text()).toContain('Gerencie')
  })

  it('renderiza sidebar', () => {
    expect(wrapper.find('[data-testid="sidebar"]').exists()).toBe(true)
  })

  it('chama fetchMyItems ao montar', () => {
    expect(mockFetchMyItems).toHaveBeenCalledOnce()
  })

  it('renderiza abas corretamente', () => {
    const tabs = wrapper.findAll('.tab')
    expect(tabs.length).toBe(2)
    expect(tabs[0]!.text()).toContain('Perdidos')
    expect(tabs[1]!.text()).toContain('Encontrados')
  })

  it('inicia com aba perdidos ativa', () => {
    expect(wrapper.find('.tab.active').text()).toContain('Perdidos')
  })

  it('mostra contagem nas abas', () => {
    const tabs = wrapper.findAll('.tab')
    expect(tabs[0]!.text()).toContain('1')
    expect(tabs[1]!.text()).toContain('1')
  })

  it('troca para encontrados ao clicar', async () => {
    await wrapper.findAll('.tab')[1]!.trigger('click')
    expect(wrapper.find('.tab.active').text()).toContain('Encontrados')
  })

  it('renderiza itens perdidos por padrão', () => {
    const items = wrapper.findAll('.item-card')
    expect(items.length).toBe(1)
  })

  it('renderiza itens encontrados ao trocar aba', async () => {
    await wrapper.findAll('.tab')[1]!.trigger('click')
    const items = wrapper.findAll('.item-card')
    expect(items.length).toBe(1)
  })

  it('mostra nome e localização do item', () => {
    const item = wrapper.find('.item-card')
    expect(item.text()).toContain('Meu Notebook')
    expect(item.text()).toContain('Sala 206')
  })

  it('mostra imagem quando existe', () => {
    expect(wrapper.find('.item-thumb img').exists()).toBe(true)
  })

  it('mostra badge "Perdido" por padrão', () => {
    expect(wrapper.find('.item-badge').text()).toBe('Perdido')
  })

  it('muda badge para "Encontrado"', async () => {
    await wrapper.findAll('.tab')[1]!.trigger('click')
    expect(wrapper.find('.item-badge').text()).toBe('Encontrado')
  })

  it('mostra estado vazio quando sem itens', async () => {
    mockLostRef.value = []
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('navega corretamente', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    vm.handleNavigate('explorar')
    expect(pushMock).toHaveBeenCalledWith({ name: 'explorar' })
  })

  it('não navega com rota inválida', () => {
    pushMock.mockClear()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    vm.handleNavigate('invalido')
    expect(pushMock).not.toHaveBeenCalled()
  })
})

describe('MeusItensView — loading state', () => {
  it('mostra indicador de loading', async () => {
    mockLoading.value = true
    mockLostRef.value = []
    mockFoundRef.value = []

    const MeusItensView = (await import('@/views/MeusItensView.vue')).default
    const wrapper = mount(MeusItensView, {
      global: {
        stubs: {
          AppSidebar: { template: '<div></div>' },
        },
      },
    })

    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true)
    expect(wrapper.find('.items-list').exists()).toBe(false)
  })
})

describe('MeusItensView — error state', () => {
  it('mostra mensagem de erro', async () => {
    mockLoading.value = false
    mockError.value = 'Conta de usuário não encontrada'
    mockLostRef.value = []
    mockFoundRef.value = []

    const MeusItensView = (await import('@/views/MeusItensView.vue')).default
    const wrapper = mount(MeusItensView, {
      global: {
        stubs: {
          AppSidebar: { template: '<div></div>' },
        },
      },
    })

    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-message"]').text()).toContain('Conta de usuário não encontrada')
  })
})
