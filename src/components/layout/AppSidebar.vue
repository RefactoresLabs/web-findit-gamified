<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = withDefaults(
  defineProps<{
    activeItem?: string
  }>(),
  { activeItem: 'explorar' },
)

const emit = defineEmits<{
  navigate: [item: string]
  logout: []
}>()

const { userEmail, logout: authLogout } = useAuth()
const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

function navigate(item: string) {
  emit('navigate', item)
}

function logout() {
  authLogout()
  emit('logout')
}

const navItems = [
  { key: 'explorar', label: 'Explorar', icon: 'pi-search', testid: 'nav-explorar' },
  { key: 'registrar', label: 'Registrar', icon: 'pi-plus-circle', testid: 'nav-registrar' },
  { key: 'meus-itens', label: 'Meus Itens', icon: 'pi-box', testid: 'nav-meus-itens' },
]
</script>

<template>
  <aside data-testid="sidebar" class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo -->
    <div class="sidebar-brand">
      <div class="brand-icon">
        <i class="pi pi-map-marker" aria-hidden="true"></i>
      </div>
      <span v-if="!isCollapsed" data-testid="brand-name" class="brand-name">Achados e Perdidos</span>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <p v-if="!isCollapsed" data-testid="menu-label" class="menu-label">Menu</p>

      <button
        v-for="item in navItems"
        :key="item.key"
        :data-testid="item.testid"
        class="nav-item"
        :class="{ active: props.activeItem === item.key }"
        @click="navigate(item.key)"
      >
        <i :class="`pi ${item.icon}`" aria-hidden="true"></i>
        <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="user-info">
        <div v-if="!isCollapsed" class="user-details">
          <span data-testid="user-email" class="user-email">{{ userEmail ?? '' }}</span>
        </div>
        <button data-testid="logout-button" class="logout-button" aria-label="Logout" @click="logout">
          <i class="pi pi-sign-out" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- Toggle -->
    <button data-testid="sidebar-toggle" class="sidebar-toggle" aria-label="Recolher menu" @click="toggleSidebar">
      <i class="pi pi-bars" aria-hidden="true"></i>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 240px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem 1rem;
  font-family: 'Inter', sans-serif;
  transition: width 0.25s ease;
  position: relative;
}

.sidebar.collapsed {
  width: 72px;
  padding: 1.5rem 0.75rem;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 0 0.25rem;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: #4f46e5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1rem;
  flex-shrink: 0;
}

.brand-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.nav-item.active {
  background: #ede9fe;
  color: #4f46e5;
  font-weight: 600;
}

.nav-item i {
  font-size: 1rem;
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
}

/* Footer */
.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.4rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0;
}

.logout-button:hover {
  color: #ef4444;
  background: #fee2e2;
}

/* Toggle */
.sidebar-toggle {
  position: absolute;
  top: 1.5rem;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.75rem;
  transition: background 0.15s, color 0.15s;
  z-index: 10;
}

.sidebar-toggle:hover {
  background: #f3f4f6;
  color: #111827;
}
</style>
