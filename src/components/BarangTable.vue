<template>
  <div class="p-6">
    <div class="flex justify-end mb-4">
      <input
        v-model="search"
        @input="handleSearch"
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
            <td class="px-6 py-4">{{ barang.jenis_barang?.nama }}</td>
            <td class="px-6 py-4">{{ barang.nama_barang }}</td>
            <td class="px-6 py-4">Rp {{ barang.harga_barang.toLocaleString('id-ID') }}</td>
            <td class="px-6 py-4 text-center space-x-2">
              <BaseButton variant="danger" @click="$emit('edit', barang)">Edit</BaseButton>
              <BaseButton variant="danger" @click="confirmDelete(barang)">Hapus</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4 space-x-2">
        <BaseButton
          variant="secondary"
          @click="currentPage--"
          :disabled="currentPage === 1"
        >
          &laquo; Sebelumnya
        </BaseButton>
        <BaseButton
          variant="secondary"
          @click="currentPage++"
          :disabled="currentPage === lastPage"
        >
          Berikutnya &raquo;
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import API from '@/lib/api'
import { toast } from 'vue3-toastify'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['edit', 'saved'])
const barangList = ref([])
const search = ref('')
const isLoading = ref(false)

const currentPage = ref(1)
const lastPage = ref(1)

const fetchBarang = async () => {
  isLoading.value = true
  try {
    const res = await API.get('/api/v1/barang', {
      params: {
        page: currentPage.value,
        search: search.value || undefined
      }
    })
    barangList.value = res.data.data
    lastPage.value = res.data.meta.last_page
  } catch (err) {
    toast.error('Gagal mengambil barang')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchBarang()
}

const confirmDelete = async (barang) => {
  if (!confirm(`Yakin ingin menghapus barang "${barang.nama_barang}"?`)) return

  try {
    await API.delete(`/api/v1/barang/${barang.id_barang}`)
    toast.success('Barang berhasil dihapus')
    fetchBarang()
    emit('saved', { success: true, message: 'Barang berhasil dihapus' })
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Gagal menghapus barang'
    toast.error('Gagal menghapus barang')
    emit('saved', { success: false, message: 'Gagal menghapus barang' })
  }
}

onMounted(fetchBarang)
watch(currentPage, fetchBarang)

defineExpose({ fetchBarang })
</script>
