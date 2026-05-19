import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => 'fake-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
})

describe('useRegisterItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  async function getComposable() {
    vi.resetModules()
    const { useRegisterItem } = await import('@/composables/useRegisterItem')
    return useRegisterItem()
  }

  it('uploadImage → POST /upload w/ FormData, returns url', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ url: '/uploads/photo.jpg' }),
  })

  const { uploadImage } = await getComposable()

  const file = new File(['img'], 'photo.jpg', {
    type: 'image/jpeg',
  })

  const url = await uploadImage(file)

  expect(url).toContain('/uploads/photo.jpg')
  expect(mockFetch).toHaveBeenCalledOnce()

  const firstCall = mockFetch.mock.calls[0]

  expect(firstCall).toBeDefined()

  const [fetchUrl, fetchOpts] = firstCall!

  expect(fetchUrl).toContain('/upload')
  expect((fetchOpts as RequestInit).method).toBe('POST')
  expect((fetchOpts as RequestInit).body).toBeInstanceOf(FormData)

  const body = (fetchOpts as RequestInit).body as FormData

  expect(body.get('file')).toBeInstanceOf(File)
})

  it('uploadImage sends auth header', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ url: '/uploads/x.jpg' }),
  })

  const { uploadImage } = await getComposable()

  await uploadImage(
    new File(['x'], 'x.jpg', {
      type: 'image/jpeg',
    }),
  )

  const firstCall = mockFetch.mock.calls[0]

  expect(firstCall).toBeDefined()

  const [, fetchOpts] = firstCall!

  const headers = (fetchOpts as RequestInit).headers as Record<string, string>

  expect(headers['Authorization']).toBe('Bearer fake-token')
})

  it('createLostItem → POST /lost-items w/ JSON body', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ id: 1 }),
  })

  const { createLostItem } = await getComposable()

  await createLostItem({
    name: 'Carteira',
    description: 'Carteira preta',
    category_id: 1,
    lost_building_space_id: 2,
    image_urls: ['/uploads/photo.jpg'],
  })

  expect(mockFetch).toHaveBeenCalledOnce()

  const firstCall = mockFetch.mock.calls[0]

  expect(firstCall).toBeDefined()

  const [fetchUrl, fetchOpts] = firstCall!

  expect(fetchUrl).toContain('/lost-items')
  expect((fetchOpts as RequestInit).method).toBe('POST')

  const body = JSON.parse((fetchOpts as RequestInit).body as string)

  expect(body.name).toBe('Carteira')
  expect(body.category_id).toBe(1)
  expect(body.lost_building_space_id).toBe(2)
  expect(body.image_urls).toEqual(['/uploads/photo.jpg'])
})

  it('createFoundItem → POST /found-items w/ JSON body', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ id: 2 }),
  })

  const { createFoundItem } = await getComposable()

  await createFoundItem({
    name: 'Óculos',
    description: 'Óculos de sol',
    category_id: 2,
    found_building_space_id: 1,
    left_building_space_id: 3,
    image_urls: [],
  })

  expect(mockFetch).toHaveBeenCalledOnce()

  const firstCall = mockFetch.mock.calls[0]

  expect(firstCall).toBeDefined()

  const [fetchUrl, fetchOpts] = firstCall!

  expect(fetchUrl).toContain('/found-items')

  const body = JSON.parse((fetchOpts as RequestInit).body as string)

  expect(body.found_building_space_id).toBe(1)
  expect(body.left_building_space_id).toBe(3)
})

  it('loading=true during uploadImage', async () => {
    let resolveUpload!: (v: unknown) => void
    mockFetch.mockReturnValueOnce(new Promise((r) => { resolveUpload = r }))

    const { uploadImage, loading } = await getComposable()
    expect(loading.value).toBe(false)

    const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' })
    const promise = uploadImage(file)
    expect(loading.value).toBe(true)

    resolveUpload({ ok: true, json: () => Promise.resolve({ url: '/x.jpg' }) })
    await promise
    expect(loading.value).toBe(false)
  })

  it('loading=true during createLostItem', async () => {
    let resolveCreate!: (v: unknown) => void
    mockFetch.mockReturnValueOnce(new Promise((r) => { resolveCreate = r }))

    const { createLostItem, loading } = await getComposable()
    const promise = createLostItem({
      name: 'X',
      description: 'Y',
      category_id: 1,
      lost_building_space_id: 1,
    })
    expect(loading.value).toBe(true)

    resolveCreate({ ok: true, json: () => Promise.resolve({ id: 1 }) })
    await promise
    expect(loading.value).toBe(false)
  })

  it('sets error on upload failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Upload failed' }),
    })

    const { uploadImage, error } = await getComposable()
    const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' })

    await expect(uploadImage(file)).rejects.toThrow()
    expect(error.value).toBe('Upload failed')
  })

  it('sets error on createLostItem failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Dados inválidos' }),
    })

    const { createLostItem, error } = await getComposable()
    await expect(
      createLostItem({
        name: '',
        description: '',
        category_id: 1,
        lost_building_space_id: 1,
      }),
    ).rejects.toThrow()
    expect(error.value).toBe('Dados inválidos')
  })
})
