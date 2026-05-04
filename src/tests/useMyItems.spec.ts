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

const mockMyLostItemsResponse = [
  {
    id: 10,
    name: 'Meu Notebook',
    user: { name: 'André' },
    category: { name: 'Material Escolar' },
    lost_building_space: { name: 'Sala 206' },
    image: { url: 'http://example.com/notebook.jpg' },
  },
]

const mockMyFoundItemsResponse = [
  {
    id: 20,
    name: 'Carteira encontrada',
    user: { name: 'André' },
    category: { name: 'Acessório Pessoal' },
    found_building_space: { name: 'Recepção' },
    image: { url: 'http://example.com/carteira.jpg' },
  },
]

describe('useMyItems', () => {
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

  it('inicia com listas vazias, loading false, error null', async () => {
    const { useMyItems } = await import('@/composables/useMyItems')
    const { myLostItems, myFoundItems, loading, error } = useMyItems()

    expect(myLostItems.value).toEqual([])
    expect(myFoundItems.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetchMyItems busca /my-lost-items e /my-found-items e normaliza', async () => {
    fetchSpy
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMyLostItemsResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMyFoundItemsResponse) })

    const { useMyItems } = await import('@/composables/useMyItems')
    const { myLostItems, myFoundItems, fetchMyItems } = useMyItems()

    await fetchMyItems()

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/my-lost-items'), expect.any(Object))
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/my-found-items'), expect.any(Object))

    expect(myLostItems.value).toHaveLength(1)
    expect(myLostItems.value[0]).toEqual({
      id: 10,
      name: 'Meu Notebook',
      userName: 'André',
      categoryName: 'Material Escolar',
      locationName: 'Sala 206',
      imageUrl: 'http://example.com/notebook.jpg',
      type: 'perdido',
    })

    expect(myFoundItems.value).toHaveLength(1)
    expect(myFoundItems.value[0]).toEqual({
      id: 20,
      name: 'Carteira encontrada',
      userName: 'André',
      categoryName: 'Acessório Pessoal',
      locationName: 'Recepção',
      imageUrl: 'http://example.com/carteira.jpg',
      type: 'encontrado',
    })
  })

  it('loading true durante fetch, false depois', async () => {
    let resolveFirst!: (value: unknown) => void
    let resolveSecond!: (value: unknown) => void

    fetchSpy
      .mockReturnValueOnce(new Promise(r => { resolveFirst = r }))
      .mockReturnValueOnce(new Promise(r => { resolveSecond = r }))

    const { useMyItems } = await import('@/composables/useMyItems')
    const { loading, fetchMyItems } = useMyItems()

    const promise = fetchMyItems()
    expect(loading.value).toBe(true)

    resolveFirst({ ok: true, json: () => Promise.resolve([]) })
    resolveSecond({ ok: true, json: () => Promise.resolve([]) })
    await promise

    expect(loading.value).toBe(false)
  })

  it('error preenchido quando API retorna erro', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Conta de usuário não encontrada' }),
    })

    const { useMyItems } = await import('@/composables/useMyItems')
    const { error, fetchMyItems } = useMyItems()

    await fetchMyItems()

    expect(error.value).toBe('Conta de usuário não encontrada')
  })

  it('error preenchido quando rede falha', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'))

    const { useMyItems } = await import('@/composables/useMyItems')
    const { error, fetchMyItems } = useMyItems()

    await fetchMyItems()

    expect(error.value).toBe('Não foi possível conectar ao servidor. Verifique sua conexão.')
  })

  it('loading false após erro', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'))

    const { useMyItems } = await import('@/composables/useMyItems')
    const { loading, fetchMyItems } = useMyItems()

    await fetchMyItems()

    expect(loading.value).toBe(false)
  })

  it('lida com bug backend: my-lost-items retornando found_building_space', async () => {
    const buggyResponse = [
      {
        id: 10,
        name: 'Meu Notebook',
        user: { name: 'André' },
        category: { name: 'Material Escolar' },
        found_building_space: { name: 'Sala 206' },
        image: { url: 'http://example.com/notebook.jpg' },
      },
    ]

    fetchSpy
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(buggyResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })

    const { useMyItems } = await import('@/composables/useMyItems')
    const { myLostItems, fetchMyItems } = useMyItems()

    await fetchMyItems()

    expect(myLostItems.value[0]!.locationName).toBe('Sala 206')
  })
})
