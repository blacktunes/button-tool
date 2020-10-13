import { createRouter, createWebHistory } from 'vue-router'
import Index from './views/Index.vue'

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/format',
    component: () => import('./components/Json.vue')
  },
  {
    path: '/editor',
    component: () => import('./components/Editor.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
