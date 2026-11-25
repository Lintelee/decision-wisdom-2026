// 第 8 頁｜辦桌棚｜強義明〈「衡斷力 (Judgment)」將成為最稀缺的競爭力〉p.128–135；朱芳儀〈AI 代理時代的增長架構師〉p.36–43
// 你點就好：總舖師一秒寫出四十道菜的長菜單，繞在轉盤上；每個人都把轉盤推給下一個人，桌上還是沒有菜。
// 讀者把轉盤轉到請客的水牛伯面前，牠圈了一道。菜上桌，帳單也順著轉盤轉到牠面前：點菜的人，也是買單的人。
import { storyPanel, pulse } from './reading-beats.js';
import { C, keep, group, box, cyl, cone, ball, disc, ring, beam, poly, slab, card, tri, quad, tab, cratePlank } from '../paper.js';
import { flowerTile, foldTravel, paperStream, paperMechanism, steamCurl } from './market-craft.js';
import { fieldSun, fieldPress, issuePrint, pressPlate } from './market-atlas.js';

import { feastCourtyard, pavedCutout } from './market-streetscape.js';
import { aimPaperHand } from '../paper-hands.js';

const DIARY = '點菜的人，也是買單的人。';
const TC = [2.12, .60], TS = 1.66;            // TS: the table piece is planted at this scale                       // the round table's centre on the page
const MR = .6, NSEG = 20, DA = Math.PI * 2 * .9 / NSEG;   // the menu: a strip of twenty panels round the turntable, two dishes each
const FOOD = [C.honey, C.leaf, C.coral, C.red, C.gold, '#b9803f', C.mint];
const STRIPE = ['#ad6354','#decbaa','#6c898e'];
const HOST = [.50, 1.93], ABO = [1.29, -1.35], CE = [3.06, -1.24];   // the three guests' places
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function dinnerGong(S) {
  S.plant(-3.41,-2.39,(g) => {
    const frame=keep(g);
    const red='#a74e43', bronze='#ba8a4a', bamboo='#836346';
    tab(frame,1.48);
    for (const x of [-.65,.65]) {
      box(frame,x,.7,0,.078,1.40,.12,bamboo);
      box(frame,x,.055,0,.20,.09,.37,C.bark);
      box(frame,x,.83,.004,.09,.06,.13,'#d6aa6f');
      beam(frame,[x,.91,0],[x*.59,1.35,0],.03,bamboo,5);
    }
    poly(frame,[[-.83,.11],[-.70,.02],[-.42,0],[.42,0],[.70,.02],[.83,.11],[.74,.15],[.53,.10],[-.53,.10],[-.74,.15]],.16,red,0,1.32,-.072);
    const gong=keep(frame,0,1.33,.075);
    for (const side of [-1,1]) beam(gong,[side*.12,0,0],[side*.22,-.21,0],.016,C.ink,5);
    disc(gong,0,-.50,0,.382,'#75563d',.062,32);
    disc(gong,0,-.50,.043,.362,bronze,.054,32);
    ring(gong,0,-.50,.079,.315,.015,'#e3b86e',32);
    ring(gong,0,-.50,.078,.201,.009,'#9a703e',26);
    const boss=ball(gong,0,-.50,.091,.112,'#d5a258',1); boss.scale.z=.38;
    for (let i=0;i<14;i++) {
      const a=i*Math.PI/7;
      const dent=poly(gong,[[-.012,0],[0,.022],[.020,.005],[.009,-.015]],.006,i%2 ? '#d09c57' : '#ad7d45',Math.cos(a)*.267,-.50+Math.sin(a)*.267,.072);
      dent.rotation.z=a;
    }
    const mallet=keep(frame,.57,1.15,.24);
    beam(mallet,[0,0,0],[-.25,-.38,0],.025,C.wood,6);
    const head=ball(mallet,-.26,-.405,0,.081,red,1); head.scale.y=.82;
    beam(mallet,[-.26,-.43,0],[-.32,-.57,0],.017,C.red,4);
    const lamps=[];
    for(let i=0;i<3;i++) {
      const light=keep(frame,-.48+i*.48,1.39,.17);
      beam(light,[0,0,0],[0,-.08,0],.009,bamboo,4);
      const lantern=ball(light,0,-.138,0,.083,'#e79357',1); lantern.scale.y=.95;
      cyl(light,0,-.068,0,.036,.036,.019,C.gold,8);
      cyl(light,0,-.211,0,.037,.037,.019,C.gold,8);
      beam(light,[0,-.22,0],[0,-.288,0],.012,C.red,4);
      beam(light,[0,-.073,.027],[0,-.138,.080],.007,'#efc785',4);
      beam(light,[0,-.138,.080],[0,-.203,.029],.007,'#efc785',4);
      lamps.push(light);
    }
    S.pad(frame,.32,[0,.81,.09]);
    lamps.forEach(lamp=>{lamp.scale.y=.25;});
    let lastStrike=0;
    S.discovery(frame,{id:'opening-gong',label:'敲響開席鑼',duration:.95,draw(u,visit,reduced){
      const swing=Math.min(foldTravel(u,.01,.27),1-foldTravel(u,.30,.61));
      mallet.rotation.z=-.86*swing;
      const ringOut=foldTravel(u,.27,1);
      gong.rotation.x=(reduced ? .035 : .20)*Math.sin(ringOut*Math.PI*5)*(1-ringOut);
      const lit=visit%2?u:1-u;
      lamps.forEach((lamp,i)=>{lamp.scale.y=.25+.83*foldTravel(lit,.12+.13*i,.66+.12*i);});
      if(u>=.25&&u<1&&lastStrike!==visit){lastStrike=visit;S.sound('dinner-gong',gong);}
    },reset:()=>{lastStrike=0;}});
  },{ry:.16,s:1.11});
}

