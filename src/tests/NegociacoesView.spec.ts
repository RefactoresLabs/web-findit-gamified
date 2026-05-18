import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import type { NegotiationItem } from '@/types/item'
import { ref } from 'vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const mockCreated: NegotiationItem[] = [
  {
    id: 1,
    itemId: 10,
    itemName: 'Carteira',
    status: 'Pendente',
    userName: 'André',
    createdAt: '2026-05-18T10:00:00',
  },
]

const mockReceived: NegotiationItem[] = [
  {
    id: 2,
    itemId: 20,
    itemName: 'Notebook',
    status: 'Aceita',
    userName: 'Lucas',
    createdAt: '2026-05-17T14:30:00',
  },
]

const mockFetchNegotiations = vi.fn()
const mockLoading = ref(false)
const mockError = ref<string | null>(null)
const mockCreatedRef = ref<NegotiationItem[]>(mockCreated)
const mockReceivedRef = ref<NegotiationItem[]>(mockReceived)

vi.mock('@/composables/useNegotiations', () => ({
  useNegotiations: () => ({
    createdNegotiations: mockCreatedRef,
    receivedNegotiations: mockReceivedRef,
    loading: mockLoading,
    error: mockError,
    fetchNegotiations: mockFetchNegotiations,
  }),
}))

async function mountView(): Promise<VueWrapper> {
  const mod = await import('@/views/NegociacoesView.vue')
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

describe('NegociacoesView', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockLoading.value = false
    mockError.value = null
    mockCreatedRef.value = mockCreated
    mockReceivedRef.value = mockReceived
    wrapper = await mountView()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza título e subtítulo', () => {
    expect(wrapper.find('.page-title').text()).toBe('Minhas Negociações')
    expect(wrapper.find('.page-sub').text()).toContain('negociações')
  })

  it('renderiza sidebar', () => {
    expect(wrapper.find('[data-testid="sidebar"]').exists()).toBe(true)
  })

  it('chama fetchNegotiations ao montar', () => {
    expect(mockFetchNegotiations).toHaveBeenCalledOnce()
  })

  it('renderiza abas Criadas e Recebidas', () => {
    const tabs = wrapper.findAll('.tab')
    expect(tabs).toHaveLength(2)
    expect(tabs[0]!.text()).toContain('Criadas')
    expect(tabs[1]!.text()).toContain('Recebidas')
  })

  it('inicia com aba Criadas ativa', () => {
    expect(wrapper.find('.tab.active').text()).toContain('Criadas')
  })

  it('mostra contagem nas abas', () => {
    const tabs = wrapper.findAll('.tab')
    expect(tabs[0]!.text()).toContain('1')
    expect(tabs[1]!.text()).toContain('1')
  })

  it('troca para Recebidas ao clicar', async () => {
    await wrapper.findAll('.tab')[1]!.trigger('click')
    expect(wrapper.find('.tab.active').text()).toContain('Recebidas')
  })

  it('renderiza cards de negociações criadas por padrão', () => {
    const cards = wrapper.findAll('.negotiation-card')
    expect(cards).toHaveLength(1)
  })

  it('renderiza cards de negociações recebidas ao trocar aba', async () => {
    await wrapper.findAll('.tab')[1]!.trigger('click')
    const cards = wrapper.findAll('.negotiation-card')
    expect(cards).toHaveLength(1)
  })

  it('card mostra nome do item e nome do usuário', () => {
    const card = wrapper.find('.negotiation-card')
    expect(card.text()).toContain('Carteira')
    expect(card.text()).toContain('André')
  })

  it('card mostra badge de status', () => {
    const badge = wrapper.find('.status-badge')
    expect(badge.text()).toBe('Pendente')
  })

  it('badge Aceita tem classe correta', async () => {
    await wrapper.findAll('.tab')[1]!.trigger('click')
    const badge = wrapper.find('.status-badge')
    expect(badge.classes()).toContain('status-aceita')
  })

  it('navega para detalhe ao clicar no card', async () => {
    await wrapper.find('.negotiation-card').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'negociacao-detalhe', params: { id: 1 }, query: { role: 'criada' } })
  })

  it('renderiza botão FAB de criar negociação', () => {
    expect(wrapper.find('[data-testid="fab-create"]').exists()).toBe(true)
  })

  it('FAB navega para seleção de item', async () => {
    await wrapper.find('[data-testid="fab-create"]').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'selecionar-item' })
  })

  it('mostra estado vazio quando sem negociações', async () => {
    mockCreatedRef.value = []
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('navega corretamente via sidebar', () => {
    const vm = wrapper.vm as any
    vm.handleNavigate('explorar')
    expect(pushMock).toHaveBeenCalledWith({ name: 'explorar' })
  })
})

describe('NegociacoesView — loading state', () => {
  it('mostra indicador de loading', async () => {
    mockLoading.value = true
    mockCreatedRef.value = []
    mockReceivedRef.value = []
    const wrapper = await mountView()
    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true)
    expect(wrapper.find('.negotiations-list').exists()).toBe(false)
  })
})

describe('NegociacoesView — error state', () => {
  it('mostra mensagem de erro', async () => {
    mockLoading.value = false
    mockError.value = 'Erro ao carregar negociações'
    mockCreatedRef.value = []
    mockReceivedRef.value = []
    const wrapper = await mountView()
    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-message"]').text()).toContain('Erro ao carregar negociações')
  })
})
