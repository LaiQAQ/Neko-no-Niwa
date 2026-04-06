<template>
  <div class="min-h-screen flex" style="background: #f5f3f0;" v-if="isLoggedIn">
    <!-- SIDEBAR -->
    <aside class="sidebar w-56 min-h-screen bg-white border-r flex flex-col fixed top-0 left-0 bottom-0 z-50 overflow-y-auto" style="border-color: var(--line);">
      <div class="p-6 pb-4 border-b" style="border-color: var(--line);">
        <div class="font-mincho text-sm text-ink tracking-widest">ねこの庭</div>
        <div class="text-xs text-ink-faint tracking-wider mt-1">neko no niwa</div>
        <span class="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-sakura-l border border-sakura" style="color: var(--ink-soft);">✦ 后台管理</span>
      </div>

      <nav class="flex-1 py-4">
        <div class="text-xs text-ink-faint tracking-widest uppercase px-4 py-3 pt-4">内容管理</div>
        <div v-for="item in navItems" :key="item.panel" 
          class="nav-item px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2.5 transition-all"
          :class="{ 'bg-sakura-l text-ink border-l-2': activePanel === item.panel, 'text-ink-soft hover:bg-sakura-l hover:text-ink': activePanel !== item.panel }"
          style="border-color: var(--sakura);"
          @click="activePanel = item.panel">
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </div>

        <div class="text-xs text-ink-faint tracking-widest uppercase px-4 py-3 pt-4">系统</div>
        <div class="nav-item px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2.5 transition-all"
          :class="{ 'bg-sakura-l text-ink border-l-2': activePanel === 'account', 'text-ink-soft hover:bg-sakura-l hover:text-ink': activePanel !== 'account' }"
          style="border-color: var(--sakura);"
          @click="activePanel = 'account'">
          <span>👤</span> 账号设置
        </div>
        <div class="nav-item px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2.5 transition-all"
          :class="{ 'bg-sakura-l text-ink border-l-2': activePanel === 'reset', 'text-ink-soft hover:bg-sakura-l hover:text-ink': activePanel !== 'reset' }"
          style="border-color: var(--sakura);"
          @click="activePanel = 'reset'">
          <span>↺</span> 重置与备份
        </div>
      </nav>

      <div class="p-4 border-t" style="border-color: var(--line);">
        <a href="/" target="_blank" class="flex items-center justify-center text-xs text-emerald-700 hover:text-emerald-800 transition-colors py-2 tracking-wide bg-emerald-50 rounded-md hover:bg-emerald-100 border border-emerald-200">
          查看前台
        </a>
        <button @click="handleLogout" class="mt-2 w-full bg-red-400 text-white text-xs py-2 rounded-md hover:bg-red-500 transition-colors tracking-wide">
          退出登录
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="main-content flex-1 ml-56">
      <div class="topbar bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-40" style="border-color: var(--line);">
        <div class="font-mincho text-sm tracking-widest text-ink">{{ panelTitles[activePanel] }}</div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-ink-faint tracking-wide">所有修改自动保存至服务器</span>
          <a href="/" target="_blank" class="btn btn-sm bg-white text-ink-soft border px-3 py-1.5 rounded-md text-xs hover:bg-sakura-l transition-colors">↗ 预览前台</a>
        </div>
      </div>

      <!-- TOAST -->
      <div class="toast fixed bottom-8 right-8 text-white text-xs px-4 py-2.5 rounded-lg tracking-wide transition-all z-50"
        :class="{ 'show opacity-100': toast.show, 'opacity-0': !toast.show, 'bg-green-600': toast.type === 'success', 'bg-red-500': toast.type === 'error', 'bg-ink': toast.type === 'default' }"
        style="transform: translateY(8px);">
        {{ toast.message }}
      </div>

      <!-- PANEL: BASIC -->
      <div v-if="activePanel === 'basic'" class="p-8">
        <div class="preview-bar text-xs text-ink-faint bg-sakura-l border border-sakura rounded-lg px-4 py-2 mb-6 flex items-center gap-2 tracking-wide">
          <span class="w-2 h-2 rounded-full bg-sakura"></span>
          修改后点击「保存」，刷新前台页面即可看到更新效果
        </div>

        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">网站信息</div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="form-label">网站名称</label>
              <input v-model="data.basic.siteName" class="form-input" placeholder="ねこの庭">
            </div>
            <div>
              <label class="form-label">副标题</label>
              <input v-model="data.basic.siteNameSub" class="form-input" placeholder="neko no niwa">
            </div>
          </div>
        </div>

        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">SEO 设置</div>
          <div class="mb-4">
            <label class="form-label">SEO 标题（显示在浏览器标签页）</label>
            <input v-model="data.basic.seoTitle" class="form-input" placeholder="ねこの庭">
          </div>
          <div class="mb-4">
            <label class="form-label">SEO 副标题（显示在标题后，用 | 分隔）</label>
            <input v-model="data.basic.seoSubtitle" class="form-input" placeholder="插画师博客">
          </div>
          <div class="mb-4">
            <label class="form-label">SEO 关键词（用英文逗号分隔）</label>
            <input v-model="data.basic.seoKeywords" class="form-input" placeholder="插画,日系,猫猫,治愈">
          </div>
          <div>
            <label class="form-label">SEO 描述（搜索引擎显示的简介）</label>
            <textarea v-model="data.basic.seoDescription" class="form-textarea" placeholder="喜欢画画、喝茶和发呆的世界，记录日常的插画师博客"></textarea>
          </div>
        </div>

        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">主人信息</div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="form-label">名字</label>
              <input v-model="data.basic.ownerName" class="form-input" placeholder="みずき · Mizuki">
            </div>
            <div>
              <label class="form-label">副标题</label>
              <input v-model="data.basic.ownerSubtitle" class="form-input" placeholder="illustrator · dreamer · cat person">
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label">个人介绍（换行用 \n 表示）</label>
            <textarea v-model="data.basic.bio" class="form-textarea" placeholder="喜欢画画、喝茶和发呆。\n世界很大，我只想做一个安静的人。"></textarea>
          </div>
          <div>
            <label class="form-label">介绍副注</label>
            <input v-model="data.basic.bioSub" class="form-input" placeholder="— 在某个不知名的角落创作着 —">
          </div>
        </div>

        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">状态栏文字</div>
          <div>
            <label class="form-label">当前状态（显示在首页绿点旁边）</label>
            <input v-model="data.basic.statusText" class="form-input" placeholder="目前在画春天的猫咪系列 · currently drawing spring cats">
          </div>
        </div>

        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">引言卡片</div>
          <div class="mb-4">
            <label class="form-label">引言内容（换行用 \n）</label>
            <textarea v-model="data.basic.quoteText" class="form-textarea"></textarea>
          </div>
          <div>
            <label class="form-label">引言署名</label>
            <input v-model="data.basic.quoteAttr" class="form-input" placeholder="— みずき の手记">
          </div>
        </div>

        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">页脚</div>
          <div class="mb-4">
            <label class="form-label">社交信息文字</label>
            <input v-model="data.basic.footerSocial" class="form-input" placeholder="ins: @mizuki_neko · pixiv: mizukineko · mail: ...">
          </div>
          <div>
            <label class="form-label">版权署名</label>
            <input v-model="data.basic.footerMadeBy" class="form-input" placeholder="made with ♡ by みずき">
          </div>
        </div>

        <button @click="saveBasic" class="btn btn-primary">💾 保存基础信息</button>
      </div>

      <!-- PANEL: TAGS -->
      <div v-if="activePanel === 'tags'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">标签列表</div>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="(tag, i) in data.tags" :key="i" class="inline-flex items-center gap-1 px-3 py-1 rounded-full border bg-sakura-l text-xs" style="border-color: var(--sakura); color: var(--ink-soft);">
              <span class="w-2 h-2 rounded-full flex-shrink-0" :class="{ 'bg-sakura': tag.color === 'pink', 'bg-sky': tag.color === 'blue', 'bg-sage': tag.color === 'sage', 'bg-amber-400': tag.color === 'orange', 'bg-purple-400': tag.color === 'purple', 'bg-rose-400': tag.color === 'rose', 'bg-teal-400': tag.color === 'teal', 'bg-indigo-400': tag.color === 'indigo' }"></span>
              {{ tag.text }}
              <span @click="removeTag(i)" class="cursor-pointer text-ink-faint hover:text-red-500 ml-1">×</span>
            </span>
          </div>
          <div class="flex gap-2 items-center">
            <input v-model="newTag.text" class="form-input flex-1 max-w-xs" placeholder="新标签文字..." style="width: 180px;">
            <select v-model="newTag.color" class="form-select w-32">
              <option value="pink">粉色</option>
              <option value="blue">蓝色</option>
              <option value="sage">绿色</option>
              <option value="orange">橙色</option>
              <option value="purple">紫色</option>
              <option value="rose">玫红</option>
              <option value="teal">青色</option>
              <option value="indigo">靛蓝</option>
            </select>
            <button @click="addTag" class="btn btn-secondary btn-sm">+ 添加</button>
          </div>
        </div>
        <button @click="saveTags" class="btn btn-primary">💾 保存标签</button>
      </div>

      <!-- PANEL: SOCIALS -->
      <div v-if="activePanel === 'socials'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">社交链接</div>
          <div v-for="(social, i) in data.socials" :key="i" class="grid grid-cols-4 gap-2 mb-2 items-end">
            <div>
              <label class="form-label">名称</label>
              <input v-model="social.label" class="form-input">
            </div>
            <div>
              <label class="form-label">图标</label>
              <select v-model="social.icon" class="form-select">
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="discord">Discord</option>
                <option value="telegram">Telegram</option>
                <option value="reddit">Reddit</option>
                <option value="pinterest">Pinterest</option>
                <option value="behance">Behance</option>
                <option value="dribbble">Dribbble</option>
                <option value="artstation">ArtStation</option>
                <option value="deviantart">DeviantArt</option>
                <option value="pixiv">Pixiv</option>
                <option value="github">GitHub</option>
                <option value="bilibili">Bilibili</option>
                <option value="acfun">AcFun</option>
                <option value="weibo">微博</option>
                <option value="wechat">微信</option>
                <option value="xiaohongshu">小红书</option>
                <option value="zhihu">知乎</option>
                <option value="douyin">抖音</option>
                <option value="netease">网易云</option>
                <option value="qq">QQ</option>
                <option value="email">Email</option>
                <option value="rss">RSS</option>
                <option value="link">链接</option>
              </select>
            </div>
            <div>
              <label class="form-label">链接</label>
              <input v-model="social.href" class="form-input">
            </div>
            <button @click="removeSocial(i)" class="btn btn-danger btn-sm mb-0">删除</button>
          </div>
          <button @click="addSocial" class="add-item-btn mt-2">+ 添加社交链接</button>
        </div>
        <button @click="saveSocials" class="btn btn-primary">💾 保存链接</button>
      </div>

      <!-- PANEL: FRIENDS -->
      <div v-if="activePanel === 'friends'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">板块设置</div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-ink-soft">友链板块在前台显示:</span>
            <button @click="toggleSection('friends')" class="btn btn-sm" :class="data.sectionVisibility?.friends !== false ? 'bg-sakura-l' : ''">
              {{ data.sectionVisibility?.friends !== false ? '👁 显示中' : '🙈 已隐藏' }}
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-ink-faint">共 {{ data.friends?.length || 0 }} 条友链</span>
          <button @click="openFriendModal()" class="btn btn-primary btn-sm">+ 添加友链</button>
        </div>
        <div class="card-list">
          <div v-for="(friend, i) in data.friends" :key="friend.id" class="card-list-item bg-white border rounded-xl p-4 flex gap-4 items-start" style="border-color: var(--line);">
            <div class="text-2xl w-9 text-center">{{ friend.avatarEmoji }}</div>
            <div class="flex-1">
              <div class="text-sm text-ink">{{ friend.name }}</div>
              <div class="text-xs text-ink-faint">{{ friend.desc }} · <a :href="friend.href" target="_blank" class="text-sakura">{{ friend.href }}</a></div>
            </div>
            <div class="flex gap-1.5 flex-shrink-0">
              <button @click="toggleFriendVisible(i)" class="btn btn-secondary btn-sm">{{ friend.visible !== false ? '👁' : '🙈' }}</button>
              <button @click="openFriendModal(i)" class="btn btn-secondary btn-sm">编辑</button>
              <button @click="deleteFriend(i)" class="btn btn-danger btn-sm">删除</button>
            </div>
          </div>
          <p v-if="!data.friends?.length" class="text-sm text-ink-faint py-4">暂无友链，点击上方按钮添加</p>
        </div>
      </div>

      <!-- PANEL: FRIEND APPLICATIONS -->
      <div v-if="activePanel === 'friend-applications'" class="p-8">
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-ink-faint">待审核: {{ pendingApplications.length }}</span>
        </div>
        <div class="card-list">
          <div v-for="(app, i) in data.friend_applications" :key="app.id" class="card-list-item bg-white border rounded-xl p-4 flex gap-4 items-start" style="border-color: var(--line);">
            <div class="text-2xl w-9 text-center">{{ app.avatarEmoji }}</div>
            <div class="flex-1">
              <div class="text-sm text-ink">
                {{ app.name }}
                <span class="text-xs px-1.5 py-0.5 rounded" :class="{ 'bg-yellow-100 text-yellow-700': app.status === 'pending', 'bg-green-100 text-green-700': app.status === 'approved', 'bg-red-100 text-red-700': app.status === 'rejected' }">
                  {{ app.status === 'pending' ? '待审核' : app.status === 'approved' ? '已通过' : '已拒绝' }}
                </span>
              </div>
              <div class="text-xs text-ink-faint">{{ app.desc }} · <a :href="app.href" target="_blank" class="text-sakura">{{ app.href }}</a></div>
              <div class="text-xs text-ink-faint mt-0.5">联系方式: {{ app.contact }}</div>
              <div class="text-xs text-ink-faint">申请时间: {{ app.created_at }}</div>
            </div>
            <div class="flex gap-1.5 flex-shrink-0">
              <template v-if="app.status === 'pending'">
                <button @click="approveApplication(i)" class="btn btn-secondary btn-sm">通过</button>
                <button @click="rejectApplication(i)" class="btn btn-danger btn-sm">拒绝</button>
              </template>
              <button @click="deleteApplication(i)" class="btn btn-danger btn-sm">删除</button>
            </div>
          </div>
          <p v-if="!data.friend_applications?.length" class="text-sm text-ink-faint py-4">暂无申请</p>
        </div>
      </div>

      <!-- PANEL: DIARY -->
      <div v-if="activePanel === 'diary'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">板块设置</div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-ink-soft">碎片日记板块在前台显示:</span>
            <button @click="toggleSection('diary')" class="btn btn-sm" :class="data.sectionVisibility?.diary !== false ? 'bg-sakura-l' : ''">
              {{ data.sectionVisibility?.diary !== false ? '👁 显示中' : '🙈 已隐藏' }}
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-ink-faint">共 {{ data.diary?.length || 0 }} 篇日记</span>
          <button @click="openDiaryModal()" class="btn btn-primary btn-sm">+ 写日记</button>
        </div>
        <div class="card-list">
          <div v-for="(entry, i) in data.diary" :key="entry.id" class="card-list-item bg-white border rounded-xl p-4 flex gap-4 items-start" style="border-color: var(--line);">
            <div class="text-center flex-shrink-0 w-12">
              <div class="text-xs text-sakura font-mincho">{{ entry.month }}</div>
              <div class="text-xs text-ink-faint">{{ entry.day }}</div>
            </div>
            <div class="flex-1">
              <div class="text-sm text-ink">{{ entry.title }}</div>
              <div class="text-xs text-ink-faint">{{ entry.excerpt?.slice(0, 60) }}... <span class="text-sakura">#{{ entry.tag }}</span></div>
            </div>
            <div class="flex gap-1.5 flex-shrink-0">
              <button @click="toggleDiaryVisible(i)" class="btn btn-secondary btn-sm">{{ entry.visible !== false ? '👁' : '🙈' }}</button>
              <button @click="openDiaryModal(i)" class="btn btn-secondary btn-sm">编辑</button>
              <button @click="deleteDiary(i)" class="btn btn-danger btn-sm">删除</button>
            </div>
          </div>
          <p v-if="!data.diary?.length" class="text-sm text-ink-faint py-4">暂无日记</p>
        </div>
      </div>

      <!-- PANEL: PLAYLIST -->
      <div v-if="activePanel === 'playlist'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">板块设置</div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-ink-soft">近期在听板块在前台显示:</span>
            <button @click="toggleSection('playlist')" class="btn btn-sm" :class="data.sectionVisibility?.playlist !== false ? 'bg-sakura-l' : ''">
              {{ data.sectionVisibility?.playlist !== false ? '👁 显示中' : '🙈 已隐藏' }}
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-ink-faint">共 {{ data.playlist?.length || 0 }} 首歌</span>
          <button @click="openPlaylistModal()" class="btn btn-primary btn-sm">+ 添加歌曲</button>
        </div>
        <div class="card-list">
          <div v-for="(song, i) in data.playlist" :key="song.id" class="card-list-item bg-white border rounded-xl p-4 flex gap-4 items-start" style="border-color: var(--line);">
            <div class="w-8 h-8 rounded flex items-center justify-center text-lg flex-shrink-0" :style="{ background: song.bg }">{{ song.emoji }}</div>
            <div class="flex-1">
              <div class="text-sm text-ink">{{ song.song }}</div>
              <div class="text-xs text-ink-faint">{{ song.artist }} · <span class="text-sakura">{{ song.mood }}</span></div>
            </div>
            <div class="flex gap-1.5 flex-shrink-0">
              <button @click="togglePlaylistVisible(i)" class="btn btn-secondary btn-sm">{{ song.visible !== false ? '👁' : '🙈' }}</button>
              <button @click="openPlaylistModal(i)" class="btn btn-secondary btn-sm">编辑</button>
              <button @click="deletePlaylist(i)" class="btn btn-danger btn-sm">删除</button>
            </div>
          </div>
          <p v-if="!data.playlist?.length" class="text-sm text-ink-faint py-4">暂无歌曲</p>
        </div>
      </div>

      <!-- PANEL: ABOUT -->
      <div v-if="activePanel === 'about'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--line);">
          <div class="form-section-title">板块设置</div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-ink-soft">更多关于我板块在前台显示:</span>
            <button @click="toggleSection('about')" class="btn btn-sm" :class="data.sectionVisibility?.about !== false ? 'bg-sakura-l' : ''">
              {{ data.sectionVisibility?.about !== false ? '👁 显示中' : '🙈 已隐藏' }}
            </button>
          </div>
        </div>
        <div v-for="(box, bi) in data.aboutBoxes" :key="bi" class="form-section bg-white border rounded-xl p-6 mb-4" style="border-color: var(--line);">
          <div class="form-section-title flex items-center gap-2">
            板块 {{ bi + 1 }}
            <button @click="deleteAboutBox(bi)" class="btn btn-danger btn-sm ml-auto">删除板块</button>
          </div>
          <div class="mb-4">
            <label class="form-label">板块标题</label>
            <input v-model="box.title" class="form-input">
          </div>
          <div class="form-label mb-2">列表项目</div>
          <div class="list-editor mb-2">
            <div v-for="(item, ii) in box.items" :key="ii" class="list-item-row flex gap-2 mb-2">
              <input v-model="box.items[ii]" class="form-input flex-1">
              <button @click="removeAboutItem(bi, ii)" class="btn btn-danger btn-sm">×</button>
            </div>
          </div>
          <button @click="addAboutItem(bi)" class="add-item-btn">+ 添加项目</button>
        </div>
        <button @click="addAboutBox" class="btn btn-secondary mb-6">+ 添加板块</button>
        <br>
        <button @click="saveAbout" class="btn btn-primary">💾 保存「关于我」</button>
      </div>

      <!-- PANEL: ACCOUNT -->
      <div v-if="activePanel === 'account'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--sakura);">
          <div class="form-section-title">修改登录信息</div>
          <p class="text-sm text-ink-soft leading-relaxed mb-4">
            修改后台登录的用户名和密码，建议定期更换以保证安全。
          </p>
          <div class="mb-4">
            <label class="form-label">新用户名</label>
            <input v-model="newUsername" class="form-input" placeholder="输入新用户名（留空则不修改）">
          </div>
          <div class="mb-4">
            <label class="form-label">当前密码</label>
            <input v-model="currentPassword" type="password" class="form-input" placeholder="输入当前密码">
          </div>
          <div class="mb-4">
            <label class="form-label">新密码</label>
            <input v-model="newPassword" type="password" class="form-input" placeholder="输入新密码（至少4位）">
          </div>
          <div class="mb-4">
            <label class="form-label">确认密码</label>
            <input v-model="confirmPassword" type="password" class="form-input" placeholder="再次输入新密码">
          </div>
          <button @click="changePassword" class="btn btn-primary">🔒 修改登录信息</button>
        </div>
      </div>

      <!-- PANEL: RESET -->
      <div v-if="activePanel === 'reset'" class="p-8">
        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--sakura);">
          <div class="form-section-title">数据备份</div>
          <p class="text-sm text-ink-soft leading-relaxed mb-4">
            备份当前的配置数据为 JSON 文件，建议在重要操作前进行备份。
          </p>
          <button @click="backupData" class="btn btn-primary">⬇ 备份数据</button>
          <div id="backup-status" class="mt-2 text-xs text-ink-soft"></div>
        </div>

        <div class="form-section bg-white border rounded-xl p-6 mb-6" style="border-color: var(--sakura);">
          <div class="form-section-title">恢复备份</div>
          <p class="text-sm text-ink-soft leading-relaxed mb-4">
            选择一个备份文件恢复，恢复后当前配置将被覆盖。
          </p>
          <div id="backup-list" class="mb-4">
            <div v-for="backup in backups" :key="backup.filename" class="backup-item flex items-center justify-between p-3 mb-2 rounded-lg bg-white/70 border" style="border-color: var(--line);">
              <div>
                <div class="text-sm text-ink">{{ backup.date }}</div>
                <div class="text-xs text-ink-faint mt-0.5">{{ backup.time }}</div>
              </div>
              <div class="flex gap-2">
                <button @click="restoreBackup(backup.filename)" class="btn text-xs py-1 px-2" style="background: var(--sky-l); border: 1px solid var(--sky); color: var(--ink-soft);">恢复</button>
                <button @click="deleteBackup(backup.filename)" class="btn text-xs py-1 px-2" style="background: #fef0f0; border: 1px solid var(--danger); color: var(--danger);">删除</button>
              </div>
            </div>
            <p v-if="!backups.length" class="text-sm text-ink-faint text-center py-4">暂无备份文件</p>
          </div>
          <button @click="loadBackups" class="btn btn-primary">↻ 刷新备份列表</button>
        </div>

        <div class="form-section bg-white border rounded-xl p-6" style="border-color: var(--danger);">
          <div class="form-section-title" style="color: var(--danger);">危险操作</div>
          <p class="text-sm text-ink-soft leading-relaxed mb-4">
            重置会清除所有通过后台修改的内容，恢复到内置的默认数据。<br>
            此操作不可恢复，请谨慎操作。
          </p>
          <button @click="confirmReset" class="btn btn-danger">↺ 重置为默认数据</button>
        </div>
      </div>
    </div>

    <!-- MODAL: FRIEND -->
    <div v-if="modals.friend" class="modal-overlay fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center" @click.self="closeModal('friend')">
      <div class="modal bg-white rounded-2xl p-8 w-full max-w-lg max-h-screen overflow-y-auto relative">
        <div @click="closeModal('friend')" class="modal-close absolute top-4 right-4 text-xl text-ink-faint cursor-pointer hover:text-sakura">×</div>
        <div class="font-mincho text-sm text-ink tracking-widest mb-6 pb-4 border-b" style="border-color: var(--line);">{{ friendEditIndex !== null ? '编辑友链' : '添加友链' }}</div>
        <input type="hidden" v-model="friendEditIndex">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="form-label">站点名称</label>
            <input v-model="friendForm.name" class="form-input" placeholder="星と猫の庭">
          </div>
          <div>
            <label class="form-label">Emoji 头像</label>
            <input v-model="friendForm.avatarEmoji" class="form-input" style="max-width: 80px;">
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label">简介</label>
          <input v-model="friendForm.desc" class="form-input" placeholder="水彩插画 · 治愈系日常 · 爱猫人">
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="form-label">链接 URL</label>
            <input v-model="friendForm.href" class="form-input" placeholder="https://...">
          </div>
          <div>
            <label class="form-label">头像背景色</label>
            <input v-model="friendForm.avatarColor" type="color" class="form-input" style="height: 38px; padding: 2px 4px;">
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-4 border-t" style="border-color: var(--line);">
          <button @click="closeModal('friend')" class="btn btn-secondary">取消</button>
          <button @click="saveFriend" class="btn btn-primary">保存友链</button>
        </div>
      </div>
    </div>

    <!-- MODAL: DIARY -->
    <div v-if="modals.diary" class="modal-overlay fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center" @click.self="closeModal('diary')">
      <div class="modal bg-white rounded-2xl p-8 w-full max-w-lg max-h-screen overflow-y-auto relative">
        <div @click="closeModal('diary')" class="modal-close absolute top-4 right-4 text-xl text-ink-faint cursor-pointer hover:text-sakura">×</div>
        <div class="font-mincho text-sm text-ink tracking-widest mb-6 pb-4 border-b" style="border-color: var(--line);">{{ diaryEditIndex !== null ? '编辑日记' : '写日记' }}</div>
        <input type="hidden" v-model="diaryEditIndex">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="form-label">月份（如 04月）</label>
            <input v-model="diaryForm.month" class="form-input" placeholder="04月">
          </div>
          <div>
            <label class="form-label">日（如 03日）</label>
            <input v-model="diaryForm.day" class="form-input" placeholder="03日">
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label">标题</label>
          <input v-model="diaryForm.title" class="form-input" placeholder="春天来了，小云也变懒了">
        </div>
        <div class="mb-4">
          <label class="form-label">正文</label>
          <textarea v-model="diaryForm.excerpt" class="form-textarea" style="min-height: 120px;"></textarea>
        </div>
        <div class="mb-4">
          <label class="form-label">标签</label>
          <input v-model="diaryForm.tag" class="form-input" placeholder="猫猫日记">
        </div>
        <div class="flex justify-end gap-2 pt-4 border-t" style="border-color: var(--line);">
          <button @click="closeModal('diary')" class="btn btn-secondary">取消</button>
          <button @click="saveDiary" class="btn btn-primary">保存日记</button>
        </div>
      </div>
    </div>

    <!-- MODAL: PLAYLIST -->
    <div v-if="modals.playlist" class="modal-overlay fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center" @click.self="closeModal('playlist')">
      <div class="modal bg-white rounded-2xl p-8 w-full max-w-lg max-h-screen overflow-y-auto relative">
        <div @click="closeModal('playlist')" class="modal-close absolute top-4 right-4 text-xl text-ink-faint cursor-pointer hover:text-sakura">×</div>
        <div class="font-mincho text-sm text-ink tracking-widest mb-6 pb-4 border-b" style="border-color: var(--line);">{{ playlistEditIndex !== null ? '编辑歌曲' : '添加歌曲' }}</div>
        <input type="hidden" v-model="playlistEditIndex">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="form-label">歌曲名</label>
            <input v-model="playlistForm.song" class="form-input" placeholder="春はゆく">
          </div>
          <div>
            <label class="form-label">艺术家</label>
            <input v-model="playlistForm.artist" class="form-input" placeholder="Aimer">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="form-label">封面 Emoji</label>
            <input v-model="playlistForm.emoji" class="form-input" placeholder="🌸">
          </div>
          <div>
            <label class="form-label">封面背景色</label>
            <input v-model="playlistForm.bg" type="color" class="form-input" style="height: 38px; padding: 2px 4px;">
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label">氛围标签</label>
          <input v-model="playlistForm.mood" class="form-input" placeholder="治愈">
        </div>
        <div class="flex justify-end gap-2 pt-4 border-t" style="border-color: var(--line);">
          <button @click="closeModal('playlist')" class="btn btn-secondary">取消</button>
          <button @click="savePlaylist" class="btn btn-primary">保存歌曲</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Not logged in -->
  <div v-else class="min-h-screen flex items-center justify-center" style="background: var(--cream);">
    <p class="text-sm text-ink-soft">正在验证登录状态...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoggedIn = ref(false)
