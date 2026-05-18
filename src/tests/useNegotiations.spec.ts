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

describe('useNegotiations', () => {
  let mockStorage: Storage
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockStorage = createMockStorage()
    vi.stubGlobal('localStorage', mockStorage)
    fetchSpy = vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({ message: 'Not found' }) })
    vi.stubGlobal('fetch', fetchSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('inicia com listas vazias, loading false, error null', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations, receivedNegotiations, loading, error } = useNegotiations()

    expect(createdNegotiations.value).toEqual([])
    expect(receivedNegotiations.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetchNegotiations seta loading false após execução', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { loading, fetchNegotiations } = useNegotiations()

    await fetchNegotiations()

    expect(loading.value).toBe(false)
  })

  it('addCreatedNegotiation adiciona item com status Pendente', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations, addCreatedNegotiation } = useNegotiations()

    await addCreatedNegotiation(10, 'Carteira', 'André')

    expect(createdNegotiations.value).toHaveLength(1)
    expect(createdNegotiations.value[0]).toMatchObject({
      itemId: 10,
      itemName: 'Carteira',
      status: 'Pendente',
      userName: 'André',
    })
  })

  it('addCreatedNegotiation persiste no localStorage', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { addCreatedNegotiation } = useNegotiations()

    await addCreatedNegotiation(10, 'Carteira', 'André')

    const stored = JSON.parse(mockStorage.getItem('mock_negotiations')!)
    expect(stored.created).toHaveLength(1)
    expect(stored.created[0].itemName).toBe('Carteira')
  })

  it('addCreatedNegotiation usa ID real quando backend retorna claim', async () => {
    mockStorage.setItem('mock_last_max_claim_id', '5')
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 6,
        status: { name: 'Pendente' },
        associated_found_item: { id: 10, name: 'Carteira' },
        claimant_user_account: { name: 'André', phone: '999' },
        created_at: '2026-01-01',
        retrieval_code: '',
      }),
    })

    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations, addCreatedNegotiation } = useNegotiations()

    await addCreatedNegotiation(10, 'Carteira', 'André')

    expect(createdNegotiations.value[0].id).toBe(6)
  })

  it('addCreatedNegotiation usa fallback Date.now quando discovery falha', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations, addCreatedNegotiation } = useNegotiations()

    await addCreatedNegotiation(10, 'Carteira', 'André')

    expect(createdNegotiations.value[0].id).toBeGreaterThan(1_000_000_000_000)
  })

  it('carrega dados do localStorage na inicialização', async () => {
    mockStorage.setItem('mock_negotiations', JSON.stringify({
      created: [{ id: 1, itemId: 5, itemName: 'Chave', status: 'Pendente', userName: 'Ana', createdAt: '2026-01-01' }],
      received: [],
    }))

    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations } = useNegotiations()

    expect(createdNegotiations.value).toHaveLength(1)
    expect(createdNegotiations.value[0].itemName).toBe('Chave')
  })

  it('updateNegotiationStatus atualiza status e persiste', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations, addCreatedNegotiation, updateNegotiationStatus } = useNegotiations()

    await addCreatedNegotiation(10, 'Carteira', 'André')
    const id = createdNegotiations.value[0].id

    updateNegotiationStatus(id, 'Aceita')

    expect(createdNegotiations.value[0].status).toBe('Aceita')

    const stored = JSON.parse(mockStorage.getItem('mock_negotiations')!)
    expect(stored.created[0].status).toBe('Aceita')
  })

  it('isMockNegotiation retorna true para IDs grandes (Date.now)', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { isMockNegotiation } = useNegotiations()

    expect(isMockNegotiation(1779135346730)).toBe(true)
    expect(isMockNegotiation(42)).toBe(false)
  })

  it('getMockNegotiation retorna item existente ou undefined', async () => {
    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations, addCreatedNegotiation, getMockNegotiation } = useNegotiations()

    await addCreatedNegotiation(10, 'Carteira', 'André')
    const id = createdNegotiations.value[0].id

    expect(getMockNegotiation(id)).toBeDefined()
    expect(getMockNegotiation(id)!.itemName).toBe('Carteira')
    expect(getMockNegotiation(999)).toBeUndefined()
  })

  it('localStorage inválido não causa crash', async () => {
    mockStorage.setItem('mock_negotiations', 'not-json')

    const { useNegotiations } = await import('@/composables/useNegotiations')
    const { createdNegotiations, receivedNegotiations } = useNegotiations()

    expect(createdNegotiations.value).toEqual([])
    expect(receivedNegotiations.value).toEqual([])
  })
})
