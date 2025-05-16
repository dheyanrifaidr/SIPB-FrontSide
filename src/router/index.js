import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import PengadaanBarang from '../pages/PengadaanBarang.vue'
import Login from '../pages/Login.vue'
import { useUserStore } from '../stores/userStore'

const routes = [
  { 
    path: '/', 
    redirect: '/login' // Add a default redirect to login
  },
  { 
    path: '/login', 
    component: Login,
    meta: { requiresAuth: false }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/pengadaan', 
    component: PengadaanBarang,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Add navigation guard using the existing userStore
router.beforeEach(async (to, from, next) => {
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
      next('/login')
    } else {
      next()
    }
  } else {
    // For routes that don't require authentication
    // If user is already authenticated and trying to access login page, redirect to dashboard
    if (to.path === '/login' && userStore.isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
  }
})

export default router