import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_URL } from '../config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('mavlono_user') || 'null'))
  const token = ref(localStorage.getItem('mavlono_token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const currentUserId = computed(() => user.value?.id)

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Хатогӣ ҳангоми вуруд')
      }
      const data = await res.json()
      setAuthStatus(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Хатогӣ ҳангоми бақайдгирӣ')
      }
      const data = await res.json()
      setAuthStatus(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('mavlono_user')
    localStorage.removeItem('mavlono_token')
  }

  const setAuthStatus = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('mavlono_user', JSON.stringify(userData))
    localStorage.setItem('mavlono_token', authToken)
  }

  return {
    user,
    token,
    isAuthenticated,
    currentUserId,
    login,
    register,
    logout
  }
})
