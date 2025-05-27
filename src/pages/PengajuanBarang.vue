<template>
  <DefaultLayout>
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold">Pengajuan Pengadaan Barang</h1>

      <!-- Daftar Barang -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PilihBarangCard
          v-for="barang in daftarBarang"
          :key="barang.id_barang"
          :barang="barang"
          :jumlahDipilih="barangDipilih[barang.id_barang]?.jumlah || 0"
          @update="updateBarangDipilih"
        />
      </div>

      <!-- Ringkasan dan Submit -->
      <RingkasanPengajuan
        :ringkasan="ringkasanPengajuan"
        @submit="ajukanPengadaan"
      />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import PilihBarangCard from '@/components/PilihBarangCard.vue'
import RingkasanPengajuan from '@/components/RingkasanPengajuan.vue'
import api from '@/lib/api'
import { ulid } from 'ulid'

// State
const daftarBarang = ref([])
const barangDipilih = ref({})

// Fetch barang dari backend
onMounted(async () => {
  try {
    const response = await api.get('/barang')
    daftarBarang.value = response.data.data
  } catch (err) {
    console.error('Gagal memuat data barang', err)
  }
})

// Update barang yang dipilih
function updateBarangDipilih({ id_barang, jumlah }) {
  if (jumlah > 0) {
    barangDipilih.value[id_barang] = {
      ...daftarBarang.value.find(b => b.id_barang === id_barang),
      jumlah,
    }
  } else {
    delete barangDipilih.value[id_barang]
  }
}

// Ringkasan (array dari barangDipilih)
const ringkasanPengajuan = computed(() =>
  Object.values(barangDipilih.value)
)

// Submit ke backend
async function ajukanPengadaan() {
  const id_pengajuan = ulid()
  try {
    // 1. Simpan ke tabel pengajuan
    await api.post('/pengajuan', {
      id_pengajuan,
      tanggal_pengajuan: new Date().toISOString().slice(0, 10),
      status_pengajuan: 'menunggu',
    })

    // 2. Simpan ke detail-pengajuan
    const detailPayload = ringkasanPengajuan.value.map(item => ({
      id_pengajuan,
      id_barang: item.id_barang,
      jumlah: item.jumlah,
    }))

    await api.post('/detail-pengajuan/batch', detailPayload)

    alert('Pengajuan berhasil diajukan.')
    barangDipilih.value = {} // reset form
  } catch (err) {
    console.error('Gagal mengajukan pengadaan', err)
    alert('Terjadi kesalahan saat mengirim pengajuan.')
  }
}
</script>
