export default [
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
