/* Gabryel Lopes portfolio: motion layer
   Same vocabulary used on the other sites: Lenis with a watchdog, reading bar,
   image curtain (portrait only), cursor spotlight, words lighting up and
   a light parallax. Everything animates transform and opacity only, so nothing
   pushes the layout, and it all switches off under prefers-reduced-motion. */
(function () {
  'use strict';

  var force = /[?&]animar=1/.test(location.search);
  if (force) document.documentElement.classList.add('force-motion');
  var less = !force && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BASE = '';
  var ticks = [];
  function runTicks() { for (var i = 0; i < ticks.length; i++) ticks[i](); }

  /* ---------- reading bar ---------- */
  var bar = document.createElement('i');
  bar.className = 'read-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var limit = 1;
  function measure() { limit = Math.max(1, document.documentElement.scrollHeight - innerHeight); }
  measure();
  addEventListener('resize', measure);

  /* ---------- per-frame effects: reading bar and a light parallax on covers ---------- */
  var parallax = less ? [] : [].slice.call(document.querySelectorAll('.case-cover img, .hero-photo img'));
  ticks.push(function () {
    var y = scrollY;
    bar.style.transform = 'scaleX(' + Math.min(1, y / limit).toFixed(4) + ')';
    for (var i = 0; i < parallax.length; i++) {
      var el = parallax[i], r = el.parentNode.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) continue;
      var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = 'translate3d(0,' + (p * -26).toFixed(1) + 'px,0) scale(1.06)';
    }
  });

  /* ---------- curtain over images, then the image settles from a slight zoom ---------- */
  if (!less) {
    var shots = document.querySelectorAll('.about-photo');
    shots.forEach(function (el) {
      el.classList.add('rv-img');
      var c = document.createElement('i');
      c.className = 'curtain';
      c.setAttribute('aria-hidden', 'true');
      el.appendChild(c);
    });
    if ('IntersectionObserver' in window) {
      var ioImg = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          ioImg.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
      shots.forEach(function (el) { ioImg.observe(el); });
    } else {
      shots.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- words light up as the line scrolls through ---------- */
  var lines = [].slice.call(document.querySelectorAll('.statement, #process h2, .tbar blockquote p'));
  if (!less && lines.length) {
    lines.forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
      el.classList.add('lit');
    });
    ticks.push(function () {
      lines.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var p = (innerHeight * 0.86 - r.top) / Math.max(1, r.height + innerHeight * 0.3);
        var ws = el.querySelectorAll('.w');
        var on = Math.round(Math.max(0, Math.min(1, p)) * ws.length);
        for (var i = 0; i < ws.length; i++) ws[i].classList.toggle('on', i < on);
      });
    });
  }

  /* ---------- spotlight following the cursor, pointer devices only ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !less) {
    document.querySelectorAll('.work, .up-card, .services li, .tquotes figure').forEach(function (card) {
      card.classList.add('spot');
      card.addEventListener('pointermove', function (ev) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      }, { passive: true });
    });
  }

  /* ---------- Lenis, with the watchdog that hands the scroll back if it breaks ---------- */
  var lenis = null;
  if (!less && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var s = document.createElement('script');
    s.src = BASE + 'assets/js/lenis.min.js?v=2';
    s.async = true;
    s.onload = function () {
      if (!window.Lenis) return;
      lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1
      });
      window.__lenis = lenis;
      (function raf(t) { if (lenis) lenis.raf(t); runTicks(); requestAnimationFrame(raf); })(0);
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (ev) {
          var id = a.getAttribute('href');
          if (id.length < 2 || !document.querySelector(id)) return;
          ev.preventDefault();
          /* #top é o cabeçalho fixo: rolar até ele não sai do lugar, então vai para o início da página */
          lenis.scrollTo(id === '#top' ? 0 : id, { offset: id === '#top' ? 0 : -76, duration: 1.1 });
        });
      });
      watch();
    };
    document.head.appendChild(s);
  }
  if (!lenis) (function own() { runTicks(); requestAnimationFrame(own); })();
  /* sem rolagem suave (movimento reduzido), o link para #top também precisa voltar ao início */
  document.querySelectorAll('a[href="#top"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      if (window.__lenis) return;
      ev.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  function watch() {
    var acc = 0, y0 = null;
    function zero() { acc = 0; y0 = null; }
    addEventListener('wheel', function (e) {
      if (!lenis || lenis.isStopped) return zero();
      var max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      var y = scrollY;
      if ((e.deltaY > 0 && y >= max - 2) || (e.deltaY < 0 && y <= 2)) return zero();
      if (y0 === null) y0 = y;
      else if (Math.abs(y - y0) >= 2) return zero();
      acc += Math.abs(e.deltaY);
      if (acc < 250) return;
      var start = y0;
      zero();
      setTimeout(function () {
        if (!lenis || lenis.isStopped) return;
        if (Math.abs(scrollY - start) >= 2) return;
        lenis.destroy(); lenis = null; window.__lenis = null;
        document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling');
        document.documentElement.style.scrollBehavior = 'auto';
      }, 400);
    }, { passive: true });
  }
})();