const activePanel = ref('basic')
const toast = ref({ show: false, message: '', type: 'default' })
const backups = ref([])

const panelTitles = {
  basic: '基础信息', tags: '标签管理', socials: '社交链接',
  friends: '友链管理', 'friend-applications': '友链申请',
  diary: '日记管理', playlist: '歌单管理',
  about: '关于我板块', account: '账号设置', reset: '重置与备份'
}

const navItems = [
  { panel: 'basic', icon: '🏠', label: '基础信息' },
  { panel: 'tags', icon: '🏷', label: '标签管理' },
  { panel: 'socials', icon: '🔗', label: '社交链接' },
  { panel: 'friends', icon: '🐾', label: '友链管理' },
  { panel: 'friend-applications', icon: '📨', label: '友链申请' },
  { panel: 'diary', icon: '📔', label: '日记管理' },
  { panel: 'playlist', icon: '🎵', label: '歌单管理' },
  { panel: 'about', icon: '✨', label: '关于我板块' }
]

const data = ref({
  basic: {
    siteName: 'ねこの庭', siteNameSub: 'neko no niwa', ownerName: 'みずき · Mizuki',
    ownerSubtitle: 'illustrator · dreamer · cat person',
    bio: '喜欢画画、喝茶和发呆。\n世界很大，我只想做一个安静的人。',
    bioSub: '— 在某个不知名的角落创作着 —',
    statusText: '目前在画春天的猫咪系列 · currently drawing spring cats',
    quoteText: '生活不必轰轰烈烈，\n有一杯热茶、一只猫、一个安静的下午，\n就已经足够好了。',
    quoteAttr: '— みずき の手记',
    footerSocial: 'ins: @mizuki_neko · pixiv: mizukineko · mail: hello@mizukineko.com',
    footerMadeBy: 'made with ♡ by みずき'
  },
  tags: [], socials: [], aboutBoxes: [], diary: [], playlist: [], friends: [],
  friend_applications: [], sectionVisibility: { about: true, diary: true, playlist: true, friends: true }
})

