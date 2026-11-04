/* Gabryel Lopes portfolio: interactions */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;
  var BASE = '';

  /* ---------- nav border after the hero ---------- */
  var nav = document.querySelector('.nav');

  /* ---------- reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- videos load only when they reach the screen ---------- */
  var vids = [].slice.call(document.querySelectorAll('video.lazy-video'));
  vids.forEach(function (v) { v.muted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.playsInline = true; });
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.load(); }
          if (!reduce && v.hasAttribute('autoplay')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { vo.observe(v); });
  } else {
    vids.forEach(function (v) { v.src = v.dataset.src; });
  }

  /* ---------- email concepts: built from one list ---------- */
  var concepts = [
    ['hs-winter', 'Happy Staffy Co', 'Winter cross-sell'],
    ['hs-restock', 'Happy Staffy Co', 'Back in stock'],
    ['01', 'Aurelia Fine Jewelry', 'Jewelry'],
    ['02', 'Barkwell', 'Fresh dog food'],
    ['03', 'NORDVIK', 'Apparel'],
    ['04', 'GLOWLAB', 'Skincare'],
    ['05', 'VERDE', 'Cold-press juice'],
    ['06', 'Maison Noctambule', 'Fragrance'],
    ['07', 'SOLSTICE', 'Self-tan'],
    ['08', 'Vitalis', 'Wellness'],
    ['09', 'Harper & Gray', 'Real estate'],
    ['10', 'Northline Advisory', 'Professional services'],
    ['11', 'Meridian Residences', 'Property launch'],
    ['12', 'Ember Coffee Co', 'Coffee'],
    ['13', 'LUMEN Optics', 'Eyewear'],
    ['14', 'KIND CREW', 'Kidswear'],
    ['15', 'OAK & ASHER', 'Furniture'],
    ['16', 'VOLTA Audio', 'Electronics'],
    ['17', 'HEARTH', 'Candles'],
    ['18', 'PULSE Studio', 'Fitness'],
    ['19', 'Bright Lane Dental', 'Dental'],
    ['20', 'SAVEUR', 'Meal kit']
  ];
  var list = document.getElementById('concepts');
  if (list) {
    list.innerHTML = concepts.map(function (c) {
      return '<li><a class="concept" href="https://gabryel-lopes-portfolio.vercel.app" target="_blank" rel="noopener">' +
        '<div class="concept-frame"><img loading="lazy" src="' + BASE + 'assets/img/email/' + c[0] + '.jpg" alt="' + c[1] + ' email" width="640"></div>' +
        '<p class="concept-cap"><b>' + c[1] + '</b><span>' + c[2] + '</span></p></a></li>';
    }).join('');
  }

  /* ---------- before / after ---------- */
  var cmp = document.getElementById('compare');
  if (cmp) {
    var range = cmp.querySelector('.ba-range');
    var before = cmp.querySelector('.ba-before');
    var after = cmp.querySelector('.ba-after');
    range.addEventListener('input', function () { cmp.style.setProperty('--pos', range.value + '%'); });
    var tabs = [].slice.call(document.querySelectorAll('.compare-tabs button'));
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', t === b ? 'true' : 'false'); });
        var k = b.dataset.ba;
        before.src = BASE + 'assets/img/ba/' + k + '-before.jpg';
        after.src = BASE + 'assets/img/ba/' + k + '-after.jpg';
        range.value = 50;
        cmp.style.setProperty('--pos', '50%');
      });
    });
  }

  /* ---------- pinned email player (desktop) ---------- */
  var player = document.getElementById('player');
  var frame = player && player.querySelector('.email-frame');
  var longImg = player && player.querySelector('.email-long');
  var bar = player && player.querySelector('.player-bar i');
  var pinned = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
  var lastY = -1, lastBar = -1;

  function drawPlayer() {
    if (!player) return;
    if (!pinned.matches) {
      if (lastY !== -1) { longImg.style.transform = ''; lastY = -1; }
      return;
    }
    var r = player.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.bottom < -100 || r.top > vh + 100) return;
    var travel = player.offsetHeight - vh;
    var p = travel > 0 ? -r.top / travel : 0;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    var over = longImg.offsetHeight - frame.clientHeight;
    var y = over > 0 ? Math.round(-p * over) : 0;
    if (y !== lastY) { longImg.style.transform = 'translate3d(0,' + y + 'px,0)'; lastY = y; }
    var b = Math.round(p * 1000) / 1000;
    if (bar && b !== lastBar) { bar.style.transform = 'scaleX(' + b + ')'; lastBar = b; }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
      drawPlayer();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (longImg) longImg.addEventListener('load', onScroll);
  onScroll();
})();

