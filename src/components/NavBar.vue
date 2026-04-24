<!--
  NavBar.vue - 顶部导航栏组件
  功能：
  1. 固定在页面顶部，滚动时添加毛玻璃背景
  2. 左侧 Logo（点击回到首页）
  3. 中间导航链接（MODULES/SKILLS/REPOSITORY/NETWORK）
  4. 右侧 CONTACT 按钮
  5. 移动端响应式汉堡菜单
-->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()              // 获取当前路由信息，用于高亮当前页面的导航链接
const scrolled = ref(false)            // 是否已经滚动（控制导航栏背景透明度）
const mobileMenuOpen = ref(false)      // 移动端菜单是否打开

const { t, locale } = useI18n()

// 导航链接配置 - 修改这里可以增减导航项
// name: 显示文字, path: 对应的路由路径
const navLinks = computed(() => [
  { name: t('nav.works'), path: '/projects' },     // 项目展示
  { name: t('nav.skills'), path: '/skills' },         // 技能详情
  { name: t('nav.repository'), path: '/repository' }, // 代码仓库
  { name: t('nav.network'), path: '/network' },       // 社交网络/博客
])

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('language', locale.value)
}

// 监听滚动事件 - 滚动超过50px时给导航栏添加毛玻璃背景
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

// 切换移动端菜单开关
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 关闭移动端菜单（点击链接后自动关闭）
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时移除滚动监听（防止内存泄漏）
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- 导航栏：scrolled类控制背景，menu-open类控制移动端状态 -->
  <header class="navbar" :class="{ scrolled, 'menu-open': mobileMenuOpen }">
    <div class="navbar-inner container">
      <!-- Logo - 点击回到首页 -->
      <router-link to="/" class="logo" @click="closeMobileMenu">
        <span class="logo-text">LINZY</span>
      </router-link>

      <!-- 桌面端导航链接 - 768px以下隐藏 -->
      <nav class="nav-links" id="main-nav">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: route.path === link.path }"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <!-- 联系按钮 - 跳转到联系页面 -->
      <div class="nav-actions">
        <button class="lang-toggle" @click="toggleLanguage" :aria-label="locale === 'en' ? '切换到中文' : 'Switch to English'">
          <span class="lang-current">{{ locale === 'en' ? 'EN' : '中' }}</span>
          <span class="lang-divider">/</span>
          <span class="lang-next">{{ locale === 'en' ? '中' : 'EN' }}</span>
        </button>
        <router-link to="/contact" class="contact-btn" id="contact-btn">
          {{ t('nav.contact') }}<span class="contact-code"></span>
        </router-link>
      </div>

      <!-- 移动端汉堡菜单按钮 - 768px以上隐藏 -->
      <button
        class="mobile-toggle"
        @click="toggleMobileMenu"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle menu"
        id="mobile-menu-toggle"
      >
        <!-- 三条横线，打开时变成 X 形 -->
        <span class="bar" :class="{ open: mobileMenuOpen }"></span>
        <span class="bar" :class="{ open: mobileMenuOpen }"></span>
        <span class="bar" :class="{ open: mobileMenuOpen }"></span>
      </button>
    </div>

    <!-- 移动端下拉菜单 - 带滑入动画 -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="mobile-menu" id="mobile-menu">
        <nav class="mobile-nav">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="mobile-link"
            @click="closeMobileMenu"
          >
            <span class="mobile-link-indicator">//</span>
            {{ link.name }}
          </router-link>
          <!-- 移动端联系链接 -->
          <router-link to="/contact" class="mobile-link mobile-link-contact" @click="closeMobileMenu">
            <span class="mobile-link-indicator">//</span>
            {{ t('nav.contact') }}
          </router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* ========== 导航栏容器 ========== */
.navbar {
  position: fixed;              /* 固定定位 - 始终在页面顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);        /* 确保在其他内容之上 */
  padding: var(--space-lg) 0;
  transition: all var(--transition-base);
  background: transparent;      /* 默认透明背景 */
}

/* 滚动后的导航栏 - 添加毛玻璃效果 */
.navbar.scrolled {
  background: rgba(10, 10, 10, 0.85);    /* 半透明深色背景 */
  backdrop-filter: blur(20px);            /* 毛玻璃模糊效果 */
  -webkit-backdrop-filter: blur(20px);    /* Safari兼容 */
  padding: var(--space-md) 0;             /* 缩小内边距 */
  border-bottom: 1px solid var(--color-border); /* 底部分隔线 */
}

