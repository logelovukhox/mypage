<!--
  TechStack.vue - 技术栈展示组件
  以进度条的形式展示各技术的掌握程度
  特点：
  1. 两栏网格布局
  2. 进度条滚动到时才开始填充动画
  3. 每个技术显示：名称 | 分类 | 进度条 | 百分比
-->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const visible = ref(false) // 控制是否显示（用于触发进度条动画）

// ===== 技术栈数据配置 =====
// 修改这里来自定义你的技术栈
// name: 技术名称, category: 分类标签, level: 掌握程度(0-100)
const techStack = computed(() => [
  { name: 'Vue.js', category: t('tech.cat_frontend'), level: 95 },       // 前端
  { name: 'React', category: t('tech.cat_frontend'), level: 88 },         // 前端
  { name: 'Node.js', category: t('tech.cat_backend'), level: 90 },        // 后端
  { name: 'Python', category: t('tech.cat_ai'), level: 85 },           // 人工智能/机器学习
  { name: 'TypeScript', category: t('tech.cat_lang'), level: 92 },    // 编程语言
  { name: 'Docker', category: t('tech.cat_devops'), level: 80 },          // 运维工具
  { name: 'Rust', category: t('tech.cat_sys'), level: 70 },           // 系统编程
  { name: 'PostgreSQL', category: t('tech.cat_db'), level: 88 },    // 数据库
])

// 滚动到可视区域时触发进度条动画
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.value = true
          observer.disconnect()
        }
      })
    },
    { threshold: 0.2 } // 20%可见时触发
  )

  const el = document.getElementById('tech-section')
  if (el) observer.observe(el)
})
</script>

<template>
  <section class="tech section" id="tech-section">
    <div class="container">
      <!-- 区块标题 -->
      <div class="section-header">
        <h2 class="section-title">{{ t('tech.title1') }} <span class="text-accent">{{ t('tech.title2') }}</span></h2>
        <p class="section-desc">
          {{ t('tech.desc') }}
        </p>
      </div>

      <!-- 技术栈网格 - 两栏布局 -->
      <div class="tech-grid" :class="{ visible }">
        <div
          v-for="(tech, index) in techStack"
          :key="tech.name"
          class="tech-item"
          :style="{ '--delay': index * 0.08 + 's' }"
        >
          <!-- 左侧：技术名称和分类 -->
          <div class="tech-header">
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-category">{{ tech.category }}</span>
          </div>
          <!-- 中间：进度条 -->
          <!-- visible为true时进度条从0%填充到 tech.level%，带延迟动画 -->
          <div class="tech-bar-wrapper">
            <div
              class="tech-bar-fill"
              :style="{ width: visible ? tech.level + '%' : '0%', transitionDelay: 'calc(0.4s + ' + index * 0.08 + 's)' }"
            ></div>
          </div>
          <!-- 右侧：百分比数值 -->
          <span class="tech-level">{{ tech.level }}%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ========== 技术栈区块容器 ========== */
.tech {
  position: relative;
  background: var(--color-bg-primary);
}

/* ========== 区块标题样式 ========== */
.section-header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

/* "CORE TECHNOLOGIES" 大标题 */
.section-title {
  font-size: var(--text-4xl);
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: var(--space-md);
}

/* 描述文字 */
.section-desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

/* ========== 两栏网格布局 ========== */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两栏 */
  gap: var(--space-lg);
  max-width: 900px;          /* 限制最大宽度 */
  margin: 0 auto;            /* 居中 */
}

/* ========== 单个技术项 ========== */
/* 三栏子网格：名称 | 进度条 | 百分比 */
.tech-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  opacity: 0;                /* 初始隐藏 */
  transform: translateX(-20px); /* 初始在左侧 */
  transition: all var(--transition-base);
}

/* 入场动画 - 从左滑入 */
.tech-grid.visible .tech-item {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.5s ease var(--delay), transform 0.5s ease var(--delay);
}

/* 悬停效果 */
.tech-item:hover {
  border-color: var(--color-border-accent);
  background: var(--color-bg-card-hover);
}

/* 技术名称和分类 */
.tech-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 技术名称 */
.tech-name {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 1px;
}

/* 分类标签 */
.tech-category {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 2px;
}

/* ========== 进度条 ========== */
/* 进度条背景轨道 */
.tech-bar-wrapper {
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

/* 进度条填充部分 - 橙色渐变 + 发光 */
.tech-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
  border-radius: var(--radius-full);
  transition: width 1s ease-out;    /* 1秒自然填充动画 */
  box-shadow: 0 0 8px var(--color-accent-glow); /* 发光效果 */
}

/* 百分比数值 */
.tech-level {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  min-width: 35px;
  text-align: right;
}

/* ========== 响应式 ========== */
/* 手机/平板：单栏 */
@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: 1fr;
  }

  /* 手机上 tech-item 改为侧边两列：左边名称+分类，右边百分比，进度条占满行 */
  .tech-item {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
  }

  /* 进度条占满第二行的两列 */
  .tech-bar-wrapper {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  /* 百分比在第一行第二列 */
  .tech-level {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
  }
}
</style>
