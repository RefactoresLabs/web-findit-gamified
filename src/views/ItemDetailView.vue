<script setup lang="ts">
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { ref, onMounted } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

/* =========================
   🔥 TYPES
========================= */
type Item = {
  id: number
  title: string
  description: string
  location: string
  image: string
  type: 'perdido' | 'encontrado'
}

type RouteKey = 'explorar' | 'registrar' | 'meus-itens'

/* =========================
   🔥 ROUTER
========================= */
const route = useRoute()
const router = useRouter()

/* =========================
   🔥 STATE
========================= */
const item = ref<Item | null>(null)

/* =========================
   🔥 MOCK DATA
========================= */
const myItems: Item[] = [
  {
    id: 1,
    title: 'MacBook Pro 14"',
    description: 'Notebook perdido próximo à entrada da biblioteca.',
    location: 'Biblioteca Central',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    type: 'perdido',
  },
  {
    id: 4,
    title: 'Carteira de Couro',
    description: 'Carteira encontrada com documentos.',
    location: 'Cantina Central',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=600',
    type: 'encontrado',
  },
]

/* =========================
   🔥 LOAD ITEM
========================= */
onMounted(() => {
  const id = Number(route.params.id)
  item.value = myItems.find(i => i.id === id) ?? null
})

/* =========================
   🔥 NAVIGATION
========================= */
const routesMap: Record<RouteKey, RouteLocationRaw> = {
  explorar: { name: 'explorar' },
  registrar: { name: 'register-item' },
  'meus-itens': { name: 'meus-itens' },
}

function handleNavigate(itemKey: string) {
  if (routesMap[itemKey as RouteKey]) {
    router.push(routesMap[itemKey as RouteKey])
  }
}

function handleLogout() {
  window.location.href = '/'
}

function goBack() {
  router.back()
}

/* =========================
   🔥 ACTIONS
========================= */
function confirmarEntrega() {
  alert('Entrega confirmada!')
}
</script>

<template>
  <div class="detail-layout">
    <AppSidebar
      active-item="meus-itens"
      @navigate="handleNavigate"
      @logout="handleLogout"
    />

    <main class="detail-main" v-if="item">
      <!-- HEADER -->
      <div class="page-header">
        <button class="back-btn" @click="goBack">
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <h1 class="page-title">{{ item.title }}</h1>
          <p class="page-sub">Detalhes do item</p>
        </div>
      </div>

      <!-- CARD -->
      <div class="detail-card">
        <!-- IMAGEM -->
        <div class="detail-image">
          <img v-if="item.image" :src="item.image" />
          <div v-else class="image-placeholder">
            <i class="pi pi-image"></i>
          </div>
        </div>

        <!-- INFOS -->
        <div class="detail-info">
          <span
            class="item-badge"
            :class="item.type === 'perdido' ? 'badge-lost' : 'badge-found'"
          >
            {{ item.type === 'perdido' ? 'Perdido' : 'Encontrado' }}
          </span>

          <h2 class="detail-title">{{ item.title }}</h2>

          <p class="detail-description">
            {{ item.description }}
          </p>

          <div class="detail-location">
            <i class="pi pi-map-marker"></i>
            {{ item.location }}
          </div>

          <!-- BOTÃO CONDICIONAL -->
          <button
            v-if="item.type === 'encontrado'"
            class="confirm-btn"
            @click="confirmarEntrega"
          >
            Confirmar entrega
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.detail-layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
  font-family: 'Inter', sans-serif;
}

.detail-main {
  flex: 1;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* HEADER */
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  border: none;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.5rem;
  cursor: pointer;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.page-sub {
  font-size: 0.85rem;
  color: #6b7280;
}

/* CARD */
.detail-card {
  display: flex;
  gap: 2rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
}

/* IMAGEM */
.detail-image {
  width: 300px;
  height: 300px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #d1d5db;
}

/* INFO */
.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
}

.detail-description {
  font-size: 0.9rem;
  color: #4b5563;
}

.detail-location {
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* BADGE */
.item-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-lost {
  background: #ef4444;
  color: #fff;
}

.badge-found {
  background: #22c55e;
  color: #fff;
}

/* BOTÃO */
.confirm-btn {
  margin-top: 1rem;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.confirm-btn:hover {
  opacity: 0.85;
}

/* MOBILE */
@media (max-width: 768px) {
  .detail-main {
    padding: 1.25rem;
  }

  .page-header {
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.2rem;
  }

  .page-sub {
    font-size: 0.8rem;
  }

  .detail-card {
    flex-direction: column;
    gap: 1.25rem;
    padding: 1rem;
  }

  .detail-image {
    width: 100%;
    height: 220px;
  }

  .detail-title {
    font-size: 1.1rem;
  }

  .detail-description {
    font-size: 0.85rem;
  }

  .detail-location {
    font-size: 0.8rem;
  }

  .confirm-btn {
    width: 100%;
    text-align: center;
  }
}
</style>