import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import RegisterView from '@/components/registrar/RegisterView.vue'

/* =========================
   🔥 MOCK ROUTER
========================= */
const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

/* =========================
   🔥 MOCK SIDEBAR
========================= */
vi.mock('@/components/layout/AppSidebar.vue', () => ({
  default: {
    template: `<div>
      <button class="nav-register" @click="$emit('navigate','registrar')"></button>
      <button class="nav-explore" @click="$emit('navigate','explorar')"></button>
    </div>`,
  },
}))

/* =========================
   🔥 MOCK CHILD COMPONENTS
========================= */
vi.mock('@/components/registrar/RegisterSelection.vue', () => ({
  default: {
    template: `<button class="select" @click="$emit('select','lost')">select</button>`,
  },
}))

vi.mock('@/components/registrar/RegisterStepPhoto.vue', () => ({
  default: {
    template: `
      <div>
        <button class="next" @click="$emit('next',{ photo:'img.png' })">next</button>
        <button class="back" @click="$emit('back')">back</button>
      </div>
    `,
  },
}))

vi.mock('@/components/registrar/RegisterStepDetails.vue', () => ({
  default: {
    template: `
      <div>
        <button class="next" @click="$emit('next',{ title:'item' })">next</button>
        <button class="back" @click="$emit('back')">back</button>
      </div>
    `,
  },
}))

vi.mock('@/components/registrar/RegisterStepLocation.vue', () => ({
  default: {
    template: `
      <div>
        <button class="submit" @click="$emit('submit',{ lat:1, lng:2 })">submit</button>
        <button class="back" @click="$emit('back')">back</button>
      </div>
    `,
  },
}))

/* =========================
   🧪 TESTS
========================= */
describe('RegisterView - fluxo completo', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(RegisterView, {
      global: {
        stubs: ['router-link'],
      },
    })
  })

  /* =========================
     📍 INIT
  ========================= */
  it('inicia no selection', () => {
    expect(wrapper.html()).toContain('select')
  })

  /* =========================
     📸 FLOW STEP 1
  ========================= */
  it('seleciona tipo e vai para photo', async () => {
    await wrapper.find('.select').trigger('click')
    expect(wrapper.vm.currentView).toBe('photo')
  })

  /* =========================
     📸 PHOTO → DETAILS
  ========================= */
  it('vai de photo para details', async () => {
    wrapper.vm.currentView = 'photo'
    await nextTick()

    await wrapper.find('.next').trigger('click')

    expect(wrapper.vm.currentView).toBe('details')
  })

  it('volta da photo', async () => {
    wrapper.vm.currentView = 'photo'
    await nextTick()

    await wrapper.find('.back').trigger('click')

    expect(wrapper.vm.currentView).toBe('selection')
  })

  /* =========================
     🧾 DETAILS → LOCATION
  ========================= */
  it('vai de details para location', async () => {
    wrapper.vm.currentView = 'details'
    await nextTick()

    await wrapper.find('.next').trigger('click')

    expect(wrapper.vm.currentView).toBe('location')
  })

  /* =========================
     📍 FINALIZAÇÃO
  ========================= */
  it('finaliza e chama router.push', async () => {
    wrapper.vm.currentView = 'location'
    await nextTick()

    await wrapper.find('.submit').trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/explorar')
    expect(wrapper.vm.currentView).toBe('selection')
  })

  /* =========================
     🔙 BACK FLOW
  ========================= */
  it('goBack funciona corretamente', () => {
    wrapper.vm.currentView = 'details'

    wrapper.vm.goBack()
    expect(wrapper.vm.currentView).toBe('photo')

    wrapper.vm.goBack()
    expect(wrapper.vm.currentView).toBe('selection')
  })

  /* =========================
     🧭 SIDEBAR
  ========================= */
  it('sidebar reset register', async () => {
    await wrapper.find('.nav-register').trigger('click')

    expect(wrapper.vm.currentView).toBe('selection')
    expect(wrapper.vm.formData).toEqual({})
  })

  it('sidebar navega para explorar', async () => {
    await wrapper.find('.nav-explore').trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/explorar')
  })
})