<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input 
            v-model="loginForm.username" 
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
            v-model="loginForm.password" 
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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import API from '@/lib/api'

// await axios.get('/sanctum/csrf-cookie')

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: ''
})

const errorMsg = ref('')

// Login function
const loading = ref(false)

const login = async () => {
  errorMsg.value = ''
  loading.value = true
  try {

    const onlineResponse = await API.get('/api/v1/online')
    if (onlineResponse.status !== 200) {
      errorMsg.value = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'
      return
    }
  
    const response = await API.post('/login', {
      login: loginForm.value.username,
      password: loginForm.value.password,
    })

    userStore.setUser(response.data.user)

    await router.push('/dashboard')
  } catch (err) {
    if (err.response?.status === 422) {
      errorMsg.value = 'Please fill in both fields.'
    } else if (err.response?.status === 401) {
      errorMsg.value = 'Username or password incorrect.'
    } else if (loginError.response?.status === 419) {
        // // Jika token expired atau mismatch, refresh token dan coba login lagi
        // await API.get('/sanctum/csrf-cookie')
        // await API.post('/login', {
        //   login: loginForm.value.username,
        //   password: loginForm.value.password,
        // })
        // router.push('/dashboard')
      errorMsg.value = 'CSRF token expired. Please try again.'
        
      } else {
      errorMsg.value = 'Login failed. Please try again.'
    }
    console.error('Login error:', err)
  } finally {
    loading.value = false
    return
  }
}

</script>
