<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import { toast } from 'vue3-toastify';

toast.success('Berhasil!');

const barangList = ref([])
const jenisBarangList = ref([])

const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selectedBarang = ref(null)
const form = ref({
  nama_barang: '',
  id_jenis_barang: '',
  harga_barang: ''
})

const fetchBarang = async () => {
  try {
    const res = await api.get('/api/v1/barang')
    barangList.value = res.data.data
  } catch (error) {
    console.error('Gagal mengambil data barang:', error)
  }
}

const fetchJenisBarang = async () => {
  try {
    const res = await api.get('/api/v1/jenis-barang')
    jenisBarangList.value = res.data.data
  } catch (error) {
    console.error('Gagal mengambil data jenis barang:', error)
  }
}

const editBarang = (barang) => {
  selectedBarang.value = barang
  form.value = {
    nama_barang: barang.nama_barang,
    id_jenis_barang: barang.jenis_barang.id,
    harga_barang: barang.harga_barang
  }
  fetchJenisBarang()
  showEditModal.value = true
}

const submitEdit = async () => {
  try {
    await api.put(`/api/v1/barang/${selectedBarang.value.id_barang}`, form.value)
    showEditModal.value = false
    fetchBarang()
  } catch (error) {
    console.error('Gagal mengupdate barang:', error)
  }
}

const confirmDelete = (barang) => {
  selectedBarang.value = barang
  showDeleteModal.value = true
}

const deleteBarang = async () => {
  try {
    await api.delete(`/api/v1/barang/${selectedBarang.value.id_barang}`)
    showDeleteModal.value = false
    fetchBarang()
  } catch (error) {
    console.error('Gagal menghapus barang:', error)
  }
}

onMounted(() => {
  fetchBarang()
})
</script>

<template>
  <div class="p-4">
    <!-- Tabel Barang -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Data Barang</h2>
      <table class="w-full border border-gray-300 rounded">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Jenis Barang</th>
            <th class="p-2 text-left">Nama Barang</th>
            <th class="p-2 text-left">Harga Barang</th>
            <th class="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="barang in barangList"
            :key="barang.id_barang"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-2">{{ barang.jenis_barang.nama }}</td>
            <td class="p-2">{{ barang.nama_barang }}</td>
            <td class="p-2">Rp {{ barang.harga_barang.toLocaleString('id-ID') }}</td>
            <td class="p-2 text-center">
              <button @click="editBarang(barang)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="confirmDelete(barang)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Edit -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-md w-[400px]">
        <h2 class="text-lg font-semibold mb-4">Edit Barang</h2>
        <form @submit.prevent="submitEdit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Nama Barang</label>
            <input v-model="form.nama_barang" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label class="block text-sm font-medium">Jenis Barang</label>
            <select v-model="form.id_jenis_barang" class="w-full border px-3 py-2 rounded" required>
              <option v-for="jenis in jenisBarangList" :key="jenis.id_jenis_barang" :value="jenis.id_jenis_barang">
                {{ jenis.nama_jenis_barang }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium">Harga Barang</label>
            <input v-model="form.harga_barang" type="number" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showEditModal = false" class="text-gray-600 hover:underline">Batal</button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Hapus -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-md w-[350px]">
        <h3 class="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
        <p class="mb-4">
          Yakin ingin menghapus <strong>{{ selectedBarang?.nama_barang }}</strong>?
        </p>
        <div class="flex justify-end gap-2">
          <button @click="showDeleteModal = false" class="text-gray-600 hover:underline">Batal</button>
          <button @click="deleteBarang" class="bg-red-600 text-white px-4 py-2 rounded">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>
