<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <Sidebar />
    <div class="flex-1" flex flex-col>
      <Navbar />
      <main class="p-6 overflow-y-auto flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
  
<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>