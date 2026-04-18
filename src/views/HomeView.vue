<template>
  <div class="mb-8 pb-6 border-b border-border">
    <h1 class="text-2xl font-bold text-text-main">Шеърҳои нав</h1>
    <p class="text-sm text-text-muted mt-1">Тозатарин шеърҳо аз шоирони тоҷик</p>
  </div>

  <!-- Advanced combined Filters -->
  <div class="mb-10">
    <!-- Toggle Button -->
    <button 
      @click="showFilters = !showFilters"
      class="w-full flex items-center justify-between bg-white/50 backdrop-blur-xl p-5 rounded-3xl border border-border shadow-sm hover:border-gold/30 transition-all group"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo/5 flex items-center justify-center text-indigo group-hover:bg-indigo group-hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </div>
        <div>
          <div class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-indigo/60 mb-0.5">Филтрҳои ҷустуҷӯ</div>
          <div class="text-sm font-bold text-text-main flex items-center gap-2">
            Интихоби шеърҳо
            <span v-if="hasActiveFilters" class="px-2 py-0.5 bg-gold text-white text-[0.6rem] font-black rounded-full shadow-sm">{{ activeFiltersCount }} фаъол</span>
          </div>
        </div>
      </div>
      <div class="text-text-faint group-hover:text-gold transition-all" :class="{ 'rotate-180': showFilters }">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </button>

    <!-- Expandable Content -->
    <div v-show="showFilters" class="mt-3 bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-inner transition-all animate-in fade-in slide-in-from-top-2 duration-300">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Author Filter -->
        <div class="relative group">
          <select v-model="filters.poetId" class="filter-select">
            <option :value="null">Ҳамаи муаллифон</option>
            <option v-for="p in metadata.poets" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-faint group-hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <!-- Genre Filter -->
        <div class="relative group">
          <select v-model="filters.genre" class="filter-select">
            <option :value="null">Ҳамаи жанрҳо</option>
            <option v-for="g in metadata.genres" :key="g" :value="g">{{ g }}</option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-faint group-hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        <!-- Tag Filter -->
        <div class="relative group">
          <select v-model="filters.tag" class="filter-select">
            <option :value="null">Ҳамаи мавзӯъҳо</option>
            <option v-for="t in metadata.tags" :key="t" :value="t">{{ t }}</option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-faint group-hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      <!-- Active Filter Indicator -->
      <div v-if="hasActiveFilters" class="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
        <div class="text-[0.65rem] font-bold text-indigo italic">
          Шумораи натиҷаҳо: {{ filteredPoems.length }}
        </div>
        <button @click="resetFilters" class="text-[0.65rem] font-black uppercase tracking-widest text-heart hover:underline flex items-center gap-1.5">
          Тоза кардани филтр
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Skeletons -->
  <template v-if="loading">
    <div v-for="i in 3" :key="i" class="bg-surface p-6 rounded-2xl border border-border mb-6 animate-pulse">
      <div class="flex items-center gap-3 mb-4">
        <div class="skeleton w-9 h-9 rounded-full"></div>
        <div class="skeleton h-4 w-32"></div>
      </div>
      <div class="skeleton h-6 w-full mb-3"></div>
      <div class="skeleton h-6 w-[70%] mb-3"></div>
    </div>
  </template>

  <!-- Empty -->
  <div v-else-if="filteredPoems.length === 0" class="empty-state">
    <div class="bg-surface-2 p-10 rounded-[3rem] text-center border-2 border-dashed border-border mb-10">
      <svg class="mx-auto mb-6 text-text-faint" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <p class="text-text-main font-bold text-lg mb-2">Шеър ёфт нашуд</p>
      <p class="text-text-faint text-sm">Бо ин филтрҳо ягон шеър ёфт нашуд. Филтрҳоро тағйир диҳед.</p>
    </div>
  </div>

  <!-- Feed -->
  <template v-else>
    <div
      v-for="(poem, i) in filteredPoems"
      :key="poem.id"
      class="bg-surface p-6 rounded-2xl border border-border mb-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gold/30 group"
    >
      <router-link :to="'/poets/' + poem.poet?.id" class="flex items-center gap-3 mb-4 decoration-transparent">
        <PoetAvatar :src="poem.poet?.avatar" :alt="poem.poet?.name" size="36" />
        <span class="text-sm font-bold text-text-main group-hover:text-indigo transition-colors">{{ poem.poet?.name }}</span>
      </router-link>

      <router-link :to="'/poems/' + poem.id" class="block decoration-transparent">
        <p class="font-serif text-xl leading-relaxed text-gray-700 whitespace-pre-line">{{ formatContent(poem.content) }}</p>
        <span class="inline-block mt-4 text-[0.8rem] font-bold text-indigo group-hover:underline uppercase tracking-wider">Муфассал хонед →</span>
      </router-link>

      <div class="mt-6 pt-5 border-t border-border flex items-center justify-between">
        <button 
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
          :class="poem._liked ? 'bg-heart text-white shadow-lg shadow-heart/20' : 'bg-surface-2 text-text-faint hover:text-heart hover:bg-heart/5'"
          @click.prevent="like(poem)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.1C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          {{ poem._likeCount }}
        </button>
        <span class="text-[0.6rem] font-black uppercase tracking-widest text-text-faint italic" v-if="poem.genre">{{ poem.genre }}</span>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { API_URL } from '../config'
