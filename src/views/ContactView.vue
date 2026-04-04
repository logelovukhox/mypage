<!--
  ContactView.vue - 联系页面
  功能：
  1. 页面顶部 Hero 区域（标题 + 描述）
  2. 左侧联系信息：邮箱、地址、状态 + 社交链接按钮
  3. 右侧联系表单：姓名、邮箱、主题、消息 + 提交
  4. 提交后显示成功消息（目前是模拟发送，需接入后端才能真正发邮件）
-->
<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ===== 表单数据 =====
const form = ref({
  name: '',       // 姓名
  email: '',      // 邮箱
  subject: '',    // 主题
  message: '',    // 消息内容
})

const submitted = ref(false) // 是否已提交成功
const sending = ref(false)   // 是否正在发送中

// 表单提交处理函数
// 目前是模拟发送（1.5秒延迟），接入后端时替换 setTimeout 中的逻辑
// 比如可以用 EmailJS、Formspree 等第三方服务，或自己的API
const handleSubmit = () => {
  sending.value = true
  // ===== 在这里替换为真实的发送逻辑 =====
  setTimeout(() => {
    sending.value = false
    submitted.value = true
    form.value = { name: '', email: '', subject: '', message: '' } // 重置表单
  }, 1500)
}

// ===== 联系信息配置 =====
// 修改这里来更改你的联系方式
const contactInfo = computed(() => [
  { label: t('contact.email'), value: '3507234307@qq.com', icon: '📧' },  // 邮箱
  { label: t('contact.location'), value: 'NingBo, China', icon: '📍' },      // 所在地
  { label: t('contact.status'), value: 'Studing', icon: '🟢' },   // 当前状态
])
</script>

