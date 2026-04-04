<!--
  App.vue - 根组件
  整个应用的外壳，包含三个主要部分：
  1. 导航栏（NavBar）- 固定在页面顶部
  2. 路由内容区（router-view）- 根据当前路径显示对应页面
  3. 页脚（FooterSection）- 固定在页面底部
-->
<script setup>
// 导入全局组件
import NavBar from './components/NavBar.vue'           // 顶部导航栏
import FooterSection from './components/FooterSection.vue' // 底部页脚
</script>

<template>
  <div class="app-wrapper">
    <!-- 扫描线覆盖层 - 模拟CRT显示器的扫描线效果，增加科技感 -->
    <!-- pointer-events: none 确保不影响点击交互 -->
    <div class="scanline-overlay"></div>
    
    <!-- 顶部导航栏组件 -->
    <NavBar />
    
    <!-- 主内容区域 -->
    <main>
      <!-- router-view 显示当前路由对应的页面组件 -->
      <!-- v-slot 获取当前渲染的组件，配合 transition 实现页面切换动画 -->
      <!-- mode="out-in" 表示旧页面先退出，新页面再进入 -->
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- 底部页脚组件 -->
    <FooterSection />
  </div>
</template>

<style scoped>
/* 应用外壳 */
.app-wrapper {
  position: relative;
  min-height: 100vh; /* 最小高度为视口高度 */
}

/* 扫描线覆盖层 - 用半透明横线模拟老式显示器效果 */
.scanline-overlay {
  position: fixed;         /* 固定定位，覆盖整个视口 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;    /* 不拦截鼠标事件 */
  z-index: 9999;           /* 最高层级，覆盖所有内容 */
  /* 重复的水平线条纹背景 */
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,   /* 极淡的黑色线条 */
    rgba(0, 0, 0, 0.03) 4px
  );
}

/* 主内容区域 */
main {
  min-height: 100vh; /* 确保内容区至少占满一屏 */
}
</style>
