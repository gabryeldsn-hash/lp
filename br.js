/* Quiz de diagnóstico: 3 perguntas ramificadas + contato. A lead vai por e-mail (EmailJS)
   e o WhatsApp abre já preenchido com as respostas. */
(function () {
  'use strict';
  var box = document.getElementById('qz');
  if (!box) return;

  var EMAILJS = { publicKey: 'UyUAUgylr2ZV0eJtt', serviceId: 'service_8qlczqn', templateId: 'template_685m1sk' };
  var PHONE = '5575981320968';

  var Q1 = {
    pergunta: 'Qual o maior incômodo com a sua marca hoje?',
    opcoes: [
      { label: 'Minha marca parece amadora / não passa confiança', key: 'Identidade' },
      { label: 'Tenho gente me vendo, mas quase ninguém compra', key: 'Conversao' },
      { label: 'Meu Instagram está parado e sem cara própria', key: 'Presenca' },
      { label: 'Vou lançar algo e não tenho material pronto', key: 'Lancamento' }
    ]
  };

  var PATHS = {
    Identidade: {
      nome: 'Identidade',
      dor: 'a minha marca parecer amadora',
      gatilho: 'Uma marca que parece amadora perde o cliente antes mesmo de falar o preço.',
      q2: { pergunta: 'O que mais te incomoda hoje?', opcoes: ['Logo / identidade fraca', 'Feed sem padrão', 'Não sei qual é a cara da minha marca'] },
      q3: { pergunta: 'Se sua marca transmitisse autoridade amanhã, o que mudaria?', opcoes: ['Cobraria mais caro', 'Atrairia clientes melhores', 'Teria orgulho de divulgar'] },
      diagnostico: 'Sua marca tem potencial, mas a percepção está sabotando seu preço. Você precisa de identidade + presença que passem autoridade.',
      servico: 'Branding / Social Media'
    },
    Conversao: {
      nome: 'Conversão',
      dor: 'ter gente me vendo, mas quase ninguém comprar',
      gatilho: 'Visita que não vira venda é dinheiro escorrendo pelo ralo — o problema quase nunca é o tráfego, é a página.',
      q2: { pergunta: 'Para onde você manda as pessoas hoje?', opcoes: ['Direct do Instagram', 'Um link genérico / Linktree', 'Não mando pra lugar nenhum'] },
      q3: { pergunta: 'O que você mais quer destravar?', opcoes: ['Mais vendas no automático', 'Passar mais profissionalismo', 'Parar de responder tudo na mão'] },
      diagnostico: 'Você já tem atenção — falta uma página de vendas estruturada pra transformar essa atenção em cliente.',
      servico: 'Landing / Página de vendas'
    },
    Presenca: {
      nome: 'Presença',
      dor: 'meu Instagram estar parado e sem cara própria',
      gatilho: 'Um perfil parado passa a impressão de que a marca também está — e o cliente vai pro concorrente que aparece.',
      q2: { pergunta: 'Como está seu conteúdo hoje?', opcoes: ['Posto quando dá tempo', 'Tenho ideias mas não sei aplicar', 'Está totalmente parado'] },
      q3: { pergunta: 'O que te seguraria de crescer nos próximos 30 dias?', opcoes: ['Falta de identidade visual', 'Falta de constância', 'Falta de estratégia'] },
      diagnostico: 'Sua marca precisa de Social Media com identidade e ritmo pra voltar a ser lembrada — e escolhida.',
      servico: 'Social Media'
    },
    Lancamento: {
      nome: 'Lançamento',
      dor: 'ir lançar algo sem material pronto',
      gatilho: 'Lançamento sem material pronto é oportunidade que passa e não volta — a janela é curta.',
      q2: { pergunta: 'Quando é o seu lançamento?', opcoes: ['Essa semana / urgente', 'Nas próximas semanas', 'Ainda planejando'] },
      q3: { pergunta: 'O que você já tem pronto?', opcoes: ['Nada, começo do zero', 'Só a ideia / oferta', 'Tenho parte, falta acabamento'] },
      diagnostico: 'Pra esse lançamento performar você precisa de página + criativos alinhados e prontos antes da janela fechar.',
      servico: 'Página + Criativos'
    }
  };

  var s = { step: 0, path: null, q1: '', q2: '', q3: '', name: '', email: '', phone: '', showErr: false };

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function validEmail() { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim()); }
  function validPhone() { return s.phone.replace(/\D/g, '').length >= 10; }
  function canSubmit() { return s.name.trim() && validEmail() && validPhone(); }

  function waLink() {
    var p = PATHS[s.path];
    var msg = 'Olá Gabryel! Fiz o diagnóstico. Meu maior incômodo é ' + (p ? p.dor : '-') + ', principalmente ' + (s.q2 || '-') +
      ', e eu quero ' + (s.q3 || '-') + '. Meu nome é ' + s.name + ', meu e-mail é ' + s.email + ', meu WhatsApp é ' + s.phone + '. Pode me ajudar?';
    return 'https://api.whatsapp.com/send?phone=' + PHONE + '&text=' + encodeURIComponent(msg);
  }

  function saveLead() {
    if (typeof emailjs === 'undefined') return;
    var p = PATHS[s.path] || {};
    try {
      emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        nome: s.name, email: s.email, whatsapp: s.phone,
        incomodo: p.dor || s.q1 || '-', resposta_2: s.q2 || '-', resposta_3: s.q3 || '-',
        caminho: p.nome || s.path || '-', diagnostico: p.diagnostico || '-', servico: p.servico || '-'
      }, { publicKey: EMAILJS.publicKey }).catch(function () {});
    } catch (e) {}
  }

  var ARROW = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

  function opts(list, sel) {
    return '<div class="qz-opts">' + list.map(function (o, i) {
      var label = typeof o === 'string' ? o : o.label;
      return '<button type="button" class="qz-opt' + (label === sel ? ' is-sel' : '') + '" data-opt="' + i + '"><span>' + esc(label) + '</span><span aria-hidden="true">✓</span></button>';
    }).join('') + '</div>';
  }

  function render(focus) {
    var p = s.path ? PATHS[s.path] : null;
    var labels = ['Pergunta 1 de 3', 'Pergunta 2 de 3', 'Pergunta 3 de 3', 'Falta pouco', 'Concluído'];
    var h = '<div class="qz-bar" aria-hidden="true"><i style="width:' + Math.round(s.step / 4 * 100) + '%"></i></div>' +
      '<div class="qz-top"><span class="qz-step">' + labels[s.step] + '</span>' +
      (s.step > 0 && s.step < 4 ? '<button type="button" class="qz-back" data-act="back">← Voltar</button>' : '') + '</div>';

    if (p && (s.step === 1 || s.step === 2)) h += '<p class="qz-gat"><b aria-hidden="true">!</b>' + esc(p.gatilho) + '</p>';

    if (s.step === 0) h += '<h3 class="qz-q">' + Q1.pergunta + '</h3>' + opts(Q1.opcoes, s.q1);
    else if (s.step === 1) h += '<h3 class="qz-q">' + p.q2.pergunta + '</h3>' + opts(p.q2.opcoes, s.q2);
    else if (s.step === 2) h += '<h3 class="qz-q">' + p.q3.pergunta + '</h3>' + opts(p.q3.opcoes, s.q3);
    else if (s.step === 3) {
      var eErr = s.showErr && !validEmail(), pErr = s.showErr && !validPhone();
      h += '<h3 class="qz-q">Quase lá! Como te chamo?</h3>' +
        '<p class="qz-p">Deixe seu nome, e-mail e WhatsApp — eu recebo seu diagnóstico e já te respondo com uma direção.</p>' +
        '<div class="qz-form">' +
        '<input class="qz-in" data-f="name" value="' + esc(s.name) + '" aria-label="Seu nome" placeholder="Seu nome" autocomplete="name">' +
        '<input class="qz-in' + (eErr ? ' is-err' : '') + '" data-f="email" value="' + esc(s.email) + '" inputmode="email" aria-label="Seu melhor e-mail" placeholder="Seu melhor e-mail" autocomplete="email">' +
        (eErr ? '<span class="qz-err">Digite um e-mail válido.</span>' : '') +
        '<input class="qz-in' + (pErr ? ' is-err' : '') + '" data-f="phone" value="' + esc(s.phone) + '" inputmode="tel" aria-label="Seu WhatsApp com DDD" placeholder="Seu WhatsApp (com DDD)" autocomplete="tel">' +
        (pErr ? '<span class="qz-err">Digite um WhatsApp válido com DDD.</span>' : '') +
        '</div>' +
        '<button type="button" class="btn btn-accent qz-sub" data-act="submit" aria-disabled="' + (canSubmit() ? 'false' : 'true') + '">Ver meu diagnóstico ' + ARROW + '</button>';
    } else {
      h += '<div class="qz-done-h"><b aria-hidden="true">✓</b><div><p class="eyebrow" style="margin-bottom:6px">Seu diagnóstico</p><h3>' + esc(p.nome) + '</h3></div></div>' +
        '<p class="qz-p" style="margin:0">' + esc(p.diagnostico) + '</p>' +
        '<div class="qz-rec"><span>Recomendado</span><b>' + esc(p.servico) + '</b></div>' +
        '<div class="qz-acts"><a class="btn btn-accent" href="' + esc(waLink()) + '" target="_blank" rel="noopener">Receber meu diagnóstico no WhatsApp</a>' +
        '<button type="button" class="qz-back" data-act="restart">Refazer</button></div>';
    }
    box.innerHTML = h;
    if (focus) { var f = box.querySelector('[data-f="' + focus + '"]'); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); } }
  }

  box.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var act = b.getAttribute('data-act');
    if (b.hasAttribute('data-opt')) {
      var i = +b.getAttribute('data-opt');
      if (s.step === 0) { s.path = Q1.opcoes[i].key; s.q1 = Q1.opcoes[i].label; }
      else if (s.step === 1) s.q2 = PATHS[s.path].q2.opcoes[i];
      else s.q3 = PATHS[s.path].q3.opcoes[i];
      s.step++;
      render();
    } else if (act === 'back') {
      s.step--; s.showErr = false; render();
    } else if (act === 'restart') {
      s = { step: 0, path: null, q1: '', q2: '', q3: '', name: '', email: '', phone: '', showErr: false };
      render();
    } else if (act === 'submit') {
      if (!canSubmit()) { s.showErr = true; render(); return; }
      saveLead();
      window.open(waLink(), '_blank', 'noopener');
      s.step = 4;
      render();
    }
  });

  box.addEventListener('input', function (e) {
    var f = e.target.getAttribute('data-f');
    if (!f) return;
    s[f] = e.target.value;
    var sub = box.querySelector('.qz-sub');
    if (sub) sub.setAttribute('aria-disabled', canSubmit() ? 'false' : 'true');
  });

  render();
})();