<template>
  <div class="page-view">
    <!-- ===== 页面顶部 Hero 区域 ===== -->
    <div class="page-hero">
      <div class="container">
        <span class="page-tag">{{ t('contact.tag') }}</span>
        <h1 class="page-title">{{ t('contact.title1') }} <span class="text-accent">{{ t('contact.title2') }}</span></h1>
        <p class="page-desc">{{ t('contact.desc') }}</p>
      </div>
    </div>

    <!-- ===== 主内容区域 ===== -->
    <div class="contact-content container">
      <div class="contact-grid">
        <!-- ===== 左侧：联系信息 ===== -->
        <div class="contact-info">
          <h2 class="info-title">{{ t('contact.getInTouch') }}</h2>
          <p class="info-desc">
            {{ t('contact.getInTouchDesc') }}
          </p>

          <!-- 联系方式卡片列表 -->
          <div class="info-cards">
            <div v-for="info in contactInfo" :key="info.label" class="info-card">
              <span class="info-icon">{{ info.icon }}</span>
              <div>
                <span class="info-label">{{ info.label }}</span>
                <span class="info-value">{{ info.value }}</span>
              </div>
            </div>
          </div>

          <!-- 社交链接按钮 - 替换href为你自己的链接 -->
          <div class="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="social-link" id="social-github">
              GitHub ↗
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-link" id="social-linkedin">
              LinkedIn ↗
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="social-link" id="social-twitter">
              Twitter/X ↗
            </a>
          </div>
        </div>

        <!-- ===== 右侧：联系表单 ===== -->
        <div class="contact-form-wrapper">
          <!-- 提交成功后显示的消息 -->
          <div v-if="submitted" class="success-message">
            <div class="success-icon">✓</div>
            <h3>{{ t('contact.msgSent') }}</h3>
            <p>{{ t('contact.msgSentDesc') }}</p>
            <button @click="submitted = false" class="btn-reset">{{ t('contact.sendAnother') }}</button>
          </div>

          <!-- 联系表单 -->
          <!-- @submit.prevent 阻止默认提交行为，改用 handleSubmit 处理 -->
          <form v-else @submit.prevent="handleSubmit" class="contact-form" id="contact-form">
            <!-- 姓名输入框 -->
            <div class="form-group">
              <label for="name" class="form-label">{{ t('contact.nameLabel') }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                :placeholder="t('contact.namePlaceholder')"
                required
              />
            </div>
            <!-- 邮箱输入框 -->
            <div class="form-group">
              <label for="email" class="form-label">{{ t('contact.emailLabel') }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                :placeholder="t('contact.emailPlaceholder')"
                required
              />
            </div>
            <!-- 主题输入框 -->
            <div class="form-group">
              <label for="subject" class="form-label">{{ t('contact.subjLabel') }}</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="form-input"
                :placeholder="t('contact.subjPlaceholder')"
                required
              />
            </div>
            <!-- 消息文本框 -->
            <div class="form-group">
              <label for="message" class="form-label">{{ t('contact.msgLabel') }}</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-input form-textarea"
                :placeholder="t('contact.msgPlaceholder')"
                rows="5"
                required
              ></textarea>
            </div>
            <!-- 提交按钮 - 发送中时显示"TRANSMITTING..."并禁用 -->
            <button type="submit" class="btn-submit" id="btn-submit" :disabled="sending">
              <span v-if="sending" class="sending-text">{{ t('contact.transmitting') }}</span>
              <span v-else>{{ t('contact.transmit') }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 页面基础样式 ========== */
.page-view { min-height: 100vh; }

/* 页面顶部 Hero 区域 */
.page-hero {
  padding: 140px 0 60px;           /* 上方140px给导航栏留空间 */
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

/* "// CONTACT" 小标签 */
.page-tag {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-accent);
  letter-spacing: 3px;
  display: block;
  margin-bottom: var(--space-md);
}

/* 页面大标题 */
.page-title {
  font-size: clamp(2rem, 7vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: var(--space-md);
}

/* 页面描述 */
.page-desc {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 500px;
}

/* ========== 主内容区域 ========== */
.contact-content {
  padding: var(--space-4xl) var(--space-xl);
}

/* 两栏网格布局 */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
}

/* ========== 左侧联系信息 ========== */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.info-title {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: 2px;
}

.info-desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

/* 联系方式卡片列表 */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* 单个联系方式卡片 */
.info-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.info-card:hover {
  border-color: var(--color-border-accent); /* 悬停边框变橙 */
}

.info-icon {
  font-size: var(--text-2xl);
}

/* 标签（EMAIL/LOCATION等） */
.info-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 2px;
  display: block;
  margin-bottom: 2px;
}

/* 具体值 */
.info-value {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

/* 社交链接按钮组 */
.social-links {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.social-link {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.social-link:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
}

/* ========== 右侧联系表单 ========== */
/* 表单外层容器 */
.contact-form-wrapper {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
}

/* 表单布局 */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* 表单项（label + input 的容器） */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* 表单标签（NAME_/EMAIL_等） */
.form-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-accent);    /* 橙色标签 */
  letter-spacing: 2px;
}

/* 输入框通用样式 */
.form-input {
  background: var(--color-bg-primary);    /* 深色背景 */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast);
  outline: none;
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

/* 输入框聚焦状态 - 橙色边框 + 外发光 */
.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

/* 文本域特有样式 */
.form-textarea {
  resize: vertical;              /* 只允许垂直拖拽调整大小 */
  min-height: 120px;
}

/* 提交按钮 */
.btn-submit {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 2px;
  padding: var(--space-md) var(--space-xl);
  background: var(--color-accent);         /* 橙色实心背景 */
  color: var(--color-bg-primary);          /* 深色文字 */
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  cursor: pointer;
  border: none;
}

/* 按钮悬停效果 - 变亮 + 上浮 + 发光 */
.btn-submit:hover:not(:disabled) {
  background: var(--color-accent-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--color-accent-glow);
}

/* 按钮禁用状态（发送中） */
.btn-submit:disabled {
  opacity: 0.7;
  cursor: wait;
}

/* 发送中文字的脉冲动画 */
.sending-text {
  animation: pulse 1s ease-in-out infinite;
}

/* ========== 发送成功消息 ========== */
.success-message {
  text-align: center;
  padding: var(--space-3xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

/* 成功图标（绿色圆形 ✓） */
.success-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  color: #22c55e;
  border: 2px solid #22c55e;
  border-radius: 50%;
}

.success-message h3 {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  letter-spacing: 2px;
  color: #22c55e;
}

.success-message p {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

/* "再发一条"按钮 */
.btn-reset {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 2px;
  padding: var(--space-sm) var(--space-xl);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
  cursor: pointer;
  background: none;
}

.btn-reset:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* ========== 响应式 ========== */
/* 手机：单栏 */
@media (max-width: 768px) {
  .page-hero {
    padding: 100px 0 40px;
  }

  .contact-content {
    padding: var(--space-2xl) var(--space-md);
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }

  .contact-form-wrapper {
    padding: var(--space-lg);
  }

  .page-desc {
    font-size: var(--text-base);
  }

  .social-links {
    gap: var(--space-sm);
  }

  .social-link {
    font-size: var(--text-xs);
    padding: var(--space-xs) var(--space-md);
  }
}
</style>
