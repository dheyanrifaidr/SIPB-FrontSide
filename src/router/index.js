import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import PengadaanBarang from '../pages/PengadaanBarang.vue'
import Login from '../pages/Login.vue'

const routes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/pengadaan', component: PengadaanBarang },
  { path: '/', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
