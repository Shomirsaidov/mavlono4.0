<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h2 class="text-3xl font-serif font-bold text-text-main mb-2">Адибон</h2>
        <p class="text-xs font-bold text-text-faint uppercase tracking-widest">Идоракунии профилҳои адибон</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Ҷустуҷӯ..." 
            class="input-base pl-12 rounded-2xl w-full md:w-64"
          />
        </div>
        <button @click="openAdd" class="btn btn-indigo whitespace-nowrap hidden md:flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Иловаи адиб
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-border">
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest">Акс</th>
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest">Адиб</th>
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest">Категория</th>
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest text-right">Амалҳо</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="poet in filteredPoets" :key="poet.id" class="group hover:bg-indigo-light/20 transition-all">
              <td class="px-8 py-5">
                <PoetAvatar :src="poet.avatar" :alt="poet.name" size="48" class="shadow-sm border border-indigo/10" />
              </td>
              <td class="px-8 py-5">
                <p class="font-serif text-lg font-bold text-text-main line-clamp-1">{{ poet.name }}</p>
                <div class="text-[0.65rem] font-black text-text-faint tracking-widest uppercase mt-0.5" v-if="poet.lifetime">{{ poet.lifetime }}</div>
              </td>
              <td class="px-8 py-5">
                <span class="px-3 py-1 bg-surface-2 text-indigo text-[0.6rem] font-black uppercase tracking-widest rounded-md">{{ poet.category }}</span>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a :href="'/poets/' + poet.id" target="_blank" class="p-2.5 rounded-xl bg-indigo-light text-indigo hover:bg-indigo hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                  </a>
                  <button @click="openEdit(poet)" class="p-2.5 rounded-xl bg-gold-light text-gold-dark hover:bg-gold hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button @click="confirmDelete(poet)" class="p-2.5 rounded-xl bg-heart/5 text-heart hover:bg-heart hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="loading" class="p-20 flex flex-col items-center justify-center text-text-faint gap-4">
        <span class="animate-spin h-8 w-8 border-4 border-indigo/20 border-t-indigo rounded-full"></span>
        <span class="text-xs font-bold uppercase tracking-widest">Боргузорӣ...</span>
      </div>
      <div v-else-if="filteredPoets.length === 0" class="p-20 text-center text-text-faint">
        Адиб ёфт нашуд.
      </div>
    </div>

    <!-- Add/Edit Modal Form -->
    <BaseModal v-model="isFormModalOpen" maxWidth="4xl">
      <template #header>
        <h3 class="text-xl font-serif font-bold text-text-main">{{ isEditMode ? 'Таҳрири адиб' : 'Иловаи адиб' }}</h3>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Ному насаб</label>
            <input v-model="form.name" type="text" placeholder="Масалан: Ҷалолуддини Румӣ" class="input-base" required />
          </div>
          <div class="space-y-3">
            <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Жанр / Категория</label>
            <input v-model="form.category" type="text" placeholder="Масалан: Классик" class="input-base" required />
          </div>
          <div class="space-y-3 md:col-span-2">
            <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Давраи ҳаёт</label>
            <input v-model="form.lifetime" type="text" placeholder="Масалан: 1207 - 1273" class="input-base" />
          </div>
        </div>

        <div class="space-y-4">
          <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Акс</label>
          <div 
            class="relative border-2 border-dashed border-border rounded-2xl p-6 text-center transition-all hover:border-gold group cursor-pointer overflow-hidden min-h-[160px] flex flex-col items-center justify-center"
            @click="$refs.fileInput.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="{ 'border-gold bg-gold-light/20': isDragging || form.avatar }"
          >
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />
            <div v-if="!form.avatar" class="space-y-3">
              <svg class="mx-auto" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <p class="text-sm font-bold text-text-main">Аксро кашола кунед ё интихоб намоед</p>
            </div>
            <div v-else class="flex flex-col items-center gap-3">
              <img :src="form.avatar" class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl" />
              <button @click.stop="form.avatar = null" class="text-[0.65rem] font-black text-heart uppercase tracking-widest hover:underline">Тоза кардан</button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Тарҷумаи ҳол</label>
            <div class="flex bg-surface-2 rounded-lg p-1">
              <button type="button" @click="editorMode = 'write'" class="px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest rounded-md transition-all" :class="editorMode === 'write' ? 'bg-white text-indigo shadow-sm' : 'text-text-faint'">Навиштан</button>
              <button type="button" @click="editorMode = 'preview'" class="px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest rounded-md transition-all" :class="editorMode === 'preview' ? 'bg-white text-indigo shadow-sm' : 'text-text-faint'">Пешнамоиш</button>
            </div>
          </div>
          
          <div v-if="editorMode === 'write'">
            <textarea v-model="form.bio" rows="6" class="input-base font-serif text-lg p-4 leading-[1.8]" required></textarea>
          </div>
          <div v-else class="p-6 bg-gray-50/50 rounded-2xl border border-dashed border-border min-h-[160px]">
            <div class="font-serif text-lg leading-[2] text-gray-800" v-html="parsedBio"></div>
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="isFormModalOpen = false" class="btn btn-outline">Бекор кардан</button>
        <button @click="handleSave" :disabled="saving" class="btn btn-indigo">
          <span v-if="saving" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
          {{ saving ? 'Ҳифз...' : 'Ҳифз кардан' }}
        </button>
      </template>
    </BaseModal>

    <!-- Delete Modal -->
    <BaseModal v-model="isDeleteModalOpen" maxWidth="md">
      <template #header>
        <div class="w-12 h-12 rounded-full bg-heart/10 flex items-center justify-center text-heart mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </div>
        <h3 class="text-xl font-bold text-center text-text-main">Нест кардани адиб</h3>
      </template>
      <p class="text-center text-text-muted">Оё шумо мутмаин ҳастед, ки мехоҳед маълумоти <strong>{{ activePoet?.name || 'ин адиб' }}</strong>-ро нест кунед? Ин амалро баргардонда намешавад.</p>
      <template #footer>
        <button @click="isDeleteModalOpen = false" class="btn btn-outline flex-1">Бекор кардан</button>
        <button @click="handleDelete" :disabled="saving" class="btn bg-heart text-white hover:bg-red-700 flex-1">
          {{ saving ? 'Нест карда истодааст...' : 'Ҳа, нест кун' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { API_URL } from '../../config'
import BaseModal from '../../components/BaseModal.vue'
import PoetAvatar from '../../components/PoetAvatar.vue'

const poets = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditMode = ref(false)
const activePoet = ref(null)

const isDragging = ref(false)
const editorMode = ref('write')

const fileInput = ref(null)

const form = ref({
  name: '',
  category: '',
  avatar: null,
  lifetime: '',
  bio: ''
})

const fetchPoets = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/poets`) 
    poets.value = await res.json()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const filteredPoets = computed(() => {
  if (!searchQuery.value) return poets.value
  const q = searchQuery.value.toLowerCase()
  return poets.value.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
})

const parsedBio = computed(() => {
  if (!form.value.bio) return '<span class="text-text-faint">Матне барои пешнамоиш нест...</span>'
  return form.value.bio.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>')
})

const openAdd = () => {
  isEditMode.value = false
  form.value = { name: '', category: '', avatar: null, lifetime: '', bio: '' }
  editorMode.value = 'write'
  isFormModalOpen.value = true
}

const openEdit = (poet) => {
  isEditMode.value = true
  activePoet.value = poet
  form.value = { ...poet }
  editorMode.value = 'write'
  isFormModalOpen.value = true
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) convertToBase64(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) convertToBase64(file)
}

const convertToBase64 = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleSave = async () => {
  saving.value = true
  const url = isEditMode.value ? `${API_URL}/api/poets/${activePoet.value.id}` : `${API_URL}/api/poets`
  const method = isEditMode.value ? 'PATCH' : 'POST'
  
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    
    if (res.ok) {
      const updated = await res.json()
      if (isEditMode.value) {
        const index = poets.value.findIndex(p => p.id === updated.id)
        if (index !== -1) poets.value[index] = { ...poets.value[index], ...updated }
      } else {
        poets.value.unshift(updated)
      }
      isFormModalOpen.value = false
    }
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (poet) => {
  activePoet.value = poet
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  saving.value = true
  try {
    const res = await fetch(`${API_URL}/api/poets/${activePoet.value.id}`, { method: 'DELETE' })
    if (res.ok) {
      poets.value = poets.value.filter(p => p.id !== activePoet.value.id)
      isDeleteModalOpen.value = false
    }
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchPoets)
</script>