/* ---------- tema claro / escuro + pilulas da navegacao ---------- */
(function () {
  'use strict';
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');

  function paint() {
    var claro = root.getAttribute('data-theme') === 'light';
    if (btn) {
      btn.setAttribute('aria-pressed', claro ? 'true' : 'false');
      var en = /^en/.test(root.lang);
      btn.setAttribute('aria-label', claro ? (en ? 'Switch to dark mode' : 'Mudar para o modo escuro') : (en ? 'Switch to light mode' : 'Mudar para o modo claro'));
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', claro ? '#F3F6FC' : '#070B18');
  }
  paint();

  if (btn) btn.addEventListener('click', function () {
    var claro = root.getAttribute('data-theme') === 'light';
    if (claro) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'light');
    try { localStorage.setItem('tema', claro ? 'escuro' : 'claro'); } catch (e) {}
    paint();
  });

  /* a pilula ativa acompanha a secao que esta na tela */
  var pills = [].slice.call(document.querySelectorAll('.nav-pills a'));
  if (!pills.length) return;
  var alvos = pills.map(function (a) {
    var id = a.getAttribute('href');
    return id === '#top' ? document.body : document.querySelector(id);
  });
  function marcar(i) {
    pills.forEach(function (a, n) { a.classList.toggle('is-active', n === i); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = alvos.indexOf(e.target);
        if (i > -1) marcar(i);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    alvos.forEach(function (el, i) { if (el && i > 0) io.observe(el); });
    addEventListener('scroll', function () {
      /* de volta ao topo: enquanto a primeira seção ainda não chegou ao meio da tela, a pílula ativa é Início */
      if (!alvos[1] || alvos[1].getBoundingClientRect().top > innerHeight * .5) marcar(0);
    }, { passive: true });
  }
})();

/* ---------- hero: nome encaixado na largura e descendo sobre a foto fixa ---------- */
(function () {
  'use strict';
  var sec = document.querySelector('.hero-n');
  if (!sec) return;
  var stage = sec.querySelector('.hero-stage'), name = sec.querySelector('.name-move');
  var svg = name.querySelector('.fit-svg'), txt = svg.querySelector('text');
  var panel = sec.querySelector('.hero-panel');

  /* recorta o viewBox na tinta das letras para o nome ir de borda a borda */
  function encaixar() {
    var cs = getComputedStyle(txt), size = 100;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = cs.fontWeight + ' ' + size + 'px ' + cs.fontFamily;
    if ('letterSpacing' in ctx) ctx.letterSpacing = (parseFloat(cs.letterSpacing) || 0) + 'px';
    var m = ctx.measureText(txt.textContent);
    txt.setAttribute('font-size', size); txt.setAttribute('x', 0); txt.setAttribute('y', 0);
    var l = m.actualBoundingBoxLeft || 0, r = m.actualBoundingBoxRight || m.width;
    var up = m.actualBoundingBoxAscent || size * .72, dn = m.actualBoundingBoxDescent || 0;
    svg.setAttribute('viewBox', [-l, -up, l + r, up + dn].join(' '));
    letras(ctx, size, l, r, up, dn);
    stage.style.setProperty('--nh', name.getBoundingClientRect().height + 'px');
  }

  /* entrada: cada letra sobe de trás da linha de base, uma depois da outra */
  var NS = 'http://www.w3.org/2000/svg', grupo = null;
  function letras(ctx, size, l, r, up, dn) {
    var frase = txt.textContent;
    if (!grupo) {
      var defs = document.createElementNS(NS, 'defs'), cp = document.createElementNS(NS, 'clipPath');
      cp.id = 'nome-corte';
      cp.appendChild(document.createElementNS(NS, 'rect'));
      defs.appendChild(cp);
      svg.insertBefore(defs, svg.firstChild);
      grupo = document.createElementNS(NS, 'g');
      grupo.setAttribute('clip-path', 'url(#nome-corte)');
      for (var i = 0, k = 0; i < frase.length; i++) {
        if (frase[i] === ' ') continue;
        var t = document.createElementNS(NS, 'text');
        t.setAttribute('class', 'nome-l');
        t.style.setProperty('--i', k++);
        t.textContent = frase[i];
        grupo.appendChild(t);
      }
      svg.appendChild(grupo);
      txt.style.visibility = 'hidden';
    }
    var rc = svg.querySelector('#nome-corte rect');
    rc.setAttribute('x', -l - 40); rc.setAttribute('y', -up - 40);
    rc.setAttribute('width', l + r + 80); rc.setAttribute('height', up + dn + 40);
    var ls = grupo.children, j = 0;
    for (var n = 0; n < frase.length; n++) {
      if (frase[n] === ' ') continue;
      ls[j].setAttribute('font-size', size);
      ls[j].setAttribute('x', ctx.measureText(frase.slice(0, n)).width.toFixed(2));
      ls[j].setAttribute('y', 0);
      j++;
    }
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { encaixar(); copiar(); altura(); quadro(); });
  encaixar();

  /* cópia azul do nome, recortada só no trecho que está sobre a foto (por trás dele) */
  var azul = name.cloneNode(true);
  azul.classList.add('name-azul');
  azul.setAttribute('aria-hidden', 'true');
  var sr = azul.querySelector('.sr-only'); if (sr) sr.remove();
  var cpA = azul.querySelector('clipPath'); if (cpA) cpA.id = 'nome-corte-azul';
  var gA = azul.querySelector('g[clip-path]'); if (gA) gA.setAttribute('clip-path', 'url(#nome-corte-azul)');
  name.parentNode.insertBefore(azul, name.nextSibling);
  function copiar() {
    var sv = azul.querySelector('.fit-svg');
    sv.setAttribute('viewBox', svg.getAttribute('viewBox'));
    var r1 = svg.querySelector('#nome-corte rect'), r2 = sv.querySelector('clipPath rect');
    if (r1 && r2) ['x', 'y', 'width', 'height'].forEach(function (k) { r2.setAttribute(k, r1.getAttribute(k)); });
    var a = svg.querySelectorAll('.nome-l'), b = sv.querySelectorAll('.nome-l');
    for (var i = 0; i < a.length && i < b.length; i++) {
      b[i].setAttribute('x', a[i].getAttribute('x'));
      b[i].setAttribute('font-size', a[i].getAttribute('font-size'));
    }
  }
  function recortar(ty) {
    var y = panel.offsetTop - (name.offsetTop + ty);
    azul.style.clipPath = 'inset(' + Math.max(0, y).toFixed(1) + 'px 0 0 0)';
    /* o nome claro some onde o azul cobre: com os dois empilhados, a borda suavizada do azul deixava um fio claro nas letras */
    var embaixo = y <= 0 ? name.offsetHeight + 400 : Math.max(-200, name.offsetHeight - y - 1);
    name.style.clipPath = 'inset(-200px -200px ' + embaixo.toFixed(1) + 'px -200px)';
  }
  recortar(0);

  /* no celular o nome para no meio do pescoço (37% da altura da foto) e a rolagem é liberada ali,
     antes de ele chegar ao fim da foto, onde já não dá para ler */
  function pescoco() {
    if (innerWidth >= 768) return null;
    var img = panel.querySelector('img'), iw = img.naturalWidth || 2844, ih = img.naturalHeight || 1600;
    var s = Math.max(panel.offsetWidth / iw, panel.offsetHeight / ih);
    var y = (panel.offsetHeight - ih * s) * .18 + ih * .37 * s; /* .18 = object-position do celular */
    return Math.max(0, panel.offsetTop + y - (name.offsetTop + name.offsetHeight / 2));
  }
  /* mantém a mesma velocidade de antes: 1,4px de rolagem para cada 1px que o nome desce */
  function altura() {
    var f = pescoco();
    sec.style.height = f === null ? '' : Math.round(stage.offsetHeight + f * 1.4) + 'px';
  }

  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]animar=1/.test(location.search);
  function quadro() {
    if (reduz) { recortar(0); return; }
    var r = sec.getBoundingClientRect();
    var curso = Math.max(1, sec.offsetHeight - stage.offsetHeight);
    var p = Math.min(1, Math.max(0, -r.top / curso));
    /* o nome e o bloco do que eu faco descem juntos ate o fim da foto */
    var lados = stage.querySelectorAll('.hero-side'), base = name.offsetTop + name.offsetHeight + 12;
    for (var i = 0; i < lados.length; i++) {
      if (lados[i].offsetParent) base = Math.max(base, lados[i].offsetTop + lados[i].offsetHeight + 36);
    }
    var fim = Math.max(0, panel.offsetTop + panel.offsetHeight - base);
    var lim = pescoco(); if (lim !== null) fim = Math.min(fim, lim);
    var ty = 'translate3d(0,' + (p * fim).toFixed(1) + 'px,0)';
    recortar(p * fim);
    var mov = stage.querySelectorAll('.name-move, .hero-move');
    for (var k = 0; k < mov.length; k++) {
      if (p > 0) mov[k].classList.add('is-live');
      mov[k].style.transform = ty;
    }
  }
  addEventListener('scroll', function () { requestAnimationFrame(quadro); }, { passive: true });
  addEventListener('resize', function () { encaixar(); copiar(); altura(); quadro(); });
})();

/* ---------- Previa dos trabalhos: fileiras andam em sentidos opostos com a rolagem ---------- */
(function () {
  var reel = document.querySelector('.reel');
  if (!reel) return;
  var tracks = reel.querySelectorAll('.reel-track');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]animar=1/.test(location.search)) return;
  var alvo = 0, atual = null, rodando = false;
  function medir() {
    var r = reel.getBoundingClientRect();
    /* zera quando a faixa esta no meio da tela */
    alvo = ((innerHeight + reel.offsetHeight) / 2 - (innerHeight - r.top)) * 0.32;
  }
  function pintar(x) {
    tracks[0].style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    tracks[1].style.transform = 'translate3d(' + (-x).toFixed(2) + 'px,0,0)';
  }
  function passo() {
    atual += (alvo - atual) * 0.1;
    pintar(atual);
    if (Math.abs(alvo - atual) > 0.05) requestAnimationFrame(passo); else rodando = false;
  }
  function mexer() {
    medir();
    if (atual === null) { atual = alvo; pintar(atual); return; }
    if (!rodando) { rodando = true; requestAnimationFrame(passo); }
  }
  addEventListener('scroll', mexer, { passive: true });
  addEventListener('resize', mexer);
  mexer();
})();

