/* surgimento dos textos: títulos sobem palavra por palavra de trás de uma máscara,
   eyebrows abrem o espaçamento e os blocos de texto sobem saindo de um desfoque.
   Dispara uma vez quando o texto entra na tela e fica desligado em reduce motion. */
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]animar=1/.test(location.search)) return;
  if (!('IntersectionObserver' in window)) return;

  var FORA = '.hero-n, template, dialog, .lit, #sku-h, .ruler-stage h2';
  function livre(el) { return !el.closest(FORA) && !el.matches(FORA); }

  /* quebra o texto em palavras sem perder links, <br> ou ênfases dentro do título */
  var n = 0;
  function quebrar(no) {
    [].slice.call(no.childNodes).forEach(function (c) {
      if (c.nodeType === 3) {
        var partes = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
        partes.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          var w = document.createElement('span'), dentro = document.createElement('span');
          w.className = 'tx-w';
          dentro.textContent = p;
          dentro.style.setProperty('--d', (n++ * 55) + 'ms');
          w.appendChild(dentro);
          frag.appendChild(w);
        });
        c.parentNode.replaceChild(frag, c);
      } else if (c.nodeType === 1 && c.tagName !== 'BR' && c.tagName !== 'svg') {
        quebrar(c);
      }
    });
  }

  var alvos = [];
  document.querySelectorAll('main h1, main h2').forEach(function (h) {
    if (!livre(h) || h.classList.contains('name-move')) return;
    n = 0;
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    quebrar(h);
    h.classList.add('tx-split');
    alvos.push(h);
  });

  document.querySelectorAll('main .eyebrow').forEach(function (el) {
    if (!livre(el)) return;
    el.classList.add('tx-eb');
    alvos.push(el);
  });

  var BLOCOS = ['.sec-lead', '.lead', '.works-head p', '.toolset-intro', '.ugc-note', '.services li', '.about-copy > p',
    '.facts > div', '.tcard blockquote', '.tcard figcaption', '.cta p', '.cs-sub', '.cs-story > div', '.cs-meta > div',
    '.cs-group header', '.tool-cat', '.svc', '.qz-card', '.prints-cols', '.prints-note', '.cta-alt', '.skills li', '.cs-video-txt > p:not(.eyebrow)'].join(',');
  var porPai = new Map();
  document.querySelectorAll(BLOCOS).forEach(function (el) {
    if (!livre(el)) return;
    var pai = el.parentNode, k = porPai.get(pai) || 0;
    porPai.set(pai, k + 1);
    el.style.setProperty('--d', Math.min(k, 6) * 90 + 'ms');
    el.classList.add('tx-up');
    alvos.push(el);
  });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('tx-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
  alvos.forEach(function (el) { io.observe(el); });
})();
