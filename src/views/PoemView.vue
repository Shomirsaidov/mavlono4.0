<template>
  <div v-if="loading" class="py-10 animate-pulse">
    <div class="skeleton h-10 w-2/3 mb-10"></div>
    <div v-for="n in 8" :key="n" class="skeleton h-6 w-full mb-4"></div>
  </div>

  <div v-else-if="!poem" class="empty-state"><p>Шеър ёфт нашуд.</p></div>

  <div v-else>
    <div class="flex items-center justify-between mb-10">
      <router-link :to="'/poets/' + poem.poet?.id" class="flex items-center gap-4 group decoration-transparent">
        <PoetAvatar :src="poem.poet?.avatar" :alt="poem.poet?.name" size="48" class="border-2" />
        <div>
          <div class="font-serif text-lg font-bold text-text-main group-hover:text-gold transition-colors">{{ poem.poet?.name }}</div>
          <div class="text-[0.7rem] text-text-faint uppercase font-bold tracking-widest mt-0.5">{{ formatDate(poem.created_at) }}</div>
        </div>
      </router-link>
    </div>

    <!-- Poem body -->
    <p class="font-serif text-2xl md:text-3xl leading-[2.2] text-gray-800 mb-12 whitespace-pre-line selection:bg-gold/10 italic">
      {{ poem.content }}
    </p>

    <!-- Stats row -->
    <div class="flex items-center gap-6 mb-10 py-6 border-y border-border">
      <button 
        class="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all"
        :class="hasLiked ? 'bg-heart text-white shadow-lg shadow-heart/20' : 'bg-surface-2 text-text-faint hover:text-heart hover:bg-heart/5'"
        @click="handleLike"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.1C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        {{ likeCount }}
      </button>
      
      <div class="flex items-center gap-2 text-text-faint text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        {{ poem.views?.length || 0 }} бор хонда шуд
      </div>
    </div>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2 mb-12" v-if="poem.genre || poem.tags">
      <span class="px-4 py-1.5 bg-indigo text-white text-[0.7rem] font-bold uppercase tracking-widest rounded-full shadow-md shadow-indigo/20">{{ poem.genre }}</span>
      <router-link v-for="tag in currentTags" :key="tag" :to="{ path: '/search', query: { q: tag } }" class="decoration-transparent">
        <span class="px-4 py-1.5 bg-surface-2 text-text-muted hover:text-indigo hover:bg-indigo-light text-[0.7rem] font-bold uppercase tracking-widest rounded-full transition-all border border-border">{{ tag }}</span>
      </router-link>
    </div>

    <div v-if="poem.user" class="mb-12">
      <div class="section-title">Иловакунандаи шеър</div>
      <router-link :to="'/users/' + poem.user.id" class="flex w-full items-center gap-4 p-4 bg-surface-2 hover:bg-gold/10 rounded-2xl transition-all group decoration-transparent border border-border">
        <div class="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-indigo/10 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-indigo group-hover:text-gold transition-colors" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <div class="text-sm font-bold text-text-main group-hover:text-gold transition-colors">{{ poem.user.name }}</div>
        </div>
      </router-link>
    </div>

    <!-- Dictionary search -->
    <div class="mb-12">
      <div class="section-title">Луғат ва калимаҳои душворфаҳм</div>
      <div class="flex gap-2">
        <input v-model="vocabQuery" @keyup.enter="searchVocab" class="input-base flex-1" placeholder="калимаро нависед...">
        <button @click="searchVocab" class="btn btn-gold">Маъно</button>
      </div>
      <div v-show="showVocab" class="mt-6 rounded-2xl overflow-hidden shadow-2xl border border-border">
        <iframe :src="vocabUrl" class="w-full h-[480px] border-0 bg-white" loading="lazy"></iframe>
      </div>
    </div>

    <!-- AI meaning button -->
    <div class="mb-12">
      <router-link :to="{ path: '/ai', query: { query: poem.content } }" class="decoration-transparent">
        <button class="btn btn-outline w-full md:w-auto py-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          Маънои шеър (AI Шарҳ)
        </button>
      </router-link>
    </div>

    <!-- Comments -->
    <div class="mb-12">
      <div class="section-title">Шарҳҳо</div>
      <div class="space-y-4">
        <div v-if="poem.comments?.length === 0" class="text-text-faint text-sm italic py-4">Ҳоло шарҳе нест.</div>
        <div v-for="comment in poem.comments || []" :key="comment.id" class="bg-surface-2 p-5 rounded-2xl border border-border group transition-all hover:bg-white hover:shadow-md">
          <div class="flex items-center gap-3 mb-2">
            <PoetAvatar :src="null" size="28" />
            <router-link v-if="comment.user" :to="'/users/' + comment.user.id" class="text-sm font-bold text-text-main hover:text-gold transition-colors decoration-transparent">{{ comment.user.name }}</router-link>
            <span v-else class="text-sm font-bold text-text-main">Хонанда</span>
          </div>
          <p class="text-[0.95rem] text-gray-700 leading-relaxed">{{ comment.text }}</p>
        </div>
      </div>

      <!-- Comment form -->
      <div class="mt-8 bg-surface p-6 rounded-2xl border border-indigo/10 shadow-sm shadow-indigo/5">
        <div class="text-[0.7rem] font-black uppercase tracking-widest text-indigo mb-4">Назари худро нависед</div>
        <textarea v-model="newComment" class="input-base min-h-[120px]" placeholder="Фикратонро нависед..."></textarea>
        <div class="mt-4 flex justify-end">
          <button @click="submitComment" class="btn btn-indigo px-8">Фиристодан</button>
        </div>
      </div>
    </div>

    <!-- Poet promo block -->
    <div class="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6" v-if="poem.poet">
      <router-link :to="'/poets/' + poem.poet.id" class="decoration-transparent">
        <PoetAvatar :src="poem.poet.avatar" :alt="poem.poet.name" size="80" class="shadow-xl" />
      </router-link>
      <div class="flex-1 text-center md:text-left">
        <router-link :to="'/poets/' + poem.poet.id" class="font-serif text-2xl font-bold text-text-main mb-2 block hover:text-gold transition-colors decoration-transparent">
          {{ poem.poet.name }}
        </router-link>
        <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
          <button class="btn btn-gold px-8 py-2.5">Обуна шудан +</button>
          <router-link :to="'/poets/' + poem.poet.id" class="btn btn-outline px-6 py-2.5">Саҳифаи шоир</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { API_URL } from '../config'
