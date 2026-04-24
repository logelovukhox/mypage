<!--
  HeroSection.vue - 首页英雄区组件（首屏大图区域）
  这是访客进入网站后看到的第一个区域，包含：
  1. AI 芯片视觉徽章
  2. 大标题（BUILDING THE FUTURE OF COMPUTE.）
  3. 副标题描述
  4. CTA行动按钮（INIT_SEQUENCE + VIEW_MANIFESTO）
  5. 右侧芯片图片（带浮动动画）
  6. 底部电路线SVG装饰
-->
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ===== 动画控制变量 =====
// 这些变量控制各元素的显示/隐藏，配合 v-if + transition 实现依次入场动画
const titleVisible = ref(false)     // 大标题是否显示
const subtitleVisible = ref(false)  // 副标题是否显示
const ctaVisible = ref(false)       // CTA按钮是否显示

// 组件挂载后 - 按时间顺序依次显示各元素
onMounted(() => {
  setTimeout(() => { titleVisible.value = true }, 300)
  setTimeout(() => { subtitleVisible.value = true }, 700)
  setTimeout(() => { ctaVisible.value = true }, 1000)
})
</script>

<template>
  <section class="hero" id="hero-section">
    <!-- 背景网格线 - 用CSS渐变画出来的淡橙色格子背景 -->
    <div class="hero-grid"></div>

    <!-- 环境光晕 - 右上角的橙色发光效果，带浮动动画 -->
    <div class="hero-glow"></div>

    <div class="hero-content container">
      <!-- ===== 左侧内容 ===== -->
      <div class="hero-left">
        <!-- 主标题 - "BUILDING THE FUTURE OF COMPUTE." -->
        <!-- 可以修改这里的文字来更改首页大标题 -->
        <transition name="fade-up">
          <div v-if="titleVisible" class="hero-title-wrapper">
            <div class="hero-emblem" aria-hidden="true">
              <img src="/images/hero-ai-emblem.png" alt="" />
            </div>
            <h1 class="hero-title">
              <span class="title-line">{{ t('hero.title1') }}</span>
              <span class="title-line">{{ t('hero.title2') }}</span>
              <span class="title-line title-accent">{{ t('hero.titleAccent') }}</span>
            </h1>
          </div>
        </transition>

        <!-- 副标题 - 简短的自我介绍描述 -->
        <!-- 修改这里的文字来更改你的职业描述 -->
        <transition name="fade-up">
          <p v-if="subtitleVisible" class="hero-subtitle">
            {{ t('hero.subtitle') }}
            <strong class="text-accent">{{ t('hero.subtitleAccent') }}</strong>
            {{ t('hero.subtitleEnd') }}
          </p>
        </transition>

        <!-- CTA行动按钮区域 -->
        <transition name="fade-up">
          <div v-if="ctaVisible" class="hero-cta">
            <!-- 主按钮 - 橙色边框圆角，带发光效果，点击跳转到项目页 -->
            <router-link to="/projects" class="btn-primary" id="btn-init">
              <span class="btn-glow"></span>      <!-- 悬停时扩散的发光元素 -->
              <span class="btn-text">{{ t('hero.initSequence') }}</span>
            </router-link>
            <!-- 次按钮 - 灰色边框方角，点击跳转到技能页 -->
            <router-link to="/skills" class="btn-secondary" id="btn-manifesto">
              <span class="btn-text">{{ t('hero.viewManifesto') }}</span>
            </router-link>
          </div>
        </transition>
      </div>

      <!-- ===== 右侧视觉区域 ===== -->
      <div class="hero-right">
        <!-- 芯片图片 - 带浮动动画 -->
        <div class="hero-image-wrapper">
          <!-- 图片路径：public/images/hero-chip.png，可替换为其他图片 -->
          <img 
            src="/images/hero-chip.png" 
            alt="Futuristic processor chip"
            class="hero-image"
          />
          <!-- 图片背后的橙色发光效果 -->
          <div class="image-glow"></div>
        </div>
      </div>
    </div>

    <!-- 底部电路线装饰 - SVG画的线条和圆点 -->
    <div class="circuit-lines">
      <svg width="100%" height="60" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,107,43,0.15)" stroke-width="1"/>
        <circle cx="400" cy="30" r="3" fill="rgba(255,107,43,0.3)"/>
        <line x1="400" y1="30" x2="600" y2="10" stroke="rgba(255,107,43,0.15)" stroke-width="1"/>
        <line x1="600" y1="10" x2="900" y2="10" stroke="rgba(255,107,43,0.15)" stroke-width="1"/>
        <circle cx="900" cy="10" r="3" fill="rgba(255,107,43,0.3)"/>
        <line x1="900" y1="10" x2="1100" y2="50" stroke="rgba(255,107,43,0.15)" stroke-width="1"/>
        <line x1="1100" y1="50" x2="1440" y2="50" stroke="rgba(255,107,43,0.15)" stroke-width="1"/>
      </svg>
    </div>
  </section>
</template>

<style scoped>
/* ========== 英雄区容器 ========== */
.hero {
  position: relative;
  min-height: 100vh;           /* 占满整个视口高度 */
  display: flex;
  align-items: center;         /* 内容垂直居中 */
  overflow: hidden;            /* 隐藏溢出的装饰元素 */
  padding-top: 80px;           /* 给固定导航栏留出空间 */
}

