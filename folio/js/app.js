// The page furniture around the book: title, captions, buttons, map and bound issue. It drives the stage and the scenes.
import { createStage } from './stage.js';
import { buildScene } from './kit.js';
import { ARTICLES } from './articles.js';
import { sourceTitle, sourceAuthors } from './editorial.js';
import { LANDS, ORDER } from './data.js';
import { routeFor, storyHash } from './routes.js';
import { makeSound } from './sound.js';
import { buildStreetHome } from './street-home.js';
import { makeEndnote } from './endnote.js';
import { bindBackmatter } from './backmatter.js';
import closingSpread from './scenes/closing.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const art = (n) => ARTICLES.find((a) => a.n === n);
const STORE = 'decision-atlas-twelve-v1';
const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } })();
const stamps = new Set(Array.isArray(saved.stamps) ? saved.stamps : []);
let preferredCloseView = typeof saved.closeView === 'boolean' ? saved.closeView : null;
let thanked = saved.thanked === true;
const save = () => { try { localStorage.setItem(STORE, JSON.stringify({ stamps: [...stamps], sound: sound.on, musicLevel: sound.musicLevel, effectsLevel: sound.effectsLevel, lastStation, closeView: preferredCloseView, thanked })); } catch { /* private mode */ } };
const params = new URLSearchParams(location.search);

const sound = makeSound(); sound.on = saved.sound !== false;
if (Number.isFinite(saved.musicLevel)) sound.musicLevel = saved.musicLevel;
if (Number.isFinite(saved.effectsLevel)) sound.effectsLevel = saved.effectsLevel;
const appEl = $('#app'), stage = createStage($('#world'));
if (window.folioEntry.first) stage.pause(true);
let hintText = '';
let toastTimer = 0, cardAt = null, cardGo = null, prev = 0, focusX = null, dockLater = null;
let bookHome, lastStation = Number.isInteger(saved.lastStation) && saved.lastStation > 0 && saved.lastStation < ORDER.length ? saved.lastStation : 0;
let defs = [], kits = [], cur = 0, busy = false, hoverId = null, bubbleAt = null, bubbleTimer = 0, hintAt = null, opened = false;
let inspection = null;
function endInspection() {
  if (inspection) stage.view.focusTo = inspection.previous;
  inspection = null;
}

async function loadDefs() {
  const out = await Promise.all(ORDER.map(async (entry) => {
    const scene = await import(`./scenes/${entry.id}.js`);
    return { ...entry, ...scene.default };
  }));
  out.forEach((d, i) => { d.no = i; d.folio ||= `${LANDS[d.land].en} · ${LANDS[d.land].name}`; d.plate ||= i ? 'PLATE ' + String(i).padStart(2, '0') : 'FOLD-OUT MAP'; });
  return [...out, closingSpread];
}
const app = {
  endInspection,
  hasThanked() { return thanked; },
  leaveThanks() {
    if (thanked) return;
    thanked = true; save(); closing.reflectThanks(stage.still.matches ? 0 : 1000);
  },
  refresh(S) { if (S.index === cur) renderDock(S); },
  bubble(pos, text, { cite = '', dur = 4.2, who = '' } = {}) {
    const b = $('#bubble'); b.innerHTML = (who ? `<b>${esc(who)}</b>` : '') + esc(text) + (cite ? `<cite>${esc(cite)}</cite>` : ''); b.hidden = false; b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    bubbleAt = pos.clone(); clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => { b.hidden = true; bubbleAt = null; }, dur * 1000 + text.length * 45);
  },
  hint(fn, text = '') { hintAt = fn; hintText = fn ? text : ''; $('#hint').hidden = !fn; },
  focus(x) { focusX = x; },
  sound(n,index,pan) { sound.play(n,index,pan); },
  toast(text, dur = 1.8) { const t = $('#toast'); t.textContent = text; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, dur * 1000); },
  /** a small paper card standing over a point of the picture; null hides it. data = {kicker, title, note, button}; go() runs when its button is pressed */
  card(pos, data, goFn) {
    const c = $('#card'); if (!pos) { c.hidden = true; cardAt = null; cardGo = null; return; }
    c.innerHTML = `<b>${esc(data.kicker || '')}</b><p>${esc(data.title || '')}</p>${data.note ? `<small>${esc(data.note)}</small>` : ''}${data.button ? `<button>${esc(data.button)}</button>` : ''}`;
    c.hidden = false; c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; cardAt = pos.clone(); cardGo = goFn || null;
  },
  /** the spread the reader was on before this one */
  from() { return prev; },
  nudge(id) { const b = $('#actions').querySelector(`[data-act="${id}"]`); if (!b) return; b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); sound.play('soft'); },
  accent(land) { return LANDS[land].color; },
  hoverId() { return hoverId; },
  complete(S) {
    if (S.index !== cur || !S.active) return;
    finishedScene = S;
    stamps.add(S.def.id); save(); renderDots();
    endnote.finish(S, keyboardStep === S);
    sound.play('stamp');
    renderDock(S);
  },
  go(id) { const i = typeof id === 'number' ? id : defs.findIndex((d) => d.id === id); if (i >= 0) go(i); },
  stamps, defs: () => defs,
  read(n,page) { openReader(n || 0,page); },
};

