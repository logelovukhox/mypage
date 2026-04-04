// 路由配置文件 - 管理所有页面的路由规则
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // 首页（直接导入，不需要懒加载）

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式（URL中没有 # 号）
  history: createWebHistory(import.meta.env.BASE_URL),

  // 路由规则列表 - 在这里添加新页面
  routes: [
    {
      path: '/',          // 首页路径
      name: 'home',       // 路由名称（可用于 router.push({ name: 'home' })）
      component: HomeView,
    },
    {
      path: '/projects',  // 项目展示页（对应导航栏的 WORKS）
      name: 'projects',
      // 懒加载：访问时才加载组件，优化首屏性能
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/skills',    // 技能页（对应导航栏的 SKILLS）
      name: 'skills',
      component: () => import('../views/SkillsView.vue'),
    },
    {
      path: '/repository', // 代码仓库页（对应导航栏的 REPOSITORY）
      name: 'repository',
      component: () => import('../views/RepositoryView.vue'),
    },
    {
      path: '/network',    // 社交网络/博客页（对应导航栏的 NETWORK）
      name: 'network',
      component: () => import('../views/NetworkView.vue'),
    },
    {
      path: '/contact',    // 联系页面（对应导航栏的 CONTACT 按钮）
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
  ],

  // 滚动行为配置 - 控制路由切换时页面滚动位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition  // 浏览器后退时恢复之前的滚动位置
    }
    return { top: 0 }       // 默认滚动到页面顶部
  },
})

export default router
