/* 博客文章数据层：分类/tag/列表信息的唯一事实来源。
   发新文章时在数组顶部加一条记录（新文章排最前），字段说明：
   - slug:     文章文件名（不含 .html）
   - title:    标题（与文章页 <h1> 一致）
   - date:     发布日期，格式 YYYY-MM-DD
   - excerpt:  一两句摘要
   - category: 单值，只能是 Benchmark / Research / Opinion / Review 之一
   - tags:     关键词数组，英文小写，多词用连字符（如 "llm-agents"）
   注意：必须用 .js（window.POSTS）而非 .json，file:// 下浏览器拦截 fetch。 */
window.POSTS = [
  {
    slug: "conceptual-thinking-reflection",
    title: "A Reflection on Conceptual Thinking",
    date: "2026-07-26",
    excerpt: "On how the Agent field advances through conceptualization, and a skill that STEM training leaves out.",
    category: "Opinion",
    tags: ["reflection", "conceptual-thinking", "interdisciplinary", "agent-research"]
  },
  {
    slug: "hello-world",
    title: "Hello World",
    date: "2026-07-22",
    excerpt: "This blog is officially open. Notes on agent systems, AI4Science, and research workflows will appear here.",
    category: "Opinion",
    tags: ["meta"]
  }
];
