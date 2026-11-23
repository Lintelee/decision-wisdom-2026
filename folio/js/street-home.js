import { LANDS } from './data.js';
import { storyHash } from './routes.js';
import { streetStops } from './street-stops.js';

const find = id => document.getElementById(id);
const number = i => String(i).padStart(2,'0');
function make(tag, cls, text) {
  const el=document.createElement(tag);
  if(cls) el.className=cls;
  if(text) el.textContent=text;
  return el;
}
export function buildStreetHome({defs, stamps, enter, read, stage, sound, setSound, save, mapScene}) {
  const stops=[], marks=[], hints=find('map-preview'), keys=find('street-stops');
  const contents=find('map-contents'), options=find('map-notes');
  let resume=0, current=1;
  function preview(level){
    if(!defs[level]) return;
    current=level;
    hints.querySelector('.map-folio').textContent='第 '+number(level)+' 幕 · '+streetStops[level-1].place;
    hints.querySelector('.map-question').textContent=defs[level].title;
  }
  function link(level, cls){
    const el=make('a',cls);el.href=storyHash(level);
    el.addEventListener('click',event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
      event.preventDefault();
      if(contents.open)contents.close();
      enter(level);
    });
    return el;
  }
  const lists=new Map();
  for(const land of ['prologue','people','model','ai']){
    const data=LANDS[land], group=make('section','chapter-index'), heading=make('h3'), list=make('ol');
    heading.append(make('small','',data.en),document.createTextNode(data.name));
    group.style.setProperty('--rule',data.color);group.append(heading,list);find('street-chapters').append(group);lists.set(land,list);
  }
  for(const [index,stop] of streetStops.entries()){
    const level=index+1,def=defs[level],plaque=link(level,'map-stop'),entry=link(level,'contents-stop');
    plaque.hidden=true;plaque.dataset.level=level;plaque.dataset.land=def.land;
    plaque.append(make('b','',number(level)),make('span','place-name',stop.place));
    plaque.addEventListener('focus',()=>preview(level));plaque.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')preview(level)});
    keys.append(plaque);stops.push(plaque);
    const row=make('li'),mark=make('span','visited','✓');mark.setAttribute('aria-label','已完成');
    entry.append(make('span','station',number(level)+'　'+stop.place),make('span','question',def.title),mark);
    row.append(entry);lists.get(def.land).append(row);marks.push(mark);
  }
  keys.addEventListener('keydown',e=>{
    const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(!delta||e.altKey||e.ctrlKey||e.metaKey) return;
    e.preventDefault();e.stopPropagation();
    const here=stops[current-1].getBoundingClientRect();
    let best=null,nearest=Infinity;
    for(const el of stops){
      if(el===e.target||el.hidden)continue;
      const pos=el.getBoundingClientRect(),dx=pos.x-here.x,dy=pos.y-here.y,forward=dx*delta[0]+dy*delta[1];
      if(forward<3)continue;
      const score=forward+Math.abs(dx*delta[1]-dy*delta[0])*2.7;
      if(score<nearest){best=el;nearest=score;}
    }
    best?.focus({preventScroll:true});
  });
  const coords=stops.map(()=>({x:NaN,y:NaN,node:null,offset:null}));
  function project(){
    for(const prop of mapScene.props){
      if(!prop.level)continue;
      const rec=coords[prop.level-1],el=stops[prop.level-1];if(!rec)continue;
      if(!rec.offset){rec.node=prop.node;rec.offset=new stage.T.Vector3(...prop.aim);rec.point=new stage.T.Vector3();}
      rec.point.copy(rec.offset);rec.node.localToWorld(rec.point);
      const p=stage.project(rec.point), x=Math.round(p.x), y=Math.round(p.y);
      if(x!==rec.x||y!==rec.y){el.style.left=x+'px';el.style.top=y+'px';rec.x=x;rec.y=y;}
      el.hidden=p.behind||x<5||x>innerWidth-5||y<12||y>innerHeight-8;
    }
  }
  find('open-contents').onclick=()=>contents.showModal();
  const motion=find('homeMotion'),audio=find('homeSound');
  const volume=find('musicVolume'), effectsVolume=find('effectsVolume');
  find('homePrefs').onclick=()=>{motion.checked=!stage.still.matches;audio.checked=sound.on;volume.value=Math.round(100*sound.musicLevel);effectsVolume.value=Math.round(100*sound.effectsLevel);options.showModal();};
  volume.oninput=()=>{sound.musicLevel=Number(volume.value)/100;save();};
  effectsVolume.oninput=()=>{sound.effectsLevel=Number(effectsVolume.value)/100;save();};
  effectsVolume.onchange=()=>sound.play('bamboo');
  motion.onchange=()=>{stage.setMotion(motion.checked);motion.checked=!stage.still.matches;};
  audio.onchange=()=>setSound(audio.checked);
  find('btnOpenRead').onclick=e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    e.preventDefault();if(contents.open)contents.close();read();
  };
  find('btnOpen').onclick=()=>enter(resume||1);find('btnOpen').disabled=false;
  return {project,preview,refresh(last){
    resume=last;let count=0;
    find('btnOpen').querySelector('span').textContent=resume?'接續第 '+number(resume)+' 幕':'從第一幕開始';
    stops.forEach((el,i)=>{
      const done=stamps.has(defs[i+1].id),here=resume===i+1;
      marks[i].hidden=!done;el.classList.toggle('last-read',here);el.classList.toggle('completed',done);
      el.setAttribute('aria-label','第'+(i+1)+'幕，'+streetStops[i].place+'。'+defs[i+1].title+(done?' 已完成':'')+(here?' 上次閱讀':''));
      if(done)count++;
    });
    find('route-progress').textContent='已完成 '+count+'／12 幕';preview(resume||1);
  }};
}
