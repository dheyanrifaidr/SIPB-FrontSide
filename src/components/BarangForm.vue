<template>
  <div class="border p-4 bg-gray-50 rounded mb-4">
    <h2 class="text-lg font-semibold mb-2">
      {{ editData ? 'Edit Barang' : 'Tambah Barang' }}
    </h2>
    <form @submit.prevent="submitForm">
      <div class="mb-2">
        <label class="block">Nama Barang:</label>
        <input
          v-model="form.nama_barang"
          type="text"
          class="border rounded w-full px-3 py-2"
          required
        />
      </div>
      <div class="mb-2">
        <label class="block">Stok Awal:</label>
        <input
          v-model="form.stok"
          type="number"
          class="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <div class="flex gap-2 mt-3">
        <button 
        type="submit" 
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
        {{ editData ? 'Update' : 'Simpan' }}
      </button>
        <button 
        @click="$emit('close')" 
        type="button" 
        class="text-gray-500 px-4 py-2 rounded hover:bg-gray-400"
        >
          Batal
        </button>
      </div>
      <!-- emit('saved', {success: true, message: 'Barang berhasil disimpan'})
      emit('saved', { success: false, message: 'Gagal menyimpan barang' }) -->
    </form>
  </div>
</template>

<!--   
  function submitForm() {
    console.log('Data barang:', form)
    alert('Barang berhasil ditambahkan! (sementara tampil di console)')
  } 
-->

<script setup>
import { reactive, watch, onMounted } from 'vue'
import API from '@/lib/api'

const props = defineProps({
  editData: Object
})

const emit = defineEmits(['close', 'added'])

const form = reactive({
  nama_barang: '',
  stok: ''
})

watch(() => props.editData, (val) => {
  if (val) {
    form.nama_barang = val.nama_barang
    form.stok = val.stok
  } else {
    form.nama_barang = ''
    form.stok = ''
  }
}, { immediate: true })

const submitForm = async () => {
  const token = localStorage.getItem('auth_token')

  try {
    if (props.editData) {
      await API.put(`/barang/${props.editData.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } else {
      await API.post('/barang', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }

    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Gagal menyimpan barang:', error)
  }
}
</script>
