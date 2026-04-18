<template>
  <div>
  <div class="mb-10 pb-6 border-b border-border">
    <h1 class="text-3xl font-serif font-bold text-text-main">Иловаи шеър</h1>
    <p class="text-sm text-text-muted mt-2">Шеъри нав ба сомона илова кунед</p>
  </div>

    <div class="space-y-6">
      <div>
        <label class="text-[0.7rem] font-bold text-text-faint uppercase tracking-widest block mb-2">Шоир</label>
        <select v-model="form.poet_id" class="input-base cursor-pointer">
          <option value="" disabled>Шоирро интихоб кунед</option>
          <option v-for="p in poets" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>
      <div>
        <label class="text-[0.7rem] font-bold text-text-faint uppercase tracking-widest block mb-2">Матни шеър</label>
        <textarea v-model="form.content" class="input-base min-h-[300px] font-serif italic text-lg md:text-xl leading-relaxed p-6" placeholder="Матни шеърро ин ҷо нависед..."></textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-[0.7rem] font-bold text-text-faint uppercase tracking-widest block mb-2">Жанр</label>
          <input v-model="form.genre" class="input-base" placeholder="Ғазал, Рубоӣ, Дубайтӣ...">
        </div>
        <div>
          <label class="text-[0.7rem] font-bold text-text-faint uppercase tracking-widest block mb-2">Тегҳо (бо вергул ҷудо кунед)</label>
          <input v-model="form.tags" class="input-base" placeholder="ишқ, ватан, табиат">
        </div>
      </div>

      <div v-if="success" class="p-4 bg-gold-light border border-gold/30 rounded-xl text-gold-dark text-sm font-bold flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Шеър бо муваффақият илова шуд!
      </div>
      <div v-if="error" class="p-4 bg-heart/5 border border-heart/20 rounded-xl text-heart text-sm font-bold flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Хатогӣ рух дод. Дубора кӯшиш кунед.
      </div>

      <div class="pt-4">
        <button @click="submit" :disabled="submitting" class="btn btn-gold px-12 py-4 text-lg">
          {{ submitting ? 'Фиристода мешавад...' : 'Шеър илова кардан' }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { API_URL } from '../config'
const poets = ref([])
const form = ref({ poet_id: '', content: '', genre: '', tags: '' })
const submitting = ref(false)
const success = ref(false)
const error = ref(false)
onMounted(async () => {
  try { const r = await fetch(`${API_URL}/api/poets`) ; poets.value = await r.json() } catch(e) {}
})
const submit = async () => {
  if (!form.value.poet_id || !form.value.content) return
  submitting.value = true; success.value = false; error.value = false
  try {
    const r = await fetch(`${API_URL}/api/poems`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form.value, user_id: 1 }) })
    if (r.ok) { success.value = true; form.value = { poet_id: '', content: '', genre: '', tags: '' } }
    else throw new Error()
  } catch(e) { error.value = true }
  finally { submitting.value = false }
}
</script>