function enterPage(i) {
  endnote.enter(kits[i], stamps.has(defs[i].id));
  keyboardStep = null; finishedScene = null;
  sound.setScene(i);
  kits[i]._enter();
  if(i && !defs[i].backmatter){lastStation=i;save();} else if(!i) bookHome?.refresh(lastStation);
  // A reduced-motion or background WebKit view may not receive an animation
  // frame before focus enters the new page. Its landmarks must already exist.
  if (!i || stage.still.matches || document.hidden) stage.paintRestingPose();
}
function ensure(i) { if (!kits[i]) kits[i] = buildScene(defs[i], i, stage, app); return kits[i]; }
function announce(t) { $('#announce').textContent = t; }

// ---------------------------------------------------------------- furniture
const portrait = matchMedia('(orientation:portrait)');
function updateViewButton() {
  const btn = $('#btnView');
  const label = portrait.matches ? (stage.view.detail ? '看全景' : '近看紙景') : '視角歸位';
  btn.setAttribute('aria-label',label);btn.title=label;
  btn.querySelector('.ico').dataset.i = portrait.matches ? (stage.view.detail ? 'far' : 'near') : 'eye';
  btn.querySelector('.t').textContent=portrait.matches?(stage.view.detail?'全景':'近看'):'視角歸位';
}
function frameSpread(i) {
  stage.view.detail = i > 0 && !defs[i]?.backmatter && (preferredCloseView ?? false);
  updateViewButton();
}
portrait.addEventListener('change', () => frameSpread(cur));
// The line under a scene heading names the source articles by title. Their authors appear when a title is
// pointed at or focused, and are credited on the explanation card and the credits page.
function renderCredits(d) {
  const byline = $('#byline');
  byline.replaceChildren();
  for (const number of new Set((d.sources || []).map(s => s.n))) {
    const article = art(number);
    if (!article) continue;
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'credit-link';
    const title = document.createElement('span');
    title.className = 'source-title';
    title.textContent = '〈' + sourceTitle(article) + '〉';
    row.append(title);
    // The authors are not printed in the line; pointing at a title shows them, in Chinese and English.
    row.dataset.authors = sourceAuthors(article);
    row.setAttribute('aria-label', [title.textContent, sourceAuthors(article), '讀原文'].filter(Boolean).join('，'));
    row.onclick = () => openReader(article.n, d.quote?.n === article.n ? d.quote.page : article.pages[0], false, row);
    byline.append(row);
  }
}
// A heading is set clause by clause. It breaks right after the first comma, so a long question reads as a
// short opening line and then the rest.
function headingParts(title) {
  const phrases = title.match(/[^，]+，?/gu).map(part => {
    const phrase = document.createElement('span');
    phrase.textContent = part;
    return phrase;
  });
  if (phrases.length > 1) phrases.splice(1, 0, document.createElement('br'));
  return phrases;
}
function renderChapter(i) {
  endInspection();
  closeObjects();
  const d = defs[i], land = LANDS[d.land]; appEl.dataset.land = d.land;
  appEl.toggleAttribute('data-backmatter', Boolean(d.backmatter));
  closing.show(Boolean(d.backmatter));
  $('#eyebrow').textContent = i === 0 ? `${land.en} · ${land.name}` : d.backmatter ? '後記' : `${land.en} · ${land.name} · 第 ${i}／${ORDER.length - 1} 頁`;
  renderCredits(d);
  $('#heading').replaceChildren(...headingParts(d.title));
  $('#heading').classList.toggle('long', [...d.title].length > 9);
  showBookmark(i);
  $('#btnPrev').disabled = i === 0; $('#btnNext').disabled = i === defs.length - 1;
  $('#btnObjects').hidden = !i || Boolean(d.backmatter);
  $('#btnRead').title = d.quote ? '翻到本幕原刊第 ' + d.quote.page + ' 頁' : '翻開原刊全文';
  $('#world').setAttribute('aria-label', d.backmatter ? '傍晚的茶攤。拉一拉燈繩，看看街坊的窗。' : i ? d.short + '。' + d.title + '。可用下方按鈕操作，或拖書頁外側翻頁。' : '街角的決策智慧首頁。四個篇章，十二幕故事。');
  stage.view.focus = stage.view.focusTo = 0;
  frameSpread(i);
  document.title = storyTitle(i);
  renderDots();
}
function storyTitle(i) {
  return i ? (defs[i].short || defs[i].title) + '｜街角的決策智慧' : '街角的決策智慧';
}
const scrub = $('#page-scrub'), turnHint = $('#turnHint'), restingHint = turnHint.textContent;
function showBookmark(i, preview = false) {
  const number = String(i).padStart(2, '0'), total = ORDER.length - 1;
  const place = i ? defs[i].short : '全書首頁';
  scrub.max = defs.length - 1; scrub.value = i;
  scrub.setAttribute('aria-valuetext', defs[i].backmatter ? '後記與致謝' : i ? '第 ' + i + ' 幕，' + place : place);
  $('.transport').classList.toggle('scrubbing', preview);
  turnHint.textContent = preview ? place : restingHint;
  $('#counter').textContent = defs[i].backmatter ? '後記' : i ? number + ' / ' + total : 'MAP';
}
scrub.addEventListener('input', () => showBookmark(busy ? cur : Number(scrub.value), !busy));
scrub.addEventListener('change', () => {
  const next = Number(scrub.value);
  showBookmark(cur);
  if (!busy && !reader.isOpen && next !== cur) go(next);
});
scrub.addEventListener('pointercancel', () => showBookmark(cur));
scrub.addEventListener('blur', () => { if ($('.transport').classList.contains('scrubbing')) showBookmark(cur); });
function renderDots() {
  const el = $('#dots'); let h = '', prev = null;
  defs.forEach((d, i) => { if (prev && prev !== d.land) h += '<span class="gap"></span>'; prev = d.land;
    const name = d.backmatter ? '後記與致謝' : i ? '第 ' + i + ' 頁，' + esc(d.short || d.title) : '全書首頁';
    h += `<button class="${i === 0 ? 'map ' : ''}${d.backmatter ? 'end-leaf ' : ''}${i === cur ? 'on ' : ''}${stamps.has(d.id) ? 'done' : ''}" style="--c:${LANDS[d.land].color}" data-i="${i}" ${i === cur ? 'aria-current="page"' : ''} aria-label="${name}" title="${name}"><i></i></button>`; });
  el.innerHTML = h;
}
let lastCaption = '', finishedScene = null, keyboardStep = null;
const endnote = makeEndnote({ panel:$('#outcome'), tab:$('#endnote-tab'), article:art, read:openReader });
function renderDock(S) {
  const v = S.view(), dock = $('#dock'), box = $('#actions'), cap = $('#capText');
  if (box.querySelector('.held')) { dockLater = S; return; }
  const playing = busy || v.playing === true;
  if (v.playing && !busy && finishedScene !== S && !$('#outcome').hidden) endnote.close();
  if (playing && !dock.classList.contains('watching')) {
    clearTimeout(bubbleTimer); clearTimeout(toastTimer); bubbleAt = null;
    $('#bubble').hidden = $('#toast').hidden = $('#tip').hidden = true;
    closeObjects();
  }
  $('#btnObjects').setAttribute('aria-disabled', String(playing));
  appEl.toggleAttribute('data-performing', playing);
  dock.classList.toggle('watching', playing);
  dock.inert = playing;
  const text = playing || v.label === '先看' ? '' : (v.caption || '');
  const buttons = playing ? [] : finishedScene === S ? [
    { id: 'next-spread', label: defs[cur+1]?.backmatter ? '翻到後記與致謝' : '翻下一頁 →', primary: true },
    ...(stamps.size >= ORDER.length - 1 && !defs[cur+1]?.backmatter ? [{id:'ending', label:'後記與致謝', quiet:true}] : []),
    { id: 'replay', label: '重玩這一幕', quiet: true },
  ] : (v.buttons || []);
  dock.classList.toggle('silent', !text);
  if (text !== lastCaption) {
    lastCaption = text; cap.textContent = text;
    cap.classList.remove('flip'); if (text) { void cap.offsetWidth; cap.classList.add('flip'); }
  }
  const key = JSON.stringify(buttons);
  if (box.dataset.key === key) return;
  box.dataset.key = key;
  box.innerHTML = buttons.map(b => `<button data-act="${esc(b.id)}" class="${b.primary ? 'primary' : b.quiet ? 'quiet' : ''}" ${b.hold ? 'data-hold="1"' : ''} ${b.disabled ? 'disabled' : ''}>${esc(b.label)}</button>`).join('');
  if (buttons.length && keyboardStep === S) {
    keyboardStep = null;
    if (!reader.isOpen && document.activeElement === document.body) box.querySelector('.primary')?.focus({ preventScroll:true });
  }
}
function closeObjects() { $('#objects').hidden = true; $('#btnObjects').setAttribute('aria-expanded', 'false'); }
function visibleProp(p) {
  for (let node = p.node; node; node = node.parent) if (!node.visible) return false;
  return p.kind === 'curio' && p.label;
}
function exploreFromList(p) {
  endInspection();
  const kit = kits[cur], point = kit.world(p.node,p.aim || [0,0,0]);
  const x = stage.project(point).x;
  if (!stage.view.portrait || !stage.view.detail || (x>innerWidth*.16 && x<innerWidth*.84)) {
    kit._tap(p); return;
  }
  const centre = Math.max(-3,Math.min(3,point.x));
  inspection = {kit, prop:p, centre, previous:stage.view.focusTo, start:stage.clock, pending:true};
  stage.view.focusTo = centre;
  if (stage.still.matches) { stage.view.focus = centre; stage.paintRestingPose(); }
}
$('#btnObjects').onclick = () => {
  const layer = $('#objects');
  if (busy || appEl.hasAttribute('data-performing')) return;
  if (!layer.hidden) return closeObjects();
  const props = kits[cur]?.props.filter(visibleProp) || [];
  if (!props.length) return;
  layer.replaceChildren(...props.map(p => {
    const button = document.createElement('button');
    button.textContent = p.label;
    button.onclick = () => { closeObjects(); $('#btnObjects').focus(); if (visibleProp(p)) exploreFromList(p); };
    return button;
  }));
  layer.hidden = false; $('#btnObjects').setAttribute('aria-expanded','true'); layer.querySelector('button')?.focus();
};
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('#objects,#btnObjects')) closeObjects();
});


