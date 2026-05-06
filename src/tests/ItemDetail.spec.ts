import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ItemDetail } from '@/types/item'
import { ref } from 'vue'

const pushMock = vi.fn()
const backMock = vi.fn()
let mockRouteParams = { id: '1' }
let mockRouteQuery = { type: 'perdido' }

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: mockRouteParams,
    query: mockRouteQuery,
  }),
  useRouter: () => ({
    push: pushMock,
    back: backMock,
  }),
}))

vi.mock('@/components/layout/AppSidebar.vue', () => ({
  default: { template: '<div data-testid="sidebar" />' },
}))

const mockLostDetail: ItemDetail = {
  id: 1,
  name: 'MacBook Pro 14',
  description: 'Notebook perdido perto da entrada',
  userName: 'Maria Silva',
  userEmail: 'maria@undb.edu.br',
  userPhone: '98988887777',
  categoryName: 'Material Escolar',
  locationName: 'Sala 206',
  buildingName: 'Centro Universitário UNDB',
  buildingCep: '65075441',
  buildingNeighborhood: 'Jardim Renascença',
  buildingStreet: 'Coronel Colares Moreira',
  leftLocationName: null,
  leftBuildingName: null,
  imageUrls: ['http://example.com/macbook.jpg'],
  type: 'perdido',
}

const mockFoundDetail: ItemDetail = {
  id: 3,
  name: 'Carteira de Couro',
  description: 'Carteira marrom encontrada',
  userName: 'Maria Silva',
  userEmail: 'maria@undb.edu.br',
  userPhone: '98988887777',
  categoryName: 'Acessório Pessoal',
  locationName: 'Recepção',
  buildingName: 'Centro Universitário UNDB',
  buildingCep: '65075441',
  buildingNeighborhood: 'Jardim Renascença',
  buildingStreet: 'Coronel Colares Moreira',
  leftLocationName: 'Refeitório',
  leftBuildingName: 'Centro Universitário UNDB',
  imageUrls: [],
  type: 'encontrado',
}

const mockFetchItem = vi.fn()
const mockItem = ref<ItemDetail | null>(null)
const mockLoading = ref(false)
const mockError = ref<string | null>(null)

vi.mock('@/composables/useItemDetail', () => ({
  useItemDetail: () => ({
    item: mockItem,
    loading: mockLoading,
    error: mockError,
    fetchItem: mockFetchItem,
  }),
}))

describe('ItemDetailView — item perdido', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockRouteParams = { id: '1' }
    mockRouteQuery = { type: 'perdido' }
    mockItem.value = mockLostDetail
    mockLoading.value = false
    mockError.value = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  async function mountComponent() {
    const { default: ItemDetailView } = await import('@/views/ItemDetailView.vue')
    return mount(ItemDetailView)
  }

  it('chama fetchItem com id e tipo da rota', async () => {
    await mountComponent()
    expect(mockFetchItem).toHaveBeenCalledWith(1, 'perdido')
  })

  it('renderiza nome do item', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-title"]').text()).toBe('MacBook Pro 14')
  })

  it('renderiza descrição', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-description"]').text()).toContain('Notebook perdido')
  })

  it('renderiza local', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-location"]').text()).toContain('Sala 206')
  })

  it('renderiza badge Perdido', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('.item-badge').text()).toBe('Perdido')
  })

  it('renderiza info do usuário', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-user-name"]').text()).toContain('Maria Silva')
    expect(wrapper.find('[data-testid="detail-user-email"]').text()).toContain('maria@undb.edu.br')
    expect(wrapper.find('[data-testid="detail-user-phone"]').text()).toContain('98988887777')
  })

  it('renderiza imagem quando existe', async () => {
    const wrapper = await mountComponent()
    const img = wrapper.find('[data-testid="detail-image"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('http://example.com/macbook.jpg')
  })

  it('botão voltar chama router.back', async () => {
    const wrapper = await mountComponent()
    await wrapper.find('[data-testid="back-btn"]').trigger('click')
    expect(backMock).toHaveBeenCalled()
  })
})

describe('ItemDetailView — item encontrado', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteParams = { id: '3' }
    mockRouteQuery = { type: 'encontrado' }
    mockItem.value = mockFoundDetail
    mockLoading.value = false
    mockError.value = null
  })

  async function mountComponent() {
    const { default: ItemDetailView } = await import('@/views/ItemDetailView.vue')
    return mount(ItemDetailView)
  }

  it('renderiza badge Encontrado', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('.item-badge').text()).toBe('Encontrado')
  })

  it('mostra seção left_building_space', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-left-location"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="detail-left-location"]').text()).toContain('Refeitório')
  })
})

describe('ItemDetailView — loading state', () => {
  it('mostra loading', async () => {
    mockItem.value = null
    mockLoading.value = true
    mockError.value = null

    const { default: ItemDetailView } = await import('@/views/ItemDetailView.vue')
    const wrapper = mount(ItemDetailView)

    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true)
  })
})

describe('ItemDetailView — error state', () => {
  it('mostra mensagem de erro', async () => {
    mockItem.value = null
    mockLoading.value = false
    mockError.value = 'Item não encontrado'

    const { default: ItemDetailView } = await import('@/views/ItemDetailView.vue')
    const wrapper = mount(ItemDetailView)

    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-message"]').text()).toContain('Item não encontrado')
  })
})