/* Instagram: o card fica flutuando na própria seção e, com a rolagem, sai dela girando em 3D
   até pousar na palma da mão da foto logo abaixo. Medimos a vaga e o alvo a cada quadro. */
(function () {
  'use strict';
  var wrap = document.getElementById('instagram');
  if (!wrap) return;
  var slot = wrap.querySelector('.ig-slot'), track = wrap.querySelector('.ig-track'), stage = wrap.querySelector('.ig-stage');
  var photo = wrap.querySelector('.ig-photo'), foto = photo.querySelector('img');
  /* palma da mão na imagem 16:9 (fração da largura e da altura) e largura do card em fração da imagem */
  var IW = 1672, IH = 941, PU = 0.508, PV = 0.80, CW = 0.30;
  var fly = wrap.querySelector('.ig-fly'), card = fly.querySelector('.ig-card');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]animar=1/.test(location.search);
  var W0 = 400, H0 = 290, vivo = false, raf = 0;

  function medir() {
    H0 = card.offsetHeight || H0;
    slot.style.aspectRatio = W0 + ' / ' + H0;
  }
  function mix(a, b, t) { return a + (b - a) * t; }

  function quadro(agora) {
    raf = 0;
    var vh = innerHeight, y = scrollY;
    var rw = wrap.getBoundingClientRect(), rs = slot.getBoundingClientRect(), pb = photo.getBoundingClientRect();
    /* onde a palma cai: cover em telas estreitas, contain nas mais largas que 16:9 (assim o topo não é cortado) */
    var largo = pb.width / pb.height > IW / IH;
    if (foto.style.objectFit !== (largo ? 'contain' : 'cover')) foto.style.objectFit = largo ? 'contain' : 'cover';
    var sc = (largo ? Math.min : Math.max)(pb.width / IW, pb.height / IH), dw = IW * sc, dh = IH * sc;
    var palmX = (pb.width - dw) / 2 + PU * dw, palmY = (pb.height - dh) / 2 + PV * dh;
    var cw = Math.min(dw * CW, pb.width * 0.86);
    photo.style.setProperty('--px', palmX.toFixed(1) + 'px');
    photo.style.setProperty('--py', palmY.toFixed(1) + 'px');
    photo.style.setProperty('--gw', (cw * 0.8).toFixed(1) + 'px');
    var sS = rs.width / W0, sE = cw / W0;
    var Sx = rs.left + rs.width / 2 - rw.left, Sy = rs.top + rs.height / 2 - rw.top;
    var Ex = pb.left + palmX - rw.left, Ey = pb.top + palmY - rw.top - H0 * sE * 0.62;

    /* começa quando o card passa do meio da tela e termina com o palco da foto preso, em 55% do trecho */
    var ini = rs.top + rs.height / 2 + y - vh * 0.42;
    var topo = parseFloat(getComputedStyle(stage).top) || 0;
    var fim = track.getBoundingClientRect().top + y - topo + (track.offsetHeight - stage.offsetHeight) * 0.55;
    var p = reduce ? 0 : Math.min(1, Math.max(0, (y - ini) / (fim - ini)));
    var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    var arco = Math.sin(Math.PI * e), solto = 1 - e, t = (agora || 0) / 1000;

    var x = mix(Sx, Ex, e), yy = mix(Sy, Ey, e) - arco * vh * 0.06 + Math.sin(t * 1.1) * 8 * solto;
    var s = mix(sS, sE, e) * (1 + arco * 0.12);
    var ry = mix(-22, -12, e) + 360 * e + Math.sin(t * .9) * 7 * solto;
    var rx = mix(12, 14, e) + arco * 38 + Math.sin(t * .7) * 4 * solto;
    var rz = mix(6, -5, e) + Math.sin(t * .8) * 2 * solto;

    fly.style.transform = 'translate3d(' + (x - W0 / 2).toFixed(1) + 'px,' + (yy - H0 / 2).toFixed(1) + 'px,0) scale(' + s.toFixed(4) + ')';
    card.style.transform = 'rotateZ(' + rz.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    photo.style.setProperty('--g', (e * e).toFixed(3));
    if (vivo && !reduce) raf = requestAnimationFrame(quadro);
  }
  function pedir() { if (!raf) raf = requestAnimationFrame(quadro); }

  medir();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medir(); pedir(); });
  addEventListener('resize', function () { medir(); pedir(); });
  addEventListener('scroll', pedir, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { vivo = es[0].isIntersecting; if (vivo) pedir(); }, { rootMargin: '200px 0px' }).observe(wrap);
  }
  quadro(0);
})();

