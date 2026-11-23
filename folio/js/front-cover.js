// The cover and its controls are available while the paper stage is loading.
(() => {
  const root = document.documentElement, dialog = document.getElementById('book-intro');
  const enter = document.getElementById('intro-enter'), label = enter.querySelector('span');
  const art = document.getElementById('intro-art');
  let ready = false, opening = false, replay = false, returnFocus = null;

  function destination() {
    if (replay) return '回到街圖';
    if (location.hash.startsWith('#read')) return '翻開原刊';
    if (location.hash === '#ending') return '翻到後記';
    if ((location.hash && !['#cover','#map','#home'].includes(location.hash)) || new URLSearchParams(location.search).has('s')) return '進入這一幕';
    return '翻開街圖';
  }
  function show(trigger) {
    returnFocus = trigger;
    replay = Boolean(trigger);
    opening = false;
    label.textContent = destination();
    root.classList.add('intro-open');
    dialog.showModal();
    document.getElementById('intro-title').focus({preventScroll:true});
    document.dispatchEvent(new Event('folio-front-show'));
  }
  function finish() {
    if (!opening || !ready || dialog.classList.contains('unbinding')) return;
    dialog.classList.add('unbinding');
    const coverMotion = !root.classList.contains('still') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const close = () => {
      dialog.close();
      root.classList.remove('intro-open');
      dialog.classList.remove('unbinding');
      enter.removeAttribute('aria-busy');
      opening = false;
      document.dispatchEvent(new Event('folio-front-hide'));
      const focus = returnFocus || document.querySelector('#reader:not([hidden]) .dr-title, #closing-page:not([hidden]) #closing-title')
        || (document.getElementById('app').dataset.cover === 'yes' ? document.getElementById('cover-title') : document.getElementById('world'));
      focus?.focus({preventScroll:true});
    };
    if (coverMotion) setTimeout(close, 340); else close();
  }
  function openBook() {
    if (opening) return;
    opening = true;
    enter.setAttribute('aria-busy','true');
    if (!ready) label.textContent = '正在翻開…';
    window.folioEntry.enter();
    finish();
  }
  document.addEventListener('folio-ready', () => { ready = true; finish(); }, {once:true});
  enter.addEventListener('click', openBook);
  dialog.addEventListener('cancel', e => { e.preventDefault(); openBook(); });
  addEventListener('hashchange', () => { if (dialog.open && !opening) label.textContent = destination(); });
  document.getElementById('reopen-intro').addEventListener('click', () => {
    document.getElementById('map-contents').close();
    show(document.getElementById('open-contents'));
  });
  if (window.folioEntry.first) show(null);
  import('./front-paper-art.js').then(({frontPaperArt}) => {
    art.innerHTML = frontPaperArt;
    return import('./front-paper-motion.js');
  }).then(({bindFrontAnimation}) => {
    bindFrontAnimation(dialog, art.firstElementChild, document.getElementById('intro-motion'));
  }).catch(() => {});
})();
