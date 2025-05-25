//dashboard.vue

<template>
  <DefaultLayout>
    <div class="p-4 bg-black-100">
      <h1 class=" text-2xl font-bold ">Dashboard</h1>
      <br />
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

</script>