import PoetAvatar from '../components/PoetAvatar.vue'

const poems = ref([])
const loading = ref(true)
const showFilters = ref(false)
const metadata = reactive({
  poets: [],
  genres: [],
  tags: []
})

const filters = reactive({
  poetId: null,
  genre: null,
  tag: null
})

const hasActiveFilters = computed(() => !!(filters.poetId || filters.genre || filters.tag))
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.poetId) count++
  if (filters.genre) count++
  if (filters.tag) count++
  return count
})

const filteredPoems = computed(() => {
  return poems.value.filter(p => {
    const matchPoet = !filters.poetId || p.poet_id === filters.poetId
    const matchGenre = !filters.genre || p.genre === filters.genre
    const matchTag = !filters.tag || (p.tags && p.tags.split(',').map(t => t.trim().toLowerCase()).includes(filters.tag.toLowerCase()))
    return matchPoet && matchGenre && matchTag
  })
})

const resetFilters = () => {
  filters.poetId = null
  filters.genre = null
  filters.tag = null
}

const formatContent = (c) => {
  if (!c) return ''
  const lines = c.split('\n').filter(l => l.trim())
  return lines.slice(0, 4).join('\n') + (lines.length > 4 ? '\n...' : '')
}

onMounted(async () => {
  try {
    // Parallel fetch main content and metadata
    const [poemsRes, metaRes] = await Promise.all([
      fetch(`${API_URL}/api/poems/recent`),
      fetch(`${API_URL}/api/poems/filters/metadata`)
    ])
    
    const poemsData = await poemsRes.json()
    const metaData = await metaRes.json()

    if (Array.isArray(poemsData)) {
      poems.value = poemsData.map(p => ({
        ...p,
        _likeCount: p.likes?.length || 0,
        _liked: p.likes?.some(l => l.user_id === 1)
      }))
    }
    
    metadata.poets = metaData.poets || []
    metadata.genres = metaData.genres || []
    metadata.tags = metaData.tags || []

  } catch(e) { console.error(e) }
  finally { loading.value = false }
})

const like = async (poem) => {
  const wasLiked = poem._liked
  poem._liked = !poem._liked
  poem._likeCount += poem._liked ? 1 : -1

  try {
    const res = await fetch(`${API_URL}/api/poems/${poem.id}/like`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1 })
    })
    const data = await res.json()
    if (data.action === 'liked') { poem._liked = true }
    else if (data.action === 'unliked') { poem._liked = false }
    if (typeof data.newCount === 'number') poem._likeCount = data.newCount
  } catch(e) {
    poem._liked = wasLiked
    poem._likeCount += wasLiked ? 0 : 0
  }
}
</script>

<style scoped>
@reference "../assets/main.css";

.filter-select {
  @apply w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-[0.8rem] font-bold text-text-main appearance-none focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none transition-all cursor-pointer group-hover:border-gold/50;
}
</style>
