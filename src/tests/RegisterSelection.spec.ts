import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import RegisterSelection from '@/components/registrar/RegisterSelection.vue'

describe('RegisterSelection - cobertura completa', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(RegisterSelection)
  })

  // ✅ RENDER
  it('renderiza título e subtítulo', () => {
    expect(wrapper.find('h1').text()).toBe('Registrar Item')
    expect(wrapper.find('p').text()).toContain('Escolha o tipo')
  })

  // ✅ CARDS
  it('renderiza dois cards', () => {
    const cards = wrapper.findAll('.card')
    expect(cards.length).toBe(2)
  })

  // ✅ TEXTOS DOS CARDS
  it('renderiza textos dos cards corretamente', () => {
    const texts = wrapper.text()

    expect(texts).toContain('Perdi algo')
    expect(texts).toContain('Encontrei algo')
  })

  // ✅ BOTÕES
  it('renderiza botões corretamente', () => {
    const buttons = wrapper.findAll('button')

    expect(buttons.length).toBe(2)
    expect(buttons[0]!.text()).toContain('Registrar Perda')
    expect(buttons[1]!.text()).toContain('Registrar Achado')
  })

  // ✅ EMIT LOST
  it('emite evento "lost" ao clicar em Registrar Perda', async () => {
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)

    const button = buttons[0]!
    await button.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual(['lost'])
  })

  // ✅ EMIT FOUND
  it('emite evento "found" ao clicar em Registrar Achado', async () => {
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(1)

    const button = buttons[1]!
    await button.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual(['found'])
  })

  // ✅ ICONES
  it('renderiza ícones corretamente', () => {
    const icons = wrapper.findAll('.icon-box i')

    expect(icons.length).toBe(2)
  })

  // ✅ CLASSES VISUAIS
  it('aplica classes corretas para lost e found', () => {
    const lost = wrapper.find('.icon-box.lost')
    const found = wrapper.find('.icon-box.found')

    expect(lost.exists()).toBe(true)
    expect(found.exists()).toBe(true)
  })

  // ✅ BOTÕES COM CLASSE
  it('botões possuem classes corretas', () => {
    const buttons = wrapper.findAll('.btn')

    expect(buttons.length).toBe(2)
    expect(buttons[0]!.classes()).toContain('lost')
    expect(buttons[1]!.classes()).toContain('found')
  })
})