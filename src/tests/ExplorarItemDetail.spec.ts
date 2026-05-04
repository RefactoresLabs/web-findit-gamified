import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ItemDetail } from '@/types/item'
import { ref } from 'vue'

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

describe('ExplorarItemDetail.vue — item perdido', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockItem.value = mockLostDetail
    mockLoading.value = false
    mockError.value = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  async function mountComponent(itemId = 1, itemType: 'perdido' | 'encontrado' = 'perdido') {
    const { default: ExplorarItemDetail } = await import(
      '@/components/explorar/ExplorarItemDetail.vue'
    )
    return mount(ExplorarItemDetail, { props: { itemId, itemType } })
  }

  it('chama fetchItem ao montar com id e tipo', async () => {
    await mountComponent(1, 'perdido')
    expect(mockFetchItem).toHaveBeenCalledWith(1, 'perdido')
  })

  it('renderiza botão Voltar', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="btn-voltar"]').exists()).toBe(true)
  })

  it('renderiza nome do item', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-nome"]').text()).toBe('MacBook Pro 14')
  })

  it('renderiza descrição', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-descricao"]').text()).toContain('Notebook perdido')
  })

  it('renderiza local + prédio', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-local"]').text()).toContain('Sala 206')
    expect(wrapper.find('[data-testid="detail-local"]').text()).toContain('Centro Universitário UNDB')
  })

  it('renderiza categoria', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-categoria"]').text()).toContain('Material Escolar')
  })

  it('renderiza info do usuário', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-user-name"]').text()).toContain('Maria Silva')
    expect(wrapper.find('[data-testid="detail-user-email"]').text()).toContain('maria@undb.edu.br')
    expect(wrapper.find('[data-testid="detail-user-phone"]').text()).toContain('98988887777')
  })

  it('renderiza imagem quando existe', async () => {
    const wrapper = await mountComponent()
    const img = wrapper.find('[data-testid="detail-foto"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('http://example.com/macbook.jpg')
  })

  it('não renderiza seção left_building_space para item perdido', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-left-location"]').exists()).toBe(false)
  })

  it('emite back ao clicar Voltar', async () => {
    const wrapper = await mountComponent()
    await wrapper.find('[data-testid="btn-voltar"]').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })
})

describe('ExplorarItemDetail.vue — item encontrado', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockItem.value = mockFoundDetail
    mockLoading.value = false
    mockError.value = null
  })

  async function mountComponent() {
    const { default: ExplorarItemDetail } = await import(
      '@/components/explorar/ExplorarItemDetail.vue'
    )
    return mount(ExplorarItemDetail, { props: { itemId: 3, itemType: 'encontrado' as const } })
  }

  it('renderiza seção left_building_space para item encontrado', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.find('[data-testid="detail-left-location"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="detail-left-location"]').text()).toContain('Refeitório')
  })
})

describe('ExplorarItemDetail.vue — loading state', () => {
  it('mostra loading', async () => {
    mockItem.value = null
    mockLoading.value = true
    mockError.value = null

    const { default: ExplorarItemDetail } = await import(
      '@/components/explorar/ExplorarItemDetail.vue'
    )
    const wrapper = mount(ExplorarItemDetail, { props: { itemId: 1, itemType: 'perdido' as const } })

    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true)
  })
})

describe('ExplorarItemDetail.vue — error state', () => {
  it('mostra mensagem de erro', async () => {
    mockItem.value = null
    mockLoading.value = false
    mockError.value = 'Item não encontrado'

    const { default: ExplorarItemDetail } = await import(
      '@/components/explorar/ExplorarItemDetail.vue'
    )
    const wrapper = mount(ExplorarItemDetail, { props: { itemId: 999, itemType: 'perdido' as const } })

    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-message"]').text()).toContain('Item não encontrado')
  })
})
