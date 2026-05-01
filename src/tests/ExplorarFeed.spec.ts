import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ExplorarFeed from '@/components/explorar/ExplorarFeed.vue'

function mountComponent(): VueWrapper {
  return mount(ExplorarFeed)
}

describe('ExplorarFeed.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mountComponent()
  })

  // Renderização
  it('renderiza o título "Explorar Itens"', () => {
    expect(wrapper.find('[data-testid="feed-title"]').text()).toBe('Explorar Itens')
  })

  it('renderiza o subtítulo correto', () => {
    expect(wrapper.find('[data-testid="feed-subtitle"]').text()).toBe(
      'Encontre ou registre itens perdidos no campus',
    )
  })

  it('renderiza botão Feed', () => {
    expect(wrapper.find('[data-testid="btn-feed"]').exists()).toBe(true)
  })

  it('renderiza botão Mapa', () => {
    expect(wrapper.find('[data-testid="btn-map"]').exists()).toBe(true)
  })

  it('botão Feed está ativo por padrão', () => {
    expect(wrapper.find('[data-testid="btn-feed"]').classes()).toContain('active')
  })

  it('botão Mapa não está ativo por padrão', () => {
    expect(wrapper.find('[data-testid="btn-map"]').classes()).not.toContain('active')
  })

  it('renderiza campo de busca', () => {
    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true)
  })

  // Tabs
  it('tab "Itens Perdidos" existe', () => {
    expect(wrapper.find('[data-testid="tab-perdido"]').exists()).toBe(true)
  })

  it('tab "Itens Encontrados" existe', () => {
    expect(wrapper.find('[data-testid="tab-encontrado"]').exists()).toBe(true)
  })

  it('tab Perdidos está ativa por padrão', () => {
    expect(wrapper.find('[data-testid="tab-perdido"]').classes()).toContain('active')
  })

  it('renderiza 3 cards na tab Itens Perdidos', () => {
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(3)
  })

  it('renderiza 2 cards na tab Itens Encontrados', async () => {
    await wrapper.find('[data-testid="tab-encontrado"]').trigger('click')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(2)
  })

  // Busca
  it('filtra cards por nome ao buscar', async () => {
    await wrapper.find('[data-testid="search-input"]').setValue('MacBook')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(1)
  })

  it('filtra cards por local ao buscar', async () => {
    await wrapper.find('[data-testid="search-input"]').setValue('Biblioteca')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(1)
  })

  it('mostra 0 cards quando busca não tem resultados', async () => {
    await wrapper.find('[data-testid="search-input"]').setValue('item inexistente xyz')
    expect(wrapper.findAll('[data-testid="item-card"]')).toHaveLength(0)
  })

  // Emits
  it('emite showMap ao clicar no botão Mapa', async () => {
    await wrapper.find('[data-testid="btn-map"]').trigger('click')
    expect(wrapper.emitted('showMap')).toBeTruthy()
  })

  it('emite showDetail com o id ao clicar em um card', async () => {
    const cards = wrapper.findAll('[data-testid="item-card"]')
    const card = cards[0]
    if (!card) throw new Error('Nenhum card encontrado')
    await card.trigger('click')
    expect(wrapper.emitted('showDetail')).toBeTruthy()
    expect(wrapper.emitted('showDetail')![0]).toEqual([1])
  })
})
