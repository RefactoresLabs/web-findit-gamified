<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ExplorarFeed from '@/components/explorar/ExplorarFeed.vue'
import ExplorarItemDetail from '@/components/explorar/ExplorarItemDetail.vue'
import ExplorarMap from '@/components/explorar/ExplorarMap.vue'
import type { RouteLocationRaw } from 'vue-router'

const router = useRouter()

type CurrentView = 'feed' | 'detail' | 'map'

const currentView = ref<CurrentView>('feed')
const selectedItemId = ref<number | null>(null)
const selectedItemType = ref<'perdido' | 'encontrado'>('perdido')

function handleNavigate(item: string) {
  const routesMap: Record<string, RouteLocationRaw> = {
    explorar: { name: 'explorar' },
    registrar: { name: 'registrar' },
    'meus-itens': { name: 'meus-itens' },
    negociacoes: { name: 'negociacoes' },
  }

  if (item === 'explorar') {
    currentView.value = 'feed'
    selectedItemId.value = null
  }

  if (routesMap[item]) {
    router.push(routesMap[item])
  }
}

function handleLogout() {
  window.location.href = '/'
}

function showDetail(itemId: number, itemType: 'perdido' | 'encontrado') {
  selectedItemId.value = itemId
  selectedItemType.value = itemType
  currentView.value = 'detail'
}

function showFeed() {
  currentView.value = 'feed'
  selectedItemId.value = null
}

function showMap() {
  currentView.value = 'map'
}
</script>

<template>
  <div class="explorar-layout">
    <AppSidebar active-item="explorar" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="explorar-main">
      <ExplorarFeed
        v-if="currentView === 'feed'"
        @show-detail="showDetail"
        @show-map="showMap"
      />
      <ExplorarItemDetail
        v-if="currentView === 'detail'"
        :item-id="selectedItemId!"
        :item-type="selectedItemType"
        @back="showFeed"
      />
      <ExplorarMap v-if="currentView === 'map'" @back="showFeed" />
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.explorar-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.explorar-main {
  flex: 1;
  overflow-y: auto;
}
</style>
