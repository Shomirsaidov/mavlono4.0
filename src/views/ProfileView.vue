<template>
  <div>
  <div class="mb-8 pb-6 border-b border-border flex items-center justify-between gap-6">
    <div>
      <h1 class="text-2xl font-bold text-text-main">{{ isMyProfile ? 'Профили шумо' : (user?.name || 'Профил') }}</h1>
      <p class="text-xs font-bold text-text-faint uppercase tracking-widest mt-1" v-if="!isMyProfile">Мушоҳидаи профили оммавӣ</p>
    </div>
  </div>

    <div v-if="loading">
    <div class="bg-surface p-6 rounded-2xl border border-border flex items-center gap-6 animate-pulse">
      <div class="skeleton w-[72px] h-[72px] rounded-2xl"></div>
      <div class="flex-1">
        <div class="skeleton h-5 w-40 mb-3"></div>
        <div class="skeleton h-6 w-20 rounded-full"></div>
      </div>
    </div>
    </div>

    <template v-else>
      <!-- User card -->
      <div class="bg-surface p-6 rounded-2xl border border-border flex items-center gap-6 shadow-sm mb-6 transition-all hover:shadow-md">
        <div class="relative">
          <PoetAvatar :src="null" size="72" class="rounded-2xl" />
          <span class="absolute -bottom-2 -right-2 bg-indigo text-white text-[0.6rem] font-black px-3 py-1 rounded-full border-2 border-surface shadow-lg">{{ rank }}‑ҷой</span>
        </div>
        <div>
          <div class="text-xl font-bold text-text-main leading-none">{{ user?.name || 'Хонанда' }}</div>
          <span class="inline-block mt-3 bg-indigo-light text-indigo text-[0.65rem] font-bold px-3 py-1 rounded-full border border-indigo/10 uppercase tracking-widest">хонанда</span>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-3 md:gap-4 mb-10">
        <div class="bg-surface p-5 rounded-2xl border border-border text-center shadow-sm">
          <div class="text-2xl font-black text-indigo leading-none mb-1">{{ myPoemsCount }}</div>
          <div class="text-[0.6rem] font-bold text-text-faint uppercase tracking-wider leading-tight mt-2">Шеърҳои воридкарда</div>
        </div>
        <div class="bg-surface p-5 rounded-2xl border border-border text-center shadow-sm">
          <div class="text-2xl font-black text-indigo leading-none mb-1">{{ rank }}</div>
          <div class="text-[0.6rem] font-bold text-text-faint uppercase tracking-wider leading-tight mt-2">Ҷойгоҳ дар рейтинг</div>
        </div>
        <div class="bg-surface p-5 rounded-2xl border border-border text-center shadow-sm">
          <div class="text-2xl font-black text-indigo leading-none mb-1">{{ totalViews }}</div>
          <div class="text-[0.6rem] font-bold text-text-faint uppercase tracking-wider leading-tight mt-2">Куллан хонда шуд</div>
        </div>
      </div>

      <!-- Subscribed Poets (Snap Scroll) -->
      <section v-if="subscribedPoets && subscribedPoets.length" class="mt-12 mb-10 overflow-hidden">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-gold rounded-full"></div>
          <h2 class="text-xl font-bold text-text-main">Обунаҳо</h2>
        </div>
        <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 no-scrollbar">
          <div 
            v-for="sub in subscribedPoets" 
            :key="sub.id"
            class="snap-start shrink-0 w-[120px] md:w-[140px] text-center"
          >
            <router-link :to="'/poets/' + sub.id" class="decoration-transparent group block">
              <PoetAvatar :src="sub.avatar" :alt="sub.name" size="80" class="mx-auto mb-3 shadow-sm group-hover:scale-105 group-hover:shadow-lg transition-all border border-border" />
              <div class="font-serif font-bold text-sm text-text-main group-hover:text-indigo transition-colors line-clamp-1">{{ sub.name }}</div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Liked Poems -->
      <div v-if="likedPoems && likedPoems.length" class="mb-10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-gold rounded-full bg-heart"></div>
          <h2 class="text-xl font-bold text-text-main">Шеърҳои писандида</h2>
        </div>
        <div class="space-y-3">
          <router-link 
            v-for="poem in likedPoems" 
            :key="poem.id" 
            :to="'/poems/' + poem.id"
            class="block bg-surface p-5 rounded-2xl border border-border hover:border-heart/30 hover:shadow-md transition-all group decoration-transparent"
          >
            <div class="flex justify-between items-center gap-4">
              <div class="flex-1 min-w-0">
                 <p class="font-serif text-lg text-gray-800 truncate group-hover:text-heart transition-colors italic mb-1">{{ formatSnippet(poem.content) }}</p>
                 <div v-if="poem.tags" class="flex flex-wrap gap-1.5 mb-1.5">
                   <span v-for="tag in poem.tags.split(',').slice(0, 2)" :key="tag" class="text-[0.55rem] font-bold uppercase px-1.5 py-0.5 bg-surface-2 text-text-muted rounded border border-border/50">#{{ tag.trim() }}</span>
                 </div>
                 <p class="text-[0.65rem] font-black text-text-faint uppercase tracking-widest">{{ poem.poet?.name || 'Номаълум' }}</p>
              </div>
              <div class="flex items-center gap-2 text-text-faint text-xs font-bold shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2.1C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                {{ poem.likes?.length || 0 }}
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Recent Added Poems -->
      <div v-if="recentPoems && recentPoems.length" class="mb-10">
       <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-gold rounded-full bg-indigo"></div>
          <h2 class="text-xl font-bold text-text-main">Шеърҳои иловашуда</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link 
            v-for="poem in recentPoems" 
            :key="poem.id" 
            :to="'/poems/' + poem.id"
            class="block bg-surface p-6 rounded-2xl border border-border hover:border-indigo/30 hover:shadow-lg transition-all group decoration-transparent flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <p class="font-serif text-[1.05rem] leading-relaxed text-gray-700 italic line-clamp-3 mb-4 whitespace-pre-line">{{ formatSnippet(poem.content) }}</p>
              <div v-if="poem.tags" class="flex flex-wrap gap-1.5 mb-2">
                 <span v-for="tag in poem.tags.split(',').slice(0, 3)" :key="tag" class="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-1 bg-surface-2 text-text-muted rounded border border-border/50">#{{ tag.trim() }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
               <span class="text-[0.65rem] font-black text-text-faint uppercase tracking-widest">{{ poem.poet?.name || 'Номаълум' }}</span>
               <span class="text-[0.65rem] font-black text-indigo uppercase tracking-widest group-hover:underline">Хондан →</span>
            </div>
          </router-link>
        </div>
      </div>
      
      <!-- Empty state if all new blocks are empty -->
      <div v-if="!recentPoems.length && !likedPoems.length && !subscribedPoets.length" class="empty-state">
        <p>Шумо ҳоло ҳеҷ фаъолияте надоред.</p>
        <router-link to="/catalog" class="btn btn-gold px-6 py-2 text-sm mt-4 inline-block">Ба каталог гузарам</router-link>
      </div>

       <div v-if="isMyProfile" class="mt-20 pt-10 border-t border-border flex justify-center pb-20">
        <button @click="handleLogout" class="flex items-center gap-2 text-text-faint hover:text-heart transition-colors px-4 py-2 group">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-heart"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span class="text-xs font-bold uppercase tracking-widest">Хуруҷ аз система</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { API_URL } from '../config'
