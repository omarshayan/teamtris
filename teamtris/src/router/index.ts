import { 
  createRouter, 
  createWebHistory,
}               from 'vue-router'

import HomeView from '../views/Home.vue'
import SoloGame from '../views/SoloGame.vue'
import Settings from '../views/Settings.vue'
import Host     from '../views/Host.vue'
import Guest    from '../views/Guest.vue'
import Login    from '../views/Login.vue'
import Register    from '../views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {transition: 'slide-left'}
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {transition: 'slide-left'} 
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {transition: 'slide-left'}
    },
    {
      path: '/solo',
      name: 'solo',
      component: SoloGame,
      meta: {transition: 'slide-left'}
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {transition: 'slide-left'}
    },
    {
      path: '/host',
      name: 'host',
      component: Host,
      meta: {transition: 'slide-left'}
    },    {
      path: '/guest',
      name: 'guest',
      component: Guest,
      meta: {transition: 'slide-left'}
    },
  ]
})



export default router
