import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import RegisterStepDetails from '@/components/registrar/RegisterStepDetails.vue'

type FormPayload = {
  itemName: string
  category: string
  description: string
}

describe('RegisterStepDetails - cobertura completa', () => {
  let wrapper: VueWrapper

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
    const badge = wrapper.find('.badge')

    expect(badge.text()).toBe('Perdido')
    expect(badge.classes()).toContain('badge-lost')
  })

  it('mostra badge "Encontrado"', async () => {
    await wrapper.setProps({ type: 'found' })

    const badge = wrapper.find('.badge')

    expect(badge.text()).toBe('Encontrado')
    expect(badge.classes()).toContain('badge-found')
  })

  // ✅ INPUTS INICIAIS
  it('preenche nome e email com props', () => {
    const inputs = wrapper.findAll('input')

    expect(inputs.length).toBeGreaterThanOrEqual(2)

    expect((inputs[0]!.element as HTMLInputElement).value).toBe('Chris')
    expect((inputs[1]!.element as HTMLInputElement).value).toBe('chris@email.com')
  })

  // ✅ FORMULÁRIO (v-model)
  it('atualiza itemName', async () => {
    const inputs = wrapper.findAll('input')

    expect(inputs.length).toBeGreaterThan(2)

    await inputs[2]!.setValue('Carteira')

    const vm = wrapper.vm as unknown as { form: FormPayload }
    expect(vm.form.itemName).toBe('Carteira')
  })

  it('atualiza categoria', async () => {
    const select = wrapper.find('select')

    await select.setValue('documentos')

    const vm = wrapper.vm as unknown as { form: FormPayload }
    expect(vm.form.category).toBe('documentos')
  })

  it('atualiza descrição', async () => {
    const textarea = wrapper.find('textarea')

    await textarea.setValue('Carteira preta')

    const vm = wrapper.vm as unknown as { form: FormPayload }
    expect(vm.form.description).toBe('Carteira preta')
  })

  // ✅ VALIDAÇÃO
  it('botão inicia desabilitado', () => {
    const btn = wrapper.find('.btn-primary')

    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('habilita botão quando formulário válido', async () => {
    const inputs = wrapper.findAll('input')

    expect(inputs.length).toBeGreaterThan(2)

    await inputs[2]!.setValue('Carteira')
    await wrapper.find('select').setValue('documentos')
    await wrapper.find('textarea').setValue('Descrição')

    const btn = wrapper.find('.btn-primary')

    expect(btn.attributes('disabled')).toBeUndefined()
  })

  // ✅ EMIT NEXT
  it('emite next com dados corretos', async () => {
    const inputs = wrapper.findAll('input')

    expect(inputs.length).toBeGreaterThan(2)

    await inputs[2]!.setValue('Carteira')
    await wrapper.find('select').setValue('documentos')
    await wrapper.find('textarea').setValue('Descrição')

    await wrapper.find('.btn-primary').trigger('click')

    const events = wrapper.emitted('next')

    expect(events).toBeTruthy()
    const eventsArray = events as unknown[][]

    expect(eventsArray.length).toBeGreaterThan(0)

    const payload = eventsArray[0]?.[0] as FormPayload

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