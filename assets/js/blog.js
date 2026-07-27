/* 博客侧边栏 + 列表过滤。
   数据来自 blog/posts.js 的 window.POSTS（必须先于本脚本加载）。
   两种模式：
   - 列表页（存在 .post-list）：侧边栏分类/tag 渲染为按钮，点击就地过滤，
     状态同步 URL query（?cat=Opinion&tag=llm），加载时从 URL 恢复。
   - 文章页（无 .post-list）：侧边栏渲染为普通链接，跳回列表页对应过滤态。
   分类单选（All 为默认）；tag 多选，命中任一已选 tag 即显示；分类与 tag 取交集。 */
(function () {
  var CATEGORIES = ["Benchmark", "Research", "Opinion", "Review"];

  var posts = (window.POSTS || []).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });

  var listEl = document.querySelector(".post-list");
  var navEl = document.querySelector(".blog-side-nav");
  var isIndex = !!listEl;

  /* 从 URL 恢复过滤态（仅列表页有意义） */
  var params = new URLSearchParams(location.search);
  var state = {
    cat: params.get("cat") || "",
    tags: params.getAll("tag").filter(Boolean)
  };
  if (state.cat && CATEGORIES.indexOf(state.cat) === -1) state.cat = "";

  /* 全部 tag（去重，按出现顺序） */
  var allTags = [];
  posts.forEach(function (p) {
    (p.tags || []).forEach(function (t) {
      if (allTags.indexOf(t) === -1) allTags.push(t);
    });
  });

  function countCat(c) {
    if (c === "") return posts.length;
    return posts.filter(function (p) { return p.category === c; }).length;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function syncURL() {
    var p = new URLSearchParams();
    if (state.cat) p.set("cat", state.cat);
    state.tags.forEach(function (t) { p.append("tag", t); });
    var qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  function match(p) {
    if (state.cat && p.category !== state.cat) return false;
    if (state.tags.length === 0) return true;
    return state.tags.some(function (t) { return (p.tags || []).indexOf(t) !== -1; });
  }

  /* 侧边栏：列表页渲染按钮（就地过滤），文章页渲染链接 */
  function renderSidebar() {
    if (!navEl) return;
    navEl.innerHTML = "";

    var catSec = el("div", "blog-side-section");
    catSec.appendChild(el("div", "blog-side-label", "Categories"));
    var catBox = el("div", "blog-side-cats");
    [""].concat(CATEGORIES).forEach(function (c) {
      var label = c === "" ? "All" : c;
      var item;
      if (isIndex) {
        item = el("button", "blog-side-cat" + (state.cat === c ? " active" : ""));
        item.type = "button";
        item.setAttribute("data-cat", c);
      } else {
        item = el("a", "blog-side-cat");
        item.href = c === "" ? "index.html" : "index.html?cat=" + encodeURIComponent(c);
      }
      item.appendChild(el("span", "", label));
      item.appendChild(el("span", "count", String(countCat(c))));
      catBox.appendChild(item);
    });
    catSec.appendChild(catBox);
    navEl.appendChild(catSec);

    if (allTags.length) {
      var tagSec = el("div", "blog-side-section");
      tagSec.appendChild(el("div", "blog-side-label", "Tags"));
      var tagBox = el("div", "blog-side-tags");
      allTags.forEach(function (t) {
        var on = state.tags.indexOf(t) !== -1;
        var chip;
        if (isIndex) {
          chip = el("button", "tag-chip" + (on ? " active" : ""), "#" + t);
          chip.type = "button";
          chip.setAttribute("data-tag", t);
        } else {
          chip = el("a", "tag-chip", "#" + t);
          chip.href = "index.html?tag=" + encodeURIComponent(t);
        }
        tagBox.appendChild(chip);
      });
      tagSec.appendChild(tagBox);
      navEl.appendChild(tagSec);
    }
  }

  function renderList() {
    listEl.innerHTML = "";
    var shown = posts.filter(match);

    if (!shown.length) {
      listEl.appendChild(el("li", "post-empty", "No posts match the current filters."));
      return;
    }

    shown.forEach(function (p) {
      var li = document.createElement("li");

      var a = el("a", "post-title", p.title);
      a.href = p.slug + ".html";
      li.appendChild(a);

      var meta = el("div", "post-meta");
      meta.appendChild(document.createTextNode(p.date + " · "));
      var catLink = el("a", "post-cat", p.category);
      catLink.href = "index.html?cat=" + encodeURIComponent(p.category);
      meta.appendChild(catLink);
      li.appendChild(meta);

      li.appendChild(el("div", "post-excerpt", p.excerpt));
      listEl.appendChild(li);
    });
  }

  renderSidebar();

  /* GoatCounter Top Viewed：公开 counter API 按文章拉计数，取前 5。
     路径必须与 GoatCounter 记录的一致（/siqi_du/blog/<slug>.html）。
     全部文章计数为 0 或请求失败时不渲染该板块；本地 file:// 跳过。 */
  var GC_CODE = "fourier7754";
  var GC_PATH_PREFIX = "/siqi_du/blog/";

  function renderTopViewed() {
    if (!navEl || !posts.length || location.protocol === "file:") return;
    Promise.all(posts.map(function (p) {
      var path = GC_PATH_PREFIX + p.slug + ".html";
      return fetch("https://" + GC_CODE + ".goatcounter.com/counter/" + encodeURIComponent(path) + ".json")
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          /* count 是带千分位逗号的格式化字符串（如 "1,234"），先剥离非数字再解析 */
          var n = j ? (parseInt(String(j.count).replace(/[^0-9]/g, ""), 10) || 0) : 0;
          return { post: p, n: n };
        })
        .catch(function () { return { post: p, n: 0 }; });
    })).then(function (rows) {
      var top = rows.filter(function (r) { return r.n > 0; })
        .sort(function (a, b) { return b.n - a.n; })
        .slice(0, 5);
      if (!top.length) return;
      var sec = el("div", "blog-side-section");
      sec.appendChild(el("div", "blog-side-label", "Top Viewed"));
      var box = el("div", "blog-side-top");
      top.forEach(function (r) {
        var a = el("a", "", r.post.title);
        a.href = r.post.slug + ".html";
        a.appendChild(el("span", "count", String(r.n)));
        box.appendChild(a);
      });
      sec.appendChild(box);
      navEl.insertBefore(sec, navEl.children[1] || null);
    }).catch(function () {});
  }

  renderTopViewed();

  if (isIndex) {
    var sidebar = document.querySelector(".blog-sidebar");
    if (sidebar) {
      sidebar.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        if (btn.hasAttribute("data-cat")) {
          state.cat = btn.getAttribute("data-cat");
        } else if (btn.hasAttribute("data-tag")) {
          var t = btn.getAttribute("data-tag");
          var i = state.tags.indexOf(t);
          if (i === -1) state.tags.push(t); else state.tags.splice(i, 1);
        }
        syncURL();
        renderSidebar();
        renderList();
      });
    }
    renderList();
  }
})();
