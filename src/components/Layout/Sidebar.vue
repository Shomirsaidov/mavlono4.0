<template>
  <aside class="w-[260px] h-screen fixed left-0 top-0 z-[100] bg-surface border-r border-border flex flex-col p-6 overflow-hidden">
    <!-- Brand -->
    <div class="mb-10 pl-2">
      <router-link to="/">
        <img src="/assets/brand/logo-horizontal.png" alt="mavlono.tj" class="h-8 object-contain">
      </router-link>
    </div>

    <!-- Main Nav -->
    <nav class="flex flex-col gap-1.5 mb-8">
      <router-link to="/" custom v-slot="{ isActive, navigate }">
        <div 
          class="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.92rem] font-semibold transition-all cursor-pointer"
          :class="isActive && $route.path === '/' ? 'bg-indigo text-white shadow-lg shadow-indigo/20' : 'text-text-muted hover:bg-surface-2'" 
          @click="navigate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Асосӣ
        </div>
      </router-link>

      <router-link to="/profile" custom v-slot="{ isActive, navigate }">
        <div 
          class="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.92rem] font-semibold transition-all cursor-pointer"
          :class="isActive ? 'bg-indigo text-white shadow-lg shadow-indigo/20' : 'text-text-muted hover:bg-surface-2'" 
          @click="navigate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Саҳифаи ман
        </div>
      </router-link>

      <router-link to="/catalog" custom v-slot="{ isActive, navigate }">
        <div 
          class="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.92rem] font-semibold transition-all cursor-pointer"
          :class="isActive ? 'bg-indigo text-white shadow-lg shadow-indigo/20' : 'text-text-muted hover:bg-surface-2'" 
          @click="navigate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          Каталог
        </div>
      </router-link>

      <router-link to="/write" custom v-slot="{ isActive, navigate }">
        <div 
          class="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.92rem] font-semibold transition-all cursor-pointer"
          :class="isActive ? 'bg-indigo text-white shadow-lg shadow-indigo/20' : 'text-text-muted hover:bg-surface-2'" 
          @click="navigate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          Иловаи шеър
        </div>
      </router-link>

      <router-link to="/ai" custom v-slot="{ isActive, navigate }">
        <div 
          class="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.92rem] font-semibold transition-all cursor-pointer"
          :class="isActive ? 'bg-indigo text-white shadow-lg shadow-indigo/20' : 'text-text-muted hover:bg-surface-2'" 
          @click="navigate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          AI Шарҳ
        </div>
      </router-link>
    </nav>

    <!-- Poets list -->
    <div class="flex-1 overflow-y-auto no-scrollbar">
      <div class="px-4 mb-3 text-[0.72rem] font-bold text-text-faint uppercase tracking-wider">Шоирон</div>
      <div class="flex flex-col gap-1">
        <router-link
          v-for="poet in poets"
          :key="poet.id"
          :to="'/poets/' + poet.id"
          class="block group"
        >
          <div class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all hover:bg-surface-2 group-active:scale-95">
            <PoetAvatar :src="poet.avatar" :alt="poet.name" size="28" />
            <span class="text-[0.88rem] font-medium text-text-muted group-hover:text-indigo transition-colors">{{ poet.name }}</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Brand footer -->
    <div class="mt-auto pt-6 border-t border-border mt-4 text-center">
      <span class="text-[0.68rem] text-text-faint font-medium">mavlono.tj © 2025</span>
    </div>
  </aside>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import PoetAvatar from '../PoetAvatar.vue'


const poets = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/poets`) 
    const data = await res.json()
    if (Array.isArray(data)) poets.value = data
  } catch(e) {
    console.error('Failed to load poets', e)
  }
})
</script>
