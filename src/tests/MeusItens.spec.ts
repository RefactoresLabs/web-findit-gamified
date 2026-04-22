import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MeusItens from '@/components/MeusIntes/MeusItensView.vue'

// ✅ mock correto do router (SEM variável externa)
vi.mock('@/router', () => {
  return {
    default: {
      push: vi.fn()
    }
  }
})

describe('MeusItens - cobertura completa', () => {
  let wrapper: any
  let router: any

  beforeEach(async () => {
    wrapper = mount(MeusItens, {
      global: {
        stubs: {
          AppSidebar: {
            template: '<div data-testid="sidebar"></div>'
          }
        }
      }
    })

    // ✅ pega o mock do router corretamente
    router = await import('@/router')
  })

  // ✅ RENDER
  it('renderiza título e subtítulo', () => {
    expect(wrapper.find('.page-title').text()).toBe('Meus Itens')
    expect(wrapper.find('.page-sub').text()).toContain('Gerencie')
  })

  // ✅ SIDEBAR
  it('renderiza sidebar', () => {
    expect(wrapper.find('[data-testid="sidebar"]').exists()).toBe(true)
  })

  // ✅ TABS
  it('renderiza abas corretamente', () => {
    const tabs = wrapper.findAll('.tab')

    expect(tabs.length).toBe(2)
    expect(tabs[0].text()).toContain('Perdidos')
    expect(tabs[1].text()).toContain('Encontrados')
  })

  it('inicia com aba perdidos ativa', () => {
    expect(wrapper.find('.tab.active').text()).toContain('Perdidos')
  })

  // ✅ TROCA DE TAB
  it('troca para encontrados ao clicar', async () => {
    const tab = wrapper.findAll('.tab')[1]

    await tab.trigger('click')

    expect(wrapper.vm.activeTab).toBe('encontrados')
    expect(wrapper.find('.tab.active').text()).toContain('Encontrados')
  })

  it('volta para perdidos ao clicar novamente', async () => {
    const tabs = wrapper.findAll('.tab')

    await tabs[1].trigger('click')
    await tabs[0].trigger('click')

    expect(wrapper.vm.activeTab).toBe('perdidos')
  })

  // ✅ COMPUTED
  it('currentItems retorna perdidos por padrão', () => {
    expect(wrapper.vm.currentItems).toEqual(wrapper.vm.perdidos)
  })

  it('currentItems retorna encontrados ao trocar aba', async () => {
    await wrapper.findAll('.tab')[1].trigger('click')

    expect(wrapper.vm.currentItems).toEqual(wrapper.vm.encontrados)
  })

  // ✅ LISTA
  it('renderiza itens perdidos', () => {
    const items = wrapper.findAll('.item-card')

    expect(items.length).toBe(wrapper.vm.perdidos.length)
  })

  it('renderiza itens encontrados', async () => {
    await wrapper.findAll('.tab')[1].trigger('click')

    const items = wrapper.findAll('.item-card')

    expect(items.length).toBe(wrapper.vm.encontrados.length)
  })

  // ✅ CONTEÚDO
  it('mostra título e localização do item', () => {
    const item = wrapper.find('.item-card')

    expect(item.text()).toContain('MacBook')
    expect(item.text()).toContain('Biblioteca')
  })

  // ✅ IMAGEM / PLACEHOLDER
  it('mostra imagem quando existe', () => {
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('mostra placeholder quando não tem imagem', async () => {
    wrapper.vm.perdidos[0].image = ''

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.thumb-placeholder').exists()).toBe(true)
  })

  // ✅ BADGE
  it('mostra badge "Perdido" por padrão', () => {
    expect(wrapper.find('.item-badge').text()).toBe('Perdido')
  })

  it('muda badge para "Encontrado"', async () => {
    await wrapper.findAll('.tab')[1].trigger('click')

    expect(wrapper.find('.item-badge').text()).toBe('Encontrado')
  })

  // ✅ EMPTY STATE
  it('mostra estado vazio quando não há itens', async () => {
    wrapper.vm.perdidos = []
    wrapper.vm.activeTab = 'perdidos'

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  // ✅ NAVEGAÇÃO
  it('navega para explorar', () => {
    wrapper.vm.handleNavigate('explorar')

    expect(router.default.push).toHaveBeenCalledWith('/explorar')
  })

  it('navega para registrar', () => {
    wrapper.vm.handleNavigate('registrar')

    expect(router.default.push).toHaveBeenCalledWith('/register')
  })

  it('navega para meus-itens', () => {
    wrapper.vm.handleNavigate('meus-itens')

    expect(router.default.push).toHaveBeenCalledWith('/meus-itens')
  })

  it('não navega com rota inválida', () => {
    router.default.push.mockClear()

    wrapper.vm.handleNavigate('invalido')

    expect(router.default.push).not.toHaveBeenCalled()
  })

  // ✅ LOGOUT
  it('faz logout corretamente', () => {
    delete (window as any).location
    window.location = { href: '' } as any

    wrapper.vm.handleLogout()

    expect(window.location.href).toBe('/')
  })

  // ✅ UI
  it('renderiza botão de seta', () => {
    expect(wrapper.find('.item-arrow').exists()).toBe(true)
  })
})