/* ---------- Trabalhos: cada capa abre o dialog com a marca e as pecas ---------- */
(function () {
  var dlg = document.getElementById('work-dialog');
  if (!dlg || !dlg.showModal) return;
  var body = dlg.querySelector('.wd-body');
  var root = document.documentElement;
  var origem = null;

  function abrir(slug, card) {
    var tpl = document.getElementById('wt-' + slug);
    if (!tpl) return;
    body.replaceChildren(tpl.content.cloneNode(true));
    origem = card || null;
    root.classList.add('wd-open');
    /* o Lenis segura a roda do mouse; o dialog tem data-lenis-prevent e a pagina fica parada atras */
    if (window.__lenis) window.__lenis.stop();
    dlg.showModal();
    dlg.scrollTop = 0;
    var pre = /^en/.test(document.documentElement.lang) ? '#work-' : '#trabalho-';
    if (location.hash !== pre + slug) history.replaceState(null, '', pre + slug);
  }

  document.querySelectorAll('.wk[data-work]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      abrir(a.dataset.work, a);
    });
  });
  dlg.querySelector('.wd-close').addEventListener('click', function () { dlg.close(); });
  /* clique fora do painel fecha */
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () {
    if (dlg.open) return; /* fechou e ja abriu outro no mesmo instante */
    root.classList.remove('wd-open');
    if (window.__lenis) window.__lenis.start();
    history.replaceState(null, '', location.pathname + location.search + '#portfolio');
    if (origem) origem.focus({ preventScroll: true });
  });

  var m = location.hash.match(/^#(?:trabalho|work)-([\w-]+)$/);
  if (m) abrir(m[1], document.querySelector('.wk[data-work="' + m[1] + '"]'));
})();