const sparks = Array.from({ length: 10 }, () => { const i = document.createElement('i'); i.className = 'spark'; i.hidden = true; $('#app').appendChild(i); return i; });
let sparkOn = false;
stage.afterFrame(() => {
  if(cur===0 && opened && !busy && !reader.isOpen && !stage.turning) bookHome?.project();
  const pts = sparkOn && opened && !busy && !stage.turning && !reader.isOpen && kits[cur] && !defs[cur].calm ? kits[cur]._sparks() : [];
  sparks.forEach((el, i) => { const p = pts[i]; if (!p) { el.hidden = true; return; } const s = stage.project(p); el.hidden = false; el.style.transform = `translate(${s.x}px, ${s.y}px)`; el.style.animationDelay = (i * -.37) + 's'; });
  if (cardAt) { const p = stage.project(cardAt), c = $('#card'); c.style.left = Math.max(170, Math.min(innerWidth - 170, p.x)) + 'px'; c.style.top = Math.max(190, p.y - 10) + 'px'; c.style.visibility = stage.turning ? 'hidden' : 'visible'; }
  if (bubbleAt) { const p = stage.project(bubbleAt), b = $('#bubble'); b.style.left = Math.max(150, Math.min(innerWidth - 150, p.x)) + 'px'; b.style.top = Math.max(130, p.y - 14) + 'px'; }
  if (inspection) {
    const shot=inspection, age=stage.clock-shot.start;
    if (busy || reader.isOpen || shot.kit!==kits[cur] || age>3.5 || !stage.view.detail) endInspection();
    else if (shot.pending && (Math.abs(stage.view.focus-shot.centre)<.35 || age>.58)) {
      shot.pending=false;
      if (visibleProp(shot.prop)) shot.kit._tap(shot.prop);
    }
  }
  stage.view.focusTo = stage.turning ? 0 : inspection ? inspection.centre : focusX != null ? Math.max(-3, Math.min(3, focusX)) : hintAt ? Math.max(-2.7, Math.min(2.7, hintAt().x)) : stage.view.focusTo;
  if (hintAt) { const p = stage.project(hintAt()), h = $('#hint'); h.style.transform = `translate(${p.x}px, ${p.y}px)`; h.style.visibility = stage.turning ? 'hidden' : 'visible'; }
});
stage.pickables = () => (opened && kits[cur] && !busy && !appEl.hasAttribute('data-performing') ? kits[cur].props : []);
stage.onTap = (hit) => { endInspection(); $('#tip').hidden = true; if (!hit) { $('#bubble').hidden = true; bubbleAt = null; return; } kits[cur]._tap(hit); };
stage.onPage = (dir) => { if (opened && !reader.isOpen) go(cur + dir); };
// a page picked up by hand: the scene pauses while the leaf is in the air, and resumes if the page is put back
stage.onGrab = (dir) => { const i = cur + dir; if (!opened || busy || reader.isOpen || i < 0 || i >= defs.length) return -1; ensure(i)._prepare(); busy = true; appEl.setAttribute('data-turning',''); kits[cur]._pause(true); renderDock(kits[cur]); $('#bubble').hidden = true; bubbleAt = null; $('#tip').hidden = true; sound.play('turn'); return i; };
stage.onDrop = (done, i) => {
  busy = false;appEl.removeAttribute('data-turning');
  if (!done) { kits[cur]._pause(false); app.refresh(kits[cur]); return; }
  kits[cur]._leave(); clearDock(); prev = cur; cur = i; presentSpread(i,false); sound.play('rise'); if (!pendingRoute) writeHash(storyHash(i)); enterPage(i); announce(defs[i].title);
};
function clearDock() { $('#dock').classList.add('watching'); $('#dock').inert=true; $('#toast').hidden = true; app.card(null); $('#actions').innerHTML = ''; $('#actions').dataset.key = ''; $('#capText').textContent = ''; lastCaption = ''; $('#dock').classList.add('silent'); }
let tipTimer = 0;
stage.onHover = (hit, ev) => {
  hoverId = hit?.id || null;
  const tip = $('#tip'); clearTimeout(tipTimer);
  if (cur === 0 && hit?.level) { bookHome?.preview(hit.level); tip.hidden = true; return; }
  if (!hit?.label || !ev || ev.buttons) { tip.hidden = true; return; }
  const pin = hintText && hintAt ? stage.project(hintAt()) : null;
  tip.textContent = pin && Math.hypot(ev.clientX - pin.x, ev.clientY - pin.y) < 38 ? hintText : hit.label;
  tip.hidden = false;
  const padding = tip.offsetWidth / 2 + 6;
  tip.style.left = Math.max(padding, Math.min(innerWidth - padding, ev.clientX)) + 'px';
  tip.style.top = Math.max(tip.offsetHeight + 12, ev.clientY) + 'px';
  tipTimer = setTimeout(() => { tip.hidden = true; }, 2600);
};

