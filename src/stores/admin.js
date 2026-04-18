import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
    const token = ref(localStorage.getItem('mavlono_admin_token') || null)
    const isAuthenticated = ref(!!token.value)

    function login(newToken) {
        token.value = newToken
        isAuthenticated.value = true
        localStorage.setItem('mavlono_admin_token', newToken)
    }

    function logout() {
        token.value = null
        isAuthenticated.value = false
        localStorage.removeItem('mavlono_admin_token')
    }

    return { token, isAuthenticated, login, logout }
})
