//userStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const loadUserFromStorage = () => {
    const saved = localStorage.getItem('auth_user')
    if (saved) {
      user.value = JSON.parse(saved)
    }
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  return {
    user,
    setUser,
    loadUserFromStorage,
    clearUser
  }
})
