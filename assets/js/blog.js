/* 博客列表页：渲染文章列表 + 分类/tag 组合过滤。
   数据来自 blog/posts.js 的 window.POSTS（必须先于本脚本加载）。
   过滤状态双向同步到 URL query：?cat=Opinion&tag=llm&tag=agents
   分类单选（All 为默认）；tag 多选，命中任一已选 tag 即显示；分类与 tag 取交集。 */
(function () {
  var CATEGORIES = ["Benchmark", "Research", "Opinion", "Review"];

  var posts = (window.POSTS || []).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });

  var filterBar = document.querySelector(".filter-bar");
  var listEl = document.querySelector(".post-list");
  if (!filterBar || !listEl) return;

  /* 从 URL 恢复过滤态 */
  var params = new URLSearchParams(location.search);
  var state = {
    cat: params.get("cat") || "",
    tags: params.getAll("tag").filter(Boolean)
  };
  if (state.cat && CATEGORIES.indexOf(state.cat) === -1) state.cat = "";

  /* 收集全部 tag（去重，按出现顺序） */
  var allTags = [];
  posts.forEach(function (p) {
    (p.tags || []).forEach(function (t) {
      if (allTags.indexOf(t) === -1) allTags.push(t);
    });
  });

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

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function renderFilterBar() {
    filterBar.innerHTML = "";

    var catRow = el("div", "filter-row");
    [""].concat(CATEGORIES).forEach(function (c) {
      var label = c === "" ? "All" : c;
      var btn = el("button", "cat-tab" + (state.cat === c ? " active" : ""), label);
      btn.type = "button";
      btn.setAttribute("data-cat", c);
      catRow.appendChild(btn);
    });
    filterBar.appendChild(catRow);

    if (allTags.length) {
      var tagRow = el("div", "filter-row");
      var label = el("span", "filter-label", "Tags:");
      tagRow.appendChild(label);
      allTags.forEach(function (t) {
        var on = state.tags.indexOf(t) !== -1;
        var btn = el("button", "tag-chip" + (on ? " active" : ""), t);
        btn.type = "button";
        btn.setAttribute("data-tag", t);
        tagRow.appendChild(btn);
      });
      filterBar.appendChild(tagRow);
    }
  }

  function renderList() {
    listEl.innerHTML = "";
    var shown = posts.filter(match);

    if (!shown.length) {
      var empty = el("li", "post-empty", "No posts match the current filters.");
      listEl.appendChild(empty);
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

      if (p.tags && p.tags.length) {
        var tagLine = el("div", "post-tags");
        p.tags.forEach(function (t) {
          var chip = el("a", "tag-chip", t);
          chip.href = "index.html?tag=" + encodeURIComponent(t);
          tagLine.appendChild(chip);
        });
        li.appendChild(tagLine);
      }

      li.appendChild(el("div", "post-excerpt", p.excerpt));
      listEl.appendChild(li);
    });
  }

  filterBar.addEventListener("click", function (e) {
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
    renderFilterBar();
    renderList();
  });

  renderFilterBar();
  renderList();
})();
