<template>
<DefaultLayout>
  <div v-if="alert.message" :class="alertClass" class="p-3 rounded mb-4">
    {{ alert.message }}
  </div>

  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold">Pengadaan Barang</h1>
    <button
      @click="showForm = !showForm"
      class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      + Tambah Barang
    </button>
  </div>

    <BarangForm
      v-if="showForm"
      :editData="editItem"
      @close="resetForm"
      @added="handleSaved"
    />
    <BarangTable
      @edit="handleEdit"
    />
    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="py-2 border">ID</th>
          <th class="py-2 border">Nama Barang</th>
          <th class="py-2 border">Stok</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in barangList" :key="item.id">
          <td class="py-2 border text-center">{{ item.id }}</td>
          <td class="py-2 border">{{ item.nama_barang }}</td>
          <td class="py-2 border text-center">{{ item.stok }}</td>
        </tr>
      </tbody>
    </table>
  
  <p v-if="barangList.length === 0" class="text-gray-500 mt-4">Tidak ada barang tersedia.</p>
</DefaultLayout>
</template>
  
<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BarangTable from '@/components/BarangTable.vue'
import BarangForm from '@/components/BarangForm.vue'
// import { ref } from 'vue'
import { ref, onMounted, computed } from 'vue'
import API from '@/lib/api'

const barangList = ref([])
const showForm = ref(false)
const loading = ref(true)

const jumlahBarang = ref(5);
const total = computed(() => jumlahBarang.value * 2);

const fetchBarang = async () => {
  const token = localStorage.getItem('auth_token')
  try {
    const res = await API.get('/barang', {
      headers: {Authorization: `Bearer ${token}`}
    })
    barangList.value = res.data.data
  } catch (error) {
    console.error('Gagal mengambil data barang:', error)
  }
}

const editItem = ref(null)

const handleEdit = (item) => {
  editItem.value = item
  showForm.value = true
}

const handleDelete = async (id) => {
  const token = localStorage.getItem('auth_token')
  if (!confirm('Yakin ingin menghapus barang ini?')) return

  try {
    await API.delete(`/barang/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchBarang()
  } catch (error) {
    console.error('Gagal hapus barang:', error)
  }
}

const resetForm = () => {
  showForm.value = false
  editItem.value = null
}

// Fetch data langsung saat halaman dibuka
onMounted(() => {
  fetchBarang()
})  

const alert = ref({
  message: '',
  type: 'success' // atau 'error'
})

const alertClass = computed(() =>
  alert.value.type === 'success'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
)

function showAlert(message, type = 'success') {
  alert.value = { message, type }
  setTimeout(() => {
    alert.value.message = ''
  }, 3000)
}
function handleSaved(result) {
  fetchBarang()
  showForm.value = false
  editItem.value = null
  showAlert(result.message, result.success ? 'success' : 'error')
}

</script>

