import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import AppSidebar from '@/components/layout/AppSidebar.vue'

function mountComponent(props = {}): VueWrapper {
  return mount(AppSidebar, { props })
}

describe('AppSidebar.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mountComponent()
  })

  // 🧪 Renderização
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

  it('renderiza nome do usuário', () => {
    expect(wrapper.find('[data-testid="user-name"]').text()).toBe('Maria Silva')
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

  // 🧠 Estado inicial
  it('inicia expandido', () => {
    expect((wrapper.vm as any).isCollapsed).toBe(false)
  })

  it('Explorar é o item ativo por padrão', () => {
    expect(wrapper.find('[data-testid="nav-explorar"]').classes()).toContain('active')
  })

  // 🔄 Toggle
  it('toggle colapsa o sidebar', async () => {
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    expect((wrapper.vm as any).isCollapsed).toBe(true)
  })

  it('toggle expande o sidebar após colapsar', async () => {
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    expect((wrapper.vm as any).isCollapsed).toBe(false)
  })

  it('adiciona classe collapsed ao container quando colapsado', async () => {
    await wrapper.find('[data-testid="sidebar-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="sidebar"]').classes()).toContain('collapsed')
  })

  // 📡 Emits
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

  // 🏷️ Prop activeItem
  it('marca o item correto como ativo via prop activeItem', () => {
    const w = mountComponent({ activeItem: 'registrar' })
    expect(w.find('[data-testid="nav-registrar"]').classes()).toContain('active')
    expect(w.find('[data-testid="nav-explorar"]').classes()).not.toContain('active')
  })
})
