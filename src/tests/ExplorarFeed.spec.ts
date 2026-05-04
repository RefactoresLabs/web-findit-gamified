import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import type { FeedItem } from '@/types/item'
import { ref } from 'vue'

const mockLostItems: FeedItem[] = [
  {
    id: 1,
    name: 'MacBook Pro',
    userName: 'Maria',
    categoryName: 'Material Escolar',
    locationName: 'Sala 206',
    imageUrl: 'http://example.com/macbook.jpg',
    type: 'perdido',
  },
  {
    id: 2,
    name: 'Caderno',
    userName: 'João',
    categoryName: 'Material Escolar',
    locationName: 'Refeitório',
    imageUrl: 'http://example.com/caderno.jpg',
    type: 'perdido',
  },
]

const mockFoundItems: FeedItem[] = [
  {
    id: 3,
    name: 'Carteira',
    userName: 'Ana',
    categoryName: 'Acessório Pessoal',
    locationName: 'Recepção',
    imageUrl: 'http://example.com/carteira.jpg',
    type: 'encontrado',
  },
]

const mockFetchItems = vi.fn()
const mockLoading = ref(false)
const mockError = ref<string | null>(null)
const mockLostRef = ref<FeedItem[]>(mockLostItems)
const mockFoundRef = ref<FeedItem[]>(mockFoundItems)

vi.mock('@/composables/useItems', () => ({
  useItems: () => ({
    lostItems: mockLostRef,
    foundItems: mockFoundRef,
    loading: mockLoading,
    error: mockError,
    fetchItems: mockFetchItems,
  }),
}))

describe('ExplorarFeed.vue', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockLoading.value = false
    mockError.value = null
    mockLostRef.value = mockLostItems
    mockFoundRef.value = mockFoundItems

    const { default: ExplorarFeed } = await import('@/components/explorar/ExplorarFeed.vue')
    wrapper = mount(ExplorarFeed)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza título "Explorar Itens"', () => {
    expect(wrapper.find('[data-testid="feed-title"]').text()).toBe('Explorar Itens')
  })

  it('renderiza subtítulo', () => {
    expect(wrapper.find('[data-testid="feed-subtitle"]').text()).toBe(
      'Encontre ou registre itens perdidos no campus',
    )
  })

  it('chama fetchItems ao montar', () => {
    expect(mockFetchItems).toHaveBeenCalledOnce()
  })

  it('renderiza botões Feed e Mapa', () => {
    expect(wrapper.find('[data-testid="btn-feed"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-map"]').exists()).toBe(true)
  })

  it('botão Feed ativo por padrão', () => {
    expect(wrapper.find('[data-testid="btn-feed"]').classes()).toContain('active')
  })

  it('renderiza campo de busca', () => {
    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true)
  })

  it('tabs Perdidos e Encontrados existem', () => {
    expect(wrapper.find('[data-testid="tab-perdido"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-encontrado"]').exists()).toBe(true)
  })

  it('tab Perdidos ativa por padrão', () => {
    expect(wrapper.find('[data-testid="tab-perdido"]').classes()).toContain('active')
  })

  it('renderiza cards dos itens perdidos por padrão', () => {
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(2)
  })

  it('renderiza cards dos itens encontrados ao clicar tab', async () => {
    await wrapper.find('[data-testid="tab-encontrado"]').trigger('click')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(1)
  })

  it('filtra cards por nome ao buscar', async () => {
    await wrapper.find('[data-testid="search-input"]').setValue('MacBook')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(1)
  })

  it('filtra cards por local ao buscar', async () => {
    await wrapper.find('[data-testid="search-input"]').setValue('Sala 206')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(1)
  })

  it('mostra 0 cards quando busca sem resultado', async () => {
    await wrapper.find('[data-testid="search-input"]').setValue('item inexistente xyz')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(0)
  })

  it('emite showMap ao clicar Mapa', async () => {
    await wrapper.find('[data-testid="btn-map"]').trigger('click')
    expect(wrapper.emitted('showMap')).toBeTruthy()
  })

  it('emite showDetail com id ao clicar card', async () => {
    const cards = wrapper.findAll('[data-testid="item-card"]')
    await cards[0]!.trigger('click')
    expect(wrapper.emitted('showDetail')).toBeTruthy()
    expect(wrapper.emitted('showDetail')![0]).toEqual([1, 'perdido'])
  })
})

describe('ExplorarFeed.vue — loading state', () => {
  it('mostra indicador de loading', async () => {
    mockLoading.value = true
    mockError.value = null
    mockLostRef.value = []
    mockFoundRef.value = []

    const { default: ExplorarFeed } = await import('@/components/explorar/ExplorarFeed.vue')
    const wrapper = mount(ExplorarFeed)

    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="items-grid"]').exists()).toBe(false)
  })
})

describe('ExplorarFeed.vue — error state', () => {
  it('mostra mensagem de erro', async () => {
    mockLoading.value = false
    mockError.value = 'Erro ao carregar itens'
    mockLostRef.value = []
    mockFoundRef.value = []

    const { default: ExplorarFeed } = await import('@/components/explorar/ExplorarFeed.vue')
    const wrapper = mount(ExplorarFeed)

    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-message"]').text()).toContain('Erro ao carregar itens')
    expect(wrapper.find('[data-testid="items-grid"]').exists()).toBe(false)
  })
})
