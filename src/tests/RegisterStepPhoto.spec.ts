import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterStepPhoto from '@/components/registrar/RegisterStepPhoto.vue'

/* =========================
   🔥 MOCK FileReader TIPADO
========================= */
class FileReaderMock implements Partial<FileReader> {
  result: string | ArrayBuffer | null = null
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null

  readAsDataURL(_file: File) {
    this.result = 'data:image/png;base64,fakeimage'

    if (this.onload) {
      this.onload.call(
        this as unknown as FileReader,
        {
          target: { result: this.result }
        } as ProgressEvent<FileReader>
      )
    }
  }
}

vi.stubGlobal('FileReader', FileReaderMock)

/* =========================
   🧪 TEST SUITE
========================= */
describe('RegisterStepPhoto.vue', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any> // 

  beforeEach(() => {
    wrapper = mount(RegisterStepPhoto, {
      props: {
        type: 'lost',
      },
    })
  })

  /* =========================
     🧾 RENDER
  ========================= */
  it('renderiza título e passo corretamente', () => {
    expect(wrapper.text()).toContain('Registrar Item')
    expect(wrapper.text()).toContain('Passo 1 de 3')
  })

  it('mostra badge de perdido', () => {
    expect(wrapper.text()).toContain('Perdido')
  })

  /* =========================
     🔙 BACK EMIT
  ========================= */
  it('emite back ao clicar botão superior', async () => {
    await wrapper.find('.back-btn').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('emite back no botão inferior', async () => {
    await wrapper.find('.btn-secondary').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  /* =========================
     📤 UPLOAD CLICK
  ========================= */
  it('abre input ao clicar na área de upload', async () => {
    const input = wrapper.find('input[type="file"]')

    const clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click')

    await wrapper.find('.upload-area').trigger('click')

    expect(clickSpy).toHaveBeenCalled()
  })

  /* =========================
     📸 UPLOAD FILE
  ========================= */
  it('processa arquivo enviado via input', async () => {
    const file = new File(['fake'], 'photo.png', { type: 'image/png' })

    const input = wrapper.find('input[type="file"]')

    Object.defineProperty(input.element, 'files', {
      value: [file],
    })

    await input.trigger('change')

    expect(wrapper.vm.previewUrl).toBe('data:image/png;base64,fakeimage')
  })

  /* =========================
     📦 DROP FILE
  ========================= */
  it('processa arquivo via drag and drop', async () => {
    const file = new File(['fake'], 'photo.png', { type: 'image/png' })

    await wrapper.find('.upload-area').trigger('drop', {
      dataTransfer: {
        files: [file],
      },
    })

    expect(wrapper.vm.previewUrl).toBe('data:image/png;base64,fakeimage')
  })

  /* =========================
     🗑 REMOVE IMAGE
  ========================= */
  it('remove imagem corretamente', async () => {
    wrapper.vm.previewUrl = 'fake-url'

    await wrapper.vm.$nextTick()

    await wrapper.find('.remove-btn').trigger('click')

    expect(wrapper.vm.previewUrl).toBeNull()
  })

  /* =========================
     🚀 NEXT EMIT
  ========================= */
  it('emite next com foto', async () => {
    wrapper.vm.previewUrl = 'fake-image-url'

    await wrapper.vm.$nextTick()

    await wrapper.find('.btn-primary').trigger('click')

    const emitted = wrapper.emitted('next')
    expect(emitted).toBeTruthy()

    expect(emitted![0]).toEqual([
      { photo: 'fake-image-url' }
    ])
  })
})