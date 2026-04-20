<template>
  <div v-if="loading" class="animate-pulse py-6">
    <div class="flex items-center gap-6 mb-10">
      <div class="skeleton w-[100px] h-[100px] rounded-full"></div>
      <div class="flex-1">
        <div class="skeleton h-8 w-2/3 mb-4"></div>
        <div class="skeleton h-4 w-1/3"></div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 mb-10">
      <div v-for="i in 3" :key="i" class="skeleton h-24 w-full rounded-2xl"></div>
    </div>
  </div>

  <div v-else-if="!poet" class="empty-state"><p>Шоир ёфт нашуд.</p></div>

  <div v-else>
    <!-- Poet hero -->
    <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-10 pb-8 border-b border-border">
      <PoetAvatar :src="poet.avatar" :alt="poet.name" size="100" class="shadow-lg border-2" />
      
      <div class="flex-1 text-center md:text-left">
        <h1 class="font-serif text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">{{ poet.name }}</h1>
        <div class="inline-flex items-center px-3 py-1 bg-gold-light text-gold text-xs font-bold uppercase tracking-widest rounded-full border border-gold/20">
          {{ poet.category || 'Шоир' }}
        </div>
        
        <div class="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
          <button class="btn btn-gold px-8 py-3 text-sm transition-all" @click="subscribe">
            Обуна шудан +
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 md:gap-4 mb-8">
      <div class="bg-surface rounded-xl p-3 md:p-5 border border-border shadow-sm text-center">
        <div class="text-xl md:text-2xl font-bold text-indigo">{{ poet.subscriptions?.length || 0 }}</div>
        <div class="text-[0.6rem] md:text-[0.7rem] font-bold text-text-faint uppercase tracking-wider mt-1">Обунагирон</div>
      </div>
      <div class="bg-surface rounded-xl p-3 md:p-5 border border-border shadow-sm text-center">
        <div class="text-xl md:text-2xl font-bold text-indigo">{{ poems.length }}</div>
        <div class="text-[0.6rem] md:text-[0.7rem] font-bold text-text-faint uppercase tracking-wider mt-1">Шеърҳо</div>
      </div>
      <div class="bg-surface rounded-xl p-3 md:p-5 border border-border shadow-sm text-center">
        <div class="text-xl md:text-2xl font-bold text-indigo">{{ totalLikes }}</div>
        <div class="text-[0.6rem] md:text-[0.7rem] font-bold text-text-faint uppercase tracking-wider mt-1">Лайкҳо</div>
      </div>
    </div>

    <!-- Bio -->
    <div class="glass-card rounded-2xl p-6 mb-10" v-if="poet.bio">
      <div class="text-[0.65rem] font-bold text-gold uppercase tracking-[0.2em] mb-3">Дар бораи шоир</div>
      <p class="font-serif text-[1.1rem] leading-[1.8] text-text-muted italic">
        "{{ poet.bio.substring(0, 300) + (poet.bio.length > 300 ? '...' : '') }}"
      </p>
      <div class="mt-4">
        <router-link :to="'/poets/' + poet.id + '/bio'" class="text-indigo font-bold text-sm hover:underline flex items-center gap-2">
          Давомашро хонед
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </router-link>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-8 bg-surface-2 p-1 rounded-2xl w-fit">
      <button 
        class="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
        :class="filter === 'popular' ? 'bg-white text-indigo shadow-sm' : 'text-text-faint hover:text-text-muted'"
        @click="filter = 'popular'"
      >Машҳур</button>
      <button 
        class="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
        :class="filter === 'recent' ? 'bg-white text-indigo shadow-sm' : 'text-text-faint hover:text-text-muted'"
        @click="filter = 'recent'"
      >Навтарин</button>
      <button 
        v-for="genre in availableGenres" :key="genre"
        class="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
        :class="filter === genre ? 'bg-white text-indigo shadow-sm' : 'text-text-faint hover:text-text-muted'"
        @click="filter = genre"
      >{{ genre }}</button>
    </div>

    <!-- Poems list -->
    <div v-if="filteredPoems.length === 0" class="empty-state"><p>Шеъре нест...</p></div>
    <div
      v-for="poem in filteredPoems"
      :key="poem.id"
      class="bg-surface p-6 rounded-2xl border border-border mb-4 hover:border-gold/30 hover:shadow-lg transition-all group"
    >
      <router-link :to="'/poems/' + poem.id" class="block decoration-transparent">
        <p class="font-serif text-lg leading-relaxed text-gray-700 italic group-hover:text-text-main transition-colors mb-4 whitespace-pre-line">{{ formatContent(poem.content) }}</p>
      </router-link>
      
      <div v-if="poem.tags" class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in poem.tags.split(',').filter(t => t.trim())" :key="tag" class="text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 bg-surface-2 text-text-muted rounded-md border border-border/50">#{{ tag.trim() }}</span>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-border/50">
        <div class="flex items-center gap-2 text-text-faint text-xs font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:text-heart transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.1C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          {{ poem.likes?.length || 0 }}
        </div>
        <router-link :to="'/poems/' + poem.id" class="text-[0.7rem] font-black text-indigo uppercase tracking-widest hover:underline">Муфассал хонед →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { API_URL } from '../config'
import PoetAvatar from '../components/PoetAvatar.vue'


const route = useRoute()
const poet = ref(null)
const poems = ref([])
const loading = ref(true)
const filter = ref('popular')

const availableGenres = computed(() => {
  const genres = poems.value.map(p => p.genre).filter(Boolean)
  return [...new Set(genres)]
})

const filteredPoems = computed(() => {
  const list = [...poems.value]
  if (filter.value === 'popular') return list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
  if (filter.value === 'recent') return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  
  return list.filter(p => p.genre === filter.value).sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
})

const totalLikes = computed(() => poems.value.reduce((sum, p) => sum + (p.likes?.length || 0), 0))

const fetchPoet = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/poets/${route.params.id}`)
    const data = await res.json()
    if (data.poet) { poet.value = data.poet; poems.value = data.poems || [] }
  } catch(e) { console.error(e) }
  finally { loading.value = false }
}

watch(() => route.params.id, fetchPoet, { immediate: true })

const formatContent = (c) => {
  if (!c) return ''
  const lines = c.split('\n').filter(l => l.trim())
  return lines.slice(0, 4).join('\n') + (lines.length > 4 ? '\n...' : '')
}

const subscribe = async () => {
  try {
    await fetch(`${API_URL}/api/poets/${poet.value.id}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1 })
    })
  } catch(e) {}
}
</script>