import PoetAvatar from '../components/PoetAvatar.vue'

const authStore = useAuthStore()


const route = useRoute()
const poem = ref(null)
const loading = ref(true)
const hasLiked = ref(false)
const likeCount = ref(0)
const vocabQuery = ref('')
const vocabUrl = ref('')
const showVocab = ref(false)
const newComment = ref('')

const currentTags = computed(() => poem.value?.tags ? poem.value.tags.split(',').map(t => t.trim()).filter(Boolean) : [])

const fetchPoem = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/poems/${route.params.id}`)
    const data = await res.json()
    if (data.poem) {
      poem.value = data.poem
      const likes = data.poem.likes || []
      likeCount.value = likes.length
      hasLiked.value = authStore.isAuthenticated && likes.some(l => l.user_id === authStore.currentUserId)
    }
  } catch(e) { console.error(e) }
  finally { loading.value = false }
}

watch(() => route.params.id, fetchPoem, { immediate: true })

const formatDate = (d) => d ? new Date(d).toLocaleDateString('tg-TJ', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

const searchVocab = () => {
  if (!vocabQuery.value.trim()) return
  vocabUrl.value = `https://vazhaju.tj/search/${encodeURIComponent(vocabQuery.value.trim())}`
  showVocab.value = true
}

const handleLike = async () => {
  // Optimistic
  const wasLiked = hasLiked.value
  hasLiked.value = !hasLiked.value
  likeCount.value += hasLiked.value ? 1 : -1

  if (!authStore.isAuthenticated) {
    alert('Лутфан аввал ба система ворид шавед.')
    return
  }

  try {
    const res = await fetch(`${API_URL}/api/poems/${poem.value.id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: authStore.currentUserId })
    })
    const data = await res.json()
    if (data.action === 'liked') hasLiked.value = true
    else if (data.action === 'unliked') hasLiked.value = false

    if (typeof data.newCount === 'number') {
      likeCount.value = data.newCount
    }
  } catch(e) {
    hasLiked.value = wasLiked
    likeCount.value += wasLiked ? 0 : 0
  }
}

const submitComment = async () => {
  if (!authStore.isAuthenticated) {
    alert('Лутфан аввал ба система ворид шавед.')
    return
  }
  if (!newComment.value.trim()) return
  const text = newComment.value.trim()
  poem.value.comments = poem.value.comments || []
  poem.value.comments.push({ id: Date.now(), text, user: { name: authStore.user?.name || 'Шумо' } })
  newComment.value = ''
  try {
    await fetch(`${API_URL}/api/poems/${poem.value.id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: authStore.currentUserId, text })
    })
  } catch(e) {}
}
</script>
