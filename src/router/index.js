import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '../stores/admin'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import PoemView from '../views/PoemView.vue'
import PoetView from '../views/PoetView.vue'
import CatalogView from '../views/CatalogView.vue'
import WriteView from '../views/WriteView.vue'
import AiView from '../views/AiView.vue'
import PoetBioView from '../views/PoetBioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresUserAuth: true } },
    { path: '/users/:id', name: 'user-profile', component: ProfileView },
    { path: '/poems/:id', name: 'poem', component: PoemView },
    { path: '/poets/:id', name: 'poet', component: PoetView },
    { path: '/poets/:id/bio', name: 'poet-bio', component: PoetBioView },
    { path: '/catalog', name: 'catalog', component: CatalogView },
    { path: '/write', name: 'write', component: WriteView },
    { path: '/ai', name: 'ai', component: AiView },
    { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
    { path: '/auth', name: 'auth', component: () => import('../views/AuthView.vue') },
    
    // Admin Routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/LoginView.vue'),
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/poems'
        },
        {
          path: 'poems',
          name: 'admin-poems',
          component: () => import('../views/admin/PoemsManagement.vue')
        },
        {
          path: 'poets',
          name: 'admin-poets',
          component: () => import('../views/admin/PoetsManagement.vue')
        }
      ]
    },

    // catch-all redirect
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore()
  if (to.meta.requiresAuth && !adminStore.isAuthenticated) {
    return next('/admin/login')
  }

  // Ensure we lazy load the user auth store to avoid injection timing issues
  let authStore
  try {
    authStore = import.meta.glob('../stores/auth.js', { eager: true })['../stores/auth.js'].useAuthStore()
  } catch (e) {
    // Fallback if needed
  }
  
  if (to.meta.requiresUserAuth && authStore && !authStore.isAuthenticated) {
    return next('/auth')
  }

  next()
})

export default router