const newTag = ref({ text: '', color: 'pink' })
const modals = ref({ friend: false, diary: false, playlist: false })
const friendEditIndex = ref(null)
const diaryEditIndex = ref(null)
const playlistEditIndex = ref(null)
const friendForm = ref({ name: '', desc: '', href: '', avatarEmoji: '🐾', avatarColor: '#faeef1' })
const diaryForm = ref({ month: '', day: '', title: '', excerpt: '', tag: '' })
const playlistForm = ref({ song: '', artist: '', emoji: '🎵', bg: '#faeef1', mood: '' })

// Account
const newUsername = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const pendingApplications = computed(() => {
  return data.value.friend_applications?.filter(a => a.status === 'pending') || []
})

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 2800)
}

async function loadData() {
  try {
    const res = await axios.get('/api/data')
    data.value = res.data
  } catch (err) {
    console.error('Failed to load data:', err)
  }
}

async function persist() {
  try {
    await axios.post('/api/data', data.value)
  } catch (err) {
    showToast('保存失败', 'error')
  }
}

onMounted(async () => {
  try {
    const checkRes = await axios.get('/api/auth/check')
    if (checkRes.data.loggedIn) {
      isLoggedIn.value = true
      await loadData()
      loadBackups()
    } else {
      router.push('/login')
    }
  } catch (err) {
    router.push('/login')
  }
})