// The three serving plates carry consecutive fragments of one painted fish.
// Slide the rack open and the head, scales and forked tail meet across the rims.
function fishChinaRack(S) {
  S.plant(-2.98,1.64,(g) => {
    const rack=keep(g), dishes=[];
    const cobalt='#3e6d7e', ink='#456877', porcelain='#f2e6c9';
    tab(rack,1.04);
    for(const x of [-.52,.52]) {
      box(rack,x,.16,0,.08,.32,.37,C.bark);
      box(rack,x,.02,0,.17,.04,.42,C.wood);
    }
    box(rack,0,.32,-.005,1.42,.07,.44,'#967654');
    box(rack,0,.402,-.18,1.34,.13,.052,C.wood);
    for(let i=0;i<5;i++) flowerTile(rack,-.43+i*.215,.23,.188,.145,i%2 ? cobalt : porcelain,i%2 ? porcelain : cobalt);
    for (let i=0;i<3;i++) {
      const plate=keep(rack,0,.62,0);
      disc(plate,0,0,0,.255,'#c6c9b4',.052,28);
      disc(plate,0,0,.031,.244,porcelain,.022,28);
      ring(plate,0,0,.048,.215,.008,ink,26);
      for(let k=0;k<8;k++) {
        const a=k*Math.PI/4+Math.PI/8;
        disc(plate,.233*Math.cos(a),.233*Math.sin(a),.049,.009,cobalt,.006,6);
      }
      const y=.005,z=.050;
      if (i===0) {
        poly(plate,[[-.198,-.01],[-.145,.064],[-.042,.11],[.11,.105],[.213,.058],[.211,-.070],[.090,-.112],[-.057,-.10],[-.146,-.058]],.006,cobalt,0,y,z);
        disc(plate,-.098,.029,z+.008,.031,porcelain,.008,12);
        disc(plate,-.099,.030,z+.016,.012,ink,.007,9);
        beam(plate,[.043,.068,z+.011],[-.011,.003,z+.012],.009,porcelain,4);
        beam(plate,[-.011,.003,z+.012],[.026,-.060,z+.012],.009,porcelain,4);
      } else if(i===1) {
        poly(plate,[[-.213,.059],[-.095,.091],[.001,.139],[.094,.171],[.075,.092],[.207,.046],[.212,-.061],[.069,-.095],[-.050,-.107],[-.215,-.070]],.006,cobalt,0,y,z);
        for(const x of [-.135,-.020,.095]) for(const yy of [-.036,.035]) {
          beam(plate,[x,yy+.024,z+.012],[x+.028,yy,z+.012],.007,porcelain,4);
          beam(plate,[x+.028,yy,z+.012],[x+.005,yy-.021,z+.012],.007,porcelain,4);
        }
      } else {
        poly(plate,[[-.214,.048],[-.081,.029],[.029,.058],[.166,.153],[.136,.056],[.079,0],[.14,-.083],[.147,-.154],[.03,-.068],[-.08,-.022],[-.212,-.06]],.006,cobalt,0,y,z);
        for(const sign of [-1,1]) beam(plate,[.018,sign*.025,z+.012],[.113,sign*.105,z+.012],.008,porcelain,4);
      }
      dishes.push(plate);
    }
    S.pad(rack,.35,[0,.56,.06]);
    paperMechanism(S,rack,{id:'fish-plates',label:'攤開青花魚盤',sound:'cup',duration:.94},(u) => {
      dishes.forEach((dish,i) => {
        const spread=foldTravel(u,i*.09,.80+i*.09);
        dish.position.x=(i-1)*(.11+.318*spread);
        dish.position.z=.09+(2-i)*.074*(1-spread);
        dish.rotation.y=-.56*(1-spread);
        dish.rotation.z=(i-1)*.14*(1-spread);
      });
    });
  },{s:1.18,ry:.07});
}

function sodaService(S,table,diner) {
  const service=keep(table,.76,.43,.60);
  const bottle=keep(service), cap=keep(service,0,.54,0);
  cap.name='放回桌上的汽水瓶蓋';
  cyl(bottle,0,.16,0,.09,.09,.32,'#699f83',12);
  cyl(bottle,0,.35,0,.037,.091,.08,'#86b59a',12);
  cyl(bottle,0,.451,0,.034,.034,.13,'#74a489',12);
  cyl(bottle,0,.518,0,.047,.046,.025,'#457864',12);
  box(bottle,0,.19,.084,.12,.13,.012,'#f2e4bf');
  disc(bottle,0,.193,.094,.035,'#c6694f',.008,10);
  box(bottle,-.054,.27,.064,.014,.086,.006,'#c2d3ae');
  cyl(cap,0,0,0,.050,.054,.030,'#b85342',12);
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    box(cap,Math.cos(a)*.046,-.010,Math.sin(a)*.046,.011,.016,.013,'#ebbc90').rotation.y=-a;
  }
  const glass=keep(service,-.24,0,.208), rimY=.205;
  cyl(glass,0,.015,0,.072,.064,.027,'#95b5a2',12);
  for(let i=0;i<7;i++) {
    const a=i*Math.PI*2/7;
    beam(glass,[Math.cos(a)*.062,.023,Math.sin(a)*.062],[Math.cos(a)*.09,rimY,Math.sin(a)*.09],.008,'#c5d6b9',5);
  }
  ring(glass,0,rimY,0,.091,.011,'#ebdfbd',14).rotation.x=Math.PI/2;
  glass.name='遞到角鴞嘴邊的汽水杯';
  const drink=keep(glass,0,.027,0); drink.name='杯裡的琥珀汽水';
  cyl(drink,0,.076,0,.083,.063,.152,'#d69a58',12);
  cyl(drink,0,.153,0,.080,.083,.014,'#f0dba1',12);
  drink.visible=false;
  const foam=keep(bottle,.007,.49,.006);
  for(const [x,y,r] of [[-.019,.04,.029],[.021,.059,.035],[.002,.085,.027],[-.024,.119,.020]]) ball(foam,x,y,0,r,'#e9e4bc',0);
  foam.visible=false;
  const stream=paperStream(service,'#d9aa69','#f3d99e',.035);
  const cupHome=glass.position.clone(), tip=new S.T.Vector3(), rim=new S.T.Vector3();
  const capHome=cap.position.clone(), capRest=new S.T.Vector3(.065,.020,.10);
  S.pad(service,.12,[0,.28,0]);
  let lastSound=0;
  S.discovery(service,{id:'soda',label:'桌邊的玻璃瓶汽水',duration:1.32,draw(u,visit,reduced){
      const step=(visit-1)%4, open=step===0?foldTravel(u,.06,.50):step===3?1-foldTravel(u,.12,.74):1;
      if(lastSound!==visit&&u>=[.08,.23,.40,.73][step]&&u<1){
        lastSound=visit;S.sound(['fizz','pour','cup','clip'][step],step===2?glass:bottle);
      }
      const pour=step===1?Math.min(foldTravel(u,0,.28),1-foldTravel(u,.70,1)):0;
      cap.position.lerpVectors(capHome,capRest,open);
      cap.position.y+=(reduced ? .04 : .31)*Math.sin(open*Math.PI);
      cap.rotation.z=(reduced ? .12 : 1.6)*Math.sin(open*Math.PI);
      bottle.rotation.z=.48*pour; bottle.rotation.x=.25*pour; bottle.position.y=.135*pour;
      foam.visible=step===0&&u>.12&&u<.8;
      foam.scale.setScalar(Math.max(.001,pulse(u,.10,.80)));
      const full=step===1?foldTravel(u,.23,.72):step===2?1-foldTravel(u,.40,.62):0;
      drink.visible=full>.005; drink.scale.y=Math.max(.001,full);
      glass.position.copy(cupHome); glass.rotation.z=0;
      if(step===2){
        const sip=Math.min(foldTravel(u,.04,.40),1-foldTravel(u,.64,.96));
        glass.rotation.z=.50*sip;
        const mouth=S.local(service,S.world(diner().rig.mouth,[0,0,.035]));
        mouth.x+=Math.sin(glass.rotation.z)*rimY; mouth.y-=Math.cos(glass.rotation.z)*rimY;
        glass.position.lerp(mouth,sip);
      }
      if(step===1&&u>.19&&u<.73){
        tip.set(0,.524,0); bottle.localToWorld(tip); service.worldToLocal(tip);
        rim.set(cupHome.x,rimY,cupHome.z);
        stream.pour(tip,rim,Math.sin(Math.PI*foldTravel(u,.19,.73)));
      } else stream.hide();
    },reset:()=>{lastSound=0;}});
}

