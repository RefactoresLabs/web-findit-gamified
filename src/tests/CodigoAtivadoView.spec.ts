import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

const pushMock = vi.fn()
let mockRouteParams: Record<string, string> = {}

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ params: mockRouteParams }),
}))

async function mountView(): Promise<VueWrapper> {
  const mod = await import('@/views/CodigoAtivadoView.vue')
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

describe('CodigoAtivadoView', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()
    mockRouteParams = { id: '3' }
    wrapper = await mountView()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza mensagem de sucesso', () => {
    expect(wrapper.find('[data-testid="success-message"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Código ativado com sucesso')
  })

  it('renderiza ícone de sucesso', () => {
    expect(wrapper.find('.success-icon').exists()).toBe(true)
  })

  it('botão voltar para negociações navega corretamente', async () => {
    await wrapper.find('[data-testid="btn-go-negotiations"]').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'negociacoes' })
  })
})