// ---------------------------------------------------------------- moving through the book
function presentSpread(i,instant){
  const isMap=i===0;
  appEl.dataset.cover=isMap?'yes':'no';
  $('#cover').classList.toggle('gone',!isMap);$('#cover').inert=!isMap;
  if(!isMap){for(const id of ['map-contents','map-notes']){const dialog=$('#'+id);if(dialog.open)dialog.close();}}
  renderChapter(i);
  if(isMap||prev===0){
    stage.view.focus=stage.view.focusTo=0;
    stage.view.home.yaw=isMap?-.075:.045;stage.view.home.tilt=isMap?.83:.51;
    if(instant||stage.still.matches){stage.view.yaw=stage.view.home.yaw;stage.view.tilt=stage.view.home.tilt;stage.view.zoom=1;}
    else stage.resetView();
  }
}
async function go(i, { instant=false, historyMode='push' }={}) {
  if(busy || reader.isOpen || i===cur || !Number.isInteger(i) || i<0 || i>=defs.length) return;
  busy=true; appEl.setAttribute('data-turning','');
  if(historyMode)writeHash(storyHash(i),historyMode);
  ensure(i)._prepare();kits[cur]?._leave();$('#bubble').hidden=$('#tip').hidden=true;bubbleAt=null;clearDock();
  prev=cur;cur=i;presentSpread(i,instant);
  if(!instant)sound.play('turn');
  if(instant||stage.still.matches){stage.show(i);stage.setLift(stage.spreads[i],1);}
  else{await stage.turnTo(i);sound.play('rise');}
  busy=false;appEl.removeAttribute('data-turning');enterPage(i);announce(defs[i].title);
  if(historyMode)(defs[i].backmatter?$('#closing-title'):i?$('#world'):$('#cover-title')).focus({preventScroll:true});
  sparkOn=false;setTimeout(()=>{sparkOn=true;},2400);
  if(i){const idle=window.requestIdleCallback||((f)=>setTimeout(f,300));idle(()=>{for(const k of [i+1,i-1])if(defs[k]&&!kits[k]&&!busy){ensure(k);break;}});}
}

