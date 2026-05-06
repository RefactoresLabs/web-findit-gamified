import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemCard from '@/components/ui/ItemCard.vue'
import type { FeedItem } from '@/types/item'

const mockItem: FeedItem = {
  id: 1,
  name: 'MacBook Pro 14"',
  userName: 'Maria Silva',
  categoryName: 'Material Escolar',
  locationName: 'Sala 206',
  imageUrl: 'https://picsum.photos/seed/macbook/400/300',
  type: 'perdido',
}

describe('ItemCard.vue', () => {
  it('renderiza imagem do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    const img = wrapper.find('[data-testid="item-card-image"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockItem.imageUrl)
  })

  it('renderiza nome do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.find('[data-testid="item-card-name"]').text()).toBe(mockItem.name)
  })

  it('renderiza local do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.find('[data-testid="item-card-local"]').text()).toContain(mockItem.locationName)
  })

  it('renderiza categoria do item', () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    expect(wrapper.find('[data-testid="category-chip"]').text()).toContain(mockItem.categoryName)
  })

  it('emite select com id ao clicar', async () => {
    const wrapper = mount(ItemCard, { props: { item: mockItem } })
    await wrapper.find('[data-testid="item-card"]').trigger('click')

    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([mockItem.id])
  })

  it('renderiza placeholder quando imageUrl vazio', () => {
    const itemSemFoto = { ...mockItem, imageUrl: '' }
    const wrapper = mount(ItemCard, { props: { item: itemSemFoto } })
    expect(wrapper.find('[data-testid="item-card-placeholder"]').exists()).toBe(true)
  })
})
