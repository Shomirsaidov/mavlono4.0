<template>
  <div class="min-h-screen bg-bg flex flex-col md:flex-row">
    <!-- Mobile Header -->
    <header class="md:hidden flex items-center justify-between p-4 bg-white border-b border-border sticky top-0 z-40">
      <h1 class="font-serif font-bold text-indigo tracking-tight">Mavlono Admin</h1>
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 text-text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </header>

    <!-- Sidebar Wrapper -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transition-transform duration-300 md:relative md:translate-x-0"
      :class="{ '-translate-x-full': !isMobileMenuOpen }"
    >
      <div class="h-full flex flex-col p-6">
        <!-- Brand -->
        <div class="mb-10 px-2 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center text-white font-serif font-black">M</div>
          <span class="font-serif font-bold text-xl text-text-main">Админ</span>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1">
          <router-link 
            v-for="item in navItems" 
            :key="item.path" 
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group"
            :class="[
              $route.path.startsWith(item.path) 
                ? 'bg-indigo text-white shadow-lg shadow-indigo/20' 
                : 'text-text-muted hover:bg-indigo-light hover:text-indigo'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-5 h-5 opacity-70 group-hover:opacity-100" />
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Logout -->
        <div class="mt-auto pt-6 border-t border-border">
          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-heart hover:bg-heart/5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Хуруҷ
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" @click="isMobileMenuOpen = false"></div>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()
const isMobileMenuOpen = ref(false)

const navItems = [
  { 
    name: 'Шеърҳо', 
    path: '/admin/poems', 
    icon: markRaw({ template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>' })
  },
  { 
    name: 'Адибон', 
    path: '/admin/poets', 
    icon: markRaw({ template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>' }) 
  }
]

const handleLogout = () => {
  adminStore.logout()
  router.push('/admin/login')
}
</script>
