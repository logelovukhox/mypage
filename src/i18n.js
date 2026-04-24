import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      works: 'WORKS',
      skills: 'SKILLS',
      repository: 'REPOSITORY',
      network: 'NETWORK',
      contact: 'CONTACT'
    },
    hero: {
      title1: 'BUILDING THE',
      title2: 'FUTURE OF',
      titleAccent: 'COMPUTE',
      subtitle: 'Software Architect & Creative Engineer focusing on',
      subtitleAccent: 'AI-driven systems',
      subtitleEnd: 'and high-precision digital infrastructure.',
      initSequence: 'INIT_SEQUENCE',
      viewManifesto: 'VIEW_MANIFESTO'
    },
    features: {
      card1: {
        title: 'FULL-STACK OPS',
        desc: 'Designing resilient infrastructure with seamless deployment cycles and comprehensive monitoring pipelines.',
        tag: 'MODULE.22: T0:66'
      },
      card2: {
        title: 'LLM INTEGRATION',
        desc: 'Seamlessly embedding large language models with optimized token usage and prompt engineering workflows.',
        tag: 'MODULE.25: UC-68'
      },
      card3: {
        title: 'C++ TOOLING',
        desc: 'Building fast local tools in C++ for log analysis, file indexing, and workflow automation with low memory overhead.',
        tag: 'MODULE.13: 16:66'
      }
    },
    footer: {
      tagline1: 'Building the future of compute.',
      tagline2: 'One system at a time.',
      status: 'ALL SYSTEMS OPERATIONAL',
      nav: 'NAVIGATION',
      connect: 'CONNECT',
      resources: 'RESOURCES',
      rights: 'All rights reserved.',
      version: 'v2.0.26 // BUILD_STABLE',
      home: 'Home',
      works: 'Works',
      skills: 'Skills',
      repository: 'Repository',
      blog: 'Blog',
      resume: 'Resume',
      contact: 'Contact'
    },
    stats: {
      metrics: '// SYSTEM_METRICS',
      years: 'YEARS_EXP',
      projects: 'PROJECTS',
      uptime: 'UPTIME_%',
      commits: 'COMMITS'
    },
    tech: {
      tag: '// TECH_STACK',
      title1: 'CORE',
      title2: 'TECHNOLOGIES',
      desc: 'The tools and frameworks that power my digital infrastructure.',
      cat_frontend: 'FRONTEND',
      cat_backend: 'BACKEND',
      cat_ai: 'AI/ML',
      cat_lang: 'LANGUAGE',
      cat_devops: 'DEVOPS',
      cat_sys: 'SYSTEMS',
      cat_db: 'DATABASE'
    },
    contact: {
      tag: '// CONTACT',
      title1: 'ESTABLISH',
      title2: 'CONNECTION',
      desc: 'Ready to collaborate? Let\'s build the future together.',
      getInTouch: 'GET IN TOUCH',
      getInTouchDesc: 'I\'m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.',
      email: 'EMAIL',
      location: 'LOCATION',
      status: 'STATUS',
      nameLabel: 'NAME_',
      namePlaceholder: 'Enter your name',
      emailLabel: 'EMAIL_',
      emailPlaceholder: 'Enter your email',
      subjLabel: 'SUBJECT_',
      subjPlaceholder: 'What\'s this about?',
      msgLabel: 'MESSAGE_',
      msgPlaceholder: 'Write your message...',
      transmit: 'TRANSMIT_MESSAGE',
      transmitting: 'TRANSMITTING...',
      msgSent: 'MESSAGE_SENT',
      msgSentDesc: 'Your message has been transmitted successfully. I\'ll respond within 24 hours.',
      sendAnother: 'SEND_ANOTHER'
    },
    network: {
      tag: '// NETWORK',
      title1: 'DIGITAL',
      title2: 'NETWORK',
      desc: 'Blog posts, articles, and thought leadership content.',
      status: 'NETWORK_STATUS: CONNECTING',
      underConst: 'This section is currently under construction.',
      establishing: 'establishing connections...'
    },
    projects: {
      bread: 'SYSTEM_OUTPUT // FILE_EXPLORER',
      title1: 'WORKS_',
      title2: 'REPOSITORY',
      filter: 'FILTER:',
      filterAll: '[ ALL ]',
      filterAi: '[ AI_SYSTEMS ]',
      filterInfra: '[ INFRASTRUCTURE ]',
      filterVis: '[ VISUAL_ENGINES ]',
      filterQuant: '[ QUANTUM_LIB ]',
      viewSource: 'VIEW_SOURCE',
      propose: 'PROPOSE_MODULE',
      proj1_desc: 'Low-latency rendering architecture optimized for real-time data visualization and high-frequency neural network topology mapping. Built for speed and...',
      proj2_desc: 'Custom LLM orchestration layer designed for edge computing. Minimal footprint, maximal context retention through proprietary kinetic memory pooling.',
      proj3_desc: 'Distributed infrastructure management for large-scale microservice deployments. Features automated healing protocols and kinetic resource allocation.',
      proj4_desc: 'High-throughput streaming analytics platform. Capable of processing 10^7 events per second with sub-millisecond latency.',
      proj5_desc: 'Bare-metal communication protocol for heterogeneous compute clusters. Direct hardware memory access (RDMA) over custom fabric.'
    },
    repo: {
      tag: '// REPOSITORY',
      title1: 'CODE',
      title2: 'REPOSITORY',
      desc: 'Open source contributions and code archives.',
      status: 'REPO_STATUS: SYNCING',
      underConst: 'This section is currently under construction.',
      fetching: 'git fetch --all...'
    },
    skills: {
      tag: '// SKILLS',
      title1: 'TECH',
      title2: 'MANIFESTO',
      desc: 'Deep dive into my technical capabilities and expertise areas.',
      status: 'MANIFESTO_STATUS: COMPILING',
      underConst: 'This section is currently under construction.',
      scanning: 'scanning skill modules...'
    }
  },
  zh: {
    nav: {
      works: '项目',
      skills: '技能',
      repository: '仓库',
      network: '网络',
      contact: '联系我'
    },
    hero: {
      title1: '构建计算与',
      title2: '数字架构的',
      titleAccent: '未来',
      subtitle: '软件架构师与创意工程师，专注于',
      subtitleAccent: 'AI 驱动系统',
      subtitleEnd: '和高精度数字基础设施。',
      initSequence: '启动序列',
      viewManifesto: '查看宣言'
    },
    features: {
      card1: {
        title: '全栈运维',
        desc: '设计具有无缝部署周期和全面监控管道的弹性基础设施。',
        tag: '模块.22: T0:66'
      },
      card2: {
        title: '大语言模型集成',
        desc: '通过优化的 token 使用和提示词工程工作流，无缝嵌入大型语言模型。',
        tag: '模块.25: UC-68'
      },
      card3: {
        title: 'C++ 工具开发',
        desc: '用 C++ 构建日志分析、文件索引和本地自动化工具，重点关注启动速度与低内存占用。',
        tag: '模块.13: 16:66'
      }
    },
    footer: {
      tagline1: '构建计算的未来。',
      tagline2: '一个系统，一次进步。',
      status: '所有系统运行正常',
      nav: '导航',
      connect: '社交连接',
      resources: '相关资源',
      rights: '版权所有。',
      version: 'v2.0.26 // 稳定版构建',
      home: '主页',
      works: '项目成果',
      skills: '技术栈',
      repository: '代码仓库',
      blog: '博客',
      resume: '简历',
      contact: '联系我'
    },
    stats: {
      metrics: '// 系统_指标',
      years: '经验_年数',
      projects: '项目数量',
      uptime: '正常运行时间_%',
      commits: '代码提交'
    },
    tech: {
      tag: '// 技术_栈',
      title1: '核心',
      title2: '技术',
      desc: '驱动我数字基础设施的工具和框架。',
      cat_frontend: '前端',
      cat_backend: '后端',
      cat_ai: '人工智能',
      cat_lang: '编程语言',
      cat_devops: '开发运维',
      cat_sys: '系统架构',
      cat_db: '数据库'
    },
    contact: {
      tag: '// 联系_我',
      title1: '建立',
      title2: '联系',
      desc: '准备好合作了吗？让我们共创未来。',
      getInTouch: '保持联系',
      getInTouchDesc: '我非常期待讨论新项目、创意想法或参与您愿景的机会。',
      email: '邮箱',
      location: '位置',
      status: '状态',
      nameLabel: '姓名_',
      namePlaceholder: '输入您的名字',
      emailLabel: '邮箱_',
      emailPlaceholder: '输入您的邮箱',
      subjLabel: '主题_',
      subjPlaceholder: '有关什么事？',
      msgLabel: '内容_',
      msgPlaceholder: '写下您的留言...',
      transmit: '发送_留言',
      transmitting: '正在发送...',
      msgSent: '留言_已发送',
      msgSentDesc: '您的留言已成功传送，我将在 24 小时内回复。',
      sendAnother: '再发一条'
    },
    network: {
      tag: '// 社交_网络',
      title1: '数字',
      title2: '网络',
      desc: '博客文章、技术探讨和前沿思维内容分享。',
      status: '网络状态：连接中',
      underConst: '该版块正在施工中。',
      establishing: '建立连接中...'
    },
    projects: {
      bread: '系统_输出 // 文件_浏览器',
      title1: '项目_',
      title2: '仓库',
      filter: '过滤：',
      filterAll: '[ 全部 ]',
      filterAi: '[ AI系统 ]',
      filterInfra: '[ 基础设施 ]',
      filterVis: '[ 视觉引擎 ]',
      filterQuant: '[ 量子库 ]',
      viewSource: '查看_源码',
      propose: '提交_模块',
      proj1_desc: '低延迟渲染架构，针对实时数据可视化和高频神经网络拓扑映射进行了优化。专为速度构建...',
      proj2_desc: '专为边缘计算设计的定制 LLM 编排层。通过专有动力学内存池实现最小占用空间、最大保留上下文。',
      proj3_desc: '面向大规模微服务部署的分布式基础设施管理。具备自动愈合协议和动态资源分配功能。',
      proj4_desc: '高吞吐量流式分析平台。每秒可处理 10^7 个事件，延迟低于毫秒级别。',
      proj5_desc: '异构计算集群裸机通信协议。支持定制结构上的基于 RDMA 硬件内存直访。'
    },
    repo: {
      tag: '// 代码_仓库',
      title1: '代码',
      title2: '仓库',
      desc: '开源项目贡献与代码归档。',
      status: '仓库_状态：同步中',
      underConst: '本版块当前建设中。',
      fetching: '正在拉取全部 git 记录...'
    },
    skills: {
      tag: '// 技能',
      title1: '技术',
      title2: '宣言',
      desc: '深入探索我的技术能力与专长领域。',
      status: '宣言_状态：编译中',
      underConst: '该区块正在搭建。',
      scanning: '扫描技能模块中...'
    }
  }
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: localStorage.getItem('language') || 'en', // Default locale
  fallbackLocale: 'en',
  messages
})

export default i18n
