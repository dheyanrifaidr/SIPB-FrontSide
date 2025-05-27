<template>
  <DefaultLayout>
    <div class="p-6 max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">🛠️ Pengadaan Manual oleh Admin</h1>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold">Pilih Barang</label>
          <select v-model="form.id_barang" class="w-full p-2 border rounded">
            <option disabled value="">-- Pilih Barang --</option>
            <option v-for="barang in barangList" :key="barang.id" :value="barang.id">
              {{ barang.nama_barang }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1 font-semibold">Jumlah Barang</label>
          <input
            type="number"
            v-model="form.jumlah"
            class="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Tambah Pengadaan
        </button>
      </form>

      <div v-if="loading" class="mt-6 text-gray-500">Memuat data barang...</div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import { useToast } from 'vue-toastification'
import DefaultLayout from '@/layout/DefaultLayout.vue'

const toast = useToast()
const loading = ref(true)

const barangList = ref([])
const form = ref({
  id_barang: '',
  jumlah: '',
})

const fetchBarang = async () => {
  try {
    const res = await api.get('/barang')
    barangList.value = res.data.data
  } catch (e) {
    toast.error('Gagal memuat data barang')
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  try {
    await api.post('/pengadaan/manual', form.value)
    toast.success('Pengadaan berhasil ditambahkan')
    form.value = { id_barang: '', jumlah: '' }
  } catch (e) {
    toast.error('Gagal menambahkan pengadaan')
  }
}

onMounted(fetchBarang)
</script>
