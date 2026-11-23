// A new visit opens at the front cover, including a shared chapter or article link.
// Refresh and browser Back can resume a page already opened in this history entry.
const resumed = ['reload', 'back_forward'].includes(performance.getEntriesByType('navigation')[0]?.type)
  && history.state?.streetEntered === true;
let acceptFrontCover;
window.folioEntry = {
  first: !resumed,
  entered: resumed ? Promise.resolve() : new Promise(resolve => { acceptFrontCover = resolve; }),
  enter() {
    history.replaceState({ ...history.state, streetEntered:true }, '');
    acceptFrontCover?.();
  },
};
document.documentElement.classList.toggle('intro-open', !resumed);
if ((location.hash && !['#cover', '#home', '#map'].includes(location.hash)) || new URLSearchParams(location.search).has('s')) {
  document.documentElement.classList.add('opening-link');
}

// The print button is already on screen while the book is binding its first paper scene.
function rememberPrintRequest(event) {
  const button = event.target.closest?.('#btnRead');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  button.dataset.requested = 'true';
  button.setAttribute('aria-busy', 'true');
  document.querySelector('#btnOpen span').textContent = '正在翻開原刊…';
}
document.addEventListener('click', rememberPrintRequest, true);
document.addEventListener('folio-ready', () => document.removeEventListener('click', rememberPrintRequest, true), {once:true});
