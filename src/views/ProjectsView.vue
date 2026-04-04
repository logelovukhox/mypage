<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ===== 超空间星场动画 =====
const canvasRef = ref(null)
let animFrameId = null
let stars = []

const STAR_COUNT = 280
const CENTER_X = () => canvasRef.value ? canvasRef.value.width / 2 : 0
const CENTER_Y = () => canvasRef.value ? canvasRef.value.height / 2 : 0

class Star {
  constructor(W, H) {
    this.W = W
    this.H = H
    this.reset(true)
  }

  reset(initial = false) {
    // 从中心附近随机布点
    this.x = (Math.random() - 0.5) * this.W * 0.12
    this.y = (Math.random() - 0.5) * this.H * 0.12
    // 速度方向就是从中心向外放射
    const angle = Math.atan2(this.y, this.x)
    this.speed = 0.4 + Math.random() * 1.8
    this.vx = Math.cos(angle) * this.speed
    this.vy = Math.sin(angle) * this.speed
    this.size = 0.5 + Math.random() * 1.5
    this.opacity = 0
    this.maxOpacity = 0.4 + Math.random() * 0.6
    // 初始化时随机散布满屏
    if (initial) {
      this.x = (Math.random() - 0.5) * this.W
      this.y = (Math.random() - 0.5) * this.H
      const a2 = Math.atan2(this.y, this.x)
      this.vx = Math.cos(a2) * this.speed
      this.vy = Math.sin(a2) * this.speed
      this.opacity = Math.random() * this.maxOpacity
    }
    // 拖尾记录
    this.trail = []
    this.maxTrail = 6 + Math.floor(Math.random() * 10)
    // 随机飞行时间（用于加速效果）
    this.age = initial ? Math.random() * 200 : 0
  }