/* Processo: cada mensagem chega num trecho da rolagem e acende o passo dela. */
(function () {
  var box = document.querySelector('.chat');
  if (!box) return;
  var stage = box.querySelector('.chat-stage');
  var msgs = [].slice.call(box.querySelectorAll('.ntf')), steps = [].slice.call(box.querySelectorAll('.chat-step'));
  var n = msgs.length, cur = -2;

  function marcar(k) {
    if (k === cur) return;
    cur = k;
    var passo = k < 0 ? 0 : +msgs[k].getAttribute('data-step');
    msgs.forEach(function (m, i) {
      m.classList.toggle('is-in', i <= k);
      m.classList.toggle('is-old', i < k);
    });
    steps.forEach(function (s, i) { s.classList.toggle('is-on', i === passo); });
  }
  function rolar() {
    var topo = parseFloat(getComputedStyle(stage).top) || 0;
    var curso = box.offsetHeight - stage.offsetHeight;
    var p = curso > 0 ? (topo - box.getBoundingClientRect().top) / curso : 1;
    // a primeira chega assim que o palco gruda; a última, um pouco antes do fim
    marcar(p < -0.08 ? -1 : Math.min(n - 1, Math.floor(Math.max(0, p) * (n - 0.4) + 0.001)));
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { marcar(n - 1); return; }
  addEventListener('scroll', rolar, { passive: true });
  addEventListener('resize', rolar);
  rolar();
})();

/* Serviços: fundo de seda em WebGL (adaptado do "Silk" do 21st.dev), em azul, atrás dos cards de vidro. */
(function () {
  var canvas = document.querySelector('.svc-bg');
  if (!canvas) return;
  var gl = canvas.getContext('webgl', { antialias: false });
  if (!gl) return;

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FRAG = [
    'precision mediump float;',
    'uniform vec3 c0,c1,c2,c3;uniform vec2 res;uniform float t;',
    'float gh(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}',
    'vec3 pal(float x){float f=clamp(x,0.,1.)*3.;vec3 c=c0;',
    '  c=mix(c,c1,smoothstep(0.,1.,clamp(f,0.,1.)));',
    '  c=mix(c,c2,smoothstep(0.,1.,clamp(f-1.,0.,1.)));',
    '  c=mix(c,c3,smoothstep(0.,1.,clamp(f-2.,0.,1.)));return c;}',
    'void main(){',
    '  vec2 p=(gl_FragCoord.xy-.5*res)/min(res.x,res.y);',
    '  p=p*1.26+vec2(-.23,0.);',
    '  vec2 q=p*1.6;float amp=.25+.09*.85;',
    '  for(float i=1.;i<5.;i+=1.){q.x+=amp/i*cos(i*2.4*q.y+t*.8+1581.);q.y+=amp/i*cos(i*1.7*q.x+t*.6);}',
    '  vec3 col=pal(.5+.5*sin(q.x+q.y));',
    '  col=(col-.5)*1.113+.5;',
    '  col+=(gh(gl_FragCoord.xy+vec2(26877.,49011.))-.5)*.16;',
    '  gl_FragColor=vec4(clamp(col,0.,1.),1.);}'
  ].join('\n');

  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  // paleta da idv: quase preto, azul profundo, azul claro de brilho e o navy do site
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); }
  [['c0', '#04060D'], ['c1', '#13307F'], ['c2', '#8FB0FF'], ['c3', '#070B18']].forEach(function (c) {
    gl.uniform3fv(gl.getUniformLocation(prog, c[0]), hex(c[1]));
  });
  var uRes = gl.getUniformLocation(prog, 'res'), uT = gl.getUniformLocation(prog, 't');

  var parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visto = false, raf = 0, t0 = performance.now();
  function medir() {
    var dpr = Math.min(devicePixelRatio || 1, 1.5);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    var k = Math.min(1, Math.sqrt(1500000 / (w * h)));
    w = Math.round(w * k); h = Math.round(h * k);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  function quadro(now) {
    raf = 0;
    medir();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT, parado ? 4 : (now - t0) / 1000 * 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (visto && !parado && !document.hidden) raf = requestAnimationFrame(quadro);
  }
  function pedir() { if (!raf) raf = requestAnimationFrame(quadro); }
  new IntersectionObserver(function (e) { visto = e[0].isIntersecting; if (visto) pedir(); }).observe(canvas);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && visto) pedir(); });
  addEventListener('resize', pedir);
  pedir();
})();

