//dashboard.vue

<template>
  <DefaultLayout>
    <div class="p-4 bg-black-100">
      <h1 class=" text-2xl font-bold ">Dashboard</h1>
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold"></h1>
        <button
          @click="logout"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p v-if="userStore.user">Selamat datang di Dashboard, {{ userStore.user.branch_name }}  ({{ userStore.user.username }})</p>
    </div>
  </DefaultLayout>
</template>
  
<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import API from '@/lib/api'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.loadUserFromStorage() // kalau belum otomatis dimuat
})

const logout = async () => {
  try {
    await API.get('/sanctum/csrf-cookie') // pastikan CSRF token fresh

    const response = await API.post('/api/v1/logout')
    console.log('Logout successful:', response.data)

    //TEST
    // const response = await API.post('/api/v1/test-logout')
    // console.log('Test logout response:', response.data)

  } catch (err) {
    console.warn('Logout error:', err)

    //TEST
    // console.warn('Test logout error:', err)

  } finally {
    userStore.clearUser()
    // Redirect ke halaman login / root
    router.push('/')
  }
}

</script>