  update(W, H) {
    this.age++
    // 距离中心越远速度越快（加速感）
    const dist = Math.sqrt(this.x * this.x + this.y * this.y)
    const accel = 1 + dist / (Math.max(W, H) * 0.8)
    this.x += this.vx * accel
    this.y += this.vy * accel
    // 拖尾
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > this.maxTrail) this.trail.shift()
    // 淸入
    this.opacity = Math.min(this.maxOpacity, this.opacity + 0.015)
    // 尾声降低
    if (dist > Math.max(W, H) * 0.6) {
      this.opacity -= 0.04
    }
    // 超出边界或透明度归零后重置
    const hw = W / 2, hh = H / 2
    if (
      Math.abs(this.x) > hw + 20 ||
      Math.abs(this.y) > hh + 20 ||
      this.opacity <= 0
    ) {
      this.reset()
    }
  }

  draw(ctx, cx, cy) {
    if (this.opacity <= 0) return
    // 拖尾
    for (let i = 0; i < this.trail.length; i++) {
      const t = (i + 1) / this.trail.length
      const tx = this.trail[i].x + cx
      const ty = this.trail[i].y + cy
      ctx.beginPath()
      ctx.arc(tx, ty, this.size * t * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 140, 80, ${this.opacity * t * 0.5})`
      ctx.fill()
    }
    // 星点本体
    const sx = this.x + cx
    const sy = this.y + cy
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.size * 2.5)
    grad.addColorStop(0, `rgba(255, 220, 180, ${this.opacity})`)
    grad.addColorStop(0.5, `rgba(255, 120, 50, ${this.opacity * 0.6})`)
    grad.addColorStop(1, `rgba(255, 80, 20, 0)`)
    ctx.beginPath()
    ctx.arc(sx, sy, this.size * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
  }
}

const initStars = (canvas) => {
  stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star(canvas.width, canvas.height))
  }
}

const resizeCanvas = () => {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
  initStars(canvasRef.value)
}

const animate = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const cx = canvas.width / 2
  const cy = canvas.height / 2

  // 半透明覆盖制造动感拖尾
  ctx.fillStyle = 'rgba(10, 10, 10, 0.25)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const s of stars) {
    s.update(canvas.width, canvas.height)
    s.draw(ctx, cx, cy)
  }

  animFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (canvasRef.value) {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (animFrameId) cancelAnimationFrame(animFrameId)
})

// ============================================================
// 分类过滤器配置
// ============================================================
const filters = computed(() => [
  { id: 'ALL', label: t('projects.filterAll') },
  { id: 'AI_SYSTEMS', label: t('projects.filterAi') },
  { id: 'INFRASTRUCTURE', label: t('projects.filterInfra') },
  { id: 'VISUAL_ENGINES', label: t('projects.filterVis') },
  { id: 'QUANTUM_LIB', label: t('projects.filterQuant') },
])

// 当前激活的过滤器
const activeFilter = ref('ALL')

// ============================================================
// 项目数据
// ============================================================
const projects = computed(() => [
  {
    id: '0x8F2A',
    name: 'VOID_ENGINE',
    status: 'STABLE',
    statusClass: 'stable',
    tags: ['RUST', 'VULKAN', 'WEBASSEMBLY'],
    category: 'VISUAL_ENGINES',
    desc: t('projects.proj1_desc'),
    buildVersion: 'BUILD_V2.04',
    image: '/proj_void_engine.png',
    link: '#',
  },
  {
    id: '0x4C1B',
    name: 'NEURAL_CORE',
    status: 'BETA',
    statusClass: 'beta',
    tags: ['PYTHON', 'PYTORCH', 'CUDA'],
    category: 'AI_SYSTEMS',
    desc: t('projects.proj2_desc'),
    buildVersion: 'BUILD_V1.56',
    image: '/proj_neural_core.png',
    link: '#',
  },
  {
    id: '0xBD5E',
    name: 'SYNAPSE_OS',
    status: 'LEGACY',
    statusClass: 'legacy',
    tags: ['C++', 'DOCKER', 'KUBERNETES'],
    category: 'INFRASTRUCTURE',
    desc: t('projects.proj3_desc'),
    buildVersion: 'BUILD_V0.84',
    image: null,
    imageText: 'CYBER\nNATURL',
    link: '#',
  },
  {
    id: '0x1A2Z',
    name: 'VECTOR_FLOW',
    status: 'STABLE',
    statusClass: 'stable',
    tags: ['GO', 'GRPC', 'NATS'],
    category: 'INFRASTRUCTURE',
    desc: t('projects.proj4_desc'),
    buildVersion: 'BUILD_V3.04',
    image: '/proj_vector_flow.png',
    link: '#',
  },
  {
    id: '0x9F3C',
    name: 'TITAN_NODE',
    status: 'DEEP_BETA',
    statusClass: 'deep-beta',
    tags: ['ZIG', 'LINUX_KERNEL', 'PCIE_GEN5'],
    category: 'QUANTUM_LIB',
    desc: t('projects.proj5_desc'),
    buildVersion: 'BUILD_V0.56',
    image: '/proj_titan_node.png',
    link: '#',
  },
])

// 根据过滤器筛选项目
const filteredProjects = computed(() => {
  if (activeFilter.value === 'ALL') return projects.value
  return projects.value.filter(p => p.category === activeFilter.value)
})

// ============================================================
// 切换过滤器
// ============================================================
const setFilter = (id) => {
  activeFilter.value = id
}

// ============================================================
// 当前系统时间（显示在 Hero 区域右侧）
// ============================================================
const systemStatus = 'ALL_SYSTEMS_OPERATIONAL'
</script>

<template>
  <div class="projects-view">
    <!-- 憟空间星场背景画布 -->
    <canvas ref="canvasRef" class="warp-bg"></canvas>

    <!-- 所有内容包层，z-index:1确保在画布上方 -->
    <div class="content-wrapper">

    <!-- ===== Hero 区域 ===== -->
    <section class="hero">
      <div class="hero-inner container">
        <!-- 左侧：标题区块 -->
        <div class="hero-left">
          <span class="breadcrumb">{{ t('projects.bread') }}</span>
          <h1 class="hero-title">{{ t('projects.title1') }}<span class="accent">{{ t('projects.title2') }}</span></h1>
          <!-- 标题底部橙色横线 -->
          <div class="title-bar"></div>
        </div>

        <!-- 右侧：坐标 + 状态 -->
        <div class="hero-meta">
          <p class="coords">LAT: 40.7128° N // LON: 74.0060° W</p>
          <p class="status-line">
            STATUS: <span class="status-value">{{ systemStatus }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ===== 分类过滤栏 ===== -->
    <div class="filter-bar container">
      <!-- 过滤器图标 -->
      <span class="filter-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        {{ t('projects.filter') }}
      </span>
      <!-- 过滤按钮组 -->
      <div class="filter-buttons">
        <button
          v-for="f in filters"
          :key="f.id"
          class="filter-btn"
          :class="{ active: activeFilter === f.id }"
          @click="setFilter(f.id)"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- ===== 项目卡片网格 ===== -->
    <div class="projects-grid container">

      <!-- 遍历项目卡片 -->
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
      >
        <!-- 卡片顶部图片区域 -->
        <div class="card-image-wrapper">
          <!-- 有图片 -->
          <img
            v-if="project.image"
            :src="project.image"
            :alt="project.name"
            class="card-img"
          />
          <!-- 无图片时显示文字占位 -->
          <div v-else class="card-img-placeholder">
            <span
              v-for="(line, i) in project.imageText.split('\n')"
              :key="i"
              class="placeholder-text"
            >{{ line }}</span>
          </div>
          <!-- ID 标签（右上角） -->
          <span class="card-id">ID: {{ project.id }}</span>
        </div>

        <!-- 卡片内容区 -->
        <div class="card-body">
          <!-- 项目名 + 状态标签 -->
          <div class="card-header">
            <h2 class="card-name">{{ project.name }}</h2>
            <span class="card-status" :class="project.statusClass">[{{ project.status }}]</span>
          </div>

          <!-- 技术栈标签 -->
          <div class="card-tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <!-- 项目描述 -->
          <p class="card-desc">{{ project.desc }}</p>

          <!-- 底部操作行 -->
          <div class="card-footer">
            <a :href="project.link" class="view-source">
              {{ t('projects.viewSource') }}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <span class="build-version">{{ project.buildVersion }}</span>
          </div>
        </div>
      </div>

      <!-- ===== 提交新项目卡片 ===== -->
      <div class="project-card propose-card">
        <div class="propose-body">
          <!-- 大号 + 图标 -->
          <div class="propose-icon">+</div>
          <p class="propose-label">{{ t('projects.propose') }}</p>
          <p class="propose-addr">0x0000 // NULL_PTR</p>
        </div>
      </div>

    </div>

    <!-- ===== 底部外边距占位 ===== -->
    <div style="height: 80px;"></div>

    </div> <!-- /content-wrapper -->
  </div>
</template>

<style scoped>
/* ============================================================
   全局布局
   ============================================================ */
.projects-view {
  min-height: 100vh;
  background: var(--color-bg);
  position: relative;        /* 为 canvas 定位 */
  overflow: hidden;
}

/* 星场画布：固定底层 */
.warp-bg {
  position: fixed;           /* fixed 确保滚动时也在底部 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* 内容层：始终在画布上方 */
.content-wrapper {
  position: relative;
  z-index: 1;
}

/* ============================================================
   Hero 区域
   ============================================================ */
.hero {
  padding: 130px 0 40px;                  /* 顶部为导航栏留出空间 */
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.hero-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-2xl);
}

/* 左侧标题块 */
.hero-left {
  flex: 1;
}

/* 面包屑路径 */
.breadcrumb {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 3px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
  text-transform: uppercase;
}

/* 大标题 */
.hero-title {
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 5vw, 4rem);
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1.05;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
  text-transform: uppercase;
}

/* 橙色强调部分 */
.accent {
  color: var(--color-accent);
}

/* 标题下的橙色横线 */
.title-bar {
  width: 60px;
  height: 3px;
  background: var(--color-accent);
  margin-top: var(--space-sm);
}

/* 右侧坐标 + 状态元 */
.hero-meta {
  text-align: right;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: 2;
  letter-spacing: 1px;
  flex-shrink: 0;
}

.coords {
  color: var(--color-text-muted);
}

.status-line {
  color: var(--color-text-muted);
}

/* 绿色状态值 */
.status-value {
  color: #4ade80;
  font-weight: 700;
}

/* ============================================================
   过滤栏
   ============================================================ */
.filter-bar {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-xl);
  flex-wrap: wrap;
}

/* 过滤器标签 */
.filter-icon {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 2px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.filter-buttons {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

/* 单个过滤按钮 */
.filter-btn {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1.5px;
  padding: 6px 14px;
  border: 1px solid transparent;
  border-radius: 2px;
  color: var(--color-text-muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

/* 激活状态：橙色高亮 */
.filter-btn.active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: rgba(255, 100, 0, 0.08);
}

/* ============================================================
   项目卡片网格
   ============================================================ */
.projects-grid {
  display: grid;
  /* 3 列等宽，最小 280px */
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding-bottom: var(--space-3xl);
}

/* 响应式：中等屏幕 2 列 */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 响应式：小屏 1 列 */
@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .hero {
    padding: 100px 0 32px;
  }
  .hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-lg);
  }
  .hero-meta {
    text-align: left;
  }
  .filter-bar {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: var(--space-md);
    /* 隐藏滚动条 */
    scrollbar-width: none;
  }
  .filter-bar::-webkit-scrollbar { display: none; }
  .filter-buttons {
    flex-wrap: nowrap;
  }
  .filter-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }
}

/* ============================================================
   单张项目卡片
   ============================================================ */
.project-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}

/* 悬停时：橙色边框 + 轻微上浮 */
.project-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(255, 100, 0, 0.12);
}

/* ---- 图片区域 ---- */
.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;   /* 固定宽高比 */
  overflow: hidden;
  background: #111;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
  filter: brightness(0.85) saturate(0.9);
}

/* 图片分辨率增强 - 悬停时微放大 */
.project-card:hover .card-img {
  transform: scale(1.04);
  filter: brightness(0.95) saturate(1.05);
}

/* 无图时的文字占位块 */
.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #111;
  gap: 2px;
}

.placeholder-text {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 8px;
  color: rgba(255, 255, 255, 0.15);
  line-height: 1.3;
}

/* ID 右上角标签 */
.card-id {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--color-accent);
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid var(--color-accent);
  padding: 3px 8px;
  backdrop-filter: blur(4px);
}

/* ---- 卡片内容区 ---- */
.card-body {
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

/* 名称行：左项目名 + 右状态标签 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.card-name {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--color-text-primary);
  text-transform: uppercase;
}

/* 状态标签 */
.card-status {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.card-status.stable {
  color: #4ade80;
  border: 1px solid #4ade80;
  background: rgba(74, 222, 128, 0.07);
}

.card-status.beta {
  color: #60a5fa;
  border: 1px solid #60a5fa;
  background: rgba(96, 165, 250, 0.07);
}

.card-status.legacy {
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.card-status.deep-beta {
  color: #f59e0b;
  border: 1px solid #f59e0b;
  background: rgba(245, 158, 11, 0.07);
}

/* 技术标签行 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: 3px 8px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s;
}

.project-card:hover .tag {
  border-color: rgba(255, 100, 0, 0.3);
}

/* 描述文字 */
.card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  flex: 1;
}

/* 底部操作行：左查看链接 + 右构建版本 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

/* VIEW_SOURCE 链接 */
.view-source {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--color-accent);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s ease, opacity 0.2s;
}

.view-source:hover {
  gap: 10px;
  opacity: 0.85;
}

/* 构建版本 */
.build-version {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

/* ============================================================
   "提交新项目"卡片
   ============================================================ */
.propose-card {
  border-style: dashed;
  border-color: var(--color-border);
  cursor: pointer;
  min-height: 220px;
}

.propose-card:hover {
  border-color: var(--color-accent);
  border-style: dashed;
  box-shadow: 0 0 20px rgba(255, 100, 0, 0.06);
}

.propose-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 220px;
  gap: 10px;
  padding: 36px;
}

/* 大号 + 图标 */
.propose-icon {
  font-size: 2rem;
  color: var(--color-text-muted);
  line-height: 1;
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: border-color 0.2s, color 0.2s;
}

.propose-card:hover .propose-icon {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.propose-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--color-text-secondary);
}

.propose-addr {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}
</style>
