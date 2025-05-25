<template>
  <aside
    :class="[
      'bg-gray-100 h-full p-4 shadow-md transition-all duration-300',
      collapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Tombol Collapse -->
    <div class="flex justify-end mb-4">
      <button @click="collapsed = !collapsed" class="text-sm text-gray-600 hover:text-gray-800">
        {{ collapsed ? '≡' : 'x' }}
      </button>
    </div>

    <!-- Menu -->
    <nav class="flex flex-col gap-2">
      <SidebarLink
        v-for="item in menu"
        :key="item.name"
        :item="item"
        :collapsed="collapsed"
      />
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import SidebarLink from './SidebarLink.vue'

const collapsed = ref(false)

const menu = [
  { 
    name: 'Dashboard', 
    path: '/dashboard',
    emoji: '🏠'
  },
  {
    name: 'Pengadaan',
    emoji: '📦',
    children: [
      { name: 'Daftar Barang', path: '/daftar-barang', emoji: '📥' },
      { name: 'Riwayat', path: '/pengadaan-riwayat', emoji: '🕘' }
    ]
  },
  { 
    name: 'Laporan', 
    path: '/laporan',
    emoji: '📊'
  }
]
</script>