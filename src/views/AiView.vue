<template>
  <div>
  <div class="mb-10 pb-6 border-b border-border">
    <h1 class="text-3xl font-serif font-bold text-text-main">Хуши сунъӣ (AI)</h1>
    <p class="text-sm text-text-muted mt-2">Маъно ва шарҳи шеъри тоҷикиро биомӯзед</p>
  </div>

    <div class="space-y-4 mb-8">
      <textarea v-model="query" class="input-base min-h-[160px] font-serif italic text-lg leading-relaxed p-6" placeholder="Шеъри худро ба ин ҷо нависед ё ворид кунед..."></textarea>
      
      <div class="flex justify-end">
        <button @click="send" :disabled="loading" class="btn btn-gold px-10 py-3 shadow-gold/30">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          <div v-else class="mr-3 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {{ loading ? 'Шарҳ дода мешавад...' : 'Шарҳ гиред' }}
        </button>
      </div>
    </div>

    <div v-if="response" class="bg-white p-8 rounded-3xl border border-border border-l-4 border-l-gold shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </div>
      <div class="text-[0.65rem] font-black text-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span class="w-8 h-px bg-gold/30"></span>
        Шарҳи ҳуши сунъӣ
      </div>
      <p class="font-serif text-lg md:text-xl leading-relaxed text-gray-800 whitespace-pre-line italic">{{ response }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { API_URL } from '../config'
import { useRoute } from 'vue-router'
const route = useRoute()
const query = ref(route.query.query || '')
const response = ref('')
const loading = ref(false)
const send = async () => {
  if (!query.value.trim()) return
  loading.value = true; response.value = ''
  try {
    const r = await fetch(`${API_URL}/api/ai/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query.value }) })
    const data = await r.json()
    response.value = data.response || data.message || 'Ҷавоб нест.'
  } catch(e) { response.value = 'Хатогӣ рух дод. Дубора кӯшиш кунед.' }
  finally { loading.value = false }
}
onMounted(() => { if (query.value) send() })
</script>
