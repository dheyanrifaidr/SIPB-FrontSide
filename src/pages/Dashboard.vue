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
    <p>Selamat datang di Dashboard</p>
  </div>
  </DefaultLayout>
</template>
  
<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRouter } from 'vue-router';
import API from '@/lib/api'

const router = useRouter()
const logout = async () => {
  const token = localStorage.getItem('auth_token')
  console.log(token);
  
  if (token) { 
    try {
      await API.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        },
        withCredentials: false
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  router.push('/login')
}
</script>