async function handleLogout() {
  try {
    await axios.post('/api/auth/logout')
    router.push('/login')
  } catch (err) {
    router.push('/login')
  }
}

// BASIC
function saveBasic() {
  persist()
  showToast('✦ 基础信息已保存')
}

// TAGS
function addTag() {
  if (!newTag.value.text) return
  data.value.tags.push({ text: newTag.value.text, color: newTag.value.color })
  newTag.value.text = ''
  newTag.value.color = 'pink'
}
function removeTag(i) { data.value.tags.splice(i, 1) }
function saveTags() {
  persist()
  loadData() // 重新加载确保显示最新数据
  showToast('✦ 标签已保存')
}

// SOCIALS
function addSocial() {
  data.value.socials.push({ label: '新链接', href: '#', icon: 'mail' })
}
function removeSocial(i) { data.value.socials.splice(i, 1) }
function saveSocials() {
  persist()
  showToast('✦ 社交链接已保存')
}

// FRIENDS
function openFriendModal(i) {
  if (i !== undefined) {
    const f = data.value.friends[i]
    friendForm.value = { ...f }
    friendEditIndex.value = i
  } else {
    friendForm.value = { name: '', desc: '', href: '', avatarEmoji: '🐾', avatarColor: '#faeef1' }
    friendEditIndex.value = null
  }
  modals.value.friend = true
}
function saveFriend() {
  if (friendEditIndex.value !== null) {
    data.value.friends[friendEditIndex.value] = { ...friendForm.value }
  } else {
    friendForm.value.id = Date.now()
    data.value.friends.push({ ...friendForm.value })
  }
  persist()
  closeModal('friend')
  showToast('✦ 友链已保存')
}
function deleteFriend(i) {
  if (!confirm('确认删除这条友链？')) return
  data.value.friends.splice(i, 1)
  persist()
  showToast('友链已删除', 'error')
}
function toggleFriendVisible(i) {
  data.value.friends[i].visible = data.value.friends[i].visible === false ? true : false
  persist()
}

