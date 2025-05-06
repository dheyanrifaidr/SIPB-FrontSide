<template>
  <DefaultLayout>
    <div v-if="alert.message" :class="alertClass" class="p-3 rounded mb-4">
      {{ alert.message }}
    </div>

    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Pengadaan Barang</h1>
      <button @click="toggleForm" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {{ showForm ? 'Tutup Form' : '+ Tambah Barang' }}
      </button>
    </div>

    <BarangForm
      v-if="showForm"
      :editData="editItem"
      @close="resetForm"
      @saved="handleSaved"
    />
    <BarangTable ref="barangTable" @edit="handleEdit" @saved="handleSaved" />
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import BarangForm from '@/components/BarangForm.vue'
import BarangTable from '@/components/BarangTable.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const showForm = ref(false)
const editItem = ref(null)
const alert = ref({ message: '', type: 'success' })
const barangTable = ref(null)

const toggleForm = () => {
  editItem.value = null
  showForm.value = !showForm.value
}

const resetForm = () => {
  showForm.value = false
  editItem.value = null
}

const handleEdit = (item) => {
  editItem.value = item
  showForm.value = true
}

const alertClass = computed(() =>
  alert.value.type === 'success'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
)

const showAlert = (message, type = 'success') => {
  alert.value = { message, type }
  setTimeout(() => (alert.value.message = ''), 3000)
}

const handleSaved = (result) => {
  resetForm()
  showAlert(result.message, result.success ? 'success' : 'error')
  barangTable.value?.fetchBarang()
}
</script>