import PoetAvatar from '../components/PoetAvatar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMyProfile = computed(() => !route.params.id || route.params.id == authStore.currentUserId)
const targetUserId = computed(() => route.params.id || authStore.currentUserId)

const user = ref(null)
const rank = ref(1)
const myPoemsCount = ref(0)
const totalViews = ref(0)
const recentPoems = ref([])
const likedPoems = ref([])
const subscribedPoets = ref([])
const loading = ref(true)

const formatSnippet = (c) => {
  if (!c) return ''
  return c.split('\n').filter(l => l.trim())[0] + '...'
}

const handleLogout = () => {
  authStore.logout()
  router.push('/auth')
}

const fetchProfile = async () => {
  if (!targetUserId.value) {
    // Edge case if someone drops onto /profile disconnected
    router.push('/auth')
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/users/${targetUserId.value}`)
    const data = await res.json()
    if (data && data.user) {
      user.value = data.user
      rank.value = data.rank || 1
      recentPoems.value = data.recentPoems || []
      likedPoems.value = data.likedPoems || []
      subscribedPoets.value = data.subscribedPoets || []
      
      // Compute stats
      myPoemsCount.value = recentPoems.value.length
      totalViews.value = recentPoems.value.reduce((acc, poem) => acc + (poem.views?.length || 0), 0)
    }
  } catch(e) {
    console.error('Profile fetch error:', e)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, fetchProfile)
onMounted(fetchProfile)
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
