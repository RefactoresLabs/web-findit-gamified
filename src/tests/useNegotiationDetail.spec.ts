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

const mockClaimDetailResponse = {
  id: 1,
  status: { name: 'Pendente' },
  claimant_user_account: { name: 'André', phone: '(98) 99999-0000' },
  associated_found_item: {
    id: 10,
    name: 'Carteira',
    user: { name: 'Lucas', phone: '(98) 88888-0000' },
  },
  created_at: '2026-05-18T10:00:00',
  retrieval_code: '',
}

describe('useNegotiationDetail', () => {
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

  it('inicia com detail null, loading false, error null', async () => {
    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { detail, loading, error } = useNegotiationDetail()

    expect(detail.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetchDetail busca /claim/:id e normaliza', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockClaimDetailResponse),
    })

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { detail, fetchDetail } = useNegotiationDetail()

    await fetchDetail(1)

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/claim/1'),
      expect.any(Object),
    )

    expect(detail.value).toEqual({
      id: 1,
      status: 'Pendente',
      claimantName: 'André',
      claimantPhone: '(98) 99999-0000',
      itemId: 10,
      itemName: 'Carteira',
      itemOwnerName: 'Lucas',
      itemOwnerPhone: '(98) 88888-0000',
      createdAt: '2026-05-18T10:00:00',
      retrievalCode: '',
    })
  })

  it('loading true durante fetch, false depois', async () => {
    let resolveFetch!: (value: unknown) => void
    fetchSpy.mockReturnValueOnce(new Promise(r => { resolveFetch = r }))

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { loading, fetchDetail } = useNegotiationDetail()

    const promise = fetchDetail(1)
    expect(loading.value).toBe(true)

    resolveFetch({ ok: true, json: () => Promise.resolve(mockClaimDetailResponse) })
    await promise

    expect(loading.value).toBe(false)
  })

  it('error preenchido quando API retorna erro', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Negociação não encontrada' }),
    })

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { error, fetchDetail } = useNegotiationDetail()

    await fetchDetail(999)

    expect(error.value).toBe('Negociação não encontrada')
  })

  it('acceptClaim chama PATCH /claims/:id/accept', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ retrieval_code: 'ABC1234567' }),
    })

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { acceptClaim } = useNegotiationDetail()

    await acceptClaim(1)

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/claims/1/accept'),
      expect.objectContaining({ method: 'PATCH' }),
    )
  })

  it('rejectClaim chama PATCH /claims/:id/reject', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Negociação rejeitada com sucesso' }),
    })

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { rejectClaim } = useNegotiationDetail()

    await rejectClaim(1)

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/claims/1/reject'),
      expect.objectContaining({ method: 'PATCH' }),
    )
  })

  it('acceptClaim seta error quando falha', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Status atual não permite essa ação' }),
    })

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { error, acceptClaim } = useNegotiationDetail()

    await acceptClaim(1)

    expect(error.value).toBe('Status atual não permite essa ação')
  })

  it('rejectClaim seta error quando falha', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Sem permissão' }),
    })

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { error, rejectClaim } = useNegotiationDetail()

    await rejectClaim(1)

    expect(error.value).toBe('Sem permissão')
  })

  it('fetchDetail retorna mock detail para IDs mock (> 1 trilhão)', async () => {
    const mockId = 1779135346730
    mockStorage.setItem('mock_negotiations', JSON.stringify({
      created: [{ id: mockId, itemId: 10, itemName: 'Carteira', status: 'Pendente', userName: 'André', createdAt: '2026-05-18T10:00:00' }],
      received: [],
    }))

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { detail, fetchDetail } = useNegotiationDetail()

    await fetchDetail(mockId)

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(detail.value).toMatchObject({
      id: mockId,
      status: 'Pendente',
      itemId: 10,
      itemName: 'Carteira',
      claimantName: 'André',
    })
  })

  it('acceptClaim mock atualiza status sem chamar API', async () => {
    const mockId = 1779135346730
    mockStorage.setItem('mock_negotiations', JSON.stringify({
      created: [{ id: mockId, itemId: 10, itemName: 'Carteira', status: 'Pendente', userName: 'André', createdAt: '2026-05-18T10:00:00' }],
      received: [],
    }))

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { acceptClaim } = useNegotiationDetail()

    await acceptClaim(mockId)

    expect(fetchSpy).not.toHaveBeenCalled()
    const stored = JSON.parse(mockStorage.getItem('mock_negotiations')!)
    expect(stored.created[0].status).toBe('Aceita')
  })

  it('rejectClaim mock atualiza status sem chamar API', async () => {
    const mockId = 1779135346730
    mockStorage.setItem('mock_negotiations', JSON.stringify({
      created: [{ id: mockId, itemId: 10, itemName: 'Carteira', status: 'Pendente', userName: 'André', createdAt: '2026-05-18T10:00:00' }],
      received: [],
    }))

    const { useNegotiationDetail } = await import('@/composables/useNegotiationDetail')
    const { rejectClaim } = useNegotiationDetail()

    await rejectClaim(mockId)

    expect(fetchSpy).not.toHaveBeenCalled()
    const stored = JSON.parse(mockStorage.getItem('mock_negotiations')!)
    expect(stored.created[0].status).toBe('Rejeitada')
  })
})
