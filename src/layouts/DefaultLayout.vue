<!-- <template>
    <div class="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div class="flex-1">
        <Navbar />
        <div class="p-4">
          <slot />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '@/components/Sidebar.vue'
  import Navbar from '@/components/Navbar.vue'
  </script>
   -->

<template>
<div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow p-4 mb-6">
    <h1 class="text-xl font-bold">SIPB Koperasi Syariah</h1>
    </nav>

    <!-- Isi Halaman -->
    <main class="px-6">
    <slot />
    </main>
</div>
</template>
  