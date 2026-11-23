// 第 4 頁｜雨衣試騎所｜陳蒔〈AI 可以幫人買東西：但品牌要讓人想買東西〉p.50–57
import { pulse } from './reading-beats.js';
import { keep, box, card, words, ring } from '../paper.js';
import { terrain, paperCloud } from './harbor-atelier.js';
import { rainLaneScenery } from './quay-streetscape.js';
import { raincoatShop, testBicycle, rainRig, cycle, commuter, helmet, orderForm, testPaper, swatchTable, gutterBoat } from './rainwear-atelier.js';

const DIARY = '「幫我找試騎所那件燕尾長擺雨衣。」戴紅安全帽的騎士記得，試騎後膝蓋還是乾的。AI 還沒比價，她已經選好了。';
const TAKEAWAY = '品牌在顧客還沒打算買時就讀懂他的生活，等到他請 AI 幫忙，心裡已經有了名字。';
const stops = {
  ready: { caption: '戴紅安全帽的水獺最怕騎到公司時膝蓋全濕。雨衣店邀她試騎，在膝上貼了張遇水會變藍的白紙。', id: 'go', label: '試騎她平常穿的短雨衣' },
  touch: { caption: '短雨衣只蓋到腰，膝上的白紙變藍了。換張新紙，再試店裡的燕尾長擺雨衣。', id: 'touch', label: '替騎士換長擺雨衣' },
  decision: { caption: '同樣的雨，這次沿著長下擺流走了。騎士掀開衣襬，膝上的紙還是白的。她今天還沒打算買。', id: 'order', label: '看她下次怎麼買' },
};