/* Depoimentos: clona a faixa pra o carrossel não ter fim e troca original/tradução no mesmo card. */
(function () {
  var rail = document.querySelector('.rv-rail');
  if (!rail) return;
  var set = rail.querySelector('.rv-set');
  var copia = set.cloneNode(true);
  copia.setAttribute('aria-hidden', 'true');
  copia.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
  set.parentNode.appendChild(copia);
  rail.classList.add('is-on');

  rail.addEventListener('click', function (e) {
    var b = e.target.closest('.rv-lang');
    if (!b) return;
    var card = b.closest('.rv'), pt = b.getAttribute('aria-pressed') !== 'true';
    card.querySelector('.rv-en').hidden = pt;
    card.querySelector('.rv-pt').hidden = !pt;
    b.setAttribute('aria-pressed', pt);
    b.textContent = pt ? 'Ver original' : 'Ver tradução';
  });
})();

/* Método: as etapas giram em órbita; clicar numa para o giro, leva ela pro topo e abre o card. */
(function () {
  var stage = document.querySelector('.orb-stage');
  if (!stage) return;
  var nodes = [].slice.call(stage.querySelectorAll('.orb-node'));
  var card = stage.querySelector('.orb-card');
  var n = nodes.length, rot = 0, alvo = null, ativo = -1, ultimo = 0;
  var parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visto = false, raf = 0;

  var ring = stage.querySelector('.orb-ring');
  function raio() { return ring.offsetWidth / 2 || 200; }
  function posicionar() {
    var r = raio();
    nodes.forEach(function (el, i) {
      var a = (i / n) * 360 + rot, rad = a * Math.PI / 180;
      var x = r * Math.cos(rad), y = r * Math.sin(rad);
      var frente = (1 + Math.sin(rad)) / 2;
      el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      el.style.zIndex = i === ativo ? 200 : Math.round(100 + 50 * Math.cos(rad));
      el.style.opacity = i === ativo ? 1 : (0.45 + 0.55 * frente).toFixed(2);
    });
    if (ativo >= 0) {
      var t = nodes[ativo].style.transform.match(/-?[\d.]+/g);
      card.style.left = 'calc(50% + ' + t[0] + 'px)';
      card.style.top = 'calc(50% + ' + (+t[1] + 64) + 'px)';
    }
  }
  function quadro(now) {
    raf = 0;
    var dt = Math.min(0.05, (now - (ultimo || now)) / 1000); ultimo = now;
    if (alvo !== null) {
      var d = ((alvo - rot) % 360 + 540) % 360 - 180;
      rot += d * Math.min(1, dt * 7);
      if (Math.abs(d) < 0.05) rot = alvo;
    } else if (!parado) {
      rot = (rot + dt * 8) % 360;
    }
    posicionar();
    if (visto && (alvo === null ? !parado : rot !== alvo)) raf = requestAnimationFrame(quadro);
  }
  function pedir() { if (!raf) { ultimo = 0; raf = requestAnimationFrame(quadro); } }

  function abrir(i) {
    ativo = i;
    var el = nodes[i], rel = el.getAttribute('data-rel').split(',').map(function (k) { return +k - 1; });
    nodes.forEach(function (o, k) {
      o.classList.toggle('is-on', k === i);
      o.classList.toggle('is-rel', rel.indexOf(k) >= 0);
      o.setAttribute('aria-expanded', k === i);
    });
    card.querySelector('.orb-chip').textContent = 'Etapa ' + (i + 1);
    card.querySelector('.orb-count').textContent = (i + 1) + ' de ' + n;
    card.querySelector('.orb-title').textContent = el.querySelector('.orb-label').textContent;
    card.querySelector('.orb-txt').textContent = el.getAttribute('data-txt');
    var pct = Math.round((i + 1) / n * 100);
    card.querySelector('.orb-bar-h b').textContent = pct + '%';
    card.querySelector('.orb-bar-t i').style.width = pct + '%';
    var box = card.querySelector('.orb-rel'); box.innerHTML = '';
    rel.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = nodes[k].querySelector('.orb-label').textContent + ' →';
      b.addEventListener('click', function (e) { e.stopPropagation(); abrir(k); });
      box.appendChild(b);
    });
    card.hidden = false;
    alvo = ((270 - (i / n) * 360) % 360 + 360) % 360;   // leva a etapa pro topo
    pedir();
  }
  function fechar() {
    ativo = -1; alvo = null; card.hidden = true;
    nodes.forEach(function (o) { o.classList.remove('is-on', 'is-rel'); o.setAttribute('aria-expanded', 'false'); });
    pedir();
  }
  nodes.forEach(function (el, i) {
    el.setAttribute('aria-expanded', 'false');
    el.addEventListener('click', function (e) { e.stopPropagation(); if (ativo === i) fechar(); else abrir(i); });
  });
  card.addEventListener('click', function (e) { e.stopPropagation(); });
  stage.addEventListener('click', function () { if (ativo >= 0) fechar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ativo >= 0) fechar(); });
  new IntersectionObserver(function (es) { visto = es[0].isIntersecting; if (visto) pedir(); }).observe(stage);
  addEventListener('resize', function () { posicionar(); });
  posicionar();
})();