/* 导航栏内部布局 - 三栏（Logo | 链接 | 按钮） */
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ========== Logo样式 ========== */
.logo {
  font-family: var(--font-mono);   /* 等宽字体 */
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: 1px;
  transition: opacity var(--transition-fast);
}

.logo:hover {
  opacity: 0.8;                    /* 悬停时略微变暗 */
}

.logo-text {
  color: var(--color-accent);      /* "LINZY" 橙色 */
}

.logo-accent {
  color: var(--color-text-primary); /* "_STUDIO" 白色 */
}

/* ========== 桌面端导航链接 ========== */
.nav-links {
  display: flex;
  gap: var(--space-2xl);           /* 链接间距 */
}

.nav-link {
  font-family: var(--font-mono);
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--color-text-secondary); /* 默认灰色 */
  transition: color var(--transition-fast);
  position: relative;
  padding-bottom: 4px;
}

/* 导航链接底部下划线动画 - 默认宽度为0 */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;                        /* 默认不显示 */
  height: 2px;
  background: var(--color-accent);  /* 橙色下划线 */
  transition: width var(--transition-base);
}

/* 悬停和激活状态 - 文字变白 */
.nav-link:hover,
.nav-link.active {
  color: var(--color-text-primary);
}

/* 悬停和激活状态 - 下划线展开到100% */
.nav-link.active::after,
.nav-link:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.lang-toggle {
  font-family: var(--font-mono);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  padding: 6px 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--transition-base), opacity var(--transition-base);
}

.lang-toggle:hover {
  color: var(--color-accent);
}

.lang-current {
  color: var(--color-text-secondary);
}

.lang-divider {
  color: var(--color-border-accent);
}

.lang-next {
  color: inherit;
}

/* ========== 联系按钮 ========== */
.contact-btn {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 1px;
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-text-secondary); /* 灰色边框 */
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  transition: all var(--transition-base);
}

/* 联系按钮悬停 - 边框变橙 + 橙色背景 */
.contact-btn:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

/* "_J064" 后缀暗色 */
.contact-code {
  color: var(--color-text-muted);
}

/* ========== 移动端汉堡菜单按钮 ========== */
.mobile-toggle {
  display: none;                   /* 默认隐藏，768px以下显示 */
  flex-direction: column;
  gap: 5px;
  padding: var(--space-sm);
}

/* 汉堡菜单的三条横线 */
.bar {
  width: 24px;
  height: 2px;
  background: var(--color-text-primary);
  transition: all var(--transition-base);
  transform-origin: center;
}

/* 打开菜单时：第一条线旋转45度，向下移动 */
.bar.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

/* 打开菜单时：中间线消失 */
.bar.open:nth-child(2) {
  opacity: 0;
}

/* 打开菜单时：第三条线旋转-45度，向上移动 → 形成 X 形 */
.bar.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ========== 移动端下拉菜单 ========== */
.mobile-menu {
  position: absolute;
  top: 100%;                       /* 导航栏正下方 */
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95); /* 深色半透明背景 */
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-xl);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* 移动端菜单链接 */
.mobile-link {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  letter-spacing: 2px;
  color: var(--color-text-secondary);
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* 悬停时 - 文字变橙 + 右移缩进 */
.mobile-link:hover {
  color: var(--color-accent);
  padding-left: var(--space-md);
}

/* "//" 前缀指示器 - 默认隐藏，悬停时显示 */
.mobile-link-indicator {
  color: var(--color-accent);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.mobile-link:hover .mobile-link-indicator {
  opacity: 1;
}

/* 联系链接默认就是橙色 */
.mobile-link-contact {
  color: var(--color-accent);
}

/* ========== 下拉菜单过渡动画 ========== */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);    /* 从上方滑入 */
}

/* ========== 响应式 ========== */
/* 小于768px（手机/平板）时隐藏桌面导航，显示汉堡菜单 */
@media (max-width: 768px) {
  .nav-links,
  .contact-btn {
    display: none;                 /* 隐藏桌面端导航和联系按钮 */
  }

  .mobile-toggle {
    display: flex;                 /* 显示汉堡菜单按钮 */
  }
}
</style>
