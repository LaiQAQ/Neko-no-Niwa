<template>
  <div class="min-h-screen flex items-center justify-center" style="background: var(--cream);">
    <div class="login-container bg-white/70 backdrop-blur-md border border-pink-100/50 rounded-3xl p-12 max-w-md w-full shadow-lg" style="--tw-shadow-color: rgba(180,140,160,.08);">
      <div class="login-header text-center mb-8">
        <h1 class="font-mincho text-2xl text-ink tracking-widest mb-2">ねこの庭</h1>
        <p class="text-xs text-ink-faint tracking-widest">后台管理登录</p>
      </div>

      <div v-if="error" class="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-lg mb-6 text-center border border-red-200">
        用户名或密码错误
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-6">
          <label class="block text-xs text-ink-soft tracking-wider mb-2">用户名</label>
          <input v-model="username" type="text" required autofocus
            class="w-full font-kaku text-sm px-4 py-3 rounded-xl border focus:border-sakura outline-none transition-colors"
            style="background: var(--cream); border-color: var(--line);">
        </div>
        <div class="mb-6">
          <label class="block text-xs text-ink-soft tracking-wider mb-2">密码</label>
          <input v-model="password" type="password" required
            class="w-full font-kaku text-sm px-4 py-3 rounded-xl border focus:border-sakura outline-none transition-colors"
            style="background: var(--cream); border-color: var(--line);">
        </div>
        <button type="submit" class="w-full font-kaku text-sm py-3 rounded-xl cursor-pointer transition-all"
          style="background: var(--sakura); color: white;" @mouseover="$event.target.style.background='#e8b0bc'" @mouseout="$event.target.style.background='var(--sakura)'">
          登录
        </button>
      </form>

      <div class="text-center mt-6">
        <router-link to="/" class="text-xs text-ink-faint hover:text-sakura transition-colors tracking-wider">← 返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref(false)

async function handleLogin() {
  try {
    const res = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })
    if (res.data.success) {
      router.push('/admin')
    }
  } catch (err) {
    error.value = true
  }
}
</script>
