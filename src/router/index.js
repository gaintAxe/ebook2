import Vue from 'vue'
import VueRouter from 'vue-router'
import Ebook from '../views/ebook/ebook.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/ebook'
  },
  {
    path: '/ebook',
    name: 'Ebook',
    component: ()=>import('../views/ebook/ebook.vue'),
    children:[
      {
        path:':dir/:filename',
        component:()=>import('../components/ebook/ebookReader.vue')
      },{
        path:':filename',
        component:()=>import('../components/ebook/ebookReader.vue')
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