// FRIEND APPLICATIONS
function approveApplication(i) {
  const app = data.value.friend_applications[i]
  app.status = 'approved'
  data.value.friends.push({
    id: app.id, name: app.name, desc: app.desc, href: app.href,
    avatarColor: app.avatarColor, avatarEmoji: app.avatarEmoji, visible: true
  })
  persist()
  showToast('✦ 申请已通过')
}
function rejectApplication(i) {
  if (!confirm('确认拒绝此申请？')) return
  data.value.friend_applications[i].status = 'rejected'
  persist()
  showToast('申请已拒绝', 'error')
}
function deleteApplication(i) {
  if (!confirm('确认删除此申请记录？')) return
  data.value.friend_applications.splice(i, 1)
  persist()
  showToast('申请记录已删除', 'error')
}

// DIARY
function openDiaryModal(i) {
  if (i !== undefined) {
    const e = data.value.diary[i]
    diaryForm.value = { ...e }
    diaryEditIndex.value = i
  } else {
    diaryForm.value = { month: '', day: '', title: '', excerpt: '', tag: '' }
    diaryEditIndex.value = null
  }
  modals.value.diary = true
}
function saveDiary() {
  if (diaryEditIndex.value !== null) {
    data.value.diary[diaryEditIndex.value] = { ...diaryForm.value }
  } else {
    diaryForm.value.id = Date.now()
    diaryForm.value.visible = true
    data.value.diary.unshift({ ...diaryForm.value })
  }
  persist()
  closeModal('diary')
  showToast('✦ 日记已保存')
}
function deleteDiary(i) {
  if (!confirm('确认删除这篇日记？')) return
  data.value.diary.splice(i, 1)
  persist()
  showToast('日记已删除', 'error')
}
function toggleDiaryVisible(i) {
  data.value.diary[i].visible = data.value.diary[i].visible === false ? true : false
  persist()
}

