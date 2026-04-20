<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-bg to-indigo-light/30">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-10">
        <h1 class="font-serif text-4xl font-bold text-indigo mb-2 tracking-tight">Mavlono</h1>
        <p class="text-xs font-bold text-text-faint uppercase tracking-[0.3em]">Панели маъмурӣ</p>
      </div>

      <!-- Login Card -->
      <div class="glass-card p-10 rounded-[2.5rem] shadow-2xl border border-white/60">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-[0.65rem] font-black text-indigo uppercase tracking-widest mb-3 ml-1">Пароли маъмурӣ</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="input-base text-lg py-4 px-6 text-center tracking-[0.5em]"
              required
              autofocus
            />
          </div>

          <p v-if="error" class="text-xs font-bold text-heart text-center">{{ error }}</p>

          <button 
            type="submit" 
            :disabled="loading"
            class="btn btn-indigo w-full py-4 rounded-2xl disabled:opacity-50"
          >
            <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
            <span v-else>Ворид шудан</span>
          </button>
        </form>
      </div>

      <!-- Back to Site -->
      <div class="mt-12 text-center">
        <router-link to="/" class="text-xs font-bold text-text-faint hover:text-indigo transition-colors flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Бозгашт ба сомона
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_URL } from '../../config'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    })
    
    const data = await res.json()
    
    if (data.success) {
      adminStore.login(data.token)
      router.push('/admin/poems')
    } else {
      error.value = data.error || 'Хатогӣ дар воридшавӣ'
    }
  } catch (err) {
    error.value = 'Сервер дастрас нест'
  } finally {
    loading.value = false
  }
}
</script>
