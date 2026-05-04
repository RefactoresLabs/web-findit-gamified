import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

function createMockStorage(): Storage {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
}

const mockLostItemDetailResponse = {
  id: 1,
  name: 'MacBook Pro 14',
  description: 'Notebook perdido perto da entrada',
  user: { name: 'Maria Silva', email: 'maria@undb.edu.br', phone: '98988887777' },
  category: { name: 'Material Escolar' },
  lost_building_space: {
    name: 'Sala 206',
    building: {
      name: 'Centro Universitário UNDB',
      localization: { cep: '65075441', neighborhood: 'Jardim Renascença', street: 'Coronel Colares Moreira' },
    },
  },
  images: [{ url: 'http://example.com/macbook.jpg' }],
}

const mockFoundItemDetailResponse = {
  id: 3,
  name: 'Carteira de Couro',
  description: 'Carteira marrom encontrada com documentos',
  user: { name: 'Maria Silva', email: 'maria@undb.edu.br', phone: '98988887777' },
  category: { name: 'Acessório Pessoal' },
  found_building_space: {
    name: 'Recepção',
    building: {
      name: 'Centro Universitário UNDB',
      localization: { cep: '65075441', neighborhood: 'Jardim Renascença', street: 'Coronel Colares Moreira' },
    },
  },
  left_building_space: {
    name: 'Refeitório',
    building: {
      name: 'Centro Universitário UNDB',
      localization: { cep: '65075441', neighborhood: 'Jardim Renascença', street: 'Coronel Colares Moreira' },
    },
  },
  item_image_urls: ['http://example.com/carteira.jpg'],
}

describe('useItemDetail', () => {
  let mockStorage: Storage
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockStorage = createMockStorage()
    vi.stubGlobal('localStorage', mockStorage)
    fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('inicia com item null, loading false, error null', async () => {
    const { useItemDetail } = await import('@/composables/useItemDetail')
    const { item, loading, error } = useItemDetail()

    expect(item.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetchItem busca GET /lost-items/{id} para tipo perdido', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLostItemDetailResponse),
    })

    const { useItemDetail } = await import('@/composables/useItemDetail')
    const { item, fetchItem } = useItemDetail()

    await fetchItem(1, 'perdido')

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/lost-items/1'),
      expect.any(Object),
    )

    expect(item.value).toEqual({
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
    })
  })

  it('fetchItem busca GET /found-items/{id} para tipo encontrado', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFoundItemDetailResponse),
    })

    const { useItemDetail } = await import('@/composables/useItemDetail')
    const { item, fetchItem } = useItemDetail()

    await fetchItem(3, 'encontrado')

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/found-items/3'),
      expect.any(Object),
    )

    expect(item.value).toEqual({
      id: 3,
      name: 'Carteira de Couro',
      description: 'Carteira marrom encontrada com documentos',
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
      imageUrls: ['http://example.com/carteira.jpg'],
      type: 'encontrado',
    })
  })

  it('loading true durante fetch, false depois', async () => {
    let resolveFetch!: (value: unknown) => void
    fetchSpy.mockReturnValue(new Promise(r => { resolveFetch = r }))

    const { useItemDetail } = await import('@/composables/useItemDetail')
    const { loading, fetchItem } = useItemDetail()

    const promise = fetchItem(1, 'perdido')
    expect(loading.value).toBe(true)

    resolveFetch({ ok: true, json: () => Promise.resolve(mockLostItemDetailResponse) })
    await promise

    expect(loading.value).toBe(false)
  })

  it('error preenchido quando API retorna erro', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Item não encontrado' }),
    })

    const { useItemDetail } = await import('@/composables/useItemDetail')
    const { error, fetchItem } = useItemDetail()

    await fetchItem(999, 'perdido')

    expect(error.value).toBe('Item não encontrado')
  })

  it('error preenchido quando rede falha', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'))

    const { useItemDetail } = await import('@/composables/useItemDetail')
    const { error, fetchItem } = useItemDetail()

    await fetchItem(1, 'perdido')

    expect(error.value).toBe('Não foi possível conectar ao servidor. Verifique sua conexão.')
  })

  it('loading false após erro', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'))

    const { useItemDetail } = await import('@/composables/useItemDetail')
    const { loading, fetchItem } = useItemDetail()

    await fetchItem(1, 'perdido')

    expect(loading.value).toBe(false)
  })
})
