<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'

import RegisterStepPhoto from '@/components/registrar/RegisterStepPhoto.vue'
import RegisterStepDetails from '@/components/registrar/RegisterStepDetails.vue'
import RegisterStepLocation from '@/components/registrar/RegisterStepLocation.vue'
import RegisterSelection from '@/components/registrar/RegisterSelection.vue'
import { useRegisterItem } from '@/composables/useRegisterItem'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { uploadImage, createLostItem, createFoundItem, loading: submitting, error: submitError } = useRegisterItem()
const { userEmail, userName } = useAuth()

type RegisterType = 'lost' | 'found'
type CurrentView = 'selection' | 'photo' | 'details' | 'location'

type RegisterFormData = {
  photo?: string | null
  file?: File | null
  itemName?: string
  description?: string
  category_id?: number
}

const currentView = ref<CurrentView>('selection')
const registerType = ref<RegisterType>('lost')
const formData = ref<RegisterFormData>({})

function handleNavigate(item: string) {
  const routesMap: Record<string, RouteLocationRaw> = {
    explorar: { name: 'explorar' },
    registrar: { name: 'registrar' },
    'meus-itens': { name: 'meus-itens' },
    negociacoes: { name: 'negociacoes' },
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

function handlePhotoNext(data: { photo: string | null; file: File | null }) {
  formData.value = { ...formData.value, photo: data.photo, file: data.file }
  currentView.value = 'details'
}

function handleDetailsNext(data: { itemName: string; category_id: number; description: string }) {
  formData.value = {
    ...formData.value,
    itemName: data.itemName,
    category_id: data.category_id,
    description: data.description,
  }
  currentView.value = 'location'
}

async function handleSubmit(data: { building_space_id: number; left_building_space_id: number }) {
  try {
    let imageUrls: string[] = []

    if (formData.value.file) {
      const url = await uploadImage(formData.value.file)
      imageUrls = [url]
    }

    if (registerType.value === 'lost') {
      await createLostItem({
        name: formData.value.itemName!,
        description: formData.value.description!,
        category_id: formData.value.category_id!,
        lost_building_space_id: data.building_space_id,
        image_urls: imageUrls.length > 0 ? imageUrls : undefined,
      })
    } else {
      await createFoundItem({
        name: formData.value.itemName!,
        description: formData.value.description!,
        category_id: formData.value.category_id!,
        found_building_space_id: data.building_space_id,
        left_building_space_id: data.left_building_space_id,
        image_urls: imageUrls.length > 0 ? imageUrls : undefined,
      })
    }

    currentView.value = 'selection'
    formData.value = {}
    router.push({ name: 'explorar' })
  } catch {
    // error already set by composable
  }
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
        :user-name="userName ?? ''"
        :user-email="userEmail ?? ''"
        @back="goBack"
        @next="handleDetailsNext"
      />
      <RegisterStepLocation
        v-else-if="currentView === 'location'"
        :type="registerType"
        @back="goBack"
        @submit="handleSubmit"
      />

      <div v-if="submitting" class="submitting-overlay" data-testid="submitting-indicator">
        <i class="pi pi-spin pi-spinner" />
        <p>Registrando item...</p>
      </div>

      <div v-if="submitError" class="submit-error" data-testid="submit-error">
        <p>{{ submitError }}</p>
      </div>
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
  position: relative;
}

.submitting-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #6b7280;
  z-index: 10;
}

.submitting-overlay i {
  font-size: 2rem;
}

.submit-error {
  text-align: center;
  padding: 1rem;
  color: #ef4444;
  font-size: 0.875rem;
}
</style>