/* passo a passo em régua: a rolagem escolhe o passo do centro */
(function () {
  var r = document.querySelector('.ruler');
  if (!r) return;
  var stage = r.querySelector('.ruler-stage');
  var items = r.querySelectorAll('.ruler-item'), texts = r.querySelectorAll('.ruler-text');
  var n = items.length, cur = -1;

  function marcar(i) {
    if (i === cur) return;
    cur = i;
    r.style.setProperty('--i', i);
    for (var k = 0; k < n; k++) {
      items[k].classList.toggle('is-on', k === i);
      texts[k].classList.toggle('is-on', k === i);
      var b = items[k].querySelector('button');
      if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    }
  }
  function medir() {
    var topo = parseFloat(getComputedStyle(stage).top) || 0;
    return { topo: topo, curso: r.offsetHeight - stage.offsetHeight };
  }
  function rolar() {
    var m = medir(), y = topo0() - m.topo;
    var p = m.curso > 0 ? Math.min(1, Math.max(0, -y / m.curso)) : 0;
    marcar(Math.min(n - 1, Math.floor(p * n)));
  }
  function topo0() { return r.getBoundingClientRect().top; }

  r.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-step]');
    if (!b) return;
    var m = medir(), k = +b.getAttribute('data-step');
    var alvo = window.scrollY + topo0() - m.topo + (k + .5) / n * m.curso;
    if (window.__lenis) window.__lenis.scrollTo(alvo); else window.scrollTo({ top: alvo, behavior: 'smooth' });
  });
  addEventListener('scroll', rolar, { passive: true });
  addEventListener('resize', rolar);
  rolar();
})();


