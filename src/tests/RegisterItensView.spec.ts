import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick, type ComponentPublicInstance } from 'vue'
import { ref } from 'vue'

type RegisterItensVM = ComponentPublicInstance & {
  currentView: 'selection' | 'photo' | 'details' | 'location'
  formData: Record<string, unknown>
  goBack: () => void
  submitting: boolean
  submitError: string | null
}

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/components/layout/AppSidebar.vue', () => ({
  default: {
    template: `
      <div>
        <button class="nav-register" @click="$emit('navigate','registrar')"></button>
        <button class="nav-explore" @click="$emit('navigate','explorar')"></button>
      </div>
    `,
  },
}))

vi.mock('@/components/registrar/RegisterSelection.vue', () => ({
  default: {
    template: `<button class="select" @click="$emit('select','lost')">select</button>`,
  },
}))

vi.mock('@/components/registrar/RegisterStepPhoto.vue', () => ({
  default: {
    template: `
      <div>
        <button class="next" @click="$emit('next',{ photo:'img.png', file: null })">next</button>
        <button class="back" @click="$emit('back')">back</button>
      </div>
    `,
  },
}))

vi.mock('@/components/registrar/RegisterStepDetails.vue', () => ({
  default: {
    template: `
      <div>
        <button class="next" @click="$emit('next',{ itemName:'Carteira', category_id: 1, description: 'desc' })">next</button>
        <button class="back" @click="$emit('back')">back</button>
      </div>
    `,
  },
}))

vi.mock('@/components/registrar/RegisterStepLocation.vue', () => ({
  default: {
    template: `
      <div>
        <button class="submit" @click="$emit('submit',{ building_space_id: 2, left_building_space_id: 0, lat: -2.53, lng: -44.3 })">submit</button>
        <button class="back" @click="$emit('back')">back</button>
      </div>
    `,
  },
}))

const mockUploadImage = vi.fn()
const mockCreateLostItem = vi.fn()
const mockCreateFoundItem = vi.fn()
const mockRegisterLoading = ref(false)
const mockRegisterError = ref<string | null>(null)

vi.mock('@/composables/useRegisterItem', () => ({
  useRegisterItem: () => ({
    uploadImage: mockUploadImage,
    createLostItem: mockCreateLostItem,
    createFoundItem: mockCreateFoundItem,
    loading: mockRegisterLoading,
    error: mockRegisterError,
  }),
}))

const mockUserEmail = ref<string | null>('maria@undb.edu.br')

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    userEmail: mockUserEmail,
    isAuthenticated: ref(true),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

describe('RegisterItensView — flow', () => {
  let wrapper: VueWrapper<RegisterItensVM>

  beforeEach(async () => {
    vi.clearAllMocks()
    mockUploadImage.mockResolvedValue('/uploads/photo.jpg')
    mockCreateLostItem.mockResolvedValue(undefined)
    mockCreateFoundItem.mockResolvedValue(undefined)
    mockRegisterLoading.value = false
    mockRegisterError.value = null

    vi.resetModules()
    const { default: RegisterView } = await import('@/views/RegisterItensView.vue')
    wrapper = mount(RegisterView, {
      global: { stubs: ['router-link'] },
    }) as VueWrapper<RegisterItensVM>
  })

  it('inicia no selection', () => {
    expect(wrapper.html()).toContain('select')
  })

  it('seleciona tipo e vai para photo', async () => {
    await wrapper.find('.select').trigger('click')
    expect(wrapper.vm.currentView).toBe('photo')
  })

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

  it('vai de details para location', async () => {
    wrapper.vm.currentView = 'details'
    await nextTick()
    await wrapper.find('.next').trigger('click')
    expect(wrapper.vm.currentView).toBe('location')
  })

  it('goBack funciona corretamente', () => {
    wrapper.vm.currentView = 'details'
    wrapper.vm.goBack()
    expect(wrapper.vm.currentView).toBe('photo')
    wrapper.vm.goBack()
    expect(wrapper.vm.currentView).toBe('selection')
  })

  it('sidebar reset register', async () => {
    await wrapper.find('.nav-register').trigger('click')
    expect(wrapper.vm.currentView).toBe('selection')
    expect(wrapper.vm.formData).toEqual({})
  })

  it('sidebar navega para explorar', async () => {
    await wrapper.find('.nav-explore').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'explorar' })
  })
})

