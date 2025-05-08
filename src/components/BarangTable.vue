<template>
  <div class="p-6">
    <div class="flex justify-end mb-4">
      <input
        v-model="search"
        @input="fetchBarang"
        type="text"
        placeholder="Cari nama barang..."
        class="border px-3 py-2 rounded w-64"
      />
    </div>
    <div class="overflow-x-auto bg-white rounded-xl shadow">
      <table class="min-w-full table-auto text-sm">
        <thead class="bg-gray-100 text-left text-gray-700">
          <tr>
            <th class="px-6 py-3">Jenis Barang</th>
            <th class="px-6 py-3">Nama Barang</th>
            <th class="px-6 py-3">Harga Barang</th>
            <th class="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="text-center py-4">Memuat data...</td>
          </tr>
          <tr v-else-if="barangList.length === 0">
            <td colspan="4" class="text-center py-4 text-gray-500">Tidak ada data barang</td>
          </tr>
          <tr v-for="barang in barangList" :key="barang.id_barang" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4">{{ barang.jenis_barang.nama }}</td>
            <td class="px-6 py-4">{{ barang.nama_barang }}</td>
            <td class="px-6 py-4">Rp {{ barang.harga_barang.toLocaleString('id-ID') }}</td>
            <td class="px-6 py-4 text-center space-x-2">
              <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" @click="$emit('edit', barang)">Edit</button>
              <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" @click="confirmDelete(barang)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4 space-x-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          &laquo; Sebelumnya
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === lastPage"
          class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Berikutnya &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API from '@/lib/api'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['edit', 'saved'])
const barangList = ref([])
const search = ref('')
const isLoading = ref(false)

const currentPage = ref(1)
const lastPage = ref(1)

const fetchBarang = async () => {
  isLoading.value = true
  try {
    const res = await API.get('/api/v1/barang')
    // const res = await API.get('/barang', {
    //   params: {
    //     page: currentPage.value,
    //     search: search.value || undefined
    //   }
    // })
    barangList.value = res.data.data
    lastPage.value = res.data.meta.last_page
  } catch (err) {
    toast.error('Gagal mengambil barang')
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async (barang) => {
  if (!confirm(`Yakin ingin menghapus barang "${barang.nama_barang}"?`)) return

  try {
    await API.delete(`/barang/${barang.id_barang}`)
    toast.success('Barang berhasil dihapus')
    fetchBarang()
    emit('saved', { success: true, message: 'Barang berhasil dihapus' })
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Gagal menghapus barang'
    toast.error('Gagal menghapus barang')
    emit('saved', { success: false, message: 'Gagal menghapus barang' })
  }
}

// watch(currentPage, fetchBarang)

onMounted(fetchBarang)

defineExpose({ fetchBarang })
</script>
