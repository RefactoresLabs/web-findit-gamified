<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'

import RegisterStepPhoto from '@/components/registrar/RegisterStepPhoto.vue'
import RegisterStepDetails from '@/components/registrar/RegisterStepDetails.vue'
import RegisterStepLocation from '@/components/registrar/RegisterStepLocation.vue'
import RegisterSelection from '@/components/registrar/RegisterSelection.vue'

const router = useRouter()

type RegisterType = 'lost' | 'found'
type CurrentView = 'selection' | 'photo' | 'details' | 'location'

const currentView = ref<CurrentView>('selection')
const registerType = ref<RegisterType>('lost')
const formData = ref<Record<string, any>>({})

function handleNavigate(item: string) {
  const routesMap: Record<string, any> = {
    explorar: { name: 'explorar' },
    registrar: { name: 'registrar' },
    'meus-itens': { name: 'meus-itens' },
  }

  if (item === 'registrar') {
    currentView.value = 'selection'
    formData.value = {}
  }

  if (routesMap[item]) {
    router.push(routesMap[item])
  }
}

function handleLogout() {
  window.location.href = '/'
}

function selectType(type: RegisterType) {
  registerType.value = type
  currentView.value = 'photo'
}

function handlePhotoNext(data: { photo: string | null }) {
  formData.value = { ...formData.value, ...data }
  currentView.value = 'details'
}

function handleDetailsNext(data: Record<string, any>) {
  formData.value = { ...formData.value, ...data }
  currentView.value = 'location'
}

function handleSubmit(data: Record<string, any>) {
  formData.value = { ...formData.value, ...data }
  console.log('Registro finalizado:', formData.value)
  // TODO: chamar API
  currentView.value = 'selection'
  formData.value = {}
  router.push({ name: 'explorar' })
}

function goBack() {
  const flow: CurrentView[] = ['selection', 'photo', 'details', 'location']
  const idx = flow.indexOf(currentView.value)
  if (idx > 0) currentView.value = flow[idx - 1]!
}
</script>

<template>
  <div class="register-layout">
    <AppSidebar active-item="registrar" @navigate="handleNavigate" @logout="handleLogout" />

    <main class="register-main">
      <RegisterSelection
        v-if="currentView === 'selection'"
        @select="selectType"
      />
      <RegisterStepPhoto
        v-else-if="currentView === 'photo'"
        :type="registerType"
        @back="goBack"
        @next="handlePhotoNext"
      />
      <RegisterStepDetails
        v-else-if="currentView === 'details'"
        :type="registerType"
        :user-name="'Maria Silva'"
        :user-email="'aluno@universidade.com'"
        @back="goBack"
        @next="handleDetailsNext"
      />
      <RegisterStepLocation
        v-else-if="currentView === 'location'"
        :type="registerType"
        @back="goBack"
        @submit="handleSubmit"
      />
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.register-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
}

.register-main {
  flex: 1;
  overflow-y: auto;
}
</style>