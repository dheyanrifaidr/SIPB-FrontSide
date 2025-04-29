<template>
  <div class="overflow-x-auto bg-white shadow rounded-lg p-4">
    <h2 class="text-xl font-semibold mb-4">Daftar Barang</h2>
    <table class="min-w-full text-sm text-left border border-gray-200">
      <thead class="bg-gray-100">
        <tr class="bg-gray-100 text-left">
          <th class="px-4 py-2 border">#</th>
          <th class="px-4 py-2 border">Nama Barang</th>
          <th class="px-4 py-2 border">Stok</th>
          <th class="px-4 py-2 border text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in barangList"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border">{{ index + 1 }}</td>
          <td class="px-4 py-2 border">{{ item.nama_barang }}</td>
          <td class="px-4 py-2 border text-center">{{ item.stok }}</td>
          <td class="px-4 py-2 border text-center">
            <button
              @click="$emit('edit', item)"
              class="text-blue-600 hover:underline mr-2"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', item.id)"
              class="text-red-600 hover:underline"
            >
              Hapus
            </button>
          </td>
        </tr>
        <tr v-if="barangList.length === 0">
          <td colspan="4" class="text-center py-4 text-gray-400">Tidak ada data</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import API from '@/lib/api'

const barangList = [
  { nama: 'Kertas A4', jumlah: 5, tanggal: '2025-04-24' },
  { nama: 'Pulpen', jumlah: 10, tanggal: '2025-04-20' },
]

defineProps(['barangList'])
defineEmits(['edit', 'delete'])

async function fetchBarang() {
    try {
    const res = await API.get('/barang')
    barangList.value = res.data.data
    } catch (err) {
    console.error('Gagal ambil data barang:', err)
    }
}

onMounted(fetchBarang)
</script>