const readerEl = $('#reader');
const reader = { get isOpen() { return !readerEl.hidden; } };
let origin = '#cover', readerTrigger = null, returnRequested = false;
let routeTimer = 0, pendingRoute = false;

function writeHash(hash, mode = 'push', state = {}) {
  if (mode !== 'replace' && location.hash === hash) return;
  history[mode === 'replace' ? 'replaceState' : 'pushState']({...state, streetEntered:true}, '', hash);
}
function queueRoute() {
  pendingRoute = true;
  clearTimeout(routeTimer);
  routeTimer = setTimeout(async () => {
    if (busy) return queueRoute();
    pendingRoute = false;
    await followRoute();
  }, 40);
}
function returnLabel() {
  return origin === '#ending' ? '返回後記' : ['#cover','#home','#map'].includes(origin) ? '返回全書首頁' : '返回這一幕';
}
function returnToStory() {
  if (!reader.isOpen || returnRequested || appEl.dataset.reading === 'closing') return;
  returnRequested = true;
  if (history.state?.boundIssue && history.state.origin === origin) history.back();
  else location.hash = origin;
}
function readPage(article, page, mode) {
  document.title = '原刊全文｜街角的決策智慧';
  window.DecisionReader.render(readerEl, {
    embedded: true, article, page, binding:stage.issue, articleTitle: a=>sourceTitle(art(a.n)||a), motion: !stage.still.matches,
    keyPage: opened && cur > 0 ? defs[cur].quote?.page : null,
    keyQuote: opened && cur > 0 ? defs[cur].quote?.t : null, mode,
    returnHash: origin, returnLabel: returnLabel(), onReturn: returnToStory,
    onLeaf: (event,dir) => sound.play(event==='cover-land'?'cover-set':'paper',null,dir*.23),
    onLayout: (layout, immediate) => {
      stage.issue.layoutChanged(layout);
      // When the type is enlarged it scrolls with both the leaves and the physical binding.
      const port = layout.port;
      const clip = layout.zoomed ? `inset(${port.top}px ${Math.max(0, innerWidth - port.right)}px ${Math.max(0, innerHeight - port.bottom)}px ${port.left}px)` : '';
      $('#world').style.setProperty('--reading-clip', clip);
      if (immediate && appEl.dataset.reading === 'open') stage.paintRestingPose();
    },
  });
}
const readingTools = [$('#world'), $('#chapter'), $('.transport'), $('#btnHome'), $('#cover'), $('#outcome'), $('#endnote-tab'), $('#closing-page')];
async function openReader(n = 0, page = art(n)?.pages[0] || 0, fromRoute = false, trigger = document.activeElement) {
  if (busy && !fromRoute) return;
  if (reader.isOpen) { readPage(n, page); return; }
  origin = opened ? storyHash(cur) : storyHash(0); readerTrigger = trigger; returnRequested = false;
  if (!fromRoute) writeHash(page === -1 ? '#read/back' : n || page ? `#read/${n}/p/${page}` : '#read', 'push', { origin, boundIssue: true });
  busy = true; closeObjects(); $('#tip').hidden = $('#bubble').hidden = true; bubbleAt = null;
  kits[cur]?._pause(true); stage.pause(false); sound.setScene(null);
  readingTools.forEach(el => { el.inert = true; });
  $('#dock').inert = true; $('#dock').classList.add('watching');
  appEl.dataset.reading = 'opening'; readerEl.hidden = false; readerEl.inert = true;
  $('#btnRead .t').textContent = returnLabel(); $('#btnRead').setAttribute('aria-label', returnLabel()); $('#btnRead').title = returnLabel();
  // From a scene's explanation card the page opens as readable text, with the cited sentence marked.
  stage.issue.begin(); readPage(n, page, trigger?.closest?.('#outcome') ? 'text' : undefined); sound.play('whoosh');
  if (!opened) stage.setLift(stage.spreads[cur], 0);
  await stage.issue.unfold(stage.still.matches || (!opened && page === 0) ? 0 : .9, opened);
  appEl.dataset.reading = 'open'; readerEl.inert = false; busy = false;
  readerEl.querySelector('.dr-title').focus({preventScroll:true});
}
async function closeReader() {
  busy = true; readerEl.inert = true; appEl.dataset.reading = 'closing';
  window.DecisionReader.suspend();
  await stage.issue.refold(stage.still.matches || !opened ? 0 : .9, opened);
  window.DecisionReader.destroy(); readerEl.hidden = true; readerEl.inert = false;
  $('#world').style.removeProperty('--reading-clip');
  delete appEl.dataset.reading;
  document.title = storyTitle(cur);
  readingTools.forEach(el => { el.inert = false; });
  $('#cover').inert = cur!==0;
  $('#btnRead .t').textContent = '原刊全文'; $('#btnRead').setAttribute('aria-label', '翻開原刊全文'); $('#btnRead').title = defs[cur].quote ? '翻到本幕原刊第 ' + defs[cur].quote.page + ' 頁' : '翻開原刊全文';
  if (opened) {
    stage.setLift(stage.spreads[cur], 1);
    busy = false; kits[cur]?._pause(false); sound.setScene(cur); app.refresh(kits[cur]);
    (readerTrigger?.closest('#byline button, #outcome button, #open-contents, #btnOpen, #closing-credits') || $('#btnRead')).focus({ preventScroll:true });
  } else { busy = false; stage.pause(true); $('#btnOpenRead').focus({preventScroll:true}); }
}
async function followRoute(initial = false) {
  const requested = location.hash;
  const legacy = initial && !requested && params.has('s') ? '#/' + params.get('s') : requested;
  const target = routeFor(legacy, defs);
  if (target.kind === 'reader') {
    const n = art(target.article) ? target.article : 0;
    const matching = defs.findIndex(d => d.sources?.some(s => s.n === n));
    const behind = routeFor(history.state?.origin || (matching > 0 ? storyHash(matching) : '#cover'), defs);
    const sameOrigin = behind.kind === 'story' ? cur===behind.index : cur===0;
    if (!sameOrigin) {
      if (reader.isOpen) await closeReader();
      if (location.hash !== requested) return queueRoute();
      await go(behind.kind==='story'?behind.index:0,{instant:true,historyMode:false});
    }
    if (location.hash !== requested) return queueRoute();
    await openReader(n, target.page ?? (art(n)?.pages[0] || 0), true);
    if (location.hash !== requested) queueRoute();
    return;
  }
  if (reader.isOpen) await closeReader();
  // A browser Back, pasted bookmark or another link may have arrived while the paper was rising.
  if (location.hash !== requested) return queueRoute();
  if (target.kind === 'cover') {
    if (requested && requested !== '#home' && requested !== '#cover') writeHash(storyHash(0), 'replace');
    if(cur!==0)await go(0,{instant:initial,historyMode:false});return;
  }
  if (location.hash !== storyHash(target.index)) writeHash(storyHash(target.index), 'replace');
  if (target.index!==cur) await go(target.index,{instant:initial,historyMode:false});
}
function openFrontispiece(){
  opened=true;cur=0;prev=0;stage.pause(false);stage.show(0);stage.setLift(stage.spreads[0],1);
  presentSpread(0,true);enterPage(0);
}

