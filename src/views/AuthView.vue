<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-2 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
      <!-- Decorative background blur -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl"></div>

      <div class="relative z-10">
        <h2 class="text-center text-4xl font-serif font-bold text-text-main">Хуш омадед</h2>
        <p class="mt-2 text-center text-sm font-bold uppercase tracking-widest text-text-faint">
          {{ isLogin ? 'Ба ҳисоби худ ворид шавед' : 'Ҳисоби нав созед' }}
        </p>
      </div>

      <div class="relative z-10 flex bg-surface-2 p-1 rounded-xl mb-8">
        <button 
          @click="isLogin = true" 
          class="flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all"
          :class="isLogin ? 'bg-white shadow-sm text-indigo' : 'text-text-faint hover:text-text-main'">
          Вуруд
        </button>
        <button 
          @click="isLogin = false" 
          class="flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all"
          :class="!isLogin ? 'bg-white shadow-sm text-indigo' : 'text-text-faint hover:text-text-main'">
          Бақайдгирӣ
        </button>
      </div>

      <form class="space-y-6 relative z-10" @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="space-y-2">
          <label class="text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Ном ва насаб</label>
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input v-model="form.name" type="text" required class="input-base !pl-12 rounded-2xl w-full" placeholder="Номи худро ворид кунед" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Почтаи электронӣ</label>
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input v-model="form.email" type="email" required class="input-base !pl-12 rounded-2xl w-full" placeholder="email@example.com" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[0.65rem] font-black text-indigo uppercase tracking-widest ml-1">Парол</label>
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input v-model="form.password" type="password" required class="input-base !pl-12 rounded-2xl w-full" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="errorMsg" class="p-4 bg-heart/10 text-heart text-sm text-center rounded-xl font-bold">
          {{ errorMsg }}
        </div>

        <button type="submit" :disabled="loading" class="btn btn-indigo w-full py-4 text-base shadow-indigo/30 rounded-2xl">
          <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mr-2"></span>
          {{ loading ? 'Лутфан интизор шавед...' : (isLogin ? 'Вуруд ба система' : 'Бақайдгирӣ') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  name: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  
  let result
  if (isLogin.value) {
    result = await authStore.login(form.value.email, form.value.password)
  } else {
    result = await authStore.register(form.value.name, form.value.email, form.value.password)
  }
  
  loading.value = false
  
  if (result.success) {
    router.push('/profile')
  } else {
    errorMsg.value = result.error
  }
}
</script>
