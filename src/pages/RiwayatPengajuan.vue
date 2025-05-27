<template>
  <DefaultLayout>
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold">Riwayat Pengajuan</h1>

      <div v-if="loading">Memuat riwayat pengajuan...</div>

      <div v-else-if="pengajuanList.length === 0" class="text-gray-500">
        Anda belum pernah mengajukan permintaan.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="pengajuan in pengajuanList"
          :key="pengajuan.id_pengajuan"
          class="border rounded-xl p-4 shadow"
        >
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-semibold">ID Pengajuan: {{ pengajuan.id_pengajuan }}</h2>
              <p class="text-sm text-gray-500">
                Tanggal: {{ pengajuan.tanggal_pengajuan }}
              </p>
              <span
                :class="statusKelas(pengajuan.status_pengajuan)"
                class="px-2 py-1 text-sm rounded-full font-medium"
              >
                {{ pengajuan.status_pengajuan }}
              </span>
            </div>
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded"
              @click="bukaDetail(pengajuan)"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Detail -->
      <div
        v-if="detailPengajuan"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <div class="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-lg">
          <h2 class="text-xl font-bold">Detail Pengajuan</h2>
          <ul class="space-y-2">
            <li v-for="item in detailPengajuan" :key="item.id_barang">
              • {{ item.nama_barang }} ({{ item.jumlah }} unit)
            </li>
          </ul>
          <div class="text-right">
            <button class="text-sm text-gray-500" @click="detailPengajuan = null">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import api from '@/lib/api'

const pengajuanList = ref([])
const detailPengajuan = ref(null)
const loading = ref(true)

onMounted(fetchPengajuan)

async function fetchPengajuan() {
  try {
    const res = await api.get('/pengajuan?user_id=me')
    pengajuanList.value = res.data.data
  } catch (e) {
    console.error('Gagal memuat riwayat pengajuan', e)
  } finally {
    loading.value = false
  }
}

async function bukaDetail(pengajuan) {
  try {
    const res = await api.get(`/pengajuan/${pengajuan.id_pengajuan}/detail`)
    detailPengajuan.value = res.data.data
  } catch (e) {
    alert('Gagal memuat detail pengajuan')
  }
}

function statusKelas(status) {
  switch (status) {
    case 'menunggu':
      return 'bg-yellow-100 text-yellow-800'
    case 'disetujui':
      return 'bg-green-100 text-green-800'
    case 'ditolak':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
