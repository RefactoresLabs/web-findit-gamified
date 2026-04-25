<script setup lang="ts">
import { ref, computed } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import router from '@/router'

type TabType = 'perdidos' | 'encontrados'

const activeTab = ref<TabType>('perdidos')

// Mock data — substituir por store/API futuramente
const perdidos = ref([
  {
    id: 1,
    title: 'MacBook Pro 14"',
    location: 'Biblioteca Central',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop',
  },
  {
    id: 2,
    title: 'Caderno de Cálculo III',
    location: 'Lab. Informática 3',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=80&h=80&fit=crop',
  },
  {
    id: 3,
    title: 'Óculos de Grau',
    location: 'Quadra Poliesportiva',
    image: '',
  },
])

const encontrados = ref([
  {
    id: 4,
    title: 'Carteira de Couro',
    location: 'Cantina Central',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=80&h=80&fit=crop',
  },
  {
    id: 5,
    title: 'Chave com chaveiro azul',
    location: 'Bloco B — Corredor',
    image: '',
  },
])

const currentItems = computed(() =>
  activeTab.value === 'perdidos' ? perdidos.value : encontrados.value
)

function handleNavigate(item: string) {
  const routesMap: Record<string, string> = {
    explorar: '/explorar',
    registrar: '/register',
    'meus-itens': '/meus-itens',
  }
  if (routesMap[item]) {
    router.push(routesMap[item])
  }
}

function handleLogout() {
  window.location.href = '/'
}
</script>

<template>
  <div class="meus-itens-layout">
    <AppSidebar active-item="meus-itens" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="meus-itens-main">
      <div class="page-header">
        <h1 class="page-title">Meus Itens</h1>
        <p class="page-sub">Gerencie os itens que você registrou</p>
      </div>

      <div class="tabs">
        <button
          class="tab"
          :class="{ active: activeTab === 'perdidos' }"
          @click="activeTab = 'perdidos'"
        >
          Perdidos ({{ perdidos.length }})
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'encontrados' }"
          @click="activeTab = 'encontrados'"
        >
          Encontrados ({{ encontrados.length }})
        </button>
      </div>

      <div class="items-list">
        <div v-for="item in currentItems" :key="item.id" class="item-card">
          <div class="item-thumb">
            <img v-if="item.image" :src="item.image" :alt="item.title" />
            <div v-else class="thumb-placeholder">
              <i class="pi pi-image"></i>
            </div>
          </div>

          <div class="item-info">
            <span class="item-title">{{ item.title }}</span>
            <span class="item-location">
              <i class="pi pi-map-marker"></i>
              {{ item.location }}
            </span>
            <span class="item-badge" :class="activeTab === 'perdidos' ? 'badge-lost' : 'badge-found'">
              {{ activeTab === 'perdidos' ? 'Perdido' : 'Encontrado' }}
            </span>
          </div>

          <button class="item-arrow">
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>

        <div v-if="currentItems.length === 0" class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>Nenhum item registrado ainda.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.meus-itens-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.meus-itens-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
}

.page-sub {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tab {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.15s;
}

.tab.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
  font-weight: 600;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
}

.item-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  transform: translateY(-1px);
}

.item-thumb {
  width: 64px;
  height: 64px;
  border-radius: 0.625rem;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  font-size: 1.5rem;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.item-location {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.item-location i {
  font-size: 0.75rem;
}

.item-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-lost { background: #ef4444; color: #fff; }
.badge-found { background: #22c55e; color: #fff; }

.item-arrow {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-state i { font-size: 2.5rem; }
.empty-state p { font-size: 0.9rem; margin: 0; }
</style>