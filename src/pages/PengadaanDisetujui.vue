<template>
  <DefaultLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">📦 Pengadaan Disetujui</h1>

      <div v-if="loading" class="text-center py-10">Loading...</div>
      <div v-else-if="pengajuanList.length === 0" class="text-center py-10 text-gray-500">
        Tidak ada pengajuan yang disetujui.
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="pengajuan in pengajuanList"
          :key="pengajuan.id_pengajuan"
          class="bg-white shadow rounded-xl p-4 border"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold text-lg">ID: {{ pengajuan.unique_id }}</p>
              <p class="text-sm text-gray-600">Tanggal: {{ formatTanggal(pengajuan.tanggal_pengajuan) }}</p>
              <p class="text-sm text-gray-600">Diajukan oleh: {{ pengajuan.nama_user }}</p>
            </div>
            <button
              class="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
              @click="handleTambahKeGudang(pengajuan)"
              :disabled="processing"
            >
              Tambah ke Gudang
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { useToast } from 'vue-toastification'

const pengajuanList = ref([])
const loading = ref(true)
const processing = ref(false)
const toast = useToast()

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/pengajuan')
    pengajuanList.value = data.data.filter(p => p.status_pengajuan === 'Disetujui')
  } catch (e) {
    toast.error('Gagal memuat data pengajuan')
  } finally {
    loading.value = false
  }
}

const handleTambahKeGudang = async (pengajuan) => {
  if (!confirm(`Tambah semua barang dari pengajuan ${pengajuan.unique_id} ke gudang?`)) return

  processing.value = true
  try {
    const { data } = await api.get(`/detail-pengajuan?id_pengajuan=${pengajuan.id_pengajuan}`)
    const detailList = data.data

    for (const item of detailList) {
      await api.post('/gudang', {
        unique_id: pengajuan.unique_id,
        id_barang: item.id_barang,
        jumlah_barang: item.jumlah
      })
    }

    // (optional) ubah status jadi selesai
    await api.put(`/pengajuan/${pengajuan.id_pengajuan}`, {
      ...pengajuan,
      status_pengajuan: 'Selesai'
    })

    toast.success(`Barang dari pengajuan ${pengajuan.unique_id} berhasil ditambahkan ke gudang`)
    await loadData()
  } catch (e) {
    console.error(e)
    toast.error('Gagal menambahkan barang ke gudang')
  } finally {
    processing.value = false
  }
}

const formatTanggal = (tgl) => {
  return new Date(tgl).toLocaleDateString('id-ID', { dateStyle: 'long' })
}

onMounted(loadData)
</script>
