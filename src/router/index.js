import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import PengadaanBarang from '../pages/PengadaanBarang.vue'
import Login from '../pages/Login.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/pengadaan', component: PengadaanBarang },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
