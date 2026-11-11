/* Detox landing loader for Tilda (build 74-a9068356).
   Tilda block T123 holds only:
     <div id="asj-detox"></div>
     <script src="https://<file hosting>/detox/loader.js"></script>
   This file adds the fonts and styles, puts the landing markup into #asj-detox and runs its scripts in order. */
(function () {
  if (window.ASJ_DETOX && window.ASJ_DETOX.loaded) return;
  var me = document.currentScript;
  var BASE = me.src.replace(/[?#].*$/, '').replace(/[^\/]*$/, '');
  var V = '__VERSION__';
  var cfg = {"leadEndpoint":"","tgBotUrl":"","waUrl":""};
  cfg.base = BASE; cfg.version = V; cfg.loaded = true;
  window.ASJ_DETOX = cfg;

  var root = document.getElementById('asj-detox');
  if (!root) { root = document.createElement('div'); root.id = 'asj-detox'; me.parentNode.insertBefore(root, me); }
  root.style.minHeight = '100vh'; root.style.background = '#f6f4f0';
  var head = document.head || document.getElementsByTagName('head')[0];

  function link(href, rel) {
    var l = document.createElement('link'); l.rel = rel; l.href = href;
    if (rel === 'preconnect') l.crossOrigin = '';
    head.appendChild(l); return l;
  }
  link('https://fonts.gstatic.com', 'preconnect');
  link('https://fonts.googleapis.com/css2?family=Vidaloka&family=Montserrat:wght@400;500;600;700&display=swap', 'stylesheet');
  var css = link(BASE + 'detox.css?v=' + V, 'stylesheet');
  var cssReady = new Promise(function (ok) { css.onload = ok; css.onerror = ok; setTimeout(ok, 8000); });

  function runScripts(list, i) {
    if (i >= list.length) { root.setAttribute('data-ready', V); fireHash(); return; }
    var old = list[i], s = document.createElement('script');
    for (var a = 0; a < old.attributes.length; a++) s.setAttribute(old.attributes[a].name, old.attributes[a].value);
    if (old.src) {
      s.onload = s.onerror = function () { runScripts(list, i + 1); };
      old.parentNode.replaceChild(s, old);
    } else {
      s.text = old.textContent;
      old.parentNode.replaceChild(s, old);
      runScripts(list, i + 1);
    }
  }
  // the page opened with #price etc.: scroll there once the landing is in place
  function fireHash() {
    var h = location.hash && location.hash.slice(1);
    var t = h && document.getElementById(decodeURIComponent(h));
    if (t) setTimeout(function () { t.scrollIntoView(); }, 50);
  }

  fetch(BASE + 'detox.html?v=' + V).then(function (r) {
    if (!r.ok) throw new Error('detox.html ' + r.status); return r.text();
  }).then(function (markup) {
    markup = markup.replace(/(["'(])img\//g, '$1' + BASE + 'img/');
    return cssReady.then(function () {
      root.innerHTML = markup;
      runScripts([].slice.call(root.querySelectorAll('script')), 0);
    });
  }).catch(function (e) {
    root.innerHTML = '<p style="font:16px/1.5 sans-serif;padding:40px 20px;text-align:center">Страница не загрузилась. Обновите её, пожалуйста.</p>';
    if (window.console) console.error('asj-detox', e);
  });
})();
