<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const canvasRef = ref(null)
let animationFrameId
let particles = []

// 粒子系统配置
const config = {
  particleCount: 80, // 粒子数量
  maxDistance: 150,  // 连线最大距离
  particleColor: 'rgba(100, 255, 218, 0.6)', // 粒子颜色（使用系统的主题色之一，如青色）
  lineColor: 'rgba(100, 255, 218, 0.2)',    // 连线颜色
  particleSpeed: 0.5 // 粒子运动速度
}

// 记录鼠标的位置用于交互
let mouse = {
  x: null,
  y: null,
  radius: 150
}

class Particle {
  constructor(x, y, dx, dy, radius) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = config.particleColor
    ctx.fill()
  }

  update(canvas, ctx) {
    // 边界检测反弹
    if (this.x > canvas.width || this.x < 0) this.dx = -this.dx
    if (this.y > canvas.height || this.y < 0) this.dy = -this.dy

    this.x += this.dx
    this.y += this.dy

    // 鼠标排斥交互（可选）
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        // 让粒子缓慢避开鼠标
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= forceDirectionX * force * 1;
        this.y -= forceDirectionY * force * 1;
      }
    }

    this.draw(ctx)
  }
}

const resizeCanvas = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }
}

const initParticles = (canvas) => {
  particles = []
  for (let i = 0; i < config.particleCount; i++) {
    const radius = Math.random() * 2 + 1
    const x = Math.random() * (canvas.width - radius * 2) + radius
    const y = Math.random() * (canvas.height - radius * 2) + radius
    const dx = (Math.random() - 0.5) * config.particleSpeed
    const dy = (Math.random() - 0.5) * config.particleSpeed
    particles.push(new Particle(x, y, dx, dy, radius))
  }
}

const animate = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(canvas, ctx)
  }

  // 绘制粒子之间的连线
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x
      const dy = particles[a].y - particles[b].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < config.maxDistance) {
        ctx.beginPath()
        // 距离越近线越不透明
        const opacity = (config.maxDistance - distance) / config.maxDistance * 0.5
        ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`
        ctx.lineWidth = 1
        ctx.moveTo(particles[a].x, particles[a].y)
        ctx.lineTo(particles[b].x, particles[b].y)
        ctx.stroke()
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const handleMouseMove = (event) => {
  mouse.x = event.x
  mouse.y = event.y
}

const handleMouseOut = () => {
  mouse.x = null
  mouse.y = null
}

onMounted(() => {
  if (canvasRef.value) {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)
    
    initParticles(canvasRef.value)
    animate()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseout', handleMouseOut)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="page-view relative-container">
    <!-- 动态粒子背景画布 -->
    <canvas ref="canvasRef" class="particles-bg"></canvas>

    <div class="page-hero glass-hero">
      <div class="container">
        <span class="page-tag">{{ t('network.tag') }}</span>
        <h1 class="page-title">{{ t('network.title1') }} <span class="text-accent">{{ t('network.title2') }}</span></h1>
        <p class="page-desc">{{ t('network.desc') }}</p>
      </div>
    </div>
    <div class="page-content container relative-content">
      <div class="coming-soon">
        <div class="terminal-window glass-card">
          <div class="terminal-header glass-header">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">network.sh</span>
          </div>
          <div class="terminal-body">
            <p class="terminal-line"><span class="prompt">$</span> establishing connections...</p>
            <p class="terminal-line"><span class="prompt">$</span> <span class="text-accent">NETWORK_STATUS: CONNECTING</span></p>
            <p class="terminal-line"><span class="prompt">$</span> This section is currently under construction.</p>
            <p class="terminal-line blink"><span class="prompt">$</span> <span class="cursor">█</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view { min-height: 100vh; position: relative; overflow: hidden; }

/* 动态粒子背景 */
.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none; /* 让鼠标事件透过画板 */
}

/* 保证内容层级在背景之上 */
.page-hero, .relative-content {
  position: relative;
  z-index: 1;
}

.page-hero {
  padding: 140px 0 60px;
  border-bottom: 1px solid rgba(100, 255, 218, 0.08);
  background: rgba(10, 10, 10, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 液态玻璃遮罩卡片 */
.glass-card {
  width: 100%;
  max-width: 600px;
  background: rgba(20, 25, 30, 0.4) !important; /* 半透明背景 */
  backdrop-filter: blur(16px); /* 玻璃模糊材质 */
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important; /* 微弱反光边缘 */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
  animation: glass-shine 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes glass-shine {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

/* 玻璃卡片的头部适配 */
.glass-header {
  display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-md) var(--space-lg);
  background: rgba(255, 255, 255, 0.03) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.page-tag { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-accent); letter-spacing: 3px; display: block; margin-bottom: var(--space-md); }
.page-title { font-size: clamp(2rem, 7vw, 3.5rem); font-weight: 900; letter-spacing: 2px; margin-bottom: var(--space-md); text-shadow: 0 0 20px rgba(100, 255, 218, 0.2); }
.page-desc { font-size: var(--text-lg); color: var(--color-text-secondary); max-width: 500px; }
.page-content { padding: var(--space-4xl) var(--space-xl); }
.coming-soon { display: flex; justify-content: center; padding: var(--space-3xl) 0; }
.terminal-dot { width: 12px; height: 12px; border-radius: 50%; }
.terminal-dot.red { background: #ff5f57; }
.terminal-dot.yellow { background: #ffbd2e; }
.terminal-dot.green { background: #28c840; }
.terminal-title { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); margin-left: var(--space-md); }
.terminal-body { padding: var(--space-xl); display: flex; flex-direction: column; gap: var(--space-sm); }
.terminal-line { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.8; }
.prompt { color: var(--color-accent); margin-right: var(--space-sm); }
.cursor { animation: pulse 1s ease-in-out infinite; }
.blink { animation: fadeIn 1s ease infinite alternate; }

/* 响应式适配 - 手机 */
@media (max-width: 768px) {
  .page-hero { padding: 100px 0 40px !important; }
  .page-content { padding: var(--space-2xl) var(--space-md); }
  .page-desc { font-size: var(--text-base); }
  .terminal-body { padding: var(--space-md); }
}
</style>
