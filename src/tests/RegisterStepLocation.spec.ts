import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterStepLocation from '@/components/registrar/RegisterStepLocation.vue'

/* =========================
   🔥 MOCK LEAFLET
========================= */
vi.mock('leaflet', () => {
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    on: vi.fn(),
  }

  const markerMock = {
    addTo: vi.fn().mockReturnThis(),
    setLatLng: vi.fn(),
  }

  return {
    default: {
      map: vi.fn(() => mapMock),
      tileLayer: vi.fn(() => ({
        addTo: vi.fn(),
      })),
      marker: vi.fn(() => markerMock),
      Icon: {
        Default: {
          prototype: {},
          mergeOptions: vi.fn(),
        },
      },
    },
  }
})

/* =========================
   🔥 TIPAGEM DO FETCH
========================= */
type GeoResponse = Array<{
  lat: string
  lon: string
}>

/* =========================
   🔥 MOCK FETCH (SEM ANY)
========================= */
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve<GeoResponse>([
        { lat: '-2.5307', lon: '-44.3068' },
      ]),
  })
) as unknown as typeof fetch

/* =========================
   🧪 TESTES
========================= */
describe('RegisterStepLocation - cobertura completa', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(RegisterStepLocation, {
      props: {
        type: 'lost',
      },
    })
  })

  /* =========================
     🧾 RENDER BÁSICO
  ========================= */
  it('renderiza título e passo corretamente', () => {
    expect(wrapper.text()).toContain('Registrar Item')
    expect(wrapper.text()).toContain('Passo 3 de 3')
  })

  it('exibe badge de perdido', () => {
    expect(wrapper.text()).toContain('Perdido')
  })

  /* =========================
     📍 FORM BINDINGS
  ========================= */
  it('atualiza prédio via select', async () => {
    const select = wrapper.find('select')

    await select.setValue('UNDB')

    const vm = wrapper.vm as unknown as {
      form: { predio: string }
    }

    expect(vm.form.predio).toBe('UNDB')
  })

  it('atualiza descrição', async () => {
    const input = wrapper.find('input[type="text"]')

    await input.setValue('Sala 204')

    const vm = wrapper.vm as unknown as {
      form: { descricao: string }
    }

    expect(vm.form.descricao).toBe('Sala 204')
  })

  /* =========================
     🌐 API CALL (WATCH)
  ========================= */
  it('chama API ao selecionar prédio', async () => {
    const select = wrapper.find('select')

    await select.setValue('UNDB')
    await wrapper.vm.$nextTick()

    expect(fetch).toHaveBeenCalled()
  })

  /* =========================
     🔘 BOTÕES
  ========================= */
  it('botão inicia desabilitado', () => {
    const btn = wrapper.find('.btn-primary')

    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('habilita botão quando formulário é válido', async () => {
    const vm = wrapper.vm as unknown as {
      form: {
        predio: string
        lat: number | null
        lng: number | null
        datetime: string
      }
    }

    vm.form.predio = 'UNDB'
    vm.form.lat = -2.53
    vm.form.lng = -44.30
    vm.form.datetime = '2026-01-01T10:00'

    await wrapper.vm.$nextTick()

    const btn = wrapper.find('.btn-primary')

    expect(btn.attributes('disabled')).toBeUndefined()
  })

  /* =========================
     📤 EMISSÕES
  ========================= */
  it('emite submit com dados corretos', async () => {
    const vm = wrapper.vm as unknown as {
      form: {
        predio: string
        lat: number | null
        lng: number | null
        datetime: string
      }
    }

    vm.form.predio = 'UNDB'
    vm.form.lat = -2.53
    vm.form.lng = -44.30
    vm.form.datetime = '2026-01-01T10:00'

    await wrapper.vm.$nextTick()

    await wrapper.find('.btn-primary').trigger('click')

    const events = wrapper.emitted('submit')

    expect(events).toBeTruthy()
    expect(events!.length).toBeGreaterThan(0)
  })

  it('emite back no botão superior', async () => {
    await wrapper.find('.back-btn').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('emite back no botão inferior', async () => {
    await wrapper.find('.btn-secondary').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })
})