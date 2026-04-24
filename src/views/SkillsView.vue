<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const agentSkills = [
  {
    title: 'Agent 架构设计',
    desc: '将复杂目标拆成 Planner、Executor、Reviewer 等角色，设计状态、记忆和任务边界。',
    tags: ['规划', '记忆', '状态机']
  },
  {
    title: '工具调用系统',
    desc: '把 API、数据库、浏览器和文件系统封装为可控工具，处理参数校验、权限和失败重试。',
    tags: ['Tool Calling', 'JSON Schema', '权限']
  },
  {
    title: 'RAG 检索增强',
    desc: '构建文档切片、向量召回、重排和引用链路，让回答能回到可验证资料。',
    tags: ['Embedding', 'Vector DB', 'Rerank']
  },
  {
    title: '多智能体协作',
    desc: '设计 Agent 间消息协议、任务交接和冲突处理，避免重复工作和无效循环。',
    tags: ['Supervisor', 'Worker', 'Review']
  },
  {
    title: '自动化工作流',
    desc: '把长任务拆入队列、回调和人工确认节点，适配异步执行与生产级观测。',
    tags: ['Workflow', 'Queue', 'HITL']
  },
  {
    title: '评测与安全',
    desc: '建立提示词回归集、工具调用日志、幻觉检查和越权防护，持续验证行为质量。',
    tags: ['Eval', 'Guardrail', 'Trace']
  }
]

const pipelineSteps = [
  '用户目标解析',
  '任务规划',
  '检索上下文',
  '工具调用',
  '结果校验',
  '结构化输出'
]

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
      <section class="agent-overview">
        <div class="overview-copy">
          <span class="eyebrow">AI AGENT STACK</span>
          <h2>从模型能力到可执行系统</h2>
          <p>
            我关注的不只是调用模型，而是把模型、工具、知识库和工作流组合成稳定可控的智能体系统。
          </p>
        </div>

        <div class="pipeline-card glass-card">
          <div class="pipeline-title">Agent 执行链路</div>
          <div class="pipeline-steps">
            <span v-for="step in pipelineSteps" :key="step" class="pipeline-step">{{ step }}</span>
          </div>
        </div>
      </section>

      <section class="skill-grid" aria-label="AI and agent skills">
        <article v-for="skill in agentSkills" :key="skill.title" class="skill-card glass-card">
          <div class="skill-card-top">
            <span class="skill-index">AI</span>
            <h3>{{ skill.title }}</h3>
          </div>
          <p>{{ skill.desc }}</p>
          <div class="skill-tags">
            <span v-for="tag in skill.tags" :key="tag">{{ tag }}</span>
          </div>
        </article>
      </section>
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
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.glass-card {
  width: 100%;
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

.agent-overview {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(360px, 1.1fr);
  gap: var(--space-xl);
  align-items: stretch;
}

.overview-copy {
  min-height: 260px;
  padding: var(--space-2xl);
  border-left: 2px solid var(--color-accent);
  background: linear-gradient(90deg, rgba(255, 107, 43, 0.08), transparent 70%);
}

.eyebrow,
.pipeline-title,
.skill-index,
.skill-tags span {
  font-family: var(--font-mono);
  letter-spacing: 1.5px;
}

.eyebrow {
  display: inline-block;
  color: var(--color-accent);
  font-size: var(--text-xs);
  margin-bottom: var(--space-md);
}

.overview-copy h2 {
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  line-height: 1.1;
  margin-bottom: var(--space-lg);
}

.overview-copy p {
  max-width: 560px;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.pipeline-card {
  min-height: 260px;
  padding: var(--space-2xl);
}

.pipeline-title {
  color: var(--color-text-primary);
  font-size: var(--text-base);
  margin-bottom: var(--space-xl);
}

.pipeline-steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.pipeline-step {
  min-height: 52px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-md);
  border: 1px solid rgba(255, 107, 43, 0.18);
  background: rgba(255, 107, 43, 0.05);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-xl);
}

.skill-card {
  min-height: 310px;
  padding: var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.skill-card-top {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-height: 104px;
}

.skill-index {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  border: 1px solid rgba(255, 107, 43, 0.32);
  background: rgba(255, 107, 43, 0.08);
}

.skill-card h3 {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  line-height: 1.35;
}

.skill-card p {
  min-height: 92px;
  color: var(--color-text-secondary);
  line-height: 1.75;
  font-size: var(--text-sm);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: auto;
}

.skill-tags span {
  min-width: 92px;
  text-align: center;
  color: var(--color-accent);
  font-size: 11px;
  border: 1px solid rgba(255, 107, 43, 0.2);
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.24);
}

/* 响应式 */
@media (max-width: 1100px) {
  .agent-overview {
    grid-template-columns: 1fr;
  }

  .skill-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-hero  { padding: 100px 0 40px; }
  .page-content { padding: var(--space-2xl) var(--space-md); }
  .page-desc  { font-size: var(--text-base); }
  .agent-overview,
  .skill-grid {
    grid-template-columns: 1fr;
  }
  .pipeline-steps {
    grid-template-columns: 1fr;
  }
}
</style>