// PLAYLIST
function openPlaylistModal(i) {
  if (i !== undefined) {
    const s = data.value.playlist[i]
    playlistForm.value = { ...s }
    playlistEditIndex.value = i
  } else {
    playlistForm.value = { song: '', artist: '', emoji: '🎵', bg: '#faeef1', mood: '' }
    playlistEditIndex.value = null
  }
  modals.value.playlist = true
}
function savePlaylist() {
  if (playlistEditIndex.value !== null) {
    data.value.playlist[playlistEditIndex.value] = { ...playlistForm.value }
  } else {
    playlistForm.value.id = Date.now()
    playlistForm.value.visible = true
    data.value.playlist.push({ ...playlistForm.value })
  }
  persist()
  closeModal('playlist')
  showToast('✦ 歌曲已保存')
}
function deletePlaylist(i) {
  if (!confirm('确认删除这首歌？')) return
  data.value.playlist.splice(i, 1)
  persist()
  showToast('歌曲已删除', 'error')
}
function togglePlaylistVisible(i) {
  data.value.playlist[i].visible = data.value.playlist[i].visible === false ? true : false
  persist()
}

// ABOUT
function addAboutBox() {
  data.value.aboutBoxes.push({ title: '新板块', items: ['项目一'] })
}
function deleteAboutBox(bi) { data.value.aboutBoxes.splice(bi, 1) }
function addAboutItem(bi) { data.value.aboutBoxes[bi].items.push('') }
function removeAboutItem(bi, ii) { data.value.aboutBoxes[bi].items.splice(ii, 1) }
function saveAbout() {
  persist()
  showToast('✦ 关于我已保存')
}

