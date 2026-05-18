import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import type { NegotiationDetail } from '@/composables/useNegotiationDetail'

const pushMock = vi.fn()
const backMock = vi.fn()
let mockRouteQuery: Record<string, string> = {}
let mockRouteParams: Record<string, string> = {}

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock, back: backMock }),
  useRoute: () => ({
    params: mockRouteParams,
    query: mockRouteQuery,
  }),
}))

const mockDetail = ref<NegotiationDetail | null>({
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
const mockLoading = ref(false)
const mockError = ref<string | null>(null)
const mockFetchDetail = vi.fn()
const mockAcceptClaim = vi.fn()
const mockRejectClaim = vi.fn()

vi.mock('@/composables/useNegotiationDetail', () => ({
  useNegotiationDetail: () => ({
    detail: mockDetail,
    loading: mockLoading,
    error: mockError,
    fetchDetail: mockFetchDetail,
    acceptClaim: mockAcceptClaim,
    rejectClaim: mockRejectClaim,
  }),
}))

async function mountView(): Promise<VueWrapper> {
  const mod = await import('@/views/NegociacaoDetalheView.vue')
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

describe('NegociacaoDetalheView — criada', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockRouteParams = { id: '1' }
    mockRouteQuery = { role: 'criada' }
    mockLoading.value = false
    mockError.value = null
    mockDetail.value = {
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
    }
    wrapper = await mountView()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('chama fetchDetail ao montar com id da rota', () => {
    expect(mockFetchDetail).toHaveBeenCalledWith(1)
  })

  it('renderiza título da página', () => {
    expect(wrapper.find('.page-title').text()).toBe('Detalhes da Negociação')
  })

  it('mostra status da negociação', () => {
    expect(wrapper.find('.status-badge').text()).toBe('Pendente')
  })

  it('mostra nome do item clicável', () => {
    const itemLink = wrapper.find('[data-testid="item-link"]')
    expect(itemLink.text()).toContain('Carteira')
  })

  it('clique no item navega para detalhe do item encontrado', async () => {
    await wrapper.find('[data-testid="item-link"]').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({
      path: '/item/10',
      query: { type: 'encontrado' },
    })
  })

  it('mostra nome e telefone do dono do item', () => {
    const text = wrapper.text()
    expect(text).toContain('Lucas')
    expect(text).toContain('(98) 88888-0000')
  })

  it('mostra nome e telefone do solicitante', () => {
    const text = wrapper.text()
    expect(text).toContain('André')
    expect(text).toContain('(98) 99999-0000')
  })

  it('mostra data de criação', () => {
    expect(wrapper.text()).toContain('18/05/2026')
  })

  it('NÃO mostra botões aceitar/rejeitar para negociação criada', () => {
    expect(wrapper.find('[data-testid="btn-accept"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="btn-reject"]').exists()).toBe(false)
  })

  it('botão voltar chama router.back', async () => {
    await wrapper.find('[data-testid="btn-back"]').trigger('click')
    expect(backMock).toHaveBeenCalled()
  })
})

describe('NegociacaoDetalheView — recebida pendente', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockRouteParams = { id: '2' }
    mockRouteQuery = { role: 'recebida' }
    mockLoading.value = false
    mockError.value = null
    mockDetail.value = {
      id: 2,
      status: 'Pendente',
      claimantName: 'André',
      claimantPhone: '(98) 99999-0000',
      itemId: 10,
      itemName: 'Carteira',
      itemOwnerName: 'Lucas',
      itemOwnerPhone: '(98) 88888-0000',
      createdAt: '2026-05-18T10:00:00',
      retrievalCode: '',
    }
    wrapper = await mountView()
  })

  it('mostra botões aceitar e rejeitar', () => {
    expect(wrapper.find('[data-testid="btn-accept"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-reject"]').exists()).toBe(true)
  })

  it('NÃO mostra botão completar', () => {
    expect(wrapper.find('[data-testid="btn-complete"]').exists()).toBe(false)
  })

  it('aceitar chama acceptClaim e recarrega', async () => {
    mockAcceptClaim.mockResolvedValueOnce(undefined)
    await wrapper.find('[data-testid="btn-accept"]').trigger('click')
    expect(mockAcceptClaim).toHaveBeenCalledWith(2)
    expect(mockFetchDetail).toHaveBeenCalledTimes(2)
  })

  it('rejeitar chama rejectClaim e recarrega', async () => {
    mockRejectClaim.mockResolvedValueOnce(undefined)
    await wrapper.find('[data-testid="btn-reject"]').trigger('click')
    expect(mockRejectClaim).toHaveBeenCalledWith(2)
    expect(mockFetchDetail).toHaveBeenCalledTimes(2)
  })
})

describe('NegociacaoDetalheView — recebida aceita', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockRouteParams = { id: '3' }
    mockRouteQuery = { role: 'recebida' }
    mockLoading.value = false
    mockError.value = null
    mockDetail.value = {
      id: 3,
      status: 'Aceita',
      claimantName: 'André',
      claimantPhone: '(98) 99999-0000',
      itemId: 10,
      itemName: 'Carteira',
      itemOwnerName: 'Lucas',
      itemOwnerPhone: '(98) 88888-0000',
      createdAt: '2026-05-18T10:00:00',
      retrievalCode: 'ABC1234567',
    }
    wrapper = await mountView()
  })

  it('NÃO mostra botões aceitar/rejeitar', () => {
    expect(wrapper.find('[data-testid="btn-accept"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="btn-reject"]').exists()).toBe(false)
  })

  it('mostra botão completar', () => {
    expect(wrapper.find('[data-testid="btn-complete"]').exists()).toBe(true)
  })

  it('completar navega para ativar-codigo', async () => {
    await wrapper.find('[data-testid="btn-complete"]').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({
      name: 'ativar-codigo',
      params: { id: 3 },
    })
  })

  it('mostra código de recuperação', () => {
    expect(wrapper.text()).toContain('ABC1234567')
  })
})

describe('NegociacaoDetalheView — loading', () => {
  it('mostra indicador de loading', async () => {
    mockLoading.value = true
    mockDetail.value = null
    mockRouteParams = { id: '1' }
    mockRouteQuery = { role: 'criada' }
    const wrapper = await mountView()
    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true)
  })
})

describe('NegociacaoDetalheView — error', () => {
  it('mostra mensagem de erro', async () => {
    mockLoading.value = false
    mockError.value = 'Negociação não encontrada'
    mockDetail.value = null
    mockRouteParams = { id: '999' }
    mockRouteQuery = { role: 'criada' }
    const wrapper = await mountView()
    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-message"]').text()).toContain('Negociação não encontrada')
  })
})
