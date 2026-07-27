/* 页面切换：优雅淡出。拦截站内链接点击，先淡出再跳转。 */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a');
  if (!a) return;
  var href = a.getAttribute('href');
  if (!href || a.target === '_blank' || href.charAt(0) === '#' ||
      href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var url;
  try { url = new URL(href, location.href); } catch (err) { return; }
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.hash) return;
  e.preventDefault();
  document.body.classList.add('page-leave');
  setTimeout(function () { location.href = url.href; }, 180);
});

/* 浏览器前进/后退（bfcache）恢复时移除淡出状态 */
window.addEventListener('pageshow', function (e) {
  if (e.persisted) document.body.classList.remove('page-leave');
});

/* 代码块复制按钮：给 .post-body 内每个 pre 加右上角 Copy 按钮 */
document.querySelectorAll('.post-body pre').forEach(function (pre) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.textContent = 'Copy';
  btn.addEventListener('click', function () {
    var code = pre.querySelector('code');
    var text = (code || pre).textContent;
    function done() {
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { }
      document.body.removeChild(ta);
    }
  });
  pre.appendChild(btn);
});