describe('RegisterItensView — API submission (lost)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUploadImage.mockResolvedValue('/uploads/photo.jpg')
    mockCreateLostItem.mockResolvedValue(undefined)
    mockRegisterLoading.value = false
    mockRegisterError.value = null
  })

  async function mountAndSubmit() {
    vi.resetModules()
    const { default: RegisterView } = await import('@/views/RegisterItensView.vue')
    const wrapper = mount(RegisterView, {
      global: { stubs: ['router-link'] },
    }) as VueWrapper<RegisterItensVM>

    // selection → photo
    await wrapper.find('.select').trigger('click')
    // photo → details
    await wrapper.find('.next').trigger('click')
    // details → location
    await wrapper.find('.next').trigger('click')
    // submit
    await wrapper.find('.submit').trigger('click')
    await nextTick()
    await nextTick()

    return wrapper
  }

  it('calls createLostItem on submit for lost type', async () => {
    await mountAndSubmit()
    expect(mockCreateLostItem).toHaveBeenCalledOnce()
    const args = mockCreateLostItem.mock.calls[0][0]
    expect(args.name).toBe('Carteira')
    expect(args.category_id).toBe(1)
    expect(args.description).toBe('desc')
    expect(args.lost_building_space_id).toBe(2)
  })

  it('does NOT call uploadImage when file is null', async () => {
    await mountAndSubmit()
    expect(mockUploadImage).not.toHaveBeenCalled()
  })

  it('navigates to explorar on success', async () => {
    await mountAndSubmit()
    expect(pushMock).toHaveBeenCalledWith({ name: 'explorar' })
  })
})

describe('RegisterItensView — API submission with file upload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUploadImage.mockResolvedValue('/uploads/photo.jpg')
    mockCreateLostItem.mockResolvedValue(undefined)
    mockRegisterLoading.value = false
    mockRegisterError.value = null
  })

  it('calls uploadImage then createLostItem when file exists', async () => {
    vi.resetModules()

    vi.doMock('@/components/registrar/RegisterStepPhoto.vue', () => ({
      default: {
        template: `
          <div>
            <button class="next" @click="$emit('next',{ photo:'data:img', file: mockFile })">next</button>
            <button class="back" @click="$emit('back')">back</button>
          </div>
        `,
        setup() {
          const mockFile = new File(['img'], 'photo.jpg', { type: 'image/jpeg' })
          return { mockFile }
        },
      },
    }))

    const { default: RegisterView } = await import('@/views/RegisterItensView.vue')
    const wrapper = mount(RegisterView, {
      global: { stubs: ['router-link'] },
    }) as VueWrapper<RegisterItensVM>

    await wrapper.find('.select').trigger('click')
    await wrapper.find('.next').trigger('click')
    await wrapper.find('.next').trigger('click')
    await wrapper.find('.submit').trigger('click')
    await nextTick()
    await nextTick()

    expect(mockUploadImage).toHaveBeenCalledOnce()
    expect(mockCreateLostItem).toHaveBeenCalledOnce()
    const args = mockCreateLostItem.mock.calls[0][0]
    expect(args.image_urls).toEqual(['/uploads/photo.jpg'])
  })
})

describe('RegisterItensView — passes userEmail to details', () => {
  it('passes userEmail from useAuth', async () => {
    vi.resetModules()

    vi.doMock('@/components/registrar/RegisterStepDetails.vue', () => ({
      default: {
        props: ['type', 'userName', 'userEmail'],
        template: `<div><span data-testid="user-email">{{ userEmail }}</span><button class="back" @click="$emit('back')">back</button></div>`,
      },
    }))

    const { default: RegisterView } = await import('@/views/RegisterItensView.vue')
    const wrapper = mount(RegisterView, {
      global: { stubs: ['router-link'] },
    }) as VueWrapper<RegisterItensVM>

    wrapper.vm.currentView = 'details'
    await nextTick()

    expect(wrapper.find('[data-testid="user-email"]').text()).toBe('maria@undb.edu.br')
  })
})
