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

const mockLostItemsResponse = [
  {
    id: 1,
    name: 'MacBook Pro',
    user: { name: 'Maria' },
    category: { name: 'Material Escolar' },
    lost_building_space: { name: 'Sala 206' },
    image: { url: 'http://example.com/macbook.jpg' },
  },
]

const mockFoundItemsResponse = [
  {
    id: 2,
    name: 'Carteira',
    user: { name: 'João' },
    category: { name: 'Acessório Pessoal' },
    found_building_space: { name: 'Refeitório' },
    image: { url: 'http://example.com/carteira.jpg' },
  },
]

describe('useItems', () => {
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
    const { useItems } = await import('@/composables/useItems')
    const { lostItems, foundItems, loading, error } = useItems()

    expect(lostItems.value).toEqual([])
    expect(foundItems.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetchItems busca /lost-items e /found-items e normaliza resultado', async () => {
    fetchSpy
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockLostItemsResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockFoundItemsResponse) })

    const { useItems } = await import('@/composables/useItems')
    const { lostItems, foundItems, fetchItems } = useItems()

    await fetchItems()

    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/lost-items'), expect.any(Object))
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/found-items'), expect.any(Object))

    expect(lostItems.value).toHaveLength(1)
    expect(lostItems.value[0]).toEqual({
      id: 1,
      name: 'MacBook Pro',
      userName: 'Maria',
      categoryName: 'Material Escolar',
      locationName: 'Sala 206',
      imageUrl: 'http://example.com/macbook.jpg',
      type: 'perdido',
    })

    expect(foundItems.value).toHaveLength(1)
    expect(foundItems.value[0]).toEqual({
      id: 2,
      name: 'Carteira',
      userName: 'João',
      categoryName: 'Acessório Pessoal',
      locationName: 'Refeitório',
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

    const { useItems } = await import('@/composables/useItems')
    const { loading, fetchItems } = useItems()

    const promise = fetchItems()
    expect(loading.value).toBe(true)

    resolveFirst({ ok: true, json: () => Promise.resolve([]) })
    resolveSecond({ ok: true, json: () => Promise.resolve([]) })
    await promise

    expect(loading.value).toBe(false)
  })

  it('error preenchido quando API retorna erro', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Erro interno do servidor' }),
    })

    const { useItems } = await import('@/composables/useItems')
    const { error, fetchItems } = useItems()

    await fetchItems()

    expect(error.value).toBe('Erro interno do servidor')
  })

  it('error preenchido quando rede falha', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'))

    const { useItems } = await import('@/composables/useItems')
    const { error, fetchItems } = useItems()

    await fetchItems()

    expect(error.value).toBe('Não foi possível conectar ao servidor. Verifique sua conexão.')
  })

  it('loading false após erro', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'))

    const { useItems } = await import('@/composables/useItems')
    const { loading, fetchItems } = useItems()

    await fetchItems()

    expect(loading.value).toBe(false)
  })

  it('limpa erro anterior ao buscar novamente', async () => {
    fetchSpy.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const { useItems } = await import('@/composables/useItems')
    const { error, fetchItems } = useItems()

    await fetchItems()
    expect(error.value).toBeTruthy()

    fetchSpy.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
    fetchSpy.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })

    await fetchItems()
    expect(error.value).toBeNull()
  })
})
