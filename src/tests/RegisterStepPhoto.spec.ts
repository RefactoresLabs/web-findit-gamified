import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterStepPhoto from '@/components/registrar/RegisterStepPhoto.vue'

class FileReaderMock implements Partial<FileReader> {
  result: string | ArrayBuffer | null = null
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null

  readAsDataURL(_file: File) {
    this.result = 'data:image/png;base64,fakeimage'
    if (this.onload) {
      this.onload.call(this as unknown as FileReader, {
        target: { result: this.result },
      } as ProgressEvent<FileReader>)
    }
  }
}

vi.stubGlobal('FileReader', FileReaderMock)

describe('RegisterStepPhoto.vue', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(RegisterStepPhoto, {
      props: { type: 'lost' },
    })
  })

  it('renderiza título e passo corretamente', () => {
    expect(wrapper.text()).toContain('Registrar Item')
    expect(wrapper.text()).toContain('Passo 1 de 3')
  })

  it('mostra badge de perdido', () => {
    expect(wrapper.text()).toContain('Perdido')
  })

  it('emite back ao clicar botão superior', async () => {
    await wrapper.find('.back-btn').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('emite back no botão inferior', async () => {
    await wrapper.find('.btn-secondary').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('abre input ao clicar na área de upload', async () => {
    const input = wrapper.find('input[type="file"]')
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click')
    await wrapper.find('.upload-area').trigger('click')
    expect(clickSpy).toHaveBeenCalled()
  })

  it('processa arquivo enviado via input', async () => {
    const file = new File(['fake'], 'photo.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')
    expect(wrapper.vm.previewUrl).toBe('data:image/png;base64,fakeimage')
  })

  it('armazena File object ao processar arquivo', async () => {
    const file = new File(['fake'], 'photo.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')
    expect(wrapper.vm.selectedFile).toBeInstanceOf(File)
    expect(wrapper.vm.selectedFile.name).toBe('photo.png')
  })

  it('processa arquivo via drag and drop', async () => {
    const file = new File(['fake'], 'photo.png', { type: 'image/png' })
    await wrapper.find('.upload-area').trigger('drop', {
      dataTransfer: { files: [file] },
    })
    expect(wrapper.vm.previewUrl).toBe('data:image/png;base64,fakeimage')
    expect(wrapper.vm.selectedFile).toBeInstanceOf(File)
  })

  it('remove imagem corretamente', async () => {
    wrapper.vm.previewUrl = 'fake-url'
    wrapper.vm.selectedFile = new File(['x'], 'x.jpg')
    await wrapper.vm.$nextTick()
    await wrapper.find('.remove-btn').trigger('click')
    expect(wrapper.vm.previewUrl).toBeNull()
    expect(wrapper.vm.selectedFile).toBeNull()
  })

  it('emite next com photo e file', async () => {
    const file = new File(['fake'], 'photo.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')

    await wrapper.find('.btn-primary').trigger('click')
    const emitted = wrapper.emitted('next')
    expect(emitted).toBeTruthy()
    const payload = emitted![0]![0] as { photo: string; file: File }
    expect(payload.photo).toBe('data:image/png;base64,fakeimage')
    expect(payload.file).toBeInstanceOf(File)
  })

  it('emite next com file null quando sem foto', async () => {
    await wrapper.find('.btn-primary').trigger('click')
    const emitted = wrapper.emitted('next')
    expect(emitted).toBeTruthy()
    const payload = emitted![0]![0] as { photo: string | null; file: File | null }
    expect(payload.photo).toBeNull()
    expect(payload.file).toBeNull()
  })
})
