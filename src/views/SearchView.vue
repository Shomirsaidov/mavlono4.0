<template>
  <div class="mb-10 pb-6 border-b border-border flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-serif font-bold text-text-main flex items-center gap-3" id="search-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        Натиҷаҳои ҷустуҷӯ
      </h1>
      <p class="text-text-muted mt-2 font-medium">Барои: <span class="italic text-indigo" id="search-query-display">"{{ query }}"</span></p>
    </div>
    <router-link to="/catalog" class="bg-surface-2 p-2 rounded-full hover:bg-gold hover:text-white transition-all shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
    </router-link>
  </div>

  <!-- Skeletons -->
  <template v-if="loading">
    <div v-for="i in 3" :key="i" class="bg-surface p-6 rounded-[2rem] border border-border mb-8 animate-pulse shadow-sm">
      <div class="flex items-center gap-4 mb-5">
        <div class="skeleton w-10 h-10 rounded-full"></div>
        <div class="skeleton h-4 w-36"></div>
      </div>
      <div class="space-y-3">
        <div class="skeleton h-5 w-full"></div>
        <div class="skeleton h-5 w-[85%]"></div>
        <div class="skeleton h-5 w-[40%]"></div>
      </div>
    </div>
  </template>

  <!-- Empty Results -->
  <div v-else-if="results.length === 0" class="flex flex-col items-center justify-center py-24 px-6 text-center bg-surface rounded-[3rem] border border-dashed border-border mb-10 shadow-sm" id="empty-search-results">
    <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gold mb-6 border border-border">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M15 8l-8 8"/><path d="M7 8l8 8"/></svg>
    </div>
    <p class="text-2xl font-serif font-bold text-text-main mb-3">Натиҷа ёфт нашуд</p>
    <p class="text-text-muted max-w-xs mx-auto text-sm leading-relaxed">Мо чизе ёфта натавонистем. Лутфан калимаҳои дигарро истифода баред.</p>
    <router-link to="/catalog" class="mt-8 px-8 py-3 bg-indigo text-white rounded-full font-bold shadow-xl shadow-indigo/20 text-sm hover:scale-105 transition-transform active:scale-95">Ба каталог баргаштан</router-link>
  </div>

  <!-- Search Results Feed -->
  <div v-else class="space-y-10" id="search-results-feed">
    <div
      v-for="poem in results"
      :key="poem.id"
      class="bg-surface p-8 md:p-10 rounded-[2.5rem] border border-border relative overflow-hidden group hover:border-gold/20 hover:shadow-lg transition-all duration-300"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <router-link :to="'/poets/' + poem.poet?.id" class="flex items-center gap-4 decoration-transparent">
          <PoetAvatar :src="poem.poet?.avatar" :alt="poem.poet?.name" size="48" class="ring-4 ring-indigo-light/30 shadow-lg group-hover:scale-105 transition-transform duration-300" />
          <div class="flex flex-col">
            <span class="text-lg font-bold text-text-main group-hover:text-gold transition-colors">{{ poem.poet?.name }}</span>
            <span class="text-[0.7rem] font-black text-gold uppercase tracking-[0.2em] mt-0.5">{{ poem.poet?.category || 'Адиб' }}</span>
          </div>
        </router-link>
        
        <div v-if="poem.tags" class="flex flex-wrap gap-2">
          <span v-for="tag in poem.tags.split(',').slice(0, 3)" :key="tag" class="px-4 py-1.5 bg-indigo-light text-indigo text-[0.65rem] font-black uppercase tracking-[0.15em] rounded-full border border-indigo/10">
            #{{ tag.trim() }}
          </span>
        </div>
      </div>

      <router-link :to="'/poems/' + poem.id" class="block decoration-transparent mb-10">
        <p class="font-serif text-2xl md:text-3xl leading-[2] text-gray-800 italic whitespace-pre-line group-hover:translate-x-1 transition-transform duration-300">
          {{ formatContent(poem.content) }}
        </p>
        <div class="mt-8 flex items-center gap-4">
          <span class="w-10 h-[2px] bg-gold rounded-full group-hover:w-16 transition-all duration-500"></span>
          <span class="text-[0.75rem] font-black text-indigo uppercase tracking-[0.25em]">Муфассал хонед</span>
        </div>
      </router-link>

      <div class="pt-8 border-t border-border flex items-center justify-between">
        <div class="flex items-center gap-8">
          <button 
            @click.prevent="toggleLike(poem)"
            class="flex items-center gap-3 transition-all active:scale-90"
            :class="poem._liked ? 'text-heart' : 'text-text-faint hover:text-heart'"
          >
            <div class="p-3 rounded-2xl transition-all" :class="poem._liked ? 'bg-heart/10 shadow-inner' : 'bg-surface-2 group-hover:bg-heart/5'">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="poem._liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.1C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <span class="text-[0.95rem] font-black">{{ poem._likeCount }}</span>
          </button>

          <div class="flex items-center gap-3 text-text-faint">
            <div class="p-3 rounded-2xl bg-surface-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <span class="text-sm font-black">{{ poem.views?.length || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { API_URL } from '../config'
import { useRoute, useRouter } from 'vue-router'
import PoetAvatar from '../components/PoetAvatar.vue'

const route = useRoute()
const router = useRouter()
const results = ref([])
const loading = ref(true)

const query = computed(() => route.query.q || '')

const formatContent = (c) => {
  if (!c) return ''
  const lines = c.split('\n').filter(l => l.trim())
  return lines.slice(0, 4).join('\n') + (lines.length > 4 ? '\n...' : '')
}

const performSearch = async () => {
  if (!query.value) {
    results.value = []
    loading.value = false
    return
  }
  
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/poems/search?query=${encodeURIComponent(query.value)}`)
    const data = await res.json()
    if (Array.isArray(data)) {
      results.value = data.map(p => {
        const likes = p.likes || []
        return {
          ...p,
          _likeCount: likes.length,
          _liked: likes.some(l => l.user_id === 1)
        }
      })
    }
  } catch (e) {
    console.error('Search failed:', e)
  } finally {
    loading.value = false
  }
}

const toggleLike = async (poem) => {
  const wasLiked = poem._liked
  poem._liked = !poem._liked
  poem._likeCount += poem._liked ? 1 : -1

  try {
    const res = await fetch(`${API_URL}/api/poems/${poem.id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1 })
    })
    const data = await res.json()
    if (typeof data.newCount === 'number') {
      poem._likeCount = data.newCount
    }
  } catch (e) {
    poem._liked = wasLiked
    poem._likeCount += wasLiked ? 0 : 0
  }
}

watch(query, performSearch)
onMounted(performSearch)
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
