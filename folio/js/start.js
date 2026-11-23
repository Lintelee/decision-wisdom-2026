// The original issue can be opened even when a browser cannot construct the paper stage.
function offerPrintIssue() {
  const app = document.getElementById('app'), reader = document.getElementById('reader');
  const entry = document.getElementById('btnOpen'), read = document.getElementById('btnRead');
  document.documentElement.classList.remove('opening-link');
  entry.disabled = false; entry.querySelector('span').textContent = '閱讀原刊全文';
  const hint = document.querySelector('.map-instruction');
  hint.textContent = '立體書暫時無法展開，可以先讀原刊。';
  document.getElementById('loading').textContent = hint.textContent;
  for (const id of ['open-contents','homePrefs','btnView','btnSound']) document.getElementById(id).hidden = true;
  document.querySelector('.transport').hidden = true;
  function close() {
    window.DecisionReader.destroy(); reader.hidden = true; delete app.dataset.reading;
    document.title = '街角的決策智慧'; entry.focus();
  }
  function open() {
    if (!reader.hidden) { close(); return; }
    reader.hidden = false; app.dataset.reading = 'fallback'; document.title = '原刊全文｜街角的決策智慧';
    window.DecisionReader.render(reader, {returnHash:'#home',returnLabel:'返回全書首頁',onReturn:close});
    const back = reader.querySelector('.dr-return');
    if (back) back.onclick = e => { e.preventDefault(); close(); };
  }
  entry.onclick = read.onclick = open;
  if (location.hash.startsWith('#read')) open();
}

try {
  await import('./paper.js');
  window.AtlasSets = {};
  await import('../../paper/stock.js');
  await import('../../paper/scenes-harbor.js');
  await import('../../paper/scenes-lab.js');
  await import('../../paper/breakfast-quay.js');
  const {ready} = await import('./app.js');
  await ready;
} catch (error) {
  console.error('立體書載入失敗', error);
  offerPrintIssue();
} finally {
  const read = document.getElementById('btnRead');
  document.dispatchEvent(new Event('folio-ready'));
  read.removeAttribute('aria-busy');
  if (read.dataset.requested && document.getElementById('reader').hidden) read.click();
  delete read.dataset.requested;
}
