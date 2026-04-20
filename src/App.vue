<template>
  <div class="antialiased font-sans text-text-main bg-bg min-h-screen">
    <!-- Desktop Sidebar -->
    <Sidebar v-if="!isAdmin" class="hidden md:flex fixed top-0 left-0 bottom-0 w-[260px] z-50 overflow-y-auto" />

    <!-- Main Content Area -->
    <main :class="[isAdmin ? 'ml-0' : 'md:ml-[260px]']" class="min-h-screen flex flex-col transition-all">
      <!-- Mobile Header -->
      <header v-if="!isAdmin" class="md:hidden sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between z-40">
        <img src="/assets/brand/logo-horizontal.png" alt="mavlono" class="h-6">
        <router-link to="/search" class="text-text-muted hover:text-indigo">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </router-link>
      </header>

      <!-- Page Content -->
      <div :class="[isAdmin ? 'max-w-none px-0 py-0' : 'max-w-4xl mx-auto w-full px-6 py-8 md:px-12 md:py-10']" class="flex-1">
        <router-view :key="$route.fullPath" />
      </div>

      <!-- Mobile Spacer -->
      <div v-if="!isAdmin" class="md:hidden h-24"></div>
    </main>
  </div>

  <!-- Mobile bottom nav -->
  <nav v-if="!isAdmin" class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border pb-safe">
    <div class="grid grid-cols-5 max-w-lg mx-auto">
      <router-link to="/" class="flex flex-col items-center py-2 transition-all" v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full" :class="isActive && $route.path === '/' ? 'text-indigo' : 'text-text-faint'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span class="text-[9px] mt-1 font-black uppercase tracking-tighter">Асосӣ</span>
        </button>
      </router-link>

      <router-link to="/catalog" class="flex flex-col items-center py-2 transition-all" v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full" :class="isActive ? 'text-indigo' : 'text-text-faint'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          <span class="text-[9px] mt-1 font-black uppercase tracking-tighter">Каталог</span>
        </button>
      </router-link>

      <router-link to="/write" class="flex flex-col items-center py-2 transition-all" v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full" :class="isActive ? 'text-indigo' : 'text-text-faint'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          <span class="text-[9px] mt-1 font-black uppercase tracking-tighter">Нависед</span>
        </button>
      </router-link>

      <router-link to="/ai" class="flex flex-col items-center py-2 transition-all" v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full" :class="isActive ? 'text-indigo' : 'text-text-faint'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          <span class="text-[9px] mt-1 font-black uppercase tracking-tighter">AI Шарҳ</span>
        </button>
      </router-link>

      <router-link to="/profile" class="flex flex-col items-center py-2 transition-all" v-slot="{ isActive, navigate }">
        <button @click="navigate" class="flex flex-col items-center justify-center w-full" :class="isActive ? 'text-indigo' : 'text-text-faint'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
          <span class="text-[9px] mt-1 font-black uppercase tracking-tighter">Профил</span>
        </button>
      </router-link>
    </div>
  </nav>

</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Layout/Sidebar.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<style>
.hidden-mobile { display: block; }
@media (max-width: 768px) { .hidden-mobile { display: none !important; } }
</style>
