<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const canvasRef = ref(null)
let animationFrameId = null

// ===== 流动电路脉冲配置 =====
// 在网格上绘制电路路径，沿路径流动发光的脉冲点
const GRID = 48          // 网格间距
const PULSE_COLOR  = 'rgba(99, 179, 237, 1)'   // 亮蓝色脉冲头
const LINE_COLOR   = 'rgba(59, 130, 246, 0.12)' // 暗蓝色网格底线
const TRAIL_COLOR  = 'rgba(147, 197, 253, 0.5)' // 拖尾颜色

let pulses = []
let gridW = 0
let gridH = 0

// 生成网格节点坐标
const snapToGrid = (v) => Math.round(v / GRID) * GRID

// 随机方向
const DIRS = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 }
]

class Pulse {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight)
  }

  reset(W, H) {
    // 随机起点（对齐到网格）
    this.x = snapToGrid(Math.random() * W)
    this.y = snapToGrid(Math.random() * H)

    // 随机初始方向
    const dir = DIRS[Math.floor(Math.random() * DIRS.length)]
    this.dx = dir.dx
    this.dy = dir.dy

    this.speed = 1.2 + Math.random() * 2.0   // 移动速度
    this.trail = []                            // 存储已经过的坐标（形成拖尾）
    this.maxTrail = 12 + Math.floor(Math.random() * 16) // 最大拖尾长度
    this.life = 0                              // 存活帧数
    this.maxLife = 200 + Math.floor(Math.random() * 300)
    this.turnTimer = 0                         // 转向计时
    this.turnInterval = GRID / this.speed      // 每走一格可能转向

    // 随机蓝紫深浅
    const hue = 200 + Math.floor(Math.random() * 60) // 200~260 蓝→紫
    this.h = hue
    this.brightness = 0.7 + Math.random() * 0.3
    this.W = W
    this.H = H
  }

  update() {
    this.life++
    this.turnTimer += this.speed

    // 每走 GRID 像素考虑转向
    if (this.turnTimer >= GRID) {
      this.turnTimer -= GRID
      // 30% 概率转向（不走回头路）
      if (Math.random() < 0.3) {
        const available = DIRS.filter(d => !(d.dx === -this.dx && d.dy === -this.dy))
        const newDir = available[Math.floor(Math.random() * available.length)]
        this.dx = newDir.dx
        this.dy = newDir.dy
      }
    }

    // 记录拖尾
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > this.maxTrail) this.trail.shift()

    // 移动
    this.x += this.dx * this.speed
    this.y += this.dy * this.speed

    // 边界反弹（对齐到网格再弹）
    if (this.x < 0 || this.x > this.W) {
      this.dx *= -1
      this.x = Math.max(0, Math.min(this.W, this.x))
    }
    if (this.y < 0 || this.y > this.H) {
      this.dy *= -1
      this.y = Math.max(0, Math.min(this.H, this.y))
    }

    return this.life < this.maxLife
  }

  draw(ctx) {
    const alpha = Math.min(1, (this.maxLife - this.life) / 60) * this.brightness

    // 绘制拖尾
    for (let i = 0; i < this.trail.length; i++) {
      const t = i / this.trail.length
      const trailAlpha = t * alpha * 0.6
      ctx.beginPath()
      ctx.arc(this.trail[i].x, this.trail[i].y, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${this.h}, 80%, 70%, ${trailAlpha})`
      ctx.fill()
    }

    // 绘制脉冲头（发光圆点）
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 8)
    grad.addColorStop(0, `hsla(${this.h}, 100%, 90%, ${alpha})`)
    grad.addColorStop(0.4, `hsla(${this.h}, 90%, 70%, ${alpha * 0.7})`)
    grad.addColorStop(1, `hsla(${this.h}, 80%, 60%, 0)`)
    ctx.beginPath()
    ctx.arc(this.x, this.y, 8, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    // 脉冲头核心高亮点
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${this.h}, 100%, 95%, ${alpha})`
    ctx.fill()
  }
}

