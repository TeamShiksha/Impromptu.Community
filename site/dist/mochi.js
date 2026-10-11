/* Mochi is a local, silent companion. No tracking or network calls. */
(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const read = key => { try { return localStorage.getItem(key) === 'true'; } catch { return false; } };
  const save = (key, value) => { try { localStorage.setItem(key, String(value)); } catch { /* Optional preferences. */ } };
  let sleeping = read('mochi-napping');
  let hidden = read('mochi-hidden');
  let actionTimer, idleTimer, bubbleTimer, placementFrame;
  let questIndex = -1;
  const quests = [
    'Bring that book you’ve been meaning to finish. One chapter counts.',
    'Ask someone what they’re building. Curiosity makes a great introduction.',
    'Take your side project out for coffee. A change of scene might help.',
    'Come as you are. Say hello to someone you haven’t met yet.'
  ];
  const root = document.createElement('aside');
  root.className = 'mochi';
  root.setAttribute('aria-label', 'Mochi the café cat');
  root.innerHTML = `
    <section class="mochi-panel" id="mochi-panel" role="dialog" aria-labelledby="mochi-title" hidden>
      <header class="mochi-panel-header"><div><span class="mochi-kicker">YOUR CAFÉ COMPANION</span><h2 id="mochi-title">Hey, I’m Mochi.</h2></div><button class="mochi-close" aria-label="Close Mochi menu">×</button></header>
      <p class="mochi-message" role="status" aria-live="polite" aria-atomic="true">Oh good, you’re here. What’s the plan?</p>
      <a class="mochi-join" href="https://chat.whatsapp.com/BjaRBKrzUZbIsA0D6uKJ7v" target="_blank" rel="noopener noreferrer">Join the WhatsApp Community <span aria-hidden="true">↗</span></a>
      <button class="mochi-option" data-action="treat"><span aria-hidden="true">♡</span> Give Mochi a treat</button>
      <button class="mochi-option" data-action="quest"><span aria-hidden="true">✦</span> Pick my side quest</button>
      <a class="mochi-option" href="https://rsvp.kim" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> Explore events on RSVP.kim</a>
      <div class="mochi-settings"><button data-action="nap" aria-pressed="false">Let Mochi nap</button><button data-action="hide">Hide Mochi</button></div>
    </section>
    <div class="mochi-bubble" hidden aria-hidden="true"></div>
    <button class="mochi-launcher" aria-label="Open Mochi the café cat’s menu" aria-expanded="false" aria-controls="mochi-panel">
      <svg class="mochi-cat" viewBox="0 0 96 96" aria-hidden="true" shape-rendering="crispEdges">
        <ellipse cx="48" cy="86" rx="31" ry="5" fill="#292a25" opacity=".13"/>
        <g class="mochi-body">
          <g class="mochi-tail"><path d="M67 69h12V55h7v23H67z" fill="#654838"/><path d="M70 71h11V57h3v19H70z" fill="#d89559"/><path d="M80 53h6v9h-6z" fill="#fff0ce"/></g>
          <path d="M30 48h36v8h6v25h-7v5H25v-6h-3V59h8z" fill="#654838"/>
          <path d="M32 51h30v7h6v22H28V60h4z" fill="#e9a368"/>
          <path d="M38 58h18v7h6v16H34V65h4z" fill="#fff0ce"/>
          <path d="M29 60h6v5h-6zm31 5h8v5h-8z" fill="#bd7347"/>
          <path d="M27 78h15v7H27zm27 0h15v7H54z" fill="#fff0ce"/>
          <g class="mochi-head">
            <path d="M19 18h7v5h7v5h27v-5h7v-5h7v33h-5v9H25v-6h-6z" fill="#654838"/>
            <path d="M23 24h4v6h8v2h24v-2h8v-6h3v26h-5v6H29v-6h-6z" fill="#e9a368"/>
            <path d="M24 29h5v8h-5zm40 0h5v8h-5z" fill="#eaa69f"/>
            <path d="M40 32h5v8h-5zm8 0h5v6h-5z" fill="#bd7347"/>
            <path d="M35 47h24v9H35z" fill="#fff0ce"/>
            <g class="mochi-eyes" fill="#352d2b"><path d="M30 40h5v7h-5zm29 0h5v7h-5z"/></g>
            <g class="mochi-closed-eyes" fill="#352d2b"><path d="M28 44h9v3h-9zm29 0h9v3h-9z"/></g>
            <path d="M44 47h6v4h-6z" fill="#b96669"/><path d="M46 51h3v3h-3z" fill="#654838"/>
            <path d="M17 47h9v2h-9zm50 0h10v2H67z" fill="#654838"/>
            <g class="mochi-glasses" fill="none" stroke="#393a36" stroke-width="2"><path d="M27 39h13v11H27zm28 0h13v11H55zm-15 4h15"/></g>
          </g>
          <g class="mochi-paw"><path d="M62 59h9v15h-9z" fill="#654838"/><path d="M63 58h7v12h-7z" fill="#fff0ce"/><path d="M65 60h3v4h-3z" fill="#eaa69f"/></g>
        </g>
        <g class="mochi-laptop"><path d="M25 65h43v20H25z" fill="#484953"/><path d="M28 68h37v14H28z" fill="#aaa1d3"/><path d="M44 72h6v6h-6z" fill="#cbea80"/><path d="M21 85h51v3H21z" fill="#373842"/></g>
        <g class="mochi-book"><path d="M25 66h20l3 3 3-3h20v20H51l-3 3-3-3H25z" fill="#777098"/><path d="M28 69h16l3 3v12l-3-2H28zm24 0h16v13H52l-3 2V72z" fill="#fff0ce"/></g>
        <g class="mochi-heart" fill="#bd6879"><path d="M72 21h6v3h3v-3h6v9h-3v3h-3v3h-3v-3h-3v-3h-3z"/></g>
        <g class="mochi-zzz" fill="#74638f"><path d="M73 34h9v3h-3v3h-3v3h6v3h-9v-5h3v-3h-3zm8-18h12v3h-3v3h-3v3h6v3H81v-5h3v-3h-3z"/></g>
      </svg>
      <span class="mochi-name">MOCHI <span aria-hidden="true">· · ·</span></span>
    </button>`;
  document.body.append(root);
  const launcher = root.querySelector('.mochi-launcher');
  const panel = root.querySelector('.mochi-panel');
  const status = root.querySelector('.mochi-message');
  const bubble = root.querySelector('.mochi-bubble');
  const nap = root.querySelector('[data-action="nap"]');
  const restore = document.createElement('button');
  restore.className = 'mochi-restore';
  restore.textContent = 'Show Mochi';
  document.querySelector('footer').append(restore);
  // Keep the main invitation as the single source of truth.
  root.querySelector('.mochi-join').href = document.querySelector('[data-whatsapp]').href;

  function rest() {
    clearTimeout(actionTimer);
    root.dataset.pose = sleeping ? 'nap' : 'idle';
  }
  function animate(pose, duration = 2400) {
    clearTimeout(actionTimer);
    root.dataset.pose = pose;
    if (pose !== 'nap') actionTimer = setTimeout(rest, motion.matches ? 1800 : duration);
  }
  function say(text) {
    status.textContent = text;
    clearTimeout(bubbleTimer);
    if (panel.hidden && !hidden) {
      bubble.textContent = text;
      bubble.hidden = false;
      bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 4200);
    }
  }
  function scheduleIdle() {
    clearTimeout(idleTimer);
    if (hidden || sleeping || motion.matches || document.hidden) return;
    idleTimer = setTimeout(() => {
      if (panel.hidden) animate(['stretch', 'groom', 'nap'][Math.floor(Math.random() * 3)], 3000);
      // An occasional nap is a short animation; a user-selected nap lasts.
      if (!sleeping && root.dataset.pose === 'nap') actionTimer = setTimeout(rest, 4500);
      scheduleIdle();
    }, 28000 + Math.random() * 18000);
  }
  function updatePreferences() {
    root.hidden = hidden;
    restore.hidden = !hidden;
    nap.textContent = sleeping ? 'Wake Mochi up' : 'Let Mochi nap';
    nap.setAttribute('aria-pressed', String(sleeping));
    root.dataset.quiet = String(sleeping || motion.matches);
    rest();
    scheduleIdle();
    queuePlacement();
  }
  function closeMenu(returnFocus = false) {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Open Mochi the café cat’s menu');
    if (returnFocus) launcher.focus({preventScroll: true});
    queuePlacement();
  }
  launcher.addEventListener('click', () => {
    if (!panel.hidden) return closeMenu(true);
    bubble.hidden = true;
    clearTimeout(bubbleTimer);
    rest();
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Close Mochi the café cat’s menu');
    panel.querySelector('.mochi-close').focus({preventScroll: true});
  });
  root.querySelector('.mochi-close').addEventListener('click', () => closeMenu(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { closeMenu(true); event.preventDefault(); }
  });
  document.addEventListener('pointerdown', event => {
    if (!root.contains(event.target) && !panel.hidden) closeMenu();
  });
  root.addEventListener('focusout', event => {
    if (event.relatedTarget && !root.contains(event.relatedTarget)) closeMenu();
  });
  root.querySelector('[data-action="treat"]').addEventListener('click', () => {
    animate('happy');
    say('Excellent. You’re on snack duty. ♡');
  });
  root.querySelector('[data-action="quest"]').addEventListener('click', () => {
    questIndex = (questIndex + 1) % quests.length;
    animate('wave');
    say(quests[questIndex]);
  });
  nap.addEventListener('click', () => {
    sleeping = !sleeping;
    save('mochi-napping', sleeping);
    updatePreferences();
    say(sleeping ? 'Do not disturb. Dreaming of café snacks.' : 'I’m up! Did someone say coffee?');
  });
  root.querySelector('[data-action="hide"]').addEventListener('click', () => {
    hidden = true;
    save('mochi-hidden', true);
    closeMenu();
    bubble.hidden = true;
    clearTimeout(bubbleTimer);
    updatePreferences();
    restore.focus({preventScroll: true});
  });
  restore.addEventListener('click', () => {
    hidden = false;
    save('mochi-hidden', false);
    updatePreferences();
    launcher.focus({preventScroll: true});
    if (!sleeping && !motion.matches) animate('wave');
  });
  document.querySelectorAll('[data-character]').forEach(card => card.addEventListener('click', () => {
    if (hidden || sleeping) return;
    const character = card.dataset.character;
    animate(character === 'builder' ? 'laptop' : character === 'reader' ? 'book' : 'happy', 4200);
    say(character === 'builder' ? 'I’ll supervise. You do the typing.' : character === 'reader' ? 'One more chapter? I’ll keep your seat warm.' : 'Perfect. You’re the important bit.');
  }));
  function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
  function place() {
    placementFrame = null;
    if (hidden || !panel.hidden) return;
    root.style.setProperty('--mochi-lift', '0px');
    root.dataset.side = 'right';
    const rect = launcher.getBoundingClientRect();
    const joins = [...document.querySelectorAll('[data-whatsapp]')].map(el => el.getBoundingClientRect());
    const collision = joins.find(join => overlaps(rect, join));
    if (collision) root.style.setProperty('--mochi-lift', `${Math.ceil(rect.bottom - collision.top + 12)}px`);
  }
  function queuePlacement() {
    if (!placementFrame) placementFrame = requestAnimationFrame(place);
  }
  window.addEventListener('scroll', queuePlacement, {passive: true});
  window.addEventListener('resize', queuePlacement, {passive: true});
  document.addEventListener('visibilitychange', () => { rest(); bubble.hidden = true; scheduleIdle(); });
  motion.addEventListener('change', updatePreferences);
  updatePreferences();
  if (!hidden && !sleeping && !motion.matches) animate('wave', 2400);
})();
