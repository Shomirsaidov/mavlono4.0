<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h2 class="text-3xl font-serif font-bold text-text-main mb-2">Шеърҳо</h2>
        <p class="text-xs font-bold text-text-faint uppercase tracking-widest">Идоракунии мундариҷа</p>
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
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-border">
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest">ID</th>
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest">Мундариҷа</th>
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest">Муаллиф</th>
              <th class="px-8 py-5 text-[0.65rem] font-black text-indigo uppercase tracking-widest text-right">Амалҳо</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="poem in filteredPoems" :key="poem.id" class="group hover:bg-indigo-light/20 transition-all">
              <td class="px-8 py-5 text-xs font-bold text-text-faint">#{{ poem.id }}</td>
              <td class="px-8 py-5 max-w-md">
                <p class="font-serif text-lg text-text-main line-clamp-1 italic">{{ poem.content }}</p>
                <div class="flex gap-2 mt-1">
                  <span class="text-[0.6rem] font-black uppercase text-gold tracking-tighter">{{ poem.genre }}</span>
                  <span class="text-[0.6rem] font-bold text-text-faint uppercase tracking-tighter" v-if="poem.tags">{{ poem.tags }}</span>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-sm text-text-main">{{ poem.poet?.name || 'Номаълум' }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openView(poem)" class="p-2.5 rounded-xl bg-indigo-light text-indigo hover:bg-indigo hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button @click="openEdit(poem)" class="p-2.5 rounded-xl bg-gold-light text-gold-dark hover:bg-gold hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button @click="confirmDelete(poem)" class="p-2.5 rounded-xl bg-heart/5 text-heart hover:bg-heart hover:text-white transition-all">
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
      <div v-else-if="filteredPoems.length === 0" class="p-20 text-center text-text-faint">
        Шеър ёфт нашуд.
      </div>
    </div>

    <!-- View Modal -->
    <BaseModal v-model="isViewModalOpen">
      <template #header>
        <span class="text-[0.65rem] font-black text-indigo uppercase tracking-widest">Тафсилоти шеър #{{ activePoem?.id }}</span>
      </template>
      <div class="font-serif text-2xl leading-[2] text-gray-800 italic whitespace-pre-wrap">
        {{ activePoem?.content }}
      </div>
      <template #footer>
        <button @click="isViewModalOpen = false" class="btn btn-outline">Бастан</button>
      </template>
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal v-model="isEditModalOpen" maxWidth="3xl">
      <template #header>
        <h3 class="text-xl font-serif font-bold text-text-main">Таҳрири шеър</h3>
      </template>
      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div>
          <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest mb-3 ml-1">Матни шеър</label>
          <textarea 
            v-model="editForm.content"
            rows="10"
            class="input-base font-serif text-xl p-6 leading-relaxed"
            required
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest mb-3 ml-1">Жанр</label>
            <input v-model="editForm.genre" type="text" class="input-base" />
          </div>
          <div>
            <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest mb-3 ml-1">Барчаспҳо</label>
            <input v-model="editForm.tags" type="text" class="input-base" />
          </div>
        </div>
      </form>
      <template #footer>
        <button @click="isEditModalOpen = false" class="btn btn-outline">Бекор кардан</button>
        <button @click="handleUpdate" :disabled="saving" class="btn btn-indigo">
          <span v-if="saving" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
          {{ saving ? 'Ҳифз...' : 'Ҳифз кардан' }}
        </button>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="isDeleteModalOpen" maxWidth="md">
      <template #header>
        <div class="w-12 h-12 rounded-full bg-heart/10 flex items-center justify-center text-heart mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </div>
        <h3 class="text-xl font-bold text-center text-text-main">Нест кардани шеър</h3>
      </template>
      <p class="text-center text-text-muted">Оё шумо мутмаин ҳастед, ки мехоҳед ин шеърро нест кунед? Ин амалро баргардонда намешавад.</p>
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

const poems = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')

const isViewModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const activePoem = ref(null)

const editForm = ref({
  content: '',
  genre: '',
  tags: ''
})

const fetchPoems = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/poems/recent`) 
    poems.value = await res.json()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const filteredPoems = computed(() => {
  if (!searchQuery.value) return poems.value
  const q = searchQuery.value.toLowerCase()
  return poems.value.filter(p => 
    p.content.toLowerCase().includes(q) || 
    p.poet?.name?.toLowerCase().includes(q)
  )
})

const openView = (poem) => {
  activePoem.value = poem
  isViewModalOpen.value = true
}

const openEdit = (poem) => {
  activePoem.value = poem
  editForm.value = { ...poem }
  isEditModalOpen.value = true
}

const handleUpdate = async () => {
  saving.value = true
  try {
    const res = await fetch(`${API_URL}/api/poems/${activePoem.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm.value)
    })
    
    if (res.ok) {
      const updated = await res.json()
      const index = poems.value.findIndex(p => p.id === updated.id)
      if (index !== -1) poems.value[index] = { ...poems.value[index], ...updated }
      isEditModalOpen.value = false
    }
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (poem) => {
  activePoem.value = poem
  isDeleteModalOpen.value = true
}

const handleDelete = async () => {
  saving.value = true
  try {
    const res = await fetch(`${API_URL}/api/poems/${activePoem.value.id}`, {
      method: 'DELETE'
    })
    
    if (res.ok) {
      poems.value = poems.value.filter(p => p.id !== activePoem.value.id)
      isDeleteModalOpen.value = false
    }
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchPoems)
</script>
