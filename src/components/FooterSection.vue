<!--
  FooterSection.vue - 页脚组件
  包含：
  1. 品牌区：Logo + 标语 + 系统运行状态
  2. 链接分组：导航链接 | 社交链接 | 资源链接
  3. 底部栏：版权信息 + 版本号
  注意：外部链接会在新标签页打开，内部链接使用 router-link
-->
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentYear = new Date().getFullYear() // 自动获取当前年份

// ===== 页脚链接配置 =====
// 修改这里来自定义页脚链接
// external: true 表示外部链接（使用 <a> 标签，新窗口打开）
// external: false/undefined 表示内部链接（使用 <router-link>）
const footerLinks = computed(() => [
  {
    title: t('footer.nav'),     // 导航栏目
    links: [
      { name: t('footer.home'), path: '/' },
      { name: t('footer.works'), path: '/projects' },
      { name: t('footer.skills'), path: '/skills' },
      { name: t('footer.repository'), path: '/repository' },
    ],
  },
  {
    title: t('footer.connect'),         // 社交链接栏目 - 替换为你自己的链接
    links: [
      { name: 'GitHub', path: 'https://github.com', external: true },
      { name: 'LinkedIn', path: 'https://linkedin.com', external: true },
      { name: 'Twitter/X', path: 'https://x.com', external: true },
      { name: 'Email', path: 'mailto:hello@example.com', external: true },
    ],
  },
  {
    title: t('footer.resources'),       // 资源栏目
    links: [
      { name: t('footer.blog'), path: '/network' },
      { name: t('footer.resume'), path: '/contact' },
      { name: t('footer.contact'), path: '/contact' },
    ],
  },
])
</script>

<template>
  <footer class="footer">
    <!-- 页脚顶部橙色渐变装饰线 -->
    <div class="footer-top-line"></div>

    <div class="container">
      <!-- 四栏网格布局：品牌区(2份) + 三个链接区(各1份) -->
      <div class="footer-grid">
        <!-- ===== 品牌区 ===== -->
        <div class="footer-brand">
          <!-- Logo -->
          <router-link to="/" class="footer-logo">
            <span class="logo-text">LINZY</span>
          </router-link>
          <!-- 标语 -->
          <p class="footer-tagline">
            {{ t('footer.tagline1') }}
            <br />
            {{ t('footer.tagline2') }}
          </p>
          <!-- 系统运行状态指示器 -->
          <div class="footer-status">
            <span class="status-indicator"></span>  <!-- 绿色呼吸灯 -->
            <span class="status-label">{{ t('footer.status') }}</span>
          </div>
        </div>

        <!-- ===== 链接栏目 ===== -->
        <!-- 遍历 footerLinks 数组生成三个链接列 -->
        <div v-for="group in footerLinks" :key="group.title" class="footer-column">
          <h4 class="footer-heading">{{ group.title }}</h4>
          <ul class="footer-list">
            <li v-for="link in group.links" :key="link.name">
              <!-- 外部链接：用 <a> 标签，新标签页打开 -->
              <a
                v-if="link.external"
                :href="link.path"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
              >
                {{ link.name }}
                <span class="external-icon">↗</span>  <!-- 外部链接图标，悬停时显示 -->
              </a>
              <!-- 内部链接：用 router-link -->
              <router-link v-else :to="link.path" class="footer-link">
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- ===== 底部栏 ===== -->
      <div class="footer-bottom">
        <span class="footer-copy">
          &copy; {{ currentYear }} LINZY_STUDIO. {{ t('footer.rights') }}
        </span>
        <!-- 版本号 - 可自定义 -->
        <span class="footer-version">{{ t('footer.version') }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ========== 页脚容器 ========== */
.footer {
  position: relative;
  background: var(--color-bg-secondary); /* 深灰背景 */
  padding: var(--space-4xl) 0 var(--space-xl);
}

/* 页脚顶部装饰线 - 中间橙色渐变到两侧透明 */
.footer-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-accent) 30%,     /* 30%处开始橙色 */
    var(--color-accent) 70%,     /* 70%处结束橙色 */
    transparent
  );
  opacity: 0.3;
}

/* ========== 四栏网格布局 ========== */
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr; /* 品牌区占2份，链接各占1份 */
  gap: var(--space-3xl);
  margin-bottom: var(--space-3xl);
}

/* ========== 品牌区样式 ========== */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.footer-logo {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: 1px;
}

/* Logo颜色 */
.logo-text {
  color: var(--color-accent);       /* "LINZY" 橙色 */
}

.logo-accent {
  color: var(--color-text-primary); /* "_STUDIO" 白色 */
}

/* 标语文字 */
.footer-tagline {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.8;
}

/* 系统运行状态 */
.footer-status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* 绿色状态指示灯 - 带呼吸发光 */
.status-indicator {
  width: 6px;
  height: 6px;
  background: #22c55e;             /* 绿色 */
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); /* 绿色发光 */
}

.status-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: #22c55e;
  letter-spacing: 2px;
}

/* ========== 链接列样式 ========== */
.footer-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* 列标题 */
.footer-heading {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 3px;
  margin-bottom: var(--space-sm);
}

.footer-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* 链接样式 */
.footer-link {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

/* 悬停效果 - 变橙 + 右移 */
.footer-link:hover {
  color: var(--color-accent);
  padding-left: 4px;
}

/* 外部链接图标 - 默认隐藏，悬停时显示 */
.external-icon {
  font-size: var(--text-xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.footer-link:hover .external-icon {
  opacity: 1;
}

/* ========== 底部栏 ========== */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border); /* 顶部分隔线 */
}

/* 版权信息 */
.footer-copy {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 版本号 */
.footer-version {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  /* 手机：两栏，品牌区占满一行 */
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
  }

  .footer-brand {
    grid-column: 1 / -1;   /* 品牌区跨所有列 */
  }

  /* 底部栏纵向排列 */
  .footer-bottom {
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
  }
}

/* 极小屏：全局单栏 */
@media (max-width: 480px) {
  .footer {
    padding: var(--space-2xl) 0 var(--space-lg);
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
  .footer-brand {
    grid-column: auto;
  }
}
</style>