/* ========== 背景网格线 ========== */
/* 用两个方向的线性渐变叠加，形成60px间距的网格 */
.hero-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 107, 43, 0.03) 1px, transparent 1px),   /* 横线 */
    linear-gradient(90deg, rgba(255, 107, 43, 0.03) 1px, transparent 1px); /* 竖线 */
  background-size: 60px 60px;  /* 网格大小，可调整 */
  pointer-events: none;        /* 不影响点击 */
}

/* ========== 环境光晕 ========== */
/* 右上角的橙色柔光，营造氛围 */
.hero-glow {
  position: absolute;
  top: 20%;
  right: 20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 107, 43, 0.08) 0%, transparent 70%);
  pointer-events: none;
  animation: float 8s ease-in-out infinite; /* 缓慢上下浮动 */
}

/* ========== 内容区布局 ========== */
/* 左右两栏网格布局 */
.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 左右各占一半 */
  gap: var(--space-3xl);
  align-items: center;
  position: relative;
  z-index: 2;                     /* 确保在背景装饰之上 */
}

/* 左侧内容 - 纵向排列 */
.hero-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* ========== 标题上方 AI 徽章 ========== */
.hero-emblem {
  width: 118px;
  height: 84px;
  margin-bottom: var(--space-lg);
  border: 1px solid rgba(255, 107, 43, 0.24);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(12, 12, 12, 0.72);
  box-shadow:
    0 0 36px rgba(255, 107, 43, 0.14),
    inset 0 0 20px rgba(255, 107, 43, 0.08);
}

.hero-emblem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 54%;
}

/* ========== 大标题样式 ========== */
.hero-title {
  display: flex;
  flex-direction: column;  /* 每行文字独占一行 */
}

/* 每行标题文字 */
.title-line {
  font-size: var(--text-hero);     /* 响应式字号：48px ~ 96px */
  font-weight: 900;                /* 最粗字重 */
  line-height: 1.05;               /* 紧凑行高 */
  letter-spacing: -2px;            /* 负间距让字更紧凑 */
  color: var(--color-text-primary);
}

/* "COMPUTE." 橙色高亮 + 发光效果 */
.title-accent {
  color: var(--color-accent);
  text-shadow: 0 0 40px var(--color-accent-glow);
}

/* ========== 副标题 ========== */
.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 540px;                /* 限制最大宽度，提高可读性 */
}

/* ========== CTA按钮区域 ========== */
.hero-cta {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  flex-wrap: wrap;                 /* 空间不足时换行 */
}

/* 主按钮（INIT_SEQUENCE）- 橙色边框圆角 */
.btn-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-text-primary);
  background: transparent;
  border: 2px solid var(--color-accent);  /* 橙色边框 */
  border-radius: var(--radius-full);       /* 药丸形圆角 */
  overflow: hidden;
  transition: all var(--transition-base);
  animation: glow 3s ease-in-out infinite; /* 持续发光呼吸动画 */
}

/* 按钮内部发光元素 - 悬停时从中心扩散 */
.btn-primary .btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: var(--color-accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all var(--transition-slow);
  opacity: 0.15;
}

/* 悬停时发光元素扩大 */
.btn-primary:hover .btn-glow {
  width: 300px;
  height: 300px;
}

/* 悬停时按钮整体效果 */
.btn-primary:hover {
  background: rgba(255, 107, 43, 0.15);
  transform: translateY(-2px);    /* 微微上浮 */
}

/* 次按钮（VIEW_MANIFESTO）- 灰色边框方角 */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-text-primary);
  border: 1px solid var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  border-color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

/* 按钮文字确保在发光层之上 */
.btn-text {
  position: relative;
  z-index: 1;
}

/* ========== 右侧视觉区域 ========== */
.hero-right {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 芯片图片容器 - 带浮动动画 */
.hero-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;                /* 图片最大宽度 */
  animation: float 6s ease-in-out infinite; /* 上下浮动 */
}

/* 芯片图片 */
.hero-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  filter: brightness(1.1) contrast(1.1); /* 稍微提高亮度和对比度 */
}

/* 图片背后的橙色辉光效果 */
.image-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 107, 43, 0.2) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

/* ========== 底部电路线装饰 ========== */
.circuit-lines {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0.6;
}

/* ========== 入场过渡动画 ========== */
.fade-up-enter-active {
  transition: all 0.8s ease-out;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* ========== 响应式布局 ========== */
/* 平板及以下（≤1024px）：改为单栏居中布局 */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;  /* 单栏 */
    text-align: center;
  }

  .hero-left {
    align-items: center;         /* 居中对齐 */
  }

  .hero-subtitle {
    margin: 0 auto;
  }

  .hero-cta {
    justify-content: center;
  }

  /* 图片移到文字上方 */
  .hero-right {
    order: -1;
  }

  .hero-image-wrapper {
    max-width: 350px;
  }
}

/* 手机（≤768px） */
@media (max-width: 768px) {
  .hero {
    padding-top: 100px;
    min-height: auto;
  }

  .hero-glow {
    width: 300px;
    height: 300px;
  }
}


/* 手机（≤480px）：标题缩小，按钮纵向排列 */
@media (max-width: 480px) {
  .title-line {
    font-size: clamp(2.2rem, 10vw, 3.5rem); /* 更小的标题字号 */
  }

  .hero-cta {
    flex-direction: column;      /* 按钮纵向排列 */
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;                 /* 按钮全宽 */
    justify-content: center;
  }
}
</style>
