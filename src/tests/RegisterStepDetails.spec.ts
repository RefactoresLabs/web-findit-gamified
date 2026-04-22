import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterStepDetails from '@/components/registrar/RegisterStepDetails.vue'

describe('RegisterStepDetails - cobertura completa', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(RegisterStepDetails, {
      props: {
        type: 'lost',
        userName: 'Chris',
        userEmail: 'chris@email.com'
      }
    })
  })

  // ✅ RENDER
  it('renderiza título e passo', () => {
    expect(wrapper.find('h2').text()).toBe('Registrar Item')
    expect(wrapper.text()).toContain('Passo 2 de 3')
  })

  // ✅ BADGE
  it('mostra badge "Perdido"', () => {
    expect(wrapper.find('.badge').text()).toBe('Perdido')
    expect(wrapper.find('.badge').classes()).toContain('badge-lost')
  })

  it('mostra badge "Encontrado"', async () => {
    await wrapper.setProps({ type: 'found' })

    expect(wrapper.find('.badge').text()).toBe('Encontrado')
    expect(wrapper.find('.badge').classes()).toContain('badge-found')
  })

  // ✅ INPUTS INICIAIS
  it('preenche nome e email com props', () => {
    const inputs = wrapper.findAll('input')

    expect(inputs[0].element.value).toBe('Chris')
    expect(inputs[1].element.value).toBe('chris@email.com')
  })

  // ✅ FORMULÁRIO (v-model)
  it('atualiza itemName', async () => {
    const input = wrapper.findAll('input')[2]

    await input.setValue('Carteira')

    expect(wrapper.vm.form.itemName).toBe('Carteira')
  })

  it('atualiza categoria', async () => {
    const select = wrapper.find('select')

    await select.setValue('documentos')

    expect(wrapper.vm.form.category).toBe('documentos')
  })

  it('atualiza descrição', async () => {
    const textarea = wrapper.find('textarea')

    await textarea.setValue('Carteira preta')

    expect(wrapper.vm.form.description).toBe('Carteira preta')
  })

  // ✅ VALIDAÇÃO
  it('botão inicia desabilitado', () => {
    const btn = wrapper.find('.btn-primary')

    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('habilita botão quando formulário válido', async () => {
    await wrapper.findAll('input')[2].setValue('Carteira')
    await wrapper.find('select').setValue('documentos')
    await wrapper.find('textarea').setValue('Descrição')

    const btn = wrapper.find('.btn-primary')

    expect(btn.attributes('disabled')).toBeUndefined()
  })

  // ✅ EMIT NEXT
  it('emite next com dados corretos', async () => {
    await wrapper.findAll('input')[2].setValue('Carteira')
    await wrapper.find('select').setValue('documentos')
    await wrapper.find('textarea').setValue('Descrição')

    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.emitted('next')).toBeTruthy()

    const payload = wrapper.emitted('next')[0][0]

    expect(payload.itemName).toBe('Carteira')
    expect(payload.category).toBe('documentos')
    expect(payload.description).toBe('Descrição')
  })

  // ✅ EMIT BACK
  it('emite back ao clicar voltar (header)', async () => {
    await wrapper.find('.back-btn').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('emite back ao clicar botão inferior', async () => {
    await wrapper.find('.btn-secondary').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  // ✅ STEP VISUAL
  it('renderiza stepper corretamente', () => {
    const steps = wrapper.findAll('.step')

    expect(steps.length).toBe(3)
  })
})