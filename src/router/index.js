import { createRouter, createWebHistory } from 'vue-router'
import { spotifyAuth } from '../services/spotify'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('../views/Callback.vue')
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: '/tops',
        name: 'TopCharts',
        component: () => import('../views/TopCharts.vue')
      },
      {
        path: '/year',
        name: 'YearInReview',
        component: () => import('../views/YearInReview.vue')
      },
      {
        path: '/pulse',
        name: 'ListeningPulse',
        component: () => import('../views/ListeningPulse.vue')
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('../views/Reports.vue')
      },
      {
        path: '/import',
        name: 'HistoryImport',
        component: () => import('../views/HistoryImport.vue')
      },
      {
        path: '/historical',
        name: 'HistoricalStats',
        component: () => import('../views/HistoricalStats.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !spotifyAuth.isTokenValid()) {
    next('/')
  } else if (to.path === '/' && spotifyAuth.isTokenValid()) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router


