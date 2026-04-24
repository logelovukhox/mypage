<!--
  HomeView.vue - 首页视图
  首页由以下四个组件从上到下依次排列组成：
  1. HeroSection   - 英雄区：AI 徽章 + 大标题 + 芯片图 + CTA按钮
  2. FeatureCards   - 特色卡片区：三张能力展示卡片
  3. TechStack      - 技术栈区：技能进度条展示
-->
<script setup>
// 导入首页各个区块组件
import HeroSection from '../components/HeroSection.vue'   // 英雄区（首屏大图区域）
import FeatureCards from '../components/FeatureCards.vue'   // 特色能力卡片
import TechStack from '../components/TechStack.vue'         // 技术栈进度条
</script>

<template>
  <div class="home-view">
    <!-- 首屏英雄区 - 包含大标题、副标题、CTA按钮、芯片图片 -->
    <HeroSection />
    <!-- 三张特色卡片 - 全栈运维、LLM集成、C++工具开发 -->
    <FeatureCards />
    <!-- 技术栈展示 - 各技能的掌握程度进度条 -->
    <TechStack />
  </div>
</template>

<style scoped>
/* 防止水平溢出（某些动画元素可能超出视口） */
.home-view {
  overflow-x: hidden;
}
</style>
