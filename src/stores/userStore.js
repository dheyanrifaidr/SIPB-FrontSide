//userStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import API from '../lib/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const loadUserFromStorage = () => {
    const saved = localStorage.getItem('auth_user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
        // Verify the session is still valid with the backend
        validateSession()
      } catch (e) {
        clearUser()
      }
    }
  }

const validateSession = async () => {
  try {
    // Use an endpoint that exists in your API routes
    // The v1/online endpoint would work, but it's not protected
    // Use a protected endpoint like v1/users instead
    await API.get('/api/v1/online')
    isAuthenticated.value = true
  } catch (error) {
    console.error('Session validation error:', error)
    // If the request fails, clear the user data
    clearUser()
    isAuthenticated.value = false
  }
}

  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth_user')
  }

  return {
    user,
    isAuthenticated,
    setUser,
    loadUserFromStorage,
    validateSession,
    clearUser
  }
})
