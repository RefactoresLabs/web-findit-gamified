import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExplorarMap from '@/components/explorar/ExplorarMap.vue'

describe('ExplorarMap.vue', () => {
  it('renderiza o container do mapa', () => {
    const wrapper = mount(ExplorarMap)
    expect(wrapper.find('[data-testid="mapa-container"]').exists()).toBe(true)
  })

  it('renderiza o iframe do Google Maps', () => {
    const wrapper = mount(ExplorarMap)
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toContain('maps.google.com')
  })

  it('renderiza o botão Feed', () => {
    const wrapper = mount(ExplorarMap)
    expect(wrapper.find('[data-testid="btn-feed"]').exists()).toBe(true)
  })

  it('botão Feed contém texto "Feed"', () => {
    const wrapper = mount(ExplorarMap)
    expect(wrapper.find('[data-testid="btn-feed"]').text()).toContain('Feed')
  })

  it('emite back ao clicar no botão Feed', async () => {
    const wrapper = mount(ExplorarMap)
    await wrapper.find('[data-testid="btn-feed"]').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })
})