// ---------------------------------------------------------------- wiring
const closing = bindBackmatter({
  hasThanked: app.hasThanked,
  light: () => { if (!busy && !reader.isOpen && defs[cur]?.backmatter) kits[cur].run('light'); },
  read: openReader, home: () => go(0),
});
$('#contents-ending').addEventListener('click', e => {
  if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); $('#map-contents').close(); go(ORDER.length);
});
document.addEventListener('folio-front-show', () => { if (opened) stage.pause(true); });
document.addEventListener('folio-front-hide', () => { if (opened) stage.pause(false); });
$('#actions').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button || busy || reader.isOpen || button.dataset.hold) return;
  const id = button.dataset.act;
  if (e.detail === 0) keyboardStep = kits[cur];
  sound.play('tap');
  if (id === 'replay') enterPage(cur);
  else if (id === 'ending') go(ORDER.length);
  else if (id === 'next-spread') go(cur + 1 < defs.length ? cur + 1 : 0);
  else kits[cur].run(id);
});
// a button marked hold: true is pressed and held: the scene gets run(id, 'down') and then run(id, 'up')
$('#actions').addEventListener('pointerdown', (e) => { const b = e.target.closest('button[data-hold]'); if (!b || busy) return; b.setPointerCapture(e.pointerId); b.classList.add('held'); sound.play('tap'); kits[cur].run(b.dataset.act, 'down'); });
const dockFlush = () => { if (dockLater) { const S = dockLater; dockLater = null; app.refresh(S); } };
for (const ev of ['pointerup', 'pointercancel']) $('#actions').addEventListener(ev, (e) => { const b = e.target.closest('button[data-hold]'); if (!b || !b.classList.contains('held')) return; b.classList.remove('held'); kits[cur].run(b.dataset.act, 'up'); dockFlush(); });
$('#actions').addEventListener('keydown', (e) => { const b = e.target.closest('button[data-hold]'); if (b && (e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); b.classList.add('held'); kits[cur].run(b.dataset.act, 'down'); } });
$('#actions').addEventListener('keyup', (e) => { const b = e.target.closest('button[data-hold]'); if (b && b.classList.contains('held')) { b.classList.remove('held'); kits[cur].run(b.dataset.act, 'up'); dockFlush(); } });
$('#card').addEventListener('click', (e) => { if (e.target.closest('button') && cardGo && !busy) { sound.play('tap'); cardGo(); } });
$('#world').addEventListener('pointerdown', () => { $('#tip').hidden = true; });
$('#dots').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(Number(b.dataset.i)); });
$('#btnPrev').onclick = () => go(cur - 1); $('#btnNext').onclick = () => go(cur + 1);
$('#btnMap').onclick = $('#btnHome').onclick = () => go(0);
$('#btnView').onclick = () => {
  if (stage.view.portrait) {
    stage.view.detail=!stage.view.detail;
    if (cur && !defs[cur]?.backmatter) { preferredCloseView = stage.view.detail; save(); }
    stage.resetView(); updateViewButton();
  }
  else stage.resetView();
};
$('#btnRead').onclick = () => {
  if (reader.isOpen) { returnToStory(); return; }
  const key = defs[cur].quote;
  openReader(key?.n || 0, key?.page || 0);
};
const sb = $('#btnSound');
function soundLabel() {
  sb.setAttribute('aria-pressed', sound.on);
  sb.setAttribute('aria-label', '配樂與音效');
  sb.title = sound.on ? '關閉配樂與音效' : '開啟配樂與音效';
}
soundLabel();
function setSound(value) { sound.on = value; soundLabel(); save(); if(value)sound.unlock(); }
sb.onclick = () => setSound(!sound.on);
addEventListener('keydown', (e) => {
  if(e.defaultPrevented || reader.isOpen || !opened || document.querySelector('dialog[open]') || e.altKey || e.ctrlKey || e.metaKey || e.target.closest?.('input,textarea,select,dialog,#street-stops')) return;
  if (e.key === 'Escape') {
    if (!$('#objects').hidden) { closeObjects(); $('#btnObjects').focus(); }
    return;
  }
  if (e.key === 'Enter' && !e.target.closest?.('button,a,summary,[contenteditable]')) { const b = $('#card:not([hidden]) button') || $('#actions button.primary:not(:disabled)'); if (b) { e.preventDefault(); b.click(); } return; }
  if (e.key === 'ArrowRight') go(cur + 1); else if (e.key === 'ArrowLeft') go(cur - 1); else if (e.key === 'm' || e.key === 'M') go(0); else if (e.key === 'r' || e.key === 'R') stage.resetView();
});

export const ready = (async function boot() {
  defs = await loadDefs();
  await Promise.allSettled([document.fonts.load('700 32px "DW Sans"', '決策'), document.fonts.load('900 32px "DW Serif"', '決策'), document.fonts.load('500 16px "IBM Plex Mono"', 'PLATE')]);
  const mapScene=ensure(0);
  bookHome=buildStreetHome({defs,stamps,enter:i=>go(i),read:()=>openReader(0,0,false,$('#open-contents')),stage,sound,setSound,save,mapScene});
  await window.folioEntry.entered;
  if (navigator.userActivation?.hasBeenActive && sound.on) sound.unlock();
  openFrontispiece();
  $('#loading').textContent = '按住書頁外緣，往書脊拖就能翻頁。';
  window.__popup = { app, stage, sound, kits, defs, go, ensure, reader, state: () => ({ cur, busy, opened, turning: stage.turning, view: kits[cur]?.view(), found: kits[cur] ? [...kits[cur].found] : [] }) };
  addEventListener('hashchange', queueRoute); addEventListener('popstate', queueRoute);
  await followRoute(true);
  document.documentElement.classList.remove('opening-link');
})();
