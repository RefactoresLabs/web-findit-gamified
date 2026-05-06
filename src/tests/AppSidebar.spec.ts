import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'

function createMockStorage(): Storage {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
}

function createJwtToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.fakesignature`
}

describe('AppSidebar.vue', () => {
  let wrapper: VueWrapper
  let mockStorage: Storage

  beforeEach(async () => {
    mockStorage = createMockStorage()
    const token = createJwtToken({ user_id: 1, email: 'aluno@universidade.com' })
    mockStorage.setItem('auth_token', token)
    vi.stubGlobal('localStorage', mockStorage)
    vi.resetModules()

    const module = await import('@/components/layout/AppSidebar.vue')
    wrapper = mount(module.default, { props: {} })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renderiza o nome da marca corretamente', () => {
    expect(wrapper.find('[data-testid="brand-name"]').text()).toBe('Achados e Perdidos')
  })

  it('renderiza o label Menu', () => {
    expect(wrapper.find('[data-testid="menu-label"]').text()).toBe('Menu')
  })

  it('renderiza item de navegação Explorar', () => {
    expect(wrapper.find('[data-testid="nav-explorar"]').text()).toContain('Explorar')
  })

  it('renderiza item de navegação Registrar', () => {
    expect(wrapper.find('[data-testid="nav-registrar"]').text()).toContain('Registrar')
  })

  it('renderiza item de navegação Meus Itens', () => {
    expect(wrapper.find('[data-testid="nav-meus-itens"]').text()).toContain('Meus Itens')
  })

  it('renderiza email do usuário', () => {
    expect(wrapper.find('[data-testid="user-email"]').text()).toBe('aluno@universidade.com')
  })

  it('renderiza botão de logout', () => {
    expect(wrapper.find('[data-testid="logout-button"]').exists()).toBe(true)
  })

  it('renderiza botão de toggle do sidebar', () => {
    expect(wrapper.find('[data-testid="sidebar-toggle"]').exists()).toBe(true)
  })

  it('inicia expandido', () => {
    expect((wrapper.vm as ComponentPublicInstance & { isCollapsed: boolean }).isCollapsed).toBe(false)
  })

  it('Explorar é o item ativo por padrão', () => {
    expect(wrapper.find('[data-testid="nav-explorar"]').classes()).toContain('active')
  })

  it('toggle colapsa o sidebar', async () => {
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    expect((wrapper.vm as ComponentPublicInstance & { isCollapsed: boolean }).isCollapsed).toBe(true)
  })

  it('toggle expande o sidebar após colapsar', async () => {
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    expect((wrapper.vm as ComponentPublicInstance & { isCollapsed: boolean }).isCollapsed).toBe(false)
  })

  it('adiciona classe collapsed ao container quando colapsado', async () => {
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="sidebar"]').classes()).toContain('collapsed')
  })

  it('emite navigate com explorar ao clicar no item Explorar', async () => {
    await wrapper.find('[data-testid="nav-explorar"]').trigger('click')
    expect(wrapper.emitted('navigate')).toBeTruthy()
    expect(wrapper.emitted('navigate')![0]).toEqual(['explorar'])
  })

  it('emite navigate com registrar ao clicar no item Registrar', async () => {
    await wrapper.find('[data-testid="nav-registrar"]').trigger('click')
    expect(wrapper.emitted('navigate')).toBeTruthy()
    expect(wrapper.emitted('navigate')![0]).toEqual(['registrar'])
  })

  it('emite navigate com meus-itens ao clicar no item Meus Itens', async () => {
    await wrapper.find('[data-testid="nav-meus-itens"]').trigger('click')
    expect(wrapper.emitted('navigate')).toBeTruthy()
    expect(wrapper.emitted('navigate')![0]).toEqual(['meus-itens'])
  })

  it('emite logout ao clicar no botão de logout', async () => {
    await wrapper.find('[data-testid="logout-button"]').trigger('click')
    expect(wrapper.emitted('logout')).toBeTruthy()
  })

  it('logout limpa token do localStorage', async () => {
    await wrapper.find('[data-testid="logout-button"]').trigger('click')
    expect(mockStorage.getItem('auth_token')).toBeNull()
  })
})
