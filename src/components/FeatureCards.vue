<!--
  FeatureCards.vue - 特色能力卡片组件
  展示三张能力卡片：全栈运维、LLM集成、低延迟系统
  特点：
  1. 滚动到可视区域时触发入场动画（IntersectionObserver）
  2. 每张卡片有独立的延迟动画
  3. 悬停时有边框高亮 + 顶部强调线 + 橙色辉光效果
-->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const cardsVisible = ref(false) // 控制卡片是否显示（用于入场动画）

// ===== 特色卡片数据 =====
// 修改这里来更改卡片内容：icon(图标)、title(标题)、description(描述)、tag(底部标签)、color(强调色)
const features = computed(() => [
  {
    icon: '⚡',
    title: t('features.card1.title'),
    description: t('features.card1.desc'),
    color: '#ff6b2b',      // 深橙色
  },
  {
    icon: '🧠',
    title: t('features.card2.title'),
    description: t('features.card2.desc'),
    color: '#ff8c55',      // 中橙色
  },
  {
    icon: '🔧',
    title: t('features.card3.title'),
    description: t('features.card3.desc'),
    color: '#ffaa77',      // 浅橙色
  },
])

// 使用 IntersectionObserver 监听区块是否进入视口
// 只触发一次（进入后就断开监听），避免重复播放动画
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {  // 元素进入视口
          cardsVisible.value = true  // 触发卡片显示
          observer.disconnect()       // 只触发一次
        }
      })
    },
    { threshold: 0.2 }  // 元素20%可见时触发
  )

  const section = document.getElementById('features-section')
  if (section) observer.observe(section)
})
</script>

<template>
  <section class="features section" id="features-section">
    <div class="container">
      <!-- 卡片网格 - visible类触发CSS入场动画 -->
      <div class="features-grid" :class="{ visible: cardsVisible }">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="feature-card"
          :style="{ '--delay': index * 0.15 + 's' }"
        >
          <!-- 卡片顶部强调线 - 悬停时显示 -->
          <div class="card-accent-line" :style="{ background: feature.color }"></div>

          <!-- 图标 -->
          <div class="feature-icon" :style="{ '--icon-color': feature.color }">
            {{ feature.icon }}
          </div>

          <!-- 卡片内容 -->
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>

          <!-- 悬停发光效果覆盖层 -->
          <div class="card-hover-glow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ========== 特色区块容器 ========== */
.features {
  position: relative;
  background: var(--color-bg-primary);
}

/* 顶部渐变分隔线装饰 */
.features::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-border-accent),   /* 中间橙色 */
    transparent
  );
}

/* ========== 三栏网格布局 ========== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三等分 */
  gap: var(--space-xl);
}

/* ========== 单张卡片 ========== */
.feature-card {
  position: relative;
  background: var(--color-bg-card);       /* 半透明深色背景 */
  border: 1px solid var(--color-border);  /* 极淡边框 */
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  overflow: hidden;
  transition: all var(--transition-base);
  opacity: 0;                             /* 初始隐藏 */
  transform: translateY(40px);            /* 初始位置在下方 */
}

/* 入场动画 - 父元素添加visible类后触发 */
/* --delay 变量让每张卡片依次出现（第1张0s，第2张0.15s，第3张0.3s） */
.features-grid.visible .feature-card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease var(--delay), transform 0.6s ease var(--delay);
}

/* 悬停效果 - 边框变橙、背景变亮、微微上浮 */
.feature-card:hover {
  border-color: var(--color-border-accent);
  background: var(--color-bg-card-hover);
  transform: translateY(-5px);
}

/* 卡片顶部强调线 - 默认隐藏，悬停时显示 */
.card-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.feature-card:hover .card-accent-line {
  opacity: 1;
}

/* 悬停时的橙色辉光覆盖层 */
.card-hover-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at top center,
    rgba(255, 107, 43, 0.05) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;    /* 不影响点击 */
}

.feature-card:hover .card-hover-glow {
  opacity: 1;
}

/* ========== 图标样式 ========== */
.feature-icon {
  font-size: var(--text-3xl);
  margin-bottom: var(--space-lg);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-accent-subtle); /* 淡橙色背景 */
}

/* ========== 卡片标题 ========== */
.feature-title {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

/* ========== 卡片描述 ========== */
.feature-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-xl);
}

/* ========== 响应式 ========== */
/* 平板：两栏 */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 手机：单栏 */
@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
