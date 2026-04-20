<template>
  <div v-if="loading" class="animate-pulse py-10">
    <div class="flex flex-col items-center mb-12">
      <div class="skeleton w-[120px] h-[120px] rounded-full mb-6"></div>
      <div class="skeleton h-10 w-64 mb-4"></div>
      <div class="skeleton h-4 w-32"></div>
    </div>
    <div class="space-y-4 max-w-2xl mx-auto">
      <div v-for="i in 10" :key="i" class="skeleton h-4 w-full"></div>
    </div>
  </div>

  <div v-else-if="!poet" class="empty-state">
    <p>Шоир ёфт нашуд.</p>
  </div>

  <div v-else class="max-w-4xl mx-auto pb-40">
    <!-- Header Section -->
    <header class="flex flex-col items-center text-center mb-24 md:mb-32 pt-16">
      <PoetAvatar :src="poet.avatar" :alt="poet.name" size="160" class="mb-10 shadow-2xl border-4 ring-8 ring-indigo-light/20 transition-all hover:scale-110" />
      <h1 class="font-serif text-5xl md:text-7xl font-bold text-text-main mb-6 tracking-tight">{{ poet.name }}</h1>
      <div v-if="poet.lifetime" class="inline-flex items-center px-6 py-2 bg-indigo-light text-indigo text-[0.7rem] font-black uppercase tracking-[0.3em] rounded-full border border-indigo/20">
        {{ poet.lifetime }}
      </div>
    </header>

    <!-- Biography Content -->
    <article class="prose prose-indigo max-w-none mb-32 px-4 md:px-0">
      <div class="section-title text-center mb-16">Тарҷумаи ҳол</div>
      <div v-if="poet.bio && poet.bio.length > 10" 
           class="font-serif text-2xl md:text-3xl leading-[2.2] text-gray-800 italic whitespace-pre-line text-justify first-letter:text-6xl first-letter:font-bold first-letter:text-indigo first-letter:mr-4 first-letter:float-left first-letter:leading-none"
           v-html="formattedBio">
      </div>
      <div v-else class="text-center text-text-faint italic py-20 bg-gray-50 rounded-[3rem] border border-dashed border-border">
        Маълумоти бештар дар бораи ин шахсият дар ҳоли омодашавӣ аст...
      </div>
    </article>

    <!-- Popular Poems (Snap Scroll) -->
    <section v-if="popularPoems.length > 0" class="mt-32 mb-32 overflow-hidden">
      <div class="px-4 md:px-0 flex items-center justify-between mb-12">
        <h2 class="text-2xl font-bold text-text-main flex items-center gap-4">
          <span class="w-12 h-[3px] bg-gold rounded-full"></span>
          Шеърҳои машҳур
        </h2>
        <router-link :to="'/poets/' + poet.id" class="text-[0.7rem] font-black text-indigo uppercase tracking-[0.2em] hover:underline">Ҳамааш →</router-link>
      </div>

      <div class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-10 no-scrollbar px-4 md:px-0">
        <div 
          v-for="poem in popularPoems" 
          :key="poem.id"
          class="snap-start shrink-0 w-[300px] md:w-[360px] glass-card p-8 rounded-[2.5rem] border border-border hover:border-gold/40 transition-all group"
        >
          <router-link :to="'/poems/' + poem.id" class="decoration-transparent h-full flex flex-col">
            <p class="font-serif text-xl leading-relaxed text-gray-700 italic line-clamp-6 mb-6 flex-1 whitespace-pre-line">
              {{ formatSnippet(poem.content) }}
            </p>
            <div v-if="poem.tags" class="flex flex-wrap gap-2 mb-6">
              <span v-for="tag in poem.tags.split(',').slice(0, 2)" :key="tag" class="text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 bg-surface-2 text-text-muted rounded-md border border-border/50">#{{ tag.trim() }}</span>
            </div>
            <div class="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
              <div class="flex items-center gap-2.5 text-text-faint text-sm font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.1C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                {{ poem.likes?.length || 0 }}
              </div>
              <span class="text-[0.7rem] font-black text-indigo uppercase tracking-widest">Хондан →</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Recommended Poets (Snap Scroll) -->
    <section v-if="recommendedPoets.length > 0" class="mt-32 mb-16 overflow-hidden">
      <div class="px-4 md:px-0 mb-12">
        <h2 class="text-2xl font-bold text-text-main flex items-center gap-4">
          <span class="w-12 h-[3px] bg-gold rounded-full"></span>
          Дигар адибон
        </h2>
      </div>

      <div class="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-10 no-scrollbar px-4 md:px-0">
        <div 
          v-for="recommend in recommendedPoets" 
          :key="recommend.id"
          class="snap-start shrink-0 w-[180px] md:w-[220px] text-center"
        >
          <router-link :to="'/poets/' + recommend.id" class="decoration-transparent group">
            <div class="mb-6 relative inline-block">
              <PoetAvatar :src="recommend.avatar" :alt="recommend.name" size="100" class="mx-auto shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all" />
              <div class="absolute -bottom-2 -right-2 bg-gold text-white p-2 rounded-full border-4 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </div>
            <div class="font-serif font-bold text-lg text-text-main group-hover:text-gold transition-colors line-clamp-1">{{ recommend.name }}</div>
            <div class="text-[0.65rem] text-text-faint uppercase font-black tracking-[0.2em] mt-2">{{ recommend.category || 'Шоир' }}</div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { API_URL } from '../config'
import { useRoute } from 'vue-router'
import PoetAvatar from '../components/PoetAvatar.vue'

const route = useRoute()
const poet = ref(null)
const poems = ref([])
const otherPoets = ref([])
const loading = ref(true)

const fetchPoetData = async () => {
  loading.value = true
  const poetId = route.params.id
  try {
    // Fetch individual poet data FIRST as it is critical
    const pRes = await fetch(`${API_URL}/api/poets/${poetId}`)
    if (pRes.ok) {
      const pData = await pRes.json()
      if (pData.poet) {
        poet.value = pData.poet
        poems.value = pData.poems || []
      }
    }

    // Fetch other poets for recommendations (non-critical)
    const allRes = await fetch(`${API_URL}/api/poets`) 
    if (allRes.ok) {
      const allData = await allRes.json()
      if (Array.isArray(allData)) {
        otherPoets.value = allData.filter(p => p.id != poetId)
      }
    }
  } catch(e) {
    console.error('Fetch Exception:', e)
  } finally {
    loading.value = false
  }
}

const popularPoems = computed(() => {
  return [...poems.value]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5)
})

const formattedBio = computed(() => {
  if (!poet.value?.bio) return ''
  return poet.value.bio
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
})

const recommendedPoets = computed(() => {
  return [...otherPoets.value].sort(() => 0.5 - Math.random()).slice(0, 8)
})

const formatSnippet = (c) => {
  if (!c) return ''
  const lines = c.split('\n').filter(l => l.trim())
  return lines.slice(0, 6).join('\n') + (lines.length > 6 ? '\n...' : '')
}

watch(() => route.params.id, fetchPoetData)

onMounted(fetchPoetData)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
