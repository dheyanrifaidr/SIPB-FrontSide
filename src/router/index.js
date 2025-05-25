import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useLoadingStore } from '../stores/loadingStore'

const Dashboard = () => import('../pages/Dashboard.vue')
const DaftarBarang = () => import('../pages/DaftarBarang.vue')
const Login = () => import('../pages/Login.vue')

const routes = [
  // { 
  //   path: '/', 
  //   redirect: '/' // Add a default redirect to login
  // },
  { 
    path: '/', 
    component: Login,
    meta: { requiresAuth: false }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/daftar-barang', 
    component: DaftarBarang,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Add navigation guard using the existing userStore
router.beforeEach(async (to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.isLoading = true // Set loading state to true
  const userStore = useUserStore()

  // Load user data from storage if not already loaded
  if (!userStore.user) {
    userStore.loadUserFromStorage()
  }

  // For routes that require authentication
  if (to.meta.requiresAuth) {
    // Wait for the validation to complete
    await userStore.validateSession()
    
    if (!userStore.isAuthenticated) {
      loadingStore.isLoading = false // Set loading state to false 
      next('/')
      return
    } else {
      next()
      return
    }
  } else if (to.path === '/' && userStore.isAuthenticated) {
    loadingStore.isLoading = false // Set loading state to false
      next('/dashboard')
      return
    }
    loadingStore.isLoading = false // Set loading state to false
    next()
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()
  loadingStore.isLoading = false // Set loading state to false
})
export default router