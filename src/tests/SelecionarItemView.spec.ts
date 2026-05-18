import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import type { FeedItem } from '@/types/item'
import { ref } from 'vue'

const pushMock = vi.fn()
const backMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock, back: backMock }),
}))

const mockFoundItems: FeedItem[] = [
  {
    id: 10,
    name: 'Carteira encontrada',
    userName: 'Lucas',
    categoryName: 'Acessório Pessoal',
    locationName: 'Recepção',
    imageUrl: 'http://example.com/carteira.jpg',
    type: 'encontrado',
  },
  {
    id: 20,
    name: 'Notebook Dell',
    userName: 'Maria',
    categoryName: 'Eletrônico',
    locationName: 'Sala 101',
    imageUrl: '',
    type: 'encontrado',
  },
]

const mockFetchItems = vi.fn()
const mockLoading = ref(false)
const mockError = ref<string | null>(null)
const mockFoundRef = ref<FeedItem[]>(mockFoundItems)

vi.mock('@/composables/useItems', () => ({
  useItems: () => ({
    lostItems: ref([]),
    foundItems: mockFoundRef,
    loading: mockLoading,
    error: mockError,
    fetchItems: mockFetchItems,
  }),
}))

const mockPostFn = vi.fn().mockResolvedValue({ message: 'Negociação registrada com sucesso!' })

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: mockPostFn,
    patch: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
      super(message)
      this.status = status
    }
  },
  getAuthToken: vi.fn(() => 'fake-token'),
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  BASE_URL: 'http://127.0.0.1:10000',
}))

async function mountView(): Promise<VueWrapper> {
  const mod = await import('@/views/SelecionarItemView.vue')
  return mount(mod.default, {
    global: {
      stubs: {
        AppSidebar: {
          template: '<div data-testid="sidebar"></div>',
          props: ['activeItem'],
        },
      },
    },
  })
}

describe('SelecionarItemView', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockLoading.value = false
    mockError.value = null
    mockFoundRef.value = mockFoundItems
    mockPostFn.mockResolvedValue({ message: 'Negociação registrada com sucesso!' })
    wrapper = await mountView()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza título', () => {
    expect(wrapper.find('.page-title').text()).toBe('Selecionar Item Encontrado')
  })

  it('chama fetchItems ao montar', () => {
    expect(mockFetchItems).toHaveBeenCalledOnce()
  })

  it('renderiza cards de itens encontrados', () => {
    const cards = wrapper.findAll('.selectable-card')
    expect(cards).toHaveLength(2)
  })

  it('card mostra nome e localização do item', () => {
    const card = wrapper.find('.selectable-card')
    expect(card.text()).toContain('Carteira encontrada')
    expect(card.text()).toContain('Recepção')
  })

  it('clicar em card cria claim com found_item_id', async () => {
    await wrapper.findAll('.selectable-card')[0]!.trigger('click')
    expect(mockPostFn).toHaveBeenCalledWith('/claims', { found_item_id: 10 })
  })

  it('após criar claim navega para negociacoes', async () => {
    await wrapper.findAll('.selectable-card')[0]!.trigger('click')
    await vi.dynamicImportSettled()
    expect(pushMock).toHaveBeenCalledWith({ name: 'negociacoes' })
  })

  it('mostra erro quando criação falha', async () => {
    mockPostFn.mockRejectedValueOnce(new Error('Item não encontrado'))
    await wrapper.findAll('.selectable-card')[0]!.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="action-error"]').exists()).toBe(true)
  })

  it('botão voltar chama router.back', async () => {
    await wrapper.find('[data-testid="btn-back"]').trigger('click')
    expect(backMock).toHaveBeenCalled()
  })

  it('mostra estado vazio quando sem itens', async () => {
    mockFoundRef.value = []
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('mostra loading', async () => {
    mockLoading.value = true
    mockFoundRef.value = []
    const w = await mountView()
    expect(w.find('[data-testid="loading-indicator"]').exists()).toBe(true)
  })

  it('mostra erro de carregamento', async () => {
    mockLoading.value = false
    mockError.value = 'Erro ao carregar itens'
    mockFoundRef.value = []
    const w = await mountView()
    expect(w.find('[data-testid="error-message"]').exists()).toBe(true)
  })
})
