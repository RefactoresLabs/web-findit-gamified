import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExplorarItemDetail from '@/components/explorar/ExplorarItemDetail.vue'

describe('ExplorarItemDetail.vue', () => {
  function mountComponent(itemId = 1) {
    return mount(ExplorarItemDetail, { props: { itemId } })
  }

  // Renderização geral
  it('renderiza o botão Voltar', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="btn-voltar"]').exists()).toBe(true)
  })

  it('botão Voltar contém texto "Voltar"', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="btn-voltar"]').text()).toContain('Voltar')
  })

  it('renderiza a foto do item', () => {
    const wrapper = mountComponent()
    const img = wrapper.find('[data-testid="detail-foto"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://picsum.photos/seed/macbook/400/300')
  })

  it('renderiza o nome do item em h1', () => {
    const wrapper = mountComponent()
    const nome = wrapper.find('[data-testid="detail-nome"]')
    expect(nome.exists()).toBe(true)
    expect(nome.text()).toBe('MacBook Pro 14"')
    expect(nome.element.tagName).toBe('H1')
  })

  it('renderiza a descrição do item', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="detail-descricao"]').text()).toContain(
      'MacBook Pro 14 polegadas',
    )
  })

  it('renderiza o local nos metadados', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="detail-local"]').text()).toContain('Biblioteca Central')
  })

  it('renderiza a data nos metadados', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="detail-data"]').text()).toContain('12 Mar 2026')
  })

  it('renderiza o reportadoPor nos metadados', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="detail-reportado-por"]').text()).toContain('Maria Silva')
  })

  it('renderiza CategoryChip com a categoria correta', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="category-chip"]').text()).toContain('Eletrônico')
  })

  it('renderiza o separador', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="detail-separator"]').exists()).toBe(true)
  })

  it('renderiza o status do item', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="detail-status"]').text()).toContain(
      'Aguardando alguém encontrar este item.',
    )
  })

  // Emits
  it('emite back ao clicar no botão Voltar', async () => {
    const wrapper = mountComponent()
    await wrapper.find('[data-testid="btn-voltar"]').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  // Item diferente (id=2)
  it('carrega dados do item correto quando itemId muda', () => {
    const wrapper = mountComponent(2)
    expect(wrapper.find('[data-testid="detail-nome"]').text()).toBe('Caderno de Cálculo III')
    expect(wrapper.find('[data-testid="detail-local"]').text()).toContain('Lab. Informática 3')
  })
})