/* SKU: túnel em perspectiva. A rolagem leva a câmera para dentro e os cards passam por ela */
(function () {
  var sec = document.getElementById('sku');
  if (!sec) return;
  var cards = [].slice.call(sec.querySelectorAll('.sku-card'));
  var centro = sec.querySelector('.sku-center');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]animar=1/.test(location.search)) {
    sec.classList.add('is-static');
    sec.querySelectorAll('img[data-src]').forEach(function (im) { im.src = im.getAttribute('data-src'); });
    return;
  }
  /* as imagens só carregam quando o túnel chega perto (o lazy nativo não enxerga cards em 3D) */
  var carregou = false;
  function carregar() {
    if (carregou) return;
    carregou = true;
    sec.querySelectorAll('img[data-src]').forEach(function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { carregar(); io.disconnect(); } }, { rootMargin: '150% 0px' });
    io.observe(sec);
  } else carregar();
  var GAP = 260, n = cards.length, CURSO = n * GAP + 1300;
  var pos = cards.map(function (c, i) {
    var a = i * 2.39996;                       /* ângulo de ouro, espalha sem repetir */
    var r = .62 + .38 * Math.abs(Math.sin(i * 1.7));
    return { a: a, r: r, rot: (i % 2 ? -1 : 1) * (3 + (i * 2) % 9) };
  });
  var alvo = 0, atual = 0, raf = 0, W = 0, H = 0;

  function medir() { W = innerWidth; H = innerHeight; }
  function progresso() {
    var r = sec.getBoundingClientRect(), curso = sec.offsetHeight - H;
    return curso > 0 ? Math.min(1, Math.max(0, -r.top / curso)) : 0;
  }
  function pintar(p) {
    /* em tela estreita ou em pé, a espiral abre mais para não cobrir o texto do centro */
    var estreita = W < 900 || H > W;
    var rx = estreita ? W * .54 : Math.min(W * .36, 620), ry = estreita ? H * .36 : Math.min(H * .3, 300);
    for (var i = 0; i < n; i++) {
      var z = -900 - i * GAP + p * CURSO;
      var op = Math.min(1, Math.max(0, (z + 2300) / 500)) * Math.min(1, Math.max(0, (950 - z) / 450));
      var c = cards[i], q = pos[i];
      if (op <= 0) { if (c.style.visibility !== 'hidden') c.style.visibility = 'hidden'; continue; }
      c.style.visibility = 'visible';
      c.style.opacity = op.toFixed(3);
      c.style.zIndex = Math.round(z + 3000);
      c.style.transform = 'translate3d(' + (Math.cos(q.a) * rx * q.r).toFixed(1) + 'px,' + (Math.sin(q.a) * ry * q.r).toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateZ(' + q.rot + 'deg)';
    }
    centro.style.opacity = Math.max(.12, 1 - p * 2.2).toFixed(3);
    centro.style.transform = 'scale(' + (1 - p * .08).toFixed(4) + ')';
  }
  function passo() {
    atual += (alvo - atual) * .1;
    if (Math.abs(alvo - atual) < .0004) atual = alvo;
    pintar(atual);
    raf = atual !== alvo ? requestAnimationFrame(passo) : 0;
  }
  function rolar() { alvo = progresso(); if (!raf) raf = requestAnimationFrame(passo); }
  medir();
  atual = alvo = progresso();
  pintar(atual);
  addEventListener('scroll', rolar, { passive: true });
  addEventListener('resize', function () { medir(); pintar(atual); });
})();