/* Portfólio: setas e bolinhas da galeria em carrossel (a rolagem é a nativa do navegador, com snap). */
(function () {
  var track = document.querySelector('.gl-track');
  if (!track) return;
  var items = [].slice.call(track.children);
  var prev = document.querySelector('.gl-prev'), next = document.querySelector('.gl-next');
  var dots = document.querySelector('.gl-dots');
  var parado = matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach(function (it, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.tabIndex = -1;
    b.addEventListener('click', function () { ir(i); });
    dots.appendChild(b);
  });
  function passo() { return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth; }
  function atual() { return Math.round(track.scrollLeft / passo()); }
  function ir(i) {
    i = Math.max(0, Math.min(items.length - 1, i));
    track.scrollTo({ left: i * passo(), behavior: parado ? 'auto' : 'smooth' });
  }
  function marcar() {
    var k = atual(), fim = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    [].forEach.call(dots.children, function (d, i) { d.classList.toggle('is-on', fim ? i === items.length - 1 : i === k); });
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = fim;
  }
  prev.addEventListener('click', function () { ir(atual() - 1); });
  next.addEventListener('click', function () { ir(atual() + 1); });
  track.addEventListener('scroll', marcar, { passive: true });
  addEventListener('resize', marcar);
  marcar();
})();
