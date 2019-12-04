import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import('@/layout/index'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/about/index')
      }
    ]
  },
]

const router = new Router({
  routes: routes
})

export default router
