/* 博客文章数据层：分类/tag/列表信息的唯一事实来源。
   发新文章时在数组顶部加一条记录（新文章排最前），字段说明：
   - slug:     文章文件名（不含 .html）
   - title:    标题（与文章页 <h1> 一致）
   - date:     发布日期，格式 YYYY-MM-DD
   - excerpt:  TL;DR 摘要（2-3 句完整句子，与正文开头 TL;DR 块内容一致；单句太短在列表里会像被截断）
   - category: 单值，只能是 Benchmark / Research / Opinion / Review 之一
   - tags:     关键词数组，英文小写，多词用连字符（如 "llm-agents"）
   注意：必须用 .js（window.POSTS）而非 .json，file:// 下浏览器拦截 fetch。 */
window.POSTS = [
  {
    slug: "conceptual-thinking-reflection",
    title: "Some of the Agent Era's Biggest Advances Are Conceptual, Not Technical: From MCP to Skills",
    date: "2026-07-26",
    excerpt: "Several of the Agent field's biggest recent advances—MCP, skills, the self-iterative agent—were conceptual syntheses, not technical inventions: someone gave a clear name to what everyone was already doing, and the field reorganized around it. Moving from the specific to the abstract is trained deliberately in economics and management, but rarely in STEM—and it is becoming a core research skill.",
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