/* footer: copiar o email */
(function () {
  var b = document.querySelector('.foot-mail button');
  if (!b) return;
  b.addEventListener('click', function () {
    var t = b.getAttribute('data-copy'), txt = b.textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () {
      b.textContent = /^en/.test(document.documentElement.lang) ? 'Copied' : 'Copiado';
    }, function () { location.href = 'mailto:' + t; }).then(function () { setTimeout(function () { b.textContent = txt; }, 1800); });
  });
})();


/* hero: a foto fica em preto e branco e o cursor pinta um rastro de bordas orgânicas
   que revela a versão colorida dele por baixo; o rastro se apaga sozinho (ref. Kern) */
(function () {
  var stage = document.querySelector('.hero-stage');
  var corte = stage && stage.querySelector('.hero-cut');
  if (!corte) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]animar=1/.test(location.search)) return;
  var base = corte.querySelector('img');
  var cv = document.createElement('canvas');
  cv.className = 'hero-reveal';
  cv.setAttribute('aria-hidden', 'true');
  corte.appendChild(cv);
  var gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true });
  if (!gl) { cv.remove(); return; }

  var VS = 'attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision mediump float;varying vec2 uv;uniform sampler2D img;uniform sampler2D msk;uniform float t;uniform float asp;',
    'float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);',
    ' return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}',
    'void main(){',
    ' vec2 q=uv*vec2(asp,1.)*7.;',
    ' float r=n(q+t*.12)*.6+n(q*2.3-t*.09)*.4;',
    ' float m=texture2D(msk,uv).a;',
    ' float a=smoothstep(.5,.56,m+(r-.5)*.42);',
    ' vec4 c=texture2D(img,uv);',
    ' gl_FragColor=vec4(c.rgb*c.a*a,c.a*a);}'
  ].join('\n');
  function sh(tipo, src) { var o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.remove(); return; }
  gl.useProgram(pr);
  var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var lp = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
  function tex(u) {
    var o = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + u); gl.bindTexture(gl.TEXTURE_2D, o);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return o;
  }
  var tImg = tex(0), tMsk = tex(1);
  gl.uniform1i(gl.getUniformLocation(pr, 'img'), 0);
  gl.uniform1i(gl.getUniformLocation(pr, 'msk'), 1);
  var uT = gl.getUniformLocation(pr, 't'), uA = gl.getUniformLocation(pr, 'asp');

  /* a versão colorida dele, alinhada pixel a pixel com o recorte em preto e branco */
  var cor = new Image(), pronto = false;
  cor.onload = function () {
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tImg);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cor);
    pronto = true;
  };
  cor.src = base.getAttribute('data-cor');

  /* máscara do rastro, em baixa resolução: o shader cuida da borda */
  var mk = document.createElement('canvas'), mc = mk.getContext('2d');
  var dpr = Math.min(devicePixelRatio || 1, 2), box = null, ult = null, raf = 0, ativo = 0, t0 = performance.now();

  function medir() {
    var r = corte.getBoundingClientRect(), cs = getComputedStyle(base);
    var iw = base.naturalWidth || 2844, ih = base.naturalHeight || 1600;
    var s = cs.objectFit === 'contain' ? Math.min(r.width / iw, r.height / ih) : Math.max(r.width / iw, r.height / ih);
    var pos = cs.objectPosition.split(' '), px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1] || '50%') / 100;
    box = { x: (r.width - iw * s) * px, y: (r.height - ih * s) * py, w: iw * s, h: ih * s };
    cv.style.left = box.x + 'px'; cv.style.top = box.y + 'px';
    cv.style.width = box.w + 'px'; cv.style.height = box.h + 'px';
    cv.width = Math.round(box.w * dpr); cv.height = Math.round(box.h * dpr);
    mk.width = Math.max(2, Math.round(box.w / 5)); mk.height = Math.max(2, Math.round(box.h / 5));
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform1f(uA, box.w / box.h);
  }

  function carimbo(x, y) {
    var r = 15, g = mc.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.55, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    mc.fillStyle = g; mc.beginPath(); mc.arc(x, y, r, 0, 6.2832); mc.fill();
  }

  function quadro(agora) {
    /* o rastro desbota devagar, como na referência */
    mc.globalCompositeOperation = 'destination-out';
    mc.fillStyle = 'rgba(0,0,0,.018)'; mc.fillRect(0, 0, mk.width, mk.height);
    mc.globalCompositeOperation = 'source-over';
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tMsk);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mk);
    gl.uniform1f(uT, (agora - t0) / 1000);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (agora - ativo > 5000) { mc.clearRect(0, 0, mk.width, mk.height); gl.clear(gl.COLOR_BUFFER_BIT); raf = 0; return; }
    raf = requestAnimationFrame(quadro);
  }

  stage.addEventListener('pointermove', function (e) {
    if (!pronto) return;
    if (!box) medir();
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width * mk.width, y = (e.clientY - r.top) / r.height * mk.height;
    if (x < -20 || y < -20 || x > mk.width + 20 || y > mk.height + 20) { ult = null; return; }
    /* liga os pontos do caminho para o rastro não ficar falhado em movimentos rápidos */
    if (ult) {
      var dx = x - ult.x, dy = y - ult.y, n = Math.ceil(Math.hypot(dx, dy) / 4);
      for (var i = 1; i <= n; i++) carimbo(ult.x + dx * i / n, ult.y + dy * i / n);
    } else carimbo(x, y);
    ult = { x: x, y: y };
    ativo = performance.now();
    if (!raf) raf = requestAnimationFrame(quadro);
  }, { passive: true });
  stage.addEventListener('pointerleave', function () { ult = null; });
  addEventListener('resize', function () { box = null; });
})();


/* UGC no celular: as setas passam um card por vez e apagam nas pontas */
(function () {
  var trilho = document.querySelector('#ugc .works-3'), setas = document.querySelectorAll('#ugc .ugc-arrows button');
  if (!trilho || setas.length < 2) return;
  function passo() { var li = trilho.children[0]; return li ? li.getBoundingClientRect().width + 14 : trilho.clientWidth; }
  function atualizar() {
    var max = trilho.scrollWidth - trilho.clientWidth;
    setas[0].disabled = trilho.scrollLeft <= 2;
    setas[1].disabled = trilho.scrollLeft >= max - 2;
  }
  setas.forEach(function (b) {
    b.addEventListener('click', function () {
      trilho.scrollBy({ left: passo() * +b.getAttribute('data-dir'), behavior: 'smooth' });
    });
  });
  trilho.addEventListener('scroll', atualizar, { passive: true });
  addEventListener('resize', atualizar);
  atualizar();
})();