const drawGrid = (ctx, W, H) => {
  // 绘制淡蓝色网格底线
  ctx.strokeStyle = LINE_COLOR
  ctx.lineWidth = 0.5

  for (let x = 0; x <= W; x += GRID) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = 0; y <= H; y += GRID) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  // 网格交叉点绘制小蓝点
  ctx.fillStyle = 'rgba(99, 179, 237, 0.08)'
  for (let x = 0; x <= W; x += GRID) {
    for (let y = 0; y <= H; y += GRID) {
      ctx.beginPath()
      ctx.arc(x, y, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

const PULSE_COUNT = 18

const initPulses = (canvas) => {
  pulses = []
  for (let i = 0; i < PULSE_COUNT; i++) {
    const p = new Pulse(canvas.width, canvas.height)
    // 让初始位置错开
    p.life = Math.floor(Math.random() * p.maxLife)
    pulses.push(p)
  }
}

const resizeCanvas = () => {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
  gridW = canvasRef.value.width
  gridH = canvasRef.value.height
  initPulses(canvasRef.value)
}

const animate = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // 清屏（带淡出拖尾：半透明深色覆盖）
  ctx.fillStyle = 'rgba(10, 10, 10, 0.18)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 画网格（每帧重绘确保网格不被拖尾遮挡）
  drawGrid(ctx, canvas.width, canvas.height)

  // 更新并绘制脉冲；死亡后重置
  for (let i = 0; i < pulses.length; i++) {
    const alive = pulses[i].update()
    pulses[i].draw(ctx)
    if (!alive) {
      pulses[i] = new Pulse(canvas.width, canvas.height)
    }
  }

  animationFrameId = requestAnimationFrame(animate)
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
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="page-view">
    <!-- 电路脉冲背景画布 -->
    <canvas ref="canvasRef" class="circuit-bg"></canvas>

    <div class="page-hero glass-hero">
      <div class="container">
        <span class="page-tag">{{ t('repo.tag') }}</span>
        <h1 class="page-title">{{ t('repo.title1') }} <span class="text-accent">{{ t('repo.title2') }}</span></h1>
        <p class="page-desc">{{ t('repo.desc') }}</p>
      </div>
    </div>

    <div class="page-content container relative-content">
      <div class="coming-soon">
        <div class="terminal-window glass-card">
          <div class="terminal-header glass-header">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">repository.sh</span>
          </div>
          <div class="terminal-body">
            <p class="terminal-line"><span class="prompt">$</span> git fetch --all...</p>
            <p class="terminal-line"><span class="prompt">$</span> <span class="text-accent-blue">REPO_STATUS: SYNCING</span></p>
            <p class="terminal-line"><span class="prompt">$</span> This section is currently under construction.</p>
            <p class="terminal-line blink"><span class="prompt">$</span> <span class="cursor">█</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面容器 */
.page-view {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 电路脉冲画布：铺满底层 */
.circuit-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* Hero 和内容区浮于画布之上 */
.page-hero,
.relative-content {
  position: relative;
  z-index: 1;
}

/* 玻璃态 Hero */
.page-hero {
  padding: 140px 0 60px;
  border-bottom: 1px solid rgba(99, 179, 237, 0.1);
  background: rgba(10, 10, 10, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.page-tag {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: #63b3ed; /* 蓝色标签 */
  letter-spacing: 3px;
  display: block;
  margin-bottom: var(--space-md);
}

.page-title {
  font-size: clamp(2rem, 7vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: var(--space-md);
  text-shadow: 0 0 30px rgba(99, 179, 237, 0.25);
}

/* 蓝色强调 */
.text-accent-blue {
  color: #63b3ed;
  text-shadow: 0 0 12px rgba(99, 179, 237, 0.4);
}

.page-desc {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 500px;
}

.page-content { padding: var(--space-4xl) var(--space-xl); }

.coming-soon {
  display: flex;
  justify-content: center;
  padding: var(--space-3xl) 0;
}

/* 玻璃态卡片（蓝色调） */
.glass-card {
  width: 100%;
  max-width: 600px;
  background: rgba(10, 18, 30, 0.55) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 179, 237, 0.2) !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(99, 179, 237, 0.04) inset;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 179, 237, 0.45) !important;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(99, 179, 237, 0.08) inset;
}

/* 蓝色扫光 */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(99, 179, 237, 0) 0%,
    rgba(99, 179, 237, 0.05) 50%,
    rgba(99, 179, 237, 0) 100%
  );
  transform: skewX(-25deg);
  animation: blue-shine 7s ease-in-out infinite;
  pointer-events: none;
}

@keyframes blue-shine {
  0%   { left: -100%; }
  20%  { left: 200%; }
  100% { left: 200%; }
}

.glass-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: rgba(99, 179, 237, 0.05) !important;
  border-bottom: 1px solid rgba(99, 179, 237, 0.12) !important;
}

.terminal-dot { width: 12px; height: 12px; border-radius: 50%; }
.terminal-dot.red    { background: #ff5f57; }
.terminal-dot.yellow { background: #ffbd2e; }
.terminal-dot.green  { background: #28c840; }
.terminal-title { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); margin-left: var(--space-md); }

.terminal-body {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.terminal-line {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.prompt  { color: #63b3ed; margin-right: var(--space-sm); }
.cursor  { animation: pulse 1s ease-in-out infinite; }
.blink   { animation: fadeIn 1s ease infinite alternate; }

/* 响应式 */
@media (max-width: 768px) {
  .page-hero    { padding: 100px 0 40px; }
  .page-content { padding: var(--space-2xl) var(--space-md); }
  .page-desc    { font-size: var(--text-base); }
  .terminal-body { padding: var(--space-md); }
}
</style>
