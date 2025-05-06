<template>
  <div class="p-6">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API from '@/lib/api'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['edit', 'saved'])
const barangList = ref([])

const fetchBarang = async () => {
  try {
    const res = await API.get('/barang')
    barangList.value = res.data.data
  } catch (err) {
    toast.error('Gagal mengambil barang')
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
    toast.error('Gagal menghapus barang')
    emit('saved', { success: false, message: 'Gagal menghapus barang' })
  }
}

onMounted(fetchBarang)
defineExpose({ fetchBarang })
</script>
