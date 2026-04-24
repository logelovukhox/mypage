<!--
  StatsSection.vue - 数据统计展示组件
  展示四个关键数字：经验年限、项目数量、可用率、提交次数
  特点：
  1. 数字使用渐变色（白→橙）
  2. 滚动到可视区域时依次淡入
  3. 带 "// SYSTEM_METRICS" 分隔标题
-->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const visible = ref(false) // 控制统计区域是否显示

// ===== 统计数据配置 =====
// 修改这里来更改你的统计数据
// value: 显示的数值, label: 下方标签, suffix: 后缀（暂未使用）
const stats = computed(() => [
  { value: '5+', label: t('stats.years'), suffix: '' },    // 经验年限
  { value: '50+', label: t('stats.projects'), suffix: '' },      // 项目数量
  { value: '99.9', label: t('stats.uptime'), suffix: '%' },    // 系统可用率
  { value: '10K+', label: t('stats.commits'), suffix: '' },      // Git提交次数
])

// 滚动到可视区域时触发显示动画
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.value = true
          observer.disconnect() // 只触发一次
        }
      })
    },
    { threshold: 0.3 } // 30%可见时触发
  )

  const el = document.getElementById('stats-section')
  if (el) observer.observe(el)
})
</script>

<template>
  <section class="stats section" id="stats-section">
    <div class="container">
      <!-- 区块分隔线 -->
      <div class="section-divider">
        <div class="divider-line"></div>
      </div>

      <!-- 四栏统计网格 -->
      <div class="stats-grid" :class="{ visible }">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="stat-card"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <!-- 数字 -->
          <div class="stat-value">
            <span class="stat-number">{{ stat.value }}</span>
          </div>
          <!-- 标签 -->
          <div class="stat-label">{{ stat.label }}</div>
          <!-- 底部橙色短线装饰 -->
          <div class="stat-underline"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ========== 统计区块容器 ========== */
.stats {
  position: relative;
  background: var(--color-bg-secondary); /* 用次背景色区分区域 */
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

/* ========== 分隔线样式 ========== */
.section-divider {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-3xl);
}

/* 左侧渐变线 - 从橙色渐变到透明 */
.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--color-border-accent), transparent);
}

/* ========== 四栏统计网格 ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 四等分 */
  gap: var(--space-xl);
}

/* 单个统计卡片 */
.stat-card {
  text-align: center;
  padding: var(--space-2xl);
  opacity: 0;                  /* 初始隐藏 */
  transform: translateY(20px); /* 初始在下方 */
}

/* 入场动画 - 每个卡片依次淡入上升 */
.stats-grid.visible .stat-card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease var(--delay), transform 0.5s ease var(--delay);
}

.stat-value {
  margin-bottom: var(--space-sm);
}

/* 数字样式 - 使用白→橙渐变色 */
.stat-number {
  font-family: var(--font-mono);
  font-size: var(--text-5xl);       /* 大号字 */
  font-weight: 900;
  color: var(--color-text-primary);
  /* 文字渐变色效果 */
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 标签文字 */
.stat-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 3px;
  margin-bottom: var(--space-md);
}

/* 底部橙色短线装饰 */
.stat-underline {
  width: 40px;
  height: 2px;
  background: var(--color-accent);
  margin: 0 auto;
  opacity: 0.5;
}

/* ========== 响应式 ========== */
/* 平板：两栏 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 手机：单栏 */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
