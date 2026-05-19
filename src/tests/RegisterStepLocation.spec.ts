import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterStepLocation from '@/components/registrar/RegisterStepLocation.vue'
import { buildings, buildingSpaces } from '@/data/static'

vi.mock('leaflet', () => {
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    flyTo: vi.fn().mockReturnThis(),
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

type GeoResponse = Array<{ lat: string; lon: string }>

globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve<GeoResponse>([{ lat: '-2.5046', lon: '-44.2825' }]),
  }),
) as unknown as typeof fetch

describe('RegisterStepLocation — lost item', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(RegisterStepLocation, {
      props: { type: 'lost' },
    })
  })

  it('renderiza título e passo', () => {
    expect(wrapper.text()).toContain('Registrar Item')
    expect(wrapper.text()).toContain('Passo 3 de 3')
  })

  it('exibe badge de perdido', () => {
    expect(wrapper.text()).toContain('Perdido')
  })

  it('renderiza select de prédio com buildings do static data', () => {
    const selects = wrapper.findAll('select')
    const buildingSelect = selects[0]!

    for (const b of buildings) {
      expect(buildingSelect.text()).toContain(b.name)
    }
  })

  it('renderiza select de local com buildingSpaces', () => {
    const selects = wrapper.findAll('select')
    const locationSelect = selects[1]!

    for (const space of buildingSpaces) {
      expect(locationSelect.text()).toContain(space.name)
    }
  })

  it('building_space option values são IDs numéricos', () => {
    const selects = wrapper.findAll('select')
    const options = selects[1]!.findAll('option')

    const valueOptions = options.filter(
      (o) => o.element.value !== '' && o.element.value !== '0',
    )

    for (let i = 0; i < buildingSpaces.length; i++) {
      expect(valueOptions[i]!.element.value).toBe(
        String(buildingSpaces[i]!.id),
      )
    }
  })

  it('lost tem 2 selects (prédio + local)', () => {
    const selects = wrapper.findAll('select')
    expect(selects.length).toBe(2)
  })

  it('botão inicia desabilitado', () => {
    expect(wrapper.find('.btn-primary').attributes('disabled')).toBeDefined()
  })

  it('habilita botão quando form válido', async () => {
    type LocationForm = {
      building_id: number
      building_space_id: number
      lat: number | null
      lng: number | null
    }

    const vm = wrapper.vm as unknown as { form: LocationForm }

    vm.form.building_id = 1
    vm.form.building_space_id = 1
    vm.form.lat = -2.5
    vm.form.lng = -44.28

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.btn-primary').attributes('disabled')).toBeUndefined()
  })

  it('emite submit com building_space_id', async () => {
    type LocationForm = {
      building_id: number
      building_space_id: number
      lat: number | null
      lng: number | null
    }

    const vm = wrapper.vm as unknown as { form: LocationForm }

    vm.form.building_id = 1
    vm.form.building_space_id = 2
    vm.form.lat = -2.5
    vm.form.lng = -44.28

    await wrapper.vm.$nextTick()

    await wrapper.find('.btn-primary').trigger('click')

    const events = wrapper.emitted('submit')

    expect(events).toBeTruthy()

    const payload = (events as unknown[][])[0]![0] as LocationForm

    expect(payload.building_space_id).toBe(2)
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

describe('RegisterStepLocation — found item', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(RegisterStepLocation, {
      props: { type: 'found' },
    })
  })

  it('exibe badge de encontrado', () => {
    expect(wrapper.text()).toContain('Encontrado')
  })

  it('found tem 3 selects (prédio + local + onde deixou)', () => {
    const selects = wrapper.findAll('select')

    expect(selects.length).toBe(3)
  })

  it('left_building_space select tem buildingSpaces', () => {
    const selects = wrapper.findAll('select')
    const leftSelect = selects[2]!

    for (const space of buildingSpaces) {
      expect(leftSelect.text()).toContain(space.name)
    }
  })

  it('emite submit com left_building_space_id', async () => {
    type FoundLocationForm = {
      building_id: number
      building_space_id: number
      left_building_space_id: number
      lat: number | null
      lng: number | null
    }

    const vm = wrapper.vm as unknown as { form: FoundLocationForm }

    vm.form.building_id = 1
    vm.form.building_space_id = 1
    vm.form.left_building_space_id = 3
    vm.form.lat = -2.5
    vm.form.lng = -44.28

    await wrapper.vm.$nextTick()

    await wrapper.find('.btn-primary').trigger('click')

    const events = wrapper.emitted('submit')

    expect(events).toBeTruthy()

    const payload = (events as unknown[][])[0]![0] as FoundLocationForm

    expect(payload.building_space_id).toBe(1)
    expect(payload.left_building_space_id).toBe(3)
  })
})