export default {
  id: 's08-judge', land: 'model', short: '你點就好', calm: true,
  title: 'AI 列了四十個方案，誰來選，誰為結果負責？',
  sources: [{ n: 14 }, { n: 5 }],
  diary: DIARY,
  takeaway: 'AI 幾秒就給出一大堆方案。難的不是答案不夠，是解法太多；選哪一個、為結果負責的，是人。',
  quote: { t: 'AI 可以生成答案、提供選項、加速執行；但為決策負責、為價值定錨的，始終是人。', n: 14, page: 135 },
  // One sentence from each of the scene's other source articles, for the list on the explanation card.
  more: [{ n: 5, page: 39, t: '工具能加速答案的產生，但策略人的價值，是判斷哪一個答案值得品牌投入。' }],
  look: { bg: '#53303a', table: '#bb8f8a', key: '#ffdcb4', fill: '#f0cfd6', sky: '#ffe9d6' },   // late afternoon
  ground(G) {
    G.wash('#e5c9b3');
    // The kitchen, cart and round table share the old lane. The curb is cut away for the serving cart.
    const lane=[[-5.87,-1.55],[-4.58,-1.73],[-3.80,-1.49],[-2.92,-2.01],[-2.77,-2.77],[-1.18,-2.77],[-1.44,-1.61],[-.44,-1.07],[1.03,-.72],[3.18,.39],[5.77,1.21],[5.72,2.60],[4.59,2.57],[3.40,2.29],[1.61,1.50],[.54,1.12],[-.87,.93],[-1.99,1.14],[-2.93,2.15],[-4.26,2.16],[-4.08,1.28],[-4.79,.98],[-5.84,1.03]];
    pavedCutout(G,lane,{mortar:'#aaa39b',colors:['#999d99','#a5a69c','#a3a6a1','#b0afa3'],width:1.23,depth:.62,angle:-.17,joint:.067});
    G.path([[-5.67,1.10],[-4.84,1.03],[-4.18,1.34],[-4.36,2.19],[-2.92,2.24],[-1.93,1.25],[-.9,1.04],[.48,1.23]],{w:.10,col:'#c4b39b',sharp:true});
    G.blob([[-5.76,-2.75],[-3.53,-2.56],[-3.59,-1.76],[-4.59,-1.80],[-5.73,-1.63]],'#ada47e',{sharp:true});
    G.blob([[4.67,-2.65],[5.74,-2.62],[5.74,.95],[5.01,.71],[4.74,-.31],[4.22,-1.37]],'#b0a585',{sharp:true});
    G.marks('dot', -6, -3.6, 6, 3.6, { n: 120, col: '#cf5a3e44', size: .2, seed: 8 });       // paper confetti from an earlier feast
    G.rect(2.39,-2.32,4.32,1.82,'#c9ac9d',{r:.07,edge:'#b89b8c',edgeW:.08});
    G.circle(TC[0]+.12,TC[1]+.12,1.88,'#c1a295',{edge:'#d6b49e',edgeW:.14});
  },
  build(S) {
    const st = S.state({ phase: 'intro', busy: false });
    let puffRate = .18, eatT = -1, pointing = false, signing = false;
    const signature = {u:0};
    const PHI = Math.atan2(HOST[1] - TC[1], HOST[0] - TC[0]);      // the direction of the host’s seat, seen from the table's centre
    dinnerGong(S);
    fishChinaRack(S);
    fieldPress(S,8);
    feastCourtyard(S);

    // ---- the sun, low in the west
    let rays; const lanterns=[];
    S.plant(-3.10, -3.25, (g) => { rays = fieldSun(g, { y: 2.66, r: .47 }); });
    S.discovery(rays,{id:'sun',label:'辦桌棚前的夕陽',duration:1.12,sound:'tin-tap',draw(u,visit,reduced){
      const dusk=visit%2?u:1-u;
      lanterns.forEach((lamp,i)=>{
        const glow=foldTravel(dusk,.10+i*.30,.48+i*.30);
        lamp.visible=glow>.02; lamp.scale.set(Math.max(.01,glow),.84*glow,Math.max(.01,glow));
        lamp.rotation.z=(reduced?0:.13)*Math.sin(u*Math.PI);
      });
    }});

    // ---- the landmark: a red, white and blue striped banquet tent
    S.plant(2.39, -2.44, (g) => {
      const HW = 1.65, ZF = .62, ZB = -.62, YE = 2.1, YR = 2.75, n = 11, sw = HW * 2 / n;
      tab(g, 3.2);
      for(const x of [-HW+.05,HW-.05]) for(const z of [ZF,ZB]) {
        beam(g,[x,0,z],[x,YE,z],.040,'#6a756b',6);
        for(const y of [.11,1.07,YE-.09]) cyl(g,x,y,z,.054,.054,.061,'#bd9869',8);
        beam(g,[x,.12,z],[x*.83,YE-.09,z],.015,'#ac9680',4);
      }
      for (let i = 0; i < n; i++) {
        const x0 = -HW + i * sw, x1 = x0 + sw, col = STRIPE[i % 3];
        // Sewn tarpaulin bows between the back seam and the front eave.
        const seam=x0+.012;
        for(const direction of [-1,1]) {
          const widths=[0,.225,.48,ZF+.07], heights=[YR,YR-.115,YE+.134,YE];
          for(let j=0;j<3;j++) quad(g,[x0,heights[j],widths[j]*direction],[x1,heights[j],widths[j]*direction],[x1,heights[j+1],widths[j+1]*direction],[x0,heights[j+1],widths[j+1]*direction],col);
          for(let j=0;j<3;j++) beam(g,[seam,heights[j]+.007,widths[j]*direction],[seam,heights[j+1]+.007,widths[j+1]*direction],.008,'#d5ba98',4);
        }
        // the scalloped valance along the front eave (right to left along its lower edge)
        const sc = []; for (let j = 0; j <= 8; j++) { const a = Math.PI * j / 8; sc.push([sw / 2 + Math.cos(a) * sw / 2, -Math.sin(a) * .16]); }
        poly(g, [[0, .1], [sw, .1], ...sc], .02, col, x0, YE - .1, ZF + .07);
      }
      // gable ends and a ridge pole
      for (const x of [-HW, HW]) tri(g, [x, YE, ZF + .06], [x, YR, 0], [x, YE, ZB - .06], C.white);
      beam(g, [-HW - .05, YR + .01, 0], [HW + .05, YR + .01, 0], .03, C.steel, 6);
      for(const end of [-1,1]){
        const x=end*(HW+.01);
        beam(g,[x,YE-.19,ZF],[x-end*.46,YE-.30,ZF],.018,'#947c62',5);
        beam(g,[x,YE-.12,ZF],[x+end*.48,.02,ZF+.22],.011,'#b79971',4);
        box(g,x+end*.48,.055,ZF+.22,.042,.11,.04,'#795e48');
      }
      pressPlate(g,'水牛伯請客',0,YE-.08,ZF+.098,1.30,.185,'#754a40','#fae8cc');
      // two paper lanterns under the front eave
      for(const x of [-.9,.9]){
        beam(g,[x,YE-.1,ZF],[x,YE-.32,ZF],.012,C.ink,4);
        ball(g,x,YE-.46,ZF,.14,C.red,1).scale.y=.85;
        cyl(g,x,YE-.33,ZF,.06,.06,.04,C.gold,8); cyl(g,x,YE-.59,ZF,.06,.06,.04,C.gold,8);
        const glow=keep(g,x,YE-.46,ZF+.011);
        ball(glow,0,0,0,.153,'#f6ba63',1);
        for(const s of [-1,1]) beam(glow,[s*.052,-.10,.098],[s*.072,.093,.097],.007,'#ce8054',5);
        glow.visible=false; lanterns.push(glow);
      }
    },{s:1.28});

    // ---- a stack of red plastic stools
    let stools, topStool;
    S.plant(-3.2,-.7,g=>{
      tab(g,.7); stools=keep(g);
      for(let i=0;i<5;i++){
        const seat=i===4?keep(stools):group(stools); seat.position.y=i*.13;
        cyl(seat,0,.22,0,.27,.29,.075,i===4?'#d96f56':C.red,12);
        for(const x of [-.18,.18]) for(const z of [-.11,.11]) beam(seat,[x*1.19,.015,z*1.26],[x,.205,z],.035,'#a84836',5);
        box(seat,0,.260,.01,.12,.006,.029,'#793f34');
        if(i===4) topStool=seat;
      }
      S.pad(stools,.25,[0,.50,0]);
    },{s:1.15});
    S.discovery(stools,{id:'stools',label:'疊在一起的紅板凳',duration:.88,sound:'wood-knock',draw(u,visit,reduced){
      const open=visit%2?u:1-u, slide=foldTravel(open,.18,.86);
      topStool.position.set(-.65*slide,.52*(1-slide)+Math.sin(Math.PI*open)*(reduced ? .055 : .27),.31*slide);
      topStool.rotation.y=-.35*slide;
    }});

    // ---- the serving cart: its tray is a reclaimed market plank; the steamer rides on it
    let plank,steamer,lid,serveTong; const puffs=[], buns=[];
    S.plant(-1.6, -.4, (g) => {
      tab(g, 1.1);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) { beam(g, [sx * .42, .08, sz * .2], [sx * .42, .56, sz * .2], .02, C.steel, 5); disc(g, sx * .42, .07, sz * .24, .07, C.dark, .04, 10); }
      box(g, 0, .25, 0, .9, .03, .44, '#b9b4a8');
      beam(g, [.45, .56, -.2], [.62, .78, -.2], .02, C.steel, 5); beam(g, [.45, .56, .2], [.62, .78, .2], .02, C.steel, 5); beam(g, [.62, .78, -.2], [.62, .78, .2], .025, C.dark, 5);
      plank = cratePlank(g, 0, .58, 0, { len: .96, h: .48, thick: .05 }); plank.rotation.x = -Math.PI / 2;
      serveTong=keep(g,.07,.28,.035);
      for(const z of [-.026,.026]) beam(serveTong,[-.28,0,-z*.5],[.24,0,z],.013,C.wood,5);
      steamer=keep(g,-.05,.61,0);
      for(let i=0;i<3;i++){cyl(steamer,0,.09+i*.17,0,.33,.32,.15,i%2?C.kraft:C.honey,16);cyl(steamer,0,.17+i*.17,0,.345,.337,.023,C.wood,16);}
      cyl(steamer,0,.524,0,.30,.30,.018,'#97714c',16);
      for(const [x,z,angle] of [[-.14,.05,-.13],[.12,.095,.24],[.025,-.13,-.22]]) {
        const bun=keep(steamer,x,.55,z); bun.rotation.y=angle; buns.push(bun);
        const bread=ball(bun,0,.049,0,.092,'#eedfc1',1); bread.scale.set(1.14,.75,.91);
        for(const side of [-1,1]) beam(bun,[side*.071,.073,.037],[0,.119,0],.006,'#bb9b76',5);
      }
      const bunny=buns[1]; bunny.name='藏在籠蓋下的兔子包';
      for(const side of [-1,1]){
        poly(bunny,[[0,0],[-.016,.056],[-.010,.108],[.013,.115],[.021,.067],[.014,.01]],.014,'#ead4aa',side*.028,.095,0).rotation.z=side*-.20;
        disc(bunny,side*.033,.065,.083,.009,C.ink,.006,8);
      }
      lid=keep(steamer,0,.62,0);
      const dome=ball(lid,0,.016,0,.35,C.honey,1); dome.scale.y=.35;
      for(const x of [-.13,-.035,.06,.14]) beam(lid,[x,.132-Math.abs(x)*.25,-.12],[x+.04,.12-Math.abs(x)*.25,.125],.008,'#b68a58',5);
      ball(lid,0,.154,0,.047,C.wood,0);
      for(let i=0;i<3;i++){const puff=keep(steamer,0,.74,0);steamCurl(puff);puff.rotation.y=i*.47;puffs.push(puff);}
      S.pad(steamer,.29,[0,.39,0]);
    },{s:1.36});
    paperMechanism(S,steamer,{id:'steamer',label:'等著上菜的竹蒸籠',sound:'lid',duration:.85},u=>{
      lid.position.set(-.48*u,.62+.16*u+.20*Math.sin(Math.PI*u),-.13*u);
      lid.rotation.z=.91*u; buns.forEach(bun=>{bun.visible=u>.13;});
    });
    paperMechanism(S,plank,{id:'plank',label:'送菜車的木托板',sound:'bamboo',duration:.62},u=>{
      serveTong.position.set(.07+.24*u,.28,.035+.37*u); serveTong.rotation.y=-.43*u;
    });

    // ---- the red round table and its turntable
    let tt,swirl,pen,ringMark,platter,bill,payment,sticks,purse,flap; const segs=[],chops=[],steamUp=[],stickPairs=[];
    S.plant(TC[0], TC[1], (g) => {
      tab(g, 1.6);
      cyl(g,0,.10,0,.91,.86,.15,'#776759',24);
      cyl(g,0,.25,0,1.14,1.2,.26,'#a3564e',30);
      cyl(g,0,.4,0,1.12,1.12,.05,'#b86959',30);
      for(const y of [.15,.35]) {
        const trim=ring(g,0,y,0,y>.2 ? 1.16 : 1.198,.010,'#dbb47f',46);
        trim.rotation.x=Math.PI/2;
      }
      for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2; box(g, Math.cos(a) * 1.17, .18, Math.sin(a) * 1.17, .01, .12, .2, '#a9432f').rotation.y = -a; }
      const brocade=[[-.044,0],[0,.035],[.044,0],[0,-.035]];
      for(let i=0;i<24;i++) {
        const a=i*Math.PI/12, fold=group(g);
        fold.position.set(Math.sin(a)*1.18,.258,Math.cos(a)*1.18); fold.rotation.y=a;
        poly(fold,brocade,.009,'#e1a365');
      }
      // a plate and a pair of chopsticks at each seat
      for (const [sx, sz] of [HOST, ABO, CE, [4.0, .9]]) {
        const a = Math.atan2(sz - TC[1], sx - TC[0]), x = Math.cos(a) * .9, z = Math.sin(a) * .9;
        cyl(g, x, .435, z, .15, .13, .025, C.white, 16); cyl(g, x, .45, z, .1, .1, .008, '#f0e6d2', 16);
        const glaze=ring(g,x,.453,z,.123,.006,'#668b91',18);glaze.rotation.x=Math.PI/2;
        const rest=group(g); rest.position.set(x,.46,z); rest.rotation.y=-a;
        box(rest,0,.005,.158,.07,.018,.058,'#e4cb9b');
        for(const dz of [.142,.167]) beam(rest,[-.16,.017,dz],[.14,.018,dz+.011],.006,C.bark,4);
      }
      // two curved arrows: the menu goes round and round (shown while nobody chooses)
      swirl = keep(g, 0, .82, 0);
      for (const a0 of [0, Math.PI]) { const R = .88, n = 9, span = 1.5; let prev = null;
        for (let j = 0; j <= n; j++) { const a = a0 + span * j / n, q = [Math.cos(a) * R, 0, Math.sin(a) * R]; if (prev) beam(swirl, prev, q, .032, C.ink, 5); prev = q; }
        const a = a0 + span, hd = cone(swirl, Math.cos(a) * R, 0, Math.sin(a) * R, .08, .2, C.ink, 8); hd.rotation.set(0, -a - Math.PI / 2, -Math.PI / 2); }
      swirl.visible = false;
      // the turntable
      tt = keep(g, 0, .43, 0);
      cyl(tt, 0, .02, 0, .74, .74, .03, '#f6efe2', 32); cyl(tt, 0, .04, 0, .1, .1, .02, '#e2d6bf', 12);
      const underglaze=keep(tt,0,.044,0); underglaze.rotation.x=-Math.PI/2;
      issuePrint(underglaze,'model',0,0,.007,.81,'#ae8b84');
      for(let i=0;i<28;i++){
        const a=Math.PI*i/14,inner=i%7 ? .668 : .632;
        beam(tt,[Math.cos(a)*inner,.043,Math.sin(a)*inner],[Math.cos(a)*.696,.043,Math.sin(a)*.696],.006,'#a88c75',4);
      }
      // the long menu: twenty panels, two little dishes drawn on each
      for (let i = 0; i < NSEG; i++) {
        const a = -(i + .5) * DA - .1, k = keep(tt, Math.cos(a) * MR, .035, Math.sin(a) * MR); k.rotation.y = Math.PI / 2 - a;
        const ln = group(k); ln.rotation.x = .62; k.userData.lean = ln;                // the strip leans out, so its dishes face up
        card(ln, 0, 0, -.006, .17, .24, '#fffaf0', .012, .02);
        box(ln, 0, .232, .008, .17, .016, .004, C.red);
        for (const [j,y] of [[0,.07],[1,.158]]) {
          const kind=i*2+j, ink=FOOD[kind%FOOD.length];
          disc(ln,0,y,.012,.045,C.white,.006,14);
          if (kind%3===0) {
            poly(ln,[[-.030,0],[-.015,.017],[.008,.018],[.021,.005],[.032,.016],[.030,-.014],[.016,-.006],[-.006,-.013],[-.017,-.010]],.006,ink,0,y,.016);
          } else if(kind%3===1) {
            for (const [x,dy] of [[0,.012],[-.014,-.007],[.014,-.007]]) disc(ln,x,y+dy,.018,.014,ink,.007,8);
          } else {
            poly(ln,[[-.029,-.008],[-.012,.011],[.028,.021],[.013,-.005],[-.01,-.016]],.006,ink,0,y,.016);
            beam(ln,[-.023,y-.012,.024],[.024,y+.015,.024],.0027,C.edge,4);
          }
        }
        k.visible = false; segs.push(k);
      }
      // the host’s selection, on the dish next to the pen
      ringMark = keep(segs[0].userData.lean, 0, .07, .026); ring(ringMark, 0, 0, 0, .062, .012, C.red, 18); ringMark.visible = false;
      // the pen clipped to the end of the menu
      pen = keep(tt, Math.cos(0) * MR, .035, Math.sin(0) * MR); pen.rotation.y = Math.PI / 2;
      { const p = keep(pen); p.rotation.z = -.32;
        beam(p, [0, .0, .02], [0, .36, .02], .032, C.navy, 8); cone(p, 0, -.035, .02, .032, .07, C.ink, 8).rotation.z = Math.PI;
        cyl(p, 0, .38, .02, .036, .036, .08, C.gold, 8); box(p, .04, .3, .02, .012, .12, .02, C.gold); }
      pen.visible = false;
      // the dish that comes (hidden): a whole fish on a big oval platter
      platter = keep(tt, 0, .04, 0);
      { const pl = cyl(platter, 0, .02, 0, .3, .27, .04, C.white, 24); pl.scale.z = .72; const pi = cyl(platter, 0, .045, 0, .25, .25, .006, '#f3e6c8', 24); pi.scale.z = .66;
        const fish = group(platter); fish.scale.setScalar(.82);
        slab(fish, [[-.24, 0], [-.12, -.11], [.06, -.12], [.18, -.06], [.2, 0], [.18, .06], [.06, .12], [-.12, .11]], .05, '#e07a45', .05);
        slab(fish, [[.18, 0], [.32, -.1], [.3, 0], [.32, .1]], .04, '#cf5a3e', .05);
        disc(fish, -.15, .1, .0, .018, C.ink, .01, 8).rotation.x = -Math.PI / 2;
        for (const [x, z] of [[-.05, .14], [.08, -.15], [-.22, -.12], [.26, .12]]) ball(fish, x, .08, z, .045, C.leaf, 0);
        for (const x of [-.1, .05]) beam(fish, [x, .1, -.09], [x + .03, .1, .09], .008, '#7d3f35', 4);
        for(let i=0;i<2;i++){const p=keep(platter,-.05+i*.12,.3,0);steamCurl(p);p.rotation.y=i*.53;steamUp.push(p);} }
      platter.visible = false;
      // the bill arrives on an empty saucer; the host pays on receipt. It turns to face the reader wherever the turntable is.
      bill = keep(tt, 0, .035, 0);
      { cyl(bill, 0, .015, 0, .15, .12, .03, C.white, 16);
        const sl = keep(bill, 0, .03, -.03); sl.rotation.x = -.22;
        card(sl, 0, 0, 0, .4, .54, '#fffdf4', .014, .03);
        for (let i = 0; i < 4; i++) box(sl, -.03 + (i % 2) * .03, .47 - i * .08, .017, .3 - (i % 2) * .06, .024, .004, '#8a8174');
        box(sl, 0, .13, .017, .32, .04, .004, C.red); box(sl, 0, .07, .017, .32, .014, .004, C.red);
        payment = keep(bill);
        payment.name = '水牛伯付的席錢';
        cyl(payment, 0, .015, 0, .085, .085, .03, C.gold, 14);
        ring(payment, 0, .033, 0, .059, .007, '#b48747', 14).rotation.x = Math.PI / 2;
        payment.visible = false; }
      bill.visible = false;
      // the chopstick holder and a bottle of soda: still parts of the table, they move when tapped
      sticks=keep(g,.95,.43,-.15);
      cyl(sticks,0,.12,0,.097,.081,.24,C.kraft,10);
      cyl(sticks,0,.245,0,.091,.091,.012,'#805840',10);
      for(let i=0;i<3;i++){
        const pair=keep(sticks,0,.115,0), angle=i*Math.PI*2/3;
        pair.rotation.y=angle;
        for(const x of [-.018,.018]) beam(pair,[x,-.05,.015],[x*1.7,.36,.068],.011,i===1?'#ad6350':C.bark,5);
        stickPairs.push(pair);
      }
      S.pad(sticks,.10,[0,.29,0]);
      sodaService(S,g,()=>ce);
      // three pairs of chopsticks that reach for the fish (hidden until it comes)
      for (const [sx, sz] of [HOST, ABO, CE]) {
        const a = Math.atan2(sz - TC[1], sx - TC[0]), k = keep(g, Math.cos(a) * .75, .63, Math.sin(a) * .75); k.rotation.y = -a;
        for (const dz of [-.02, .02]) beam(k, [0, 0, dz], [-.5, -.12, dz * .3], .01, C.bark, 4);
        k.visible = false; chops.push(k);
      }
    }, { s: TS });
    S.discovery(sticks,{id:'sticks',label:'三雙竹筷的筷筒',duration:.78,sound:'bamboo',draw(u,visit){
      const pick=stickPairs[(visit-1)%stickPairs.length];
      const lift=Math.min(foldTravel(u,.03,.32),1-foldTravel(u,.53,1));
      pick.position.y=.115+.27*lift; pick.rotation.z=(visit%2?1:-1)*.21*lift;
    }});

    // ---- the dog under the table
    let dog, dogHead, dogBowl, tail, ripple;
    S.plant(2.95, 2.42, (g) => {
      dog = keep(g);
      const b = ball(dog, 0, .16, 0, .17, C.honey, 1); b.scale.set(1.35, .75, .8);
      const h=dogHead=keep(dog,-.2,.3,.04); ball(h,0,0,0,.11,C.honey,1);
      for(const sx of [-1,1]) poly(h,[[-.03,0],[.03,0],[0,-.12]],.02,C.wood,sx*.07,.07,.02);
      for (const sx of [-1, 1]) disc(h, sx * .04, .02, .1, .014, C.ink, .01, 8); ball(h, -.0, -.035, .1, .022, C.ink, 0);
      for (const x of [-.12, .12]) box(dog, x, .05, .06, .05, .1, .05, C.honey);
      tail = keep(dog, .22, .2, 0); beam(tail, [0, 0, 0], [.14, .12, 0], .02, C.honey, 4);
      dogBowl=keep(g,-.33,0,.17);
      cyl(dogBowl,0,.050,0,.143,.173,.085,'#6c8c83',14);
      cyl(dogBowl,0,.094,0,.124,.124,.009,'#96b4b1',16);
      ripple=keep(dogBowl,0,.104,0);
      ring(ripple,0,0,0,.090,.009,'#e7dcb9',16).rotation.x=Math.PI/2; ripple.visible=false;
      S.pad(dog,.19,[-.03,.22,0]);
    }, { s: 1.1 });
    S.discovery(dog,{id:'dog',label:'桌腳喝水的小狗',duration:1.16,sound:'bark',draw(u,visit,reduced){
      const sip=Math.min(foldTravel(u,.08,.37),1-foldTravel(u,.68,.94));
      dogHead.position.set(-.20-.11*sip,.30-.151*sip,.04+.046*sip); dogHead.rotation.z=.33*sip;
      tail.rotation.z=Math.sin(u*Math.PI*4)*sip*(reduced ? .07 : .45);
      const wave=foldTravel(u,.36,.82); ripple.visible=wave>0&&wave<1;
      ripple.scale.set(Math.max(.01,wave),1,Math.max(.01,wave));
      if(u>=.35&&u<1&&dogBowl.userData.sip!==visit){dogBowl.userData.sip=visit;S.sound('drip',dogBowl);}
    },reset:()=>{delete dogBowl.userData.sip;}});

    // ---- the guests: the host, the otter and the note-taking owl sit at the back of the table
    let host, abo, ce, invitation, writingPen, walletHand;
    const inkRing = [];
    S.plant(HOST[0], HOST[1], (g) => {
      host = S.person(g, {s:1.64,kind:'elder',species:'buffalo'});
      walletHand = keep(host.rig.grips[0], 0, 0, .035);
      purse = keep(walletHand, 0, -.10, 0); purse.name='水牛伯的結帳錢包';
      box(purse,0,0,0,.25,.17,.045,'#74493d');
      flap = keep(purse,0,.08,.023); poly(flap,[[-.12,0],[.12,0],[.10,-.055],[.01,-.09],[-.11,-.055]],.008,'#ac6554');
      disc(flap,0,-.061,.012,.013,C.gold,.008,8);
      purse.visible = false;
      invitation=keep(host.inner,.015,.58,.17); invitation.name='水牛伯圈菜的席單';
      box(invitation,0,0,0,.28,.21,.012,'#fbefd4');
      for(const y of [-.087,.086]) box(invitation,0,y,.011,.256,.009,.006,'#ad6154');
      poly(invitation,[[-.054,0],[-.026,.022],[.008,.029],[.041,.014],[.071,.032],[.066,-.014],[.041,-.002],[.015,-.021],[-.026,-.020]],.006,'#426b72',0,0,.014);
      disc(invitation,-.029,.008,.023,.004,C.white,.005,6);
      const curve=t=>[.004+.090*Math.cos(t),.003+.058*Math.sin(t),.025];
      for(let i=0;i<20;i++){
        const line=keep(invitation); beam(line,curve(i*Math.PI/10),curve((i+1)*Math.PI/10),.0052,C.red,4);
        line.visible=false; inkRing.push(line);
      }
      invitation.visible=false;
      writingPen=keep(host.inner); writingPen.name='水牛伯握的圈菜筆';
      beam(writingPen,[0,-.10,0],[0,.105,0],.015,C.navy,7);
      beam(writingPen,[0,.105,0],[0,.145,0],.007,'#ac4940',5);
      writingPen.visible=false;
    });
    S.plant(ABO[0], ABO[1], (g) => { abo = S.person(g, { s: 1.34, kind: 'adult', species: 'otter', coat: C.blue, hair: '#8f8a80' }); });
    S.plant(CE[0], CE[1], (g) => { ce = S.person(g, { s: 1.34, kind: 'ce', coat: C.navy }); });
    for(const [p,id,label,gesture] of [
      [host,'gran','穿棗紅長衫、作東的水牛伯',()=>{host.wave(1.2);S.sound('cloth');}],
      [abo,'abo','等著開席的阿伯',()=>{abo.doubt();abo.hop(.10);}],
      [ce,'ce','在桌邊記菜的角鴞',()=>{ce.wave(.85);S.sound('pencil');}],
    ]){
      const c=S.curio(p.root,{id,label,quiet:true,tap:gesture});p.propId=c.id;
    }

    // ---- 總舖師
    let zhi;
    S.plant(-1.02, 1.54, (g) => { zhi = S.robot(g, { species: 'bear', s: 1.70, lights: S.index - 1 }); });
    S.hero(zhi, { label: '辦桌的黑熊總舖師', ready: () => st.phase === 'ready', go });

    // ---- the story
    const penAngle = () => wrap(-tt.rotation.y);          // where the pen is now, seen from the table's centre (world angle)
    async function go() {
      if (st.phase !== 'ready') return; S.set({ phase: 'busy' });
      zhi.cheer(); S.sound('paper');
      for (let i = NSEG - 1; i >= 0; i--) { S.show(segs[i], .18); await S.wait(.05); }
      await S.show(pen, .3); zhi.still(); zhi.wave(1);
      await S.wait(.3);
      // nobody wants to choose: each one pushes the turntable on to the next (you order, you order)
      const target = -2 * Math.PI + .95;
      S.sound('wheel'); S.to(tt.rotation, { y: target }, 1.83, 'inOut'); S.show(swirl, .3);
      for (const p of [host, abo, ce]) { p.wave(.7); p.hop(.12); await S.wait(.61); }
      await S.wait(.22); pointing = true; S.emote(abo, '…', 1.6, C.ink);
      await S.wait(.6);
      S.set({ phase: 'touch' }); S.hint(pen, [0, .3, 0], '轉給穿棗紅長衫的水牛伯');
    }
    async function touch(byHand) {
      if (st.phase !== 'touch' || st.busy) return; st.busy = true; S.hint(null); S.refresh();
      pointing = false; S.hide(swirl, .25);
      const d = wrap(PHI - penAngle());
      if (Math.abs(d) > .14) S.sound('wheel');
      await S.to(tt.rotation, { y: tt.rotation.y - d }, byHand ? .25 : Math.max(.5, Math.abs(d) * .45), byHand ? 'out' : 'inOut');
      host.still(); abo.still();
      const menu = S.local(host.inner,S.world(ringMark));
      invitation.position.copy(menu); invitation.visible=true;
      await S.to(invitation.position,{x:.015,y:.58,z:.17},.60,'inOut');
      pen.visible=false; signing=writingPen.visible=true;
      S.sound('pencil'); await S.to(signature,{u:1},1.25,'lin'); await S.wait(.42);
      signing=writingPen.visible=false;
      await S.to(invitation.position,{x:menu.x,y:menu.y,z:menu.z},.48,'inOut');
      invitation.visible=false; ringMark.visible=true;
      await S.wait(.36);
      // the rest of the menu folds away: one dish chosen out of forty
      S.sound('paper');
      for (let i = NSEG - 1; i > 0; i--) { S.hide(segs[i], .12); await S.wait(.03); }
      await S.wait(.3);
      // the dish arrives from the steamer on the cart
      const from = S.local(tt, S.world(steamer, [0, .6, 0]));
      platter.position.copy(from); platter.rotation.y = tt.rotation.y * -1;
      S.show(platter, .3); S.sound('whoosh'); puffRate = 1;
      await S.to(platter.position, { x: from.x * .5, y: .9, z: from.z * .5 }, .4, 'out');
      await S.to(platter.position, { x: 0, y: .04, z: 0 }, .4, 'in'); S.sound('cup');
      host.cheer(); abo.cheer(); ce.cheer(); zhi.cheer();
      chops.forEach((k, i) => { S.wait(i * .15).then(() => S.show(k, .3)); }); eatT = 0;
      await S.wait(1.0);
      host.still(); abo.still(); ce.still(); zhi.still();
      // the bill comes too, and it rides the turntable round to the one who chose
      const b0 = -.7, r = .56, la = b0 + tt.rotation.y;           // start at the back right; local angle = world angle + turn
      bill.position.set(Math.cos(la) * r, .035, Math.sin(la) * r);
      await S.show(bill, .30); S.sound('paper');
      await S.wait(.18);
      const dd = wrap(PHI - b0); const turn = dd > 0 ? dd : dd + Math.PI * 2;
      S.sound('wheel'); await S.to(tt.rotation, { y: tt.rotation.y - turn }, 1.55, 'inOut');
      host.still(); await S.show(purse, .25);
      await S.to(flap.rotation, { x: -2.2 }, .28, 'out');
      const fromCash = S.local(bill, S.world(purse, [0, .20, .08]));
      payment.position.copy(fromCash); payment.visible = true;
      S.to(payment.position, { x: .05, z: .08 }, .60, 'inOut');
      await S.to(payment.position, { y: fromCash.y + .3 }, .28, 'out');
      await S.to(payment.position, { y: .033 }, .32, 'in'); S.sound('coin');
      host.cheer(); S.emote(host, '♥', 2.2); ce.wave(1.4); abo.wave(1.2);
      await S.wait(.6);
      S.learn(zhi); zhi.cheer();
      await S.wait(1);
      S.set({ phase: 'done' }); S.done();
    }
    const crank = S.crank(tt, { id: 'tt', label: '轉盤', spin: false, pad: 0, tap: () => touch(false),
      turn: (d) => { if (st.phase !== 'touch' || st.busy) return; tt.rotation.y -= d; if (Math.abs(wrap(PHI - penAngle())) < .26) touch(true); },
      done: () => { if (st.phase === 'touch' && !st.busy && Math.abs(wrap(PHI - penAngle())) < .5) touch(true); } });
    S.pad(tt, .8, [0, .05, 0]).scale.y = .35;                // a flat grab area over the whole turntable
    S.onReadyLoop((phase) => {
      // Two diners pass an empty lazy Susan between them; neither orders yet.
      const offer = pulse(phase, .03, .52), passBack = pulse(phase, .43, .92);
      tt.rotation.y += .65 * offer - .38 * passBack;
      abo.armR.rotation.z += .96 * offer; host.armL.rotation.z -= 1.20 * passBack;
      host.head.rotation.z -= .13 * passBack;
      abo.head.rotation.y += .28 * passBack;
    }, 5.5, [tt, abo.armR, host.armL, abo.head, host.head]);
    S.act('go', go); S.act('touch', () => touch(false));
    S.on('reset', () => { puffRate=.18; eatT=-1; signature.u=0; signing=pointing=false; crank.zero(); });
    S.on('enter', async () => {
      await S.wait(.5); abo.hop(.12); S.sound('soft'); S.emote(abo, '…', 1.4, C.ink);
      await S.wait(.6); ce.doubt(); host.wave(.8);
      await S.wait(.6); ce.still(); S.set({ phase: 'ready' });
    });
    S.ui(() => storyPanel(st, {
      opening: '穿棗紅長衫的水牛伯招呼大家入席。黑熊總舖師把 AI 擬的菜單送來了，足足有四十道。',
      start: '攤開四十道菜',
      checkpoint: '大家都把菜單推給鄰座，一道菜也沒點。今晚作東的水牛伯知道要請這桌人吃什麼。',
      action: '把菜單轉給水牛伯',
      ending: '水牛伯圈了魚，請大家吃，也接下帳單。AI 能列出四十種選項，主人家決定了要端哪一道，也得買單。',
    }));

    const inkTarget=new S.T.Vector3(), handTarget=new S.T.Vector3(), nibAxis=new S.T.Vector3(0,1,0);
    S.tick((t, dt) => {
      const still=S.stage.still.matches, breeze=still ? 0 : t;
      puffRate += (.18 - puffRate) * Math.min(1, dt * .7);
      puffs.forEach((p, i) => { const u = (breeze * puffRate * 2 + i / 3) % 1; p.position.set(Math.sin(u * 5 + i) * .06, .62 + u * .55, 0); p.scale.setScalar(Math.max(.001, (.45 + u * .8) * (1 - u * u))); });
      if(!still) rays.rotation.z+=dt*.05;
      tail.rotation.z = S.stage.still.matches ? 0 : Math.sin(t*3)*.13;
      if (swirl.visible) swirl.rotation.y = -breeze * (st.phase === 'busy' ? 3 : .6);
      if (pointing) { const w = Math.sin(breeze * 5) * .08; host.armR.rotation.z = 1.3 + w; abo.armR.rotation.z = 1.3 - w; ce.armL.rotation.z = -1.3 + w; }   // you choose. no, you.
      if (bill.visible) bill.rotation.y = -tt.rotation.y;       // the slip always faces the reader
      if (platter.visible) { steamUp.forEach((p, i) => { const u = (breeze * .5 + i * .5) % 1; p.position.y = .2 + u * .5; p.scale.setScalar(Math.max(.001, (1 - u) * 1.1)); }); }
      if (signing) {
        host.head.rotation.z=-.13; host.head.rotation.x=.16;
        handTarget.set(-.12,-.045,.017); invitation.localToWorld(handTarget); host.inner.worldToLocal(handTarget);
        aimPaperHand(host.armL,host.rig.elbows[0],host.rig.grips[0],handTarget);
        const a=signature.u*Math.PI*2;
        inkTarget.set(.004+.090*Math.cos(a),.003+.058*Math.sin(a),.032);
        invitation.localToWorld(inkTarget); host.inner.worldToLocal(inkTarget);
        handTarget.copy(inkTarget); handTarget.x+=.097; handTarget.y+=.077;
        aimPaperHand(host.armR,host.rig.elbows[1],host.rig.grips[1],handTarget);
        host.rig.grips[1].getWorldPosition(handTarget); host.inner.worldToLocal(handTarget);
        writingPen.position.copy(handTarget);
        const dir=inkTarget.sub(handTarget);
        writingPen.scale.y=dir.length()/.145;
        writingPen.quaternion.setFromUnitVectors(nibAxis,dir.normalize());
        inkRing.forEach((line,i)=>{line.visible=signature.u>=(i+1)/inkRing.length;});
      }
      walletHand.rotation.z=-host.armL.rotation.z-host.rig.elbows[0].rotation.z;
      if (eatT >= 0 && !still) { eatT += dt; chops.forEach((k, i) => { const u = Math.sin(eatT * 5 + i * 2); k.position.y = .63 + u * .05; }); }
    });
  },
};
