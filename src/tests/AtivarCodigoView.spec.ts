import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'

const pushMock = vi.fn()
const backMock = vi.fn()
let mockRouteParams: Record<string, string> = {}

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock, back: backMock }),
  useRoute: () => ({ params: mockRouteParams }),
}))

const mockPatchFn = vi.fn()

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: mockPatchFn,
    delete: vi.fn(),
    upload: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number
    code?: string
    constructor(status: number, message: string, code?: string) {
      super(message)
      this.status = status
      this.code = code
    }
  },
  getAuthToken: vi.fn(() => 'fake-token'),
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  BASE_URL: 'http://127.0.0.1:10000',
}))

async function mountView(): Promise<VueWrapper> {
  const mod = await import('@/views/AtivarCodigoView.vue')
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

describe('AtivarCodigoView', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockRouteParams = { id: '3' }
    mockPatchFn.mockResolvedValue({ message: 'Negociação concluída com sucesso!' })
    wrapper = await mountView()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza título', () => {
    expect(wrapper.find('.page-title').text()).toBe('Ativação de Código')
  })

  it('renderiza input para código de 10 dígitos', () => {
    const input = wrapper.find('[data-testid="code-input"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('maxlength')).toBe('10')
  })

  it('botão confirmar desabilitado quando código < 10 dígitos', () => {
    const btn = wrapper.find('[data-testid="btn-confirm"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('botão confirmar habilitado quando código = 10 dígitos', async () => {
    await wrapper.find('[data-testid="code-input"]').setValue('1234567890')
    const btn = wrapper.find('[data-testid="btn-confirm"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(false)
  })

  it('confirmar chama PATCH complete-retrieval com código', async () => {
    await wrapper.find('[data-testid="code-input"]').setValue('1234567890')
    await wrapper.find('[data-testid="btn-confirm"]').trigger('click')
    expect(mockPatchFn).toHaveBeenCalledWith('/claims/3/complete-retrieval', {
      retrieval_code: '1234567890',
    })
  })

  it('após sucesso navega para codigo-ativado', async () => {
    await wrapper.find('[data-testid="code-input"]').setValue('1234567890')
    await wrapper.find('[data-testid="btn-confirm"]').trigger('click')
    await vi.dynamicImportSettled()
    expect(pushMock).toHaveBeenCalledWith({
      name: 'codigo-ativado',
      params: { id: '3' },
    })
  })

  it('mostra erro quando código incorreto', async () => {
    mockPatchFn.mockRejectedValueOnce(
      Object.assign(new Error('Código de recuperação incorreto'), { status: 400 }),
    )
    await wrapper.find('[data-testid="code-input"]').setValue('0000000000')
    await wrapper.find('[data-testid="btn-confirm"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="code-error"]').exists()).toBe(true)
  })

  it('botão voltar chama router.back', async () => {
    await wrapper.find('[data-testid="btn-back"]').trigger('click')
    expect(backMock).toHaveBeenCalled()
  })

  it('aceita apenas dígitos no input', async () => {
    const input = wrapper.find('[data-testid="code-input"]')
    expect(input.attributes('inputmode')).toBe('numeric')
  })
})
