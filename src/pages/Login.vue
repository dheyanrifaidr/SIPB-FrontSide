<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <form @submit.prevent="loginActivity">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input 
            v-model="username" 
            type="text" 
            name="username"
            placeholder="username"
            class="w-full px-3 py-2 border rounded" 
            required 
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input 
            v-model="password" 
            type="password" 
            name="password"
            placeholder="password"
            class="w-full px-3 py-2 border rounded" 
            required 
          />
        </div>
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
          {{ loading ? 'LOADING...' : 'LOGIN' }}
        </button>
        <p v-if="errorMsg" class="text-red-500 mt-2">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import API from '../lib/api'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const loading = ref(false)
const username = ref('')
const password = ref('')
const errorMsg = ref('')

async function getCsrfCookie() {
  try {
    // Clear any existing CSRF cookie first
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // For stateful Sanctum, this endpoint sets the CSRF cookie
    await API.get('/sanctum/csrf-cookie')

    // Add a small delay to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Verify the cookie was set
    const token = getCookie('XSRF-TOKEN')
    console.log('CSRF cookie obtained:', !!token)

    if (!token) {
      throw new Error('CSRF token not set')
    }

    return true

  } catch (error) {
    console.error('Failed to get CSRF cookie:', error)
    errorMsg.value = 'Failed to establish secure connection'
    return false
  }
}

// Helper function to get cookie
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return null
}

async function loginActivity() {
  loading.value = true
  errorMsg.value = ''
  
  try {
    // First get CSRF cookie
    const csrfSuccess = await getCsrfCookie()
    if (!csrfSuccess) {
      loading.value = false
      return
    }

    // Debug: Log all cookies
    console.log('All cookies before login:', document.cookie)

    // Debug: Log the specific CSRF token
    const csrfToken = getCookie('XSRF-TOKEN')
    console.log('CSRF Token before login:', csrfToken)
  
    // Login attempt
    const response = await API.post('/api/login', {
      login: username.value,
      password: password.value,
    })

    console.log('Login successful:', response.data)

    // Store user data in userStore
    const userStore = useUserStore()
    userStore.setUser(response.data.user)
    
    toast.success('Login successful!')
    router.push('/dashboard')

  } catch (error) {
    console.error('Login failed:', error)
    errorMsg.value = error.response?.data?.message || 'Login failed'
    toast.error(errorMsg.value)
  } finally {
    loading.value = false
  }
}
</script>