// SECTIONS
function toggleSection(section) {
  if (!data.value.sectionVisibility) data.value.sectionVisibility = {}
  data.value.sectionVisibility[section] = data.value.sectionVisibility[section] === false ? true : false
  persist()
  showToast(data.value.sectionVisibility[section] ? '板块已显示' : '板块已隐藏')
}

// MODALS
function closeModal(name) {
  modals.value[name] = false
}

// BACKUP & RESET
async function loadBackups() {
  try {
    const res = await axios.get('/api/auth/backups')
    if (res.data.success) {
      backups.value = res.data.backups
    }
  } catch (err) {
    console.error('Failed to load backups:', err)
  }
}

async function backupData() {
  try {
    const res = await axios.post('/api/auth/backup')
    if (res.data.success) {
      showToast('数据备份成功', 'success')
      loadBackups()
    }
  } catch (err) {
    showToast('备份失败', 'error')
  }
}

async function restoreBackup(filename) {
  if (!confirm('恢复此备份将覆盖当前配置，确定继续吗？')) return
  try {
    const res = await axios.post('/api/auth/restore-backup', { filename })
    if (res.data.success) {
      await loadData()
      showToast('备份已恢复', 'success')
    }
  } catch (err) {
    showToast('恢复失败', 'error')
  }
}

