import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import FriendApply from '../views/FriendApply.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/admin', component: Admin },
  { path: '/friend-apply', component: FriendApply }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
