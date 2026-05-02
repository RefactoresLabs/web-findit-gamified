import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemCard from '@/components/ui/ItemCard.vue'
import type { Item } from '@/types/item'

const mockItem: Item = {
  id: 1,
  nome: 'MacBook Pro 14"',
  descricao: 'MacBook Pro 14 polegadas, cor prata',
  local: 'Biblioteca Central',
  data: '12 Mar 2026',
  categoria: 'Eletrônico',
  tipo: 'perdido',
  foto: 'https://picsum.photos/seed/macbook/400/300',
  reportadoPor: 'Maria Silva',
  status: 'Aguardando alguém encontrar este item.',
  
  // ✅ CORREÇÃO AQUI
  lat: -2.5307,
  lng: -44.3068,
}

describe('ItemCard.vue', () => {
  it('renderiza a foto do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    const img = wrapper.find('[data-testid="item-card-image"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockItem.foto)
  })

  it('renderiza o nome do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.find('[data-testid="item-card-name"]').text()).toBe(mockItem.nome)
  })

  it('renderiza o local do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.find('[data-testid="item-card-local"]').text()).toContain(mockItem.local)
  })

  it('renderiza a data do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.find('[data-testid="item-card-data"]').text()).toContain(mockItem.data)
  })

  it('renderiza CategoryChip com a categoria correta', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.find('[data-testid="category-chip"]').text()).toContain(mockItem.categoria)
  })

  it('não renderiza badge de tipo (Perdido/Encontrado)', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.text()).not.toContain('Perdido')
    expect(wrapper.text()).not.toContain('Encontrado')
  })

  it('emite evento select com o id do item ao clicar no card', async () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    await wrapper.find('[data-testid="item-card"]').trigger('click')

    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()

    expect(emitted![0]).toEqual([mockItem.id])
  })
})