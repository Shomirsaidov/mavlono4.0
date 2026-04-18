<template>
  <div class="pb-20">
    <!-- Search Section -->
    <div class="mb-12">
      <h1 class="text-3xl font-serif font-bold text-text-main mb-6">Каталог ва ҷустуҷӯ</h1>
      <div class="relative group">
        <input 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="Ҷустуҷӯи шеърҳо, шоирон ё мавзӯъҳо..." 
          class="w-full bg-surface border border-border rounded-2xl py-4 pl-14 pr-6 text-base font-medium transition-all focus:outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo group-hover:border-indigo/30 shadow-sm"
        >
        <div class="absolute left-5 top-1/2 -translate-y-1/2 text-text-faint group-focus-within:text-indigo transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <button 
          @click="handleSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-indigo text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo/20 hover:scale-105 active:scale-95 transition-all"
        >
          Ҷустуҷӯ
        </button>
      </div>
    </div>

    <!-- Popular Tags Section -->
    <div class="mb-16">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1.5 h-6 bg-gold rounded-full"></div>
        <h2 class="text-xl font-bold text-text-main">Мавзӯъҳои маъмул</h2>
      </div>
      
      <div v-if="tagsLoading" class="flex flex-wrap gap-2 animate-pulse">
        <div v-for="n in 8" :key="n" class="h-9 w-24 bg-surface-2 rounded-full border border-border"></div>
      </div>
      <div v-else class="flex flex-wrap gap-2.5">
        <button 
          v-for="tag in popularTags" 
          :key="tag"
          @click="clickTag(tag)"
          class="px-5 py-2 bg-surface border border-border rounded-full text-xs font-black text-text-muted transition-all hover:bg-indigo-light hover:text-indigo hover:border-indigo/30 hover:shadow-md active:scale-95"
        >
          #{{ tag.toUpperCase() }}
        </button>
      </div>
    </div>

    <!-- Poets Catalog -->
    <div>
      <div class="flex items-center gap-3 mb-8">
        <div class="w-1.5 h-6 bg-gold rounded-full"></div>
        <h2 class="text-xl font-bold text-text-main">Рӯйхати адибон</h2>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="n in 6" :key="n" class="bg-surface p-5 rounded-3xl border border-border flex items-center gap-4 animate-pulse">
          <div class="skeleton w-14 h-14 rounded-full"></div>
          <div class="flex-1">
            <div class="skeleton h-4 w-1/2 mb-2"></div>
            <div class="skeleton h-3 w-1/4"></div>
          </div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <router-link 
          v-for="poet in poets" 
          :key="poet.id" 
          :to="'/poets/' + poet.id"
          class="block bg-surface p-5 rounded-3xl border border-border hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all group decoration-transparent"
        >
          <div class="flex items-center gap-5">
            <PoetAvatar :src="poet.avatar" :alt="poet.name" size="56" class="shadow-sm border-2 border-white group-hover:scale-110 transition-transform duration-500" />
            <div>
              <div class="font-serif text-lg font-bold text-text-main group-hover:text-gold transition-colors">{{ poet.name }}</div>
              <div class="text-[0.65rem] font-black text-text-faint uppercase tracking-[0.15em] mt-1 group-hover:text-indigo transition-colors">{{ poet.category || 'Шоир' }}</div>
            </div>
            <div class="ml-auto p-2.5 rounded-2xl bg-surface-2 group-hover:bg-gold group-hover:text-white transition-all text-text-faint shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_URL } from '../config'
import { useRouter } from 'vue-router'
import PoetAvatar from '../components/PoetAvatar.vue'

const router = useRouter()
const poets = ref([])
const popularTags = ref([])
const loading = ref(true)
const tagsLoading = ref(true)
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
  }
}

const clickTag = (tag) => {
  router.push({ name: 'search', query: { q: tag } })
}

onMounted(async () => {
  // Fetch poets
  try {
    const res = await fetch(`${API_URL}/api/poets`) 
    const data = await res.json()
    if (Array.isArray(data)) poets.value = data
  } catch(e) {
    console.error('Failed to load poets:', e)
  } finally {
    loading.value = false
  }

  // Fetch popular tags
  try {
    const res = await fetch(`${API_URL}/api/poems/tags/popular`) 
    const data = await res.json()
    if (Array.isArray(data)) popularTags.value = data
  } catch(e) {
    console.error('Failed to load popular tags:', e)
  } finally {
    tagsLoading.value = false
  }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