async function deleteBackup(filename) {
  if (!confirm('确定删除此备份文件吗？此操作不可恢复！')) return
  try {
    await axios.post('/api/auth/delete-backup', { filename })
    showToast('备份已删除', 'success')
    loadBackups()
  } catch (err) {
    showToast('删除失败', 'error')
  }
}

async function confirmReset() {
  if (!confirm('真的要重置所有内容为默认数据吗？此操作不可恢复！')) return
  try {
    const res = await axios.post('/api/auth/reset')
    if (res.data.success) {
      data.value = res.data.data
      showToast('数据已重置为默认', 'error')
    }
  } catch (err) {
    showToast('重置失败', 'error')
  }
}

// ACCOUNT
async function changePassword() {
  if (!currentPassword.value) {
    showToast('请输入当前密码', 'error')
    return
  }
  if (!newPassword.value) {
    showToast('请输入新密码', 'error')
    return
  }
  if (newPassword.value.length < 4) {
    showToast('新密码长度不能少于4位', 'error')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致', 'error')
    return
  }
  try {
    const res = await axios.post('/api/auth/change-password', {
      current_password: currentPassword.value,
      new_password: newPassword.value,
      new_username: newUsername.value
    })
    if (res.data.success) {
      showToast('登录信息修改成功，请重新登录', 'success')
      setTimeout(() => router.push('/login'), 1000)
    }
  } catch (err) {
    showToast('修改失败: ' + (err.response?.data?.message || '未知错误'), 'error')
  }
}
</script>

<style scoped>
.sidebar { border-color: var(--line); }
.nav-item { border-left: 2px solid transparent; }
.form-label { font-size: .68rem; color: var(--ink-soft); letter-spacing: .08em; }
.form-input, .form-textarea, .form-select {
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-size: .78rem; color: var(--ink);
  background: var(--cream); border: 1px solid var(--line);
  border-radius: 8px; padding: .55rem .85rem; outline: none;
  transition: border-color .2s; letter-spacing: .03em; width: 100%;
}
.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--sakura); background: #fff;
}
.form-textarea { resize: vertical; min-height: 80px; line-height: 1.7; }
.form-section-title {
  font-size: .72rem; color: var(--ink-faint); letter-spacing: .18em;
  margin-bottom: 1.2rem; padding-bottom: .6rem; border-bottom: 1px solid var(--line);
  display: flex; align-items: center; gap: 8px;
}
.form-section-title::before {
  content: ''; display: inline-block; width: 4px; height: 4px;
  border-radius: 50%; background: var(--sakura);
}
.btn {
  font-family: 'Zen Kaku Gothic New', sans-serif; font-size: .72rem;
  padding: .5rem 1.1rem; border-radius: 8px; border: 1px solid var(--line);
  cursor: pointer; letter-spacing: .06em; transition: background .2s, border-color .2s, color .2s;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn-primary { background: var(--sakura); border-color: var(--sakura); color: #fff; }
.btn-primary:hover { background: #e8b0bc; border-color: #e8b0bc; }
.btn-secondary { background: #fff; color: var(--ink-soft); }
.btn-secondary:hover { background: var(--sakura-l); border-color: var(--sakura); }
.btn-danger { background: transparent; border-color: var(--danger); color: var(--danger); }
.btn-danger:hover { background: #faeef1; }
.btn-sm { font-size: .65rem; padding: .35rem .75rem; }
.add-item-btn {
  font-size: .68rem; color: var(--sakura); border: 1px dashed var(--sakura);
  background: var(--sakura-l); padding: .4rem .9rem; border-radius: 8px;
  cursor: pointer; letter-spacing: .06em; margin-top: 4px; transition: background .2s;
  display: inline-flex; align-items: center; gap: 5px;
}
.add-item-btn:hover { background: #f5e0e5; }
.toast { opacity: 0; pointer-events: none; }
.toast.show { opacity: 1; transform: translateY(0); }
</style>
