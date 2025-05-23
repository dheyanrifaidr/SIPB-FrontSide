<template>
  <nav class="bg-white shadow px-6 py-4 flex justify-between items-center">
    <h1 class="text-xl font-semibold text-gray-800">SIPB</h1>
    <div class="flex items-center gap-4">
      <span class="text-gray-600">Halo, {{ username }}</span>
      <button @click="logout" class="text-red-500 hover:underline">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const username = localStorage.getItem('username') || 'User' // atau ambil dari store

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
