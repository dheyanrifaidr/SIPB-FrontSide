<template>
  <div class="border p-4 bg-gray-50 rounded mb-4">
    <h2 class="text-lg font-semibold mb-2">{{ editData ? 'Edit Barang' : 'Tambah Barang' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-2">
        <label class="block">Jenis Barang:</label>
        <select v-model="form.id_jenis_barang" class="border rounded w-full px-3 py-2" required>
          <option value="" disabled>Pilih jenis barang</option>
          <option v-for="jenis in jenisBarangList" :key="jenis.id" :value="jenis.id">
            {{ jenis.nama }}
          </option>
        </select>
      </div>

      <div class="mb-2">
        <label class="block">Nama Barang:</label>
        <input v-model="form.nama_barang" type="text" class="border rounded w-full px-3 py-2" required />
      </div>

      <div class="mb-2">
        <label class="block">Harga Barang:</label>
        <input v-model.number="form.harga_barang" type="number" class="w-full border px-2 py-1 rounded" required />
      </div>

      <div class="flex gap-2 mt-3">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {{ editData ? 'Update' : 'Simpan' }}
        </button>
        <button @click="$emit('close')" type="button" class="text-gray-500 px-4 py-2 rounded hover:bg-gray-200">
          Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import API from '@/lib/api'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const form = reactive({
  id_jenis_barang: '',
  nama_barang: '',
  harga_barang: ''
})

const jenisBarangList = ref([])

const fetchJenisBarang = async () => {
  try {
    const res = await API.get('/api/v1/jenis-barang')
    jenisBarangList.value = res.data.data
  } catch (err) {
    console.error('Gagal mengambil jenis barang:', err)
  }
}

const resetFormData = () => {
  form.id_jenis_barang = ''
  form.nama_barang = ''
  form.harga_barang = ''
}

const submitForm = async () => {
  try {
    if (props.editData) {
      await API.put(`/api/v1/barang/${props.editData.id_barang}`, form)
      emit('saved', { success: true, message: 'Barang berhasil diperbarui' })
    } else {
      await API.post('/api/v1/barang', form)
      emit('saved', { success: true, message: 'Barang berhasil ditambahkan' })
    }
    resetFormData()
    emit('close')
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Gagal menyimpan barang'
    console.error('Gagal menyimpan:', err)
    emit('saved', { success: false, message: 'Gagal menyimpan barang' })
  }
}

watch(() => props.editData, (val) => {
  if (val) {
    form.id_jenis_barang = val.jenis_barang?.id || ''
    form.nama_barang = val.nama_barang || ''
    form.harga_barang = val.harga_barang || ''
  } else {
    resetFormData()
  }
}, { immediate: true })

onMounted(fetchJenisBarang)
</script>
