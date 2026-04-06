<template>
  <div class="min-h-screen py-8 px-4" style="background: var(--cream);">
    <div class="max-w-xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="font-mincho text-2xl text-ink tracking-widest mb-2">ねこの庭</h1>
        <p class="text-xs text-ink-faint tracking-widest">友链申请</p>
      </div>

      <div class="bg-white/70 backdrop-blur-md border border-pink-100/50 rounded-3xl p-8 shadow-lg" style="--tw-shadow-color: rgba(180,140,160,.08);">
        <div v-if="success" class="bg-green-50 text-green-700 text-xs px-4 py-4 rounded-lg mb-6 text-center border border-green-200">
          ✦ 申请已提交，我们会尽快审核
        </div>

        <div v-if="errors.length" class="bg-red-50 text-red-700 text-xs px-4 py-4 rounded-lg mb-6 text-center border border-red-200">
          {{ errors.join('\n') }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label class="block text-xs text-ink-soft tracking-wider mb-2">网站名称 *</label>
            <input v-model="form.name" type="text" required
              class="w-full font-kaku text-sm px-4 py-3 rounded-xl border focus:border-sakura outline-none transition-colors"
              style="background: var(--cream); border-color: var(--line);">
          </div>
          <div class="mb-6">
            <label class="block text-xs text-ink-soft tracking-wider mb-2">网站描述 *</label>
            <textarea v-model="form.desc" required rows="3"
              class="w-full font-kaku text-sm px-4 py-3 rounded-xl border focus:border-sakura outline-none transition-colors resize-none"
              style="background: var(--cream); border-color: var(--line);"></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-xs text-ink-soft tracking-wider mb-2">网站链接 *</label>
            <input v-model="form.href" type="url" required placeholder="https://"
              class="w-full font-kaku text-sm px-4 py-3 rounded-xl border focus:border-sakura outline-none transition-colors"
              style="background: var(--cream); border-color: var(--line);">
          </div>
          <div class="mb-6">
            <label class="block text-xs text-ink-soft tracking-wider mb-2">头像表情</label>
            <input v-model="form.avatar_emoji" type="text"
              class="w-full font-kaku text-sm px-4 py-3 rounded-xl border focus:border-sakura outline-none transition-colors text-center text-xl"
              style="background: var(--cream); border-color: var(--line);">
          </div>
          <div class="mb-6">
            <label class="block text-xs text-ink-soft tracking-wider mb-2">联系方式 *（邮箱或QQ）</label>
            <input v-model="form.contact" type="text" required
              class="w-full font-kaku text-sm px-4 py-3 rounded-xl border focus:border-sakura outline-none transition-colors"
              style="background: var(--cream); border-color: var(--line);">
          </div>
          <button type="submit" class="w-full font-kaku text-sm py-3 rounded-xl cursor-pointer transition-all"
            style="background: var(--sakura); color: white;" @mouseover="$event.target.style.background='#e8b0bc'" @mouseout="$event.target.style.background='var(--sakura)'">
            提交申请
          </button>
        </form>
      </div>

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
const form = ref({
  name: '',
  desc: '',
  href: '',
  avatar_emoji: '🐾',
  avatar_color: '#faeef1',
  contact: ''
})
const success = ref(false)
const errors = ref([])

async function handleSubmit() {
  errors.value = []
  
  if (!form.value.name) errors.value.push('请填写网站名称')
  if (!form.value.desc) errors.value.push('请填写网站描述')
  if (!form.value.href) errors.value.push('请填写网站链接')
  if (!form.value.contact) errors.value.push('请填写联系方式')
  
  if (errors.value.length) return
  
  try {
    await axios.post('/api/friend-apply', form.value)
    success.value = true
    setTimeout(() => router.push('/'), 2000)
  } catch (err) {
    errors.value.push('提交失败，请稍后重试')
  }
}
</script>
