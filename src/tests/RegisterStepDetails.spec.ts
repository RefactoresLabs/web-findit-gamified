import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import RegisterStepDetails from '@/components/registrar/RegisterStepDetails.vue'
import { categories } from '@/data/static'

type FormPayload = {
  itemName: string
  category_id: number
  description: string
}

describe('RegisterStepDetails', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(RegisterStepDetails, {
      props: {
        type: 'lost',
        userName: 'Chris',
        userEmail: 'chris@email.com',
      },
    })
  })

  it('renderiza título e passo', () => {
    expect(wrapper.find('h2').text()).toBe('Registrar Item')
    expect(wrapper.text()).toContain('Passo 2 de 3')
  })

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

  it('preenche nome e email com props', () => {
    const inputs = wrapper.findAll('input')
    expect((inputs[0]!.element as HTMLInputElement).value).toBe('Chris')
    expect((inputs[1]!.element as HTMLInputElement).value).toBe('chris@email.com')
  })

  it('renderiza categorias do static data', () => {
    const options = wrapper.findAll('select option')
    // 1 placeholder + N categories
    expect(options.length).toBe(1 + categories.length)
    for (const cat of categories) {
      expect(wrapper.text()).toContain(cat.name)
    }
  })

  it('option values são IDs numéricos', () => {
  const options = wrapper.findAll('select option')

  const valueOptions = options.filter((o) => {
    const option = o.element as HTMLOptionElement
    return option.value !== '' && option.value !== '0'
  })

  for (let i = 0; i < categories.length; i++) {
    expect(
      (valueOptions[i]!.element as HTMLOptionElement).value,
    ).toBe(String(categories[i]!.id))
  }
})

  it('atualiza itemName', async () => {
    const inputs = wrapper.findAll('input')
    await inputs[2]!.setValue('Carteira')
    const vm = wrapper.vm as unknown as { form: FormPayload }
    expect(vm.form.itemName).toBe('Carteira')
  })

  it('atualiza category_id via select', async () => {
    const select = wrapper.find('select')
    await select.setValue(String(categories[0]!.id))
    const vm = wrapper.vm as unknown as { form: FormPayload }
    expect(vm.form.category_id).toBe(categories[0]!.id)
  })

  it('atualiza descrição', async () => {
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Carteira preta')
    const vm = wrapper.vm as unknown as { form: FormPayload }
    expect(vm.form.description).toBe('Carteira preta')
  })

  it('botão inicia desabilitado', () => {
    expect(wrapper.find('.btn-primary').attributes('disabled')).toBeDefined()
  })

  it('habilita botão quando formulário válido', async () => {
    const inputs = wrapper.findAll('input')
    await inputs[2]!.setValue('Carteira')
    await wrapper.find('select').setValue(String(categories[0]!.id))
    await wrapper.find('textarea').setValue('Descrição')
    expect(wrapper.find('.btn-primary').attributes('disabled')).toBeUndefined()
  })

  it('emite next com category_id numérico', async () => {
    const inputs = wrapper.findAll('input')
    await inputs[2]!.setValue('Carteira')
    await wrapper.find('select').setValue(String(categories[0]!.id))
    await wrapper.find('textarea').setValue('Descrição')
    await wrapper.find('.btn-primary').trigger('click')

    const events = wrapper.emitted('next')
    expect(events).toBeTruthy()
    const payload = (events as unknown[][])[0]![0] as FormPayload
    expect(payload.itemName).toBe('Carteira')
    expect(payload.category_id).toBe(categories[0]!.id)
    expect(payload.description).toBe('Descrição')
  })

  it('emite back ao clicar voltar (header)', async () => {
    await wrapper.find('.back-btn').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('emite back ao clicar botão inferior', async () => {
    await wrapper.find('.btn-secondary').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('renderiza stepper corretamente', () => {
    expect(wrapper.findAll('.step').length).toBe(3)
  })
})