export default {
  id:'s04-want', land:'people', calm:true, short:'雨衣試騎所',
  title:'如何讓顧客在請 AI 比價前，就指名要買你的品牌？',
  sources:[{n:7}], diary:DIARY, takeaway:TAKEAWAY,
  quote:{t:'被 AI 找到，只是下一階段社群商務的門票；接下來的工作是回歸行銷的初心：挖掘 insight 、創造能喚醒購買動機的內容',n:7,page:51},
  look:{bg:'#41555a',table:'#7f9593',key:'#f5e9c9',fill:'#c4dce1',sky:'#e6efeb'},
  ground(G) {
    G.wash('#ded8c3').grid(.58,'#6b715320',.017);
    G.rect(0,1.26,12,.98,'#b6b8a6',{r:.04});
    for(const z of [.75,1.77]) G.path([[-6,z],[6,z]],{w:.037,col:'#6b837d',sharp:true});
    G.path([[-5.5,1.26],[5.6,1.26]],{w:.035,col:'#f0e3bd',dash:[.36,.25],sharp:true});
    G.rect(1.91,.14,4.46,2.23,'#a7b9ac',{r:.19,edge:'#e7d8b8',edgeW:.07});
    for(const x of [.11,3.72]) {
      for(let i=0;i<9;i++) G.rect(x,-.49+i*.14,.21,.047,'#6c817c',{r:.014});
    }
    G.blob([[2.03,1.45],[2.36,1.32],[3.11,1.4],[3.43,1.57],[3.08,1.79],[2.51,1.78]],'#8faeb0',{edge:'#e4ded0',edgeW:.035});
    G.marks('wave',2.36,1.49,3.08,1.68,{n:6,col:'#eef1de',size:.08});
  },
  build(S) {
    const st=S.state({phase:'intro',busy:true});
    const shortMotion=()=>S.stage.still.matches;
    const duration=(s)=>shortMotion()?Math.min(s,.12):s;
    const pause=(s)=>S.wait(duration(s));
    const shift=(obj,to,t,ease='inOut')=>S.to(obj,to,duration(t),ease);
    const idle=()=>!st.busy;
    terrain(S,'street');
    rainLaneScenery(S);
    S.plant(-.65,-2.85,g=>paperCloud(g,1.90,2.58,'#acb6b1'));
    S.plant(3.31,-3.14,g=>paperCloud(g,1.38,2.16,'#bec7bc'));

    let shop,clerk;
    S.plant(-2.64,-.78,g=>{shop=raincoatShop(g);},{s:1.31});
    S.plant(-3.91,.34,g=>{clerk=S.person(g,{s:1.30,kind:'adult',coat:'#486858',hair:'#59483b'});},{y:.35});
    const home=shop.cape.position.clone();
    S.plant(-2.83,1.89,g=>swatchTable(S,g),{s:.91,ry:.06});

    let rig,bike,mount,riding,leaf,firstSample;
    S.plant(1.88,.08,g=>{
      rig=rainRig(g);
      mount=keep(g,0,.10,0);
      bike=testBicycle(mount); riding=commuter(mount);
      const day=keep(g,1.22,1.52,-.36);
      card(day,0,0,0,.38,.49,'#e0c796',.033,.026);
      words(day,'17',0,.21,.043,.16,{color:'#4b605b'});
      leaf=keep(day,0,.436,.050);
      card(leaf,0,-.387,0,.344,.374,'#f3e4bd',.012,.018);
      words(leaf,'10',0,-.205,.020,.16,{color:'#4b605b'});
      box(day,0,.45,.069,.38,.073,.053,'#a85c48');
      box(g,-1.26,1.43,-.43,.30,.41,.044,'#b69a72');
      firstSample=testPaper(g); firstSample.paper.visible=false; firstSample.patch.visible=true;
    },{s:1.38});
    let zhi,order,price;
    S.plant(-.64,1.14,g=>{
      zhi=S.robot(g,{species:'frog',s:1.60,lights:S.index-1});
      price=keep(g,-.38,.19,.10); price.visible=false;
      card(price,0,0,0,.78,.78,'#efe0bd',.030,.026);
      for(const [i,number] of ['590','690'].entries()){
        const y=.48-i*.24;
        words(price,'$ '+number,0,y,.036,.14,{color:'#536862',weight:750});
        box(price,0,y-.103,.038,.62,.011,.009,'#ad9271');
      }
      order=orderForm(g);order.position.set(.56,.23,.20);
    });
    let returning;
    S.plant(0,1.16,g=>{
      returning=S.person(g,{x:2.22,s:1.40,species:'otter',coat:'#566c7d',hair:'#453d3a',prop:false});
      helmet(returning.head,0,.246,.077,.85);
      returning.root.visible=false;
    });
    let landing;
    S.plant(1.91,1.48,g=>{
      landing=keep(g,0,.024,0);
      for(const [x,z,r] of [[-.39,0,.12],[.13,.10,.20],[.47,-.03,.088]]) {
        ring(landing,x,0,z,r,.012,'#d9e6d9',20).rotation.x=-Math.PI/2;
      }
      gutterBoat(S,landing);
    });

    function stopAt(phase) {
      capeProp.drag=phase==='touch'?carry:null;
      S.set({phase,busy:false});
    }
    function startAction(phase) {
      if(st.phase!==phase || st.busy) return false;
      capeProp.drag=null; S.hint(null); S.set({phase:'busy',busy:true});
      return true;
    }

    let pedalling=false,protectedKnees=false,pedalAngle=.45,showerTime=0;
    function weather(on) {
      pedalling=on;
      rig.shower.visible=on;
      rig.runoffs.visible=on&&protectedKnees;
    }
    async function spray() {
      S.sound('soft'); await shift(rig.valve.rotation,{z:-1.9},.26);
      weather(true);
      await pause(1.45);
      weather(false); await shift(rig.valve.rotation,{z:0},.25);
    }
    async function shortRide() {
      if(!startAction('ready')) return;
      S.focus(riding.rider);
      await spray();
      riding.sample.patch.visible=true;
      S.sound('rain-drop');
      await shift(riding.head.rotation,{z:-.23},.29);
      await pause(.36);
      S.focus(shop.cape);
      stopAt('touch');
      S.hint(shop.cape,[0,.10,.07]);
    }
    async function fit() {
      if(!startAction('touch')) return;
      S.focus(riding.rider);
      // Pin the used blue strip beside the rig, then fit a fresh strip to exactly the same knee.
      const used=firstSample.paper;
      used.position.copy(S.local(used.parent,S.world(riding.sample.paper)));
      used.rotation.z=riding.legs[1].thigh.rotation.z;used.visible=true;riding.sample.paper.visible=false;
      await Promise.all([shift(used.position,{x:-1.26,y:1.43,z:-.365},.44),shift(used.rotation,{z:0},.44),shift(used.scale,{x:1.36,y:1.36,z:1.36},.44)]);
      riding.sample.patch.visible=false; riding.sample.paper.visible=true; riding.sample.paper.scale.setScalar(.08);
      await shift(riding.sample.paper.scale,{x:1,y:1,z:1},.22,'out');
      const shoulder=S.local(shop.cape.parent,S.world(riding.rider,[-.08,1.48,.28]));
      await shift(shop.cape.position,{x:shoulder.x,y:shoulder.y,z:shoulder.z},.56);
      shop.cape.visible=false;
      riding.worn.visible=true; S.sound('cloth'); riding.worn.scale.setScalar(.85);
      await shift(riding.worn.scale,{x:1,y:1,z:1},.23,'out');
      protectedKnees=true;
      await spray();
      S.sound('rain-drop');
      await Promise.all([shift(riding.hem.rotation,{z:.45,x:-.19},.54),shift(riding.hem.scale,{y:.64},.54)]);
      await shift(riding.head.rotation,{z:-.26},.24);
      await pause(.36);
      stopAt('decision');
    }
    async function buy() {
      if(!startAction('decision')) return;
      S.focus(zhi.root);
      // A calendar leaf turns. The station's test bike stays; the same rider returns in her red helmet.
      await Promise.all([shift(leaf.rotation,{x:-2.88},.42),shift(riding.rider.scale,{y:.035},.42,'in')]);
      leaf.visible=false; riding.rider.visible=false;
      shop.cape.position.copy(home);shop.cape.visible=true;
      returning.root.visible=true;
      price.visible=true; price.scale.y=.07;
      await Promise.all([S.walk(returning,{x:.49,z:0},duration(.87)),shift(price.scale,{y:.63},.77)]);
      returning.root.scale.x=-Math.abs(returning.root.scale.x);
      if(!shortMotion()) returning.wave(.46);
      order.visible=true;order.scale.setScalar(.05);
      S.sound('tick');
      await Promise.all([shift(order.scale,{x:.76,y:.76,z:.76},.46,'out'),shift(price.scale,{y:.025},.3)]);
      price.visible=false;
      if(shortMotion()) zhi.setLights(S.index);
      else { S.learn(zhi); await S.wait(1.82); }
      S.focus(null); stopAt('done'); S.done();
    }

    const trialLegs = riding.legs.flatMap(leg => [leg.thigh, leg.shin, leg.shoe]);
    S.onReadyLoop((phase) => {
      // Half a pedal stroke brings the uncovered knee into view. She looks down at the test strip.
      const stroke = pulse(phase, .03, .7), look = pulse(phase, .42, .92);
      cycle(riding.legs, pedalAngle - 1.45 * stroke);
      bike.wheels.forEach(wheel => { wheel.rotation.z -= 1.25 * stroke; });
      riding.head.rotation.z -= .28 * look; clerk.armR.rotation.z += .8 * look;
    }, 5.1, [...trialLegs, ...bike.wheels, riding.head, clerk.armR]);
    S.act('go',shortRide);S.act('touch',fit);S.act('order',buy);
    const capeProp=S.carry(shop.cape,{
      id:'poncho',label:'燕尾長擺雨衣',pad:.33,padAt:[0,.04,.04],aim:[0,.04,.04],
      targets:()=>[{node:riding.rider,at:()=>S.world(riding.rider,[0,1.29,.20]),r:91,drop:fit}],
      tap:()=>{if(st.phase==='touch') fit(); else if(idle()) S.wiggle(shop.cape,.065);},
    });
    const carry=capeProp.drag; capeProp.drag=null;
    S.pad(riding.rider,.46,[0,1.23,.12]);
    S.prop(riding.rider,{id:'rider',label:'騎車通勤的小岑',aim:[0,1.34,.15],tap:()=>{
      if(st.phase==='ready') shortRide();
      if(st.phase==='decision') buy();
    }});
    S.prop(zhi.root,{id:'zhi',label:'幫客人試雨衣、用 AI 比價的樹蛙點點',aim:[0,.72,.04],tap:()=>{
      if(st.phase==='ready') shortRide(); else if(st.phase==='decision') buy(); else if(idle()) zhi.wave(.56);
    }});
    S.curio(clerk.root,{id:'clerk',label:'帶人試穿的店員',quiet:true,tap:()=>{if(idle()) clerk.wave(.78);}});
    S.pad(bike.bell,.15,[0,.04,0]);
    let lastRing=-1;
    S.discovery(bike.bell,{id:'bell',label:'試騎車的銅鈴',duration:.93,reset(){lastRing=-1;},
      draw(u,visit,still){
        const double=visit%2===0, hit=pulse(u,.02,.32)+(double?pulse(u,.43,.75):0);
        bike.striker.rotation.z=-1.44*hit;
        bike.chimes.visible=(u>=.15&&u<.40)||(double&&u>=.58&&u<.89);
        bike.chimes.scale.setScalar(still?1:1+.42*hit);
        const count=u>=.58&&double?2:u>=.15?1:0,mark=visit*2+count;
        if(count&&mark!==lastRing){lastRing=mark;S.sound('cycle-bell',bike.bell);}
      }});
    S.on('reset',()=>{
      protectedKnees=false;pedalling=false;pedalAngle=.45;showerTime=0;
      capeProp.drag=null;cycle(riding.legs,pedalAngle);
    });
    S.on('enter',async()=>{
      mount.position.x=-.56;
      pedalling=true;await shift(mount.position,{x:0},.80,'out');pedalling=false;
      await pause(.16);stopAt('ready');
    });
    S.ui(()=>{
      if(st.busy) return {playing:true,caption:'',buttons:[]};
      const stop=stops[st.phase];
      return {playing:false,caption:stop?stop.caption:DIARY,buttons:stop?[{id:stop.id,label:stop.label,primary:true}]:[]};
    });
    S.tick((_t,dt)=>{
      if(!pedalling) return;
      if(!shortMotion()) {
        pedalAngle-=dt*5.0;cycle(riding.legs,pedalAngle);
        bike.wheels.forEach(w=>{w.rotation.z-=dt*5.4;});
      }
      if(!rig.shower.visible) return;
      showerTime+=dt;
      for(const {dash,x,offset} of rig.streaks) {
        const y=2.38-((showerTime*1.55+offset)%1)*2.20;
        dash.position.y=y;
        // The long, sloping lap panel catches the spray; the blue beads follow the outside edge.
        dash.visible=!protectedKnees || x<-.44 || x>.67 || y>1.79-Math.max(0,x)*.73;
      }
      rig.runoffs.position.y=-((showerTime*1.35)%1)*.082;
    });
  },
};
