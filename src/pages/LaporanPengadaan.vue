<template>
  <DefaultLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">📊 Laporan Pengadaan & Stok</h1>

      <div v-if="loading" class="text-center py-10">Memuat data...</div>
      <div v-else>
        <table class="w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="px-4 py-2 border">Nama Barang</th>
              <th class="px-4 py-2 border">Total Pengadaan</th>
              <th class="px-4 py-2 border">Stok Saat Ini</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in laporan"
              :key="item.id_barang"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-4 py-2 border">{{ item.nama_barang }}</td>
              <td class="px-4 py-2 border">{{ item.total_pengadaan }}</td>
              <td class="px-4 py-2 border">{{ item.stok }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { useToast } from 'vue-toastification'

const laporan = ref([])
const loading = ref(true)
const toast = useToast()

const loadLaporan = async () => {
  loading.value = true
  try {
    const { data: pengadaanRes } = await api.get('/laporan-pengadaan')
    laporan.value = pengadaanRes.data
  } catch (e) {
    toast.error('Gagal memuat laporan')
  } finally {
    loading.value = false
  }
}

onMounted(loadLaporan)
</script>
