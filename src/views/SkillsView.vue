<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const canvasRef = ref(null)
let animationFrameId = null

// ===== Matrix 代码雨配置 =====
// 使用代码/十六进制/符号字符集，营造终端/黑客感
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]|/\\#$%&*=+-_.,:;?!@^~`\'\"01アイウエオカキクケコサシスセソ'
const FONT_SIZE = 14
const COLUMN_SPEED_MIN = 0.3
const COLUMN_SPEED_MAX = 1.2

let columns = []

class Column {
  constructor(x, canvasHeight) {
    this.x = x
    this.y = canvasHeight + Math.random() * canvasHeight  // 从屏幕底部随机位置开始
    this.speed = COLUMN_SPEED_MIN + Math.random() * (COLUMN_SPEED_MAX - COLUMN_SPEED_MIN)
    this.chars = []
    this.length = Math.floor(8 + Math.random() * 20) // 每列字符串的长度
    this.opacity = 0.4 + Math.random() * 0.6
    this.charTimer = 0
    this.charInterval = 3 + Math.floor(Math.random() * 5) // 每隔几帧换一个字符
    // 初始化字符串
    for (let i = 0; i < this.length; i++) {
      this.chars.push(CHARS[Math.floor(Math.random() * CHARS.length)])
    }
  }

  draw(ctx, canvasHeight) {
    this.charTimer++
    // 随机刷新某些字符，营造闪烁感
    if (this.charTimer >= this.charInterval) {
      this.charTimer = 0
      const idx = Math.floor(Math.random() * this.chars.length)
      this.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)]
    }

    for (let i = 0; i < this.chars.length; i++) {
      // 从下往上：头部在 y，尾部在 y + length*FONT_SIZE（在头部下方）
      const charY = this.y + i * FONT_SIZE
      if (charY < 0 || charY > canvasHeight) continue

      const ratio = 1 - i / this.length
      if (i === 0) {
        // 最头部：亮橙色
        ctx.fillStyle = `rgba(255, 200, 150, ${this.opacity})`
      } else if (i < 3) {
        // 靠近头部：橙色
        ctx.fillStyle = `rgba(255, 107, 43, ${this.opacity * ratio * 1.2})`
      } else {
        // 尾部：暗橙渐隐
        ctx.fillStyle = `rgba(180, 60, 10, ${this.opacity * ratio * 0.7})`
      }

      ctx.fillText(this.chars[i], this.x, charY)
    }

    // 向上移动
    this.y -= this.speed

    // 头部超出屏幕顶部（整列已消失）后重置到底部
    if (this.y + this.length * FONT_SIZE < 0) {
      this.y = canvasHeight + Math.random() * 200 + 50
      this.speed = COLUMN_SPEED_MIN + Math.random() * (COLUMN_SPEED_MAX - COLUMN_SPEED_MIN)
      this.length = Math.floor(8 + Math.random() * 20)
      this.opacity = 0.4 + Math.random() * 0.6
    }
  }
}

const initColumns = (canvas) => {
  columns = []
  const colCount = Math.floor(canvas.width / FONT_SIZE)
  for (let i = 0; i < colCount; i++) {
    const col = new Column(i * FONT_SIZE, canvas.height)
    // 初始化时将 y 随机分布在整个屏幕内，这样一打开就是满屏效果
    col.y = Math.random() * canvas.height
    columns.push(col)
  }
}

const resizeCanvas = () => {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
  initColumns(canvasRef.value)
}

const animate = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // 用半透明黑色覆盖，形成拖尾效果
  ctx.fillStyle = 'rgba(10, 10, 10, 0.12)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = `${FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`
  ctx.textAlign = 'center'

  for (const col of columns) {
    col.draw(ctx, canvas.height)
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
    <!-- Matrix 代码雨背景画布 -->
    <canvas ref="canvasRef" class="matrix-bg"></canvas>

    <div class="page-hero glass-hero">
      <div class="container">
        <h1 class="page-title">{{ t('skills.title1') }} <span class="text-accent">{{ t('skills.title2') }}</span></h1>
        <p class="page-desc">{{ t('skills.desc') }}</p>
      </div>
    </div>

    <div class="page-content container relative-content">
      <div class="coming-soon">
        <div class="terminal-window glass-card">
          <div class="terminal-header glass-header">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">skills.sh</span>
          </div>
          <div class="terminal-body">
            <p class="terminal-line"><span class="prompt">$</span> scanning skill modules...</p>
            <p class="terminal-line"><span class="prompt">$</span> <span class="text-accent">MANIFESTO_STATUS: COMPILING</span></p>
            <p class="terminal-line"><span class="prompt">$</span> This section is currently under construction.</p>
            <p class="terminal-line blink"><span class="prompt">$</span> <span class="cursor">█</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面容器，相对定位用于叠层 */
.page-view {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Matrix 画布：绝对定位铺满全屏，在最底层 */
.matrix-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* Hero 区域和内容区浮于画布之上 */
.page-hero,
.relative-content {
  position: relative;
  z-index: 1;
}

/* 玻璃态 Hero 区域 */
.page-hero {
  padding: 140px 0 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 10, 10, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.page-title {
  font-size: clamp(2rem, 7vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: var(--space-md);
  text-shadow: 0 0 30px rgba(255, 107, 43, 0.3);
}

.page-desc {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 500px;
}

.page-content {
  padding: var(--space-4xl) var(--space-xl);
}

.coming-soon {
  display: flex;
  justify-content: center;
  padding: var(--space-3xl) 0;
}

/* 玻璃态终端卡片 */
.glass-card {
  width: 100%;
  max-width: 600px;
  background: rgba(15, 15, 15, 0.5) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 43, 0.2) !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(255, 107, 43, 0.05) inset;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 107, 43, 0.4) !important;
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(255, 107, 43, 0.08) inset;
}

/* 玻璃卡片顶部扫光动画 */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 107, 43, 0) 0%,
    rgba(255, 107, 43, 0.04) 50%,
    rgba(255, 107, 43, 0) 100%
  );
  transform: skewX(-25deg);
  animation: orange-shine 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes orange-shine {
  0%   { left: -100%; }
  20%  { left: 200%; }
  100% { left: 200%; }
}

.glass-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: rgba(255, 107, 43, 0.04) !important;
  border-bottom: 1px solid rgba(255, 107, 43, 0.15) !important;
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

.prompt  { color: var(--color-accent); margin-right: var(--space-sm); }
.cursor  { animation: pulse 1s ease-in-out infinite; }
.blink   { animation: fadeIn 1s ease infinite alternate; }

/* 响应式 */
@media (max-width: 768px) {
  .page-hero  { padding: 100px 0 40px; }
  .page-content { padding: var(--space-2xl) var(--space-md); }
  .page-desc  { font-size: var(--text-base); }
  .terminal-body { padding: var(--space-md); }
}
</style>
