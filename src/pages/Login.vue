<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Login</label>
          <input v-model="loginForm.login" type="text" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="loginForm.password" type="password" class="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Masuk
        </button>
        <p v-if="errorMsg" class="text-red-500 mt-2">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import API from '@/lib/api'

const router = useRouter()

const loginForm = ref({
  login: '',
  password: ''
})

const errorMsg = ref('')

// Function to check if API is online
const checkOnlineStatus = async () => {
  try {
    const onlineResponse = await API.get('/online')
    if (onlineResponse.status === 200) {
      return onlineResponse
    }
  } catch (err) {
    console.error('Error checking online status:', err)
    return false
  }
}

// Login function
const login = async () => {
  errorMsg.value = ''
  const online = await checkOnlineStatus()
  if (!online) {
    errorMsg.value = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'
    return
  }

  try {
    const res = await API.post('/auth/login', loginForm.value)

    if (res.data.status === true) {
      localStorage.setItem('auth_token', res.data.token)
      localStorage.setItem('auth_user', JSON.stringify(res.data.user))
      const token = localStorage.getItem('auth_token')
      console.log(token);
      router.push('/') // atau sesuaikan dengan dashboard route kamu
    } else {
      errorMsg.value = res.data.message || 'Login gagal.'
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      errorMsg.value = 'Login gagal. Username atau password salah.'
    } else {
      errorMsg.value = 'Terjadi kesalahan saat login.'
    }
    console.error('Login error:', err)
  }
}
</script>
