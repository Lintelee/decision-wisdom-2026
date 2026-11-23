import { ball, beam, box, cyl, group, poly, quad, slab } from '../paper.js';
import { streetStops } from '../street-stops.js';
import { townLanes, townStops } from '../town-layout.js';
import { workshops } from './town-workshops.js';
import { fly, neighbour } from './town-neighbours.js';

function flagstones() {
  const tile=document.createElement('canvas');tile.width=88;tile.height=42;
  const g=tile.getContext('2d');g.fillStyle='#beaa87';g.fillRect(0,0,88,42);
  const colors=['#e3cda6','#ead6b1','#d9c298','#dfc9a5'];
  for(let j=0;j<2;j++)for(let i=-1;i<3;i++){
    g.fillStyle=colors[(i+j*2+4)%4];
    const x=i*44+(j%2)*22;g.fillRect(x+.9,j*21+1.1,42.5,19.4);
    g.fillStyle='#eee0c0';g.fillRect(x+1,j*21+1.2,37,.65);
  }
  return g.createPattern(tile,'repeat');
}

function printTown(G) {
  G.wash('#eeddba');
  G.blob([[-5.84,-3.40],[-3.50,-3.44],[-1.3,-3.38],[.04,-3.36],[2.9,-3.39],[5.78,-3.34],[5.77,-1.06],[5.83,.71],[5.70,2.93],[5.42,3.23],[2.57,3.31],[-.15,3.20],[-2.80,3.29],[-5.64,3.10],[-5.79,1.11]],'#c7b487',{sharp:true});
  G.blob([[-5.76,-3.29],[-1.95,-3.29],[-.18,-3.27],[-.39,-1.31],[-1.51,-.75],[-2.94,-.79],[-4.30,-.56],[-5.69,-.74]],'#a9b6a0',{sharp:true});
  G.blob([[-5.70,-.72],[-4.31,-.59],[-2.93,-.80],[-1.41,-.90],[-.43,-.43],[-.58,.96],[-.51,3.17],[-2.73,3.21],[-5.59,3.02]],'#ceae8c',{sharp:true});
  G.blob([[.08,-3.25],[3.12,-3.33],[5.68,-3.27],[5.62,-1.12],[4.46,-.88],[3.13,-.43],[2.40,.42],[1.36,.75],[.17,.54],[-.41,-.48],[.04,-1.37]],'#b9b397',{sharp:true});
  G.blob([[2.38,.45],[3.12,-.42],[4.47,-.88],[5.64,-1.12],[5.69,2.90],[5.36,3.16],[2.65,3.25],[-.46,3.16],[-.52,1.70],[.14,.91],[1.38,.77]],'#aa9a9d',{sharp:true});
  // A sliver of quayside water terminates at the outside edge of the left leaf.
  G.blob([[-5.80,-3.29],[-4.72,-3.28],[-4.85,-3.02],[-5.28,-2.79],[-5.42,-2.12],[-5.59,-1.55],[-5.75,-1.48]],'#799e9e',{sharp:true});
  G.path([[-4.81,-3.24],[-5.25,-2.96],[-5.42,-2.68],[-5.50,-2.01],[-5.66,-1.51]],{w:.055,col:'#eddfb9'});
  G.marks('wave',-5.70,-3.20,-5.49,-1.88,{n:11,col:'#d8e2cfaa',size:.085,seed:601});
  G.marks('tick',-5.42,-2.95,5.42,2.87,{n:280,col:'#77674935',size:.065,seed:501});
  G.marks('dot',-5.54,-3.0,5.6,3.03,{n:580,col:'#f2e2bf80',size:.046,seed:441});

  const paving=flagstones();
  for(const lane of townLanes)G.path(lane,{w:.425,col:'#a58a6b'});
  for(const lane of townLanes)G.path(lane,{w:.36,col:paving});
  // The temple turns the middle of the page into a paved, circular meeting place.
  G.circle(.50,.66,.88,'#ab9676');G.circle(.50,.66,.83,paving);
  G.circle(.50,.66,.60,null,{edge:'#b59a78',edgeW:.044});G.circle(.50,.66,.42,null,{edge:'#c4a080',edgeW:.025});
  const p=G.g;
  const shadowRadius=G.X(.91)-G.X(0);
  for(const stop of townStops){
    const {x,z}=stop;
    p.save();p.translate(G.X(x+.11),G.Z(z+.06));p.scale(1,.68);
    const shadow=p.createRadialGradient(0,0,0,0,0,shadowRadius);
    shadow.addColorStop(0,'#544d466c');shadow.addColorStop(.65,'#544d4629');shadow.addColorStop(1,'#544d4600');
    p.fillStyle=shadow;p.fillRect(-shadowRadius,-shadowRadius,2*shadowRadius,2*shadowRadius);p.restore();
  }
  for(const [x,z,r] of [[3.47,2.53,.45],[4.21,2.48,.36],[.60,2.48,.33]]){
    const light=p.createRadialGradient(G.X(x),G.Z(z),0,G.X(x),G.Z(z),G.X(r)-G.X(0));
    light.addColorStop(0,'#f5c36d98');light.addColorStop(1,'#e9bb6a00');G.circle(x,z,r,light);
  }
}

function footbridge(S,side) {
  const centre=side*.53;
  S.plant(centre,-1.70,g=>{
    const n=5, yAt=x=>.06+.28*Math.cos(Math.abs(x)/1.06*Math.PI/2);
    const local=abs=>abs-centre;
    for(let k=0;k<n;k++){
      const a=side*1.06*k/n,b=side*1.06*(k+1)/n,ya=yAt(a),yb=yAt(b),x1=local(a),x2=local(b);
      quad(g,[x1,ya,-.17],[x2,yb,-.17],[x2,yb,.17],[x1,ya,.17],k%2?'#c6ab8b':'#d5b797');
      quad(g,[x1,ya,.17],[x2,yb,.17],[x2,yb-.073,.17],[x1,ya-.073,.17],'#93735b');
      for(const z of [-.19,.19]) {
        beam(g,[x1,ya+.17,z],[x2,yb+.17,z],.023,'#ad775a',5);
        if(k%2===0)box(g,x1,ya+.09,z,.040,.20,.046,'#e6c494');
      }
    }
    for(const z of [-.22,.22])box(g,local(side*.86),.078,z,.155,.16,.065,'#9d8065');
  });
}
function foldedTree(g,h,ink,light) {
  const k=group(g);k.scale.setScalar(h);
  beam(k,[0,.02,0],[-.045,.59,0],.053,'#856347',6);
  for(const [x,y] of [[-.23,.73],[.16,.83],[.01,1.0]])beam(k,[-.025,.37,0],[x,y,0],.030,'#866447',5);
  for(const [x,y,z,r,c] of [[-.18,.73,.01,.25,ink],[.17,.81,0,.27,light],[.01,.98,-.02,.27,ink]]){
    const top=ball(k,x,y,z,r,c,0);top.scale.set(1.10,.90,.76);top.rotation.y=x*3+1.3;
    poly(k,[[-.52,0],[.20,.65],[.55,.17],[-.16,-.08]].map(([a,b])=>[a*r,b*r]),.009,light,x,y,z+r*.64);
  }
}
function terracedGarden(S) {
  // The outer lane climbs a bank of three torn leaves. The little stairs meet the actual street.
  S.plant(5.42,1.56,g=>{
    const lower=[[-.17,-.70],[.09,-.84],[.33,-.71],[.37,-.30],[.32,.18],[.35,.70],[.20,.82],[-.05,.72],[-.13,.41],[-.22,.17],[-.17,-.07],[-.22,-.36]];
    const middle=[[-.08,-.53],[.12,-.70],[.30,-.60],[.32,-.17],[.26,.19],[.28,.57],[.16,.67],[.01,.58],[.04,.33],[-.12,.11],[-.05,-.23]];
    const upper=[[.035,-.36],[.17,-.48],[.285,-.40],[.29,-.10],[.20,.20],[.23,.42],[.10,.43],[.07,.22],[.02,.04],[.09,-.13]];
    let y=.006;
    for(const [outline,edge,top] of [[lower,'#ad9475','#c4b994'],[middle,'#a48e75','#acb499'],[upper,'#988b73','#91a28b']]){
      slab(g,outline,.064,edge,y);slab(g,outline,.015,top,y+.064);y+=.079;
    }
    for(let i=0;i<4;i++)box(g,-.28+i*.086,.025+i*.037,-.22+i*.016,.10,.044,.235,'#d6bd98');
    for(const [x,z,s] of [[.19,-.28,.70],[.18,.34,.88],[.04,.46,.59]]){
      const reeds=group(g);reeds.position.set(x,.21,z);reeds.scale.setScalar(s);
      for(const [dx,h,c] of [[-.08,.19,'#718a70'],[-.02,.25,'#708e76'],[.105,.17,'#94a67e']])
        poly(reeds,[[0,0],[dx,h],[dx*.25+.025,.056],[.018,0]],.012,c);
    }
  });
}
function landscape(S) {
  // An irregular rear ridge sits behind the roofs so the book has a readable silhouette.
  for(const [x,z,h,c1,c2] of [[-4.82,-3.05,.87,'#859f85','#aab191'],[-3.35,-3.10,1.06,'#7c917b','#a4ab89'],[-.72,-3.19,.97,'#929d83','#a9b394'],[2.61,-3.13,1.10,'#879c89','#a4a58f'],[5.06,-2.99,.92,'#78918b','#9bada0']]){
    S.plant(x,z,g=>{
      const outline=[[-.83,0],[-.72,h*.25],[-.50,h*.21],[-.16,h*.75],[.01,h*.61],[.28,h],[.50,h*.68],[.72,h*.33],[.84,0]];
      poly(g,outline,.14,c1);
      poly(g,[[.28,h],[.48,h*.67],[.75,h*.31],[.83,0],[.43,0],[.32,h*.24]],.016,c2,0,0,.142);
    });
  }
  for(const [x,z,h,ink,light] of [[-5.48,-.92,.95,'#709075','#93a47b'],[-3.28,-2.76,1.26,'#6a8a70','#8d9d6f'],[-3.04,.08,.84,'#70885e','#a1a16b'],[-5.12,1.20,.76,'#718d60','#a6a875'],[-.53,-2.84,1.00,'#79967b','#a5ae88'],[2.52,-2.71,1.02,'#6b8b77','#91a481'],[5.35,-.64,.86,'#68877b','#8a9d89'],[2.65,1.63,.72,'#788b70','#a09f76']]){
    S.plant(x,z,g=>foldedTree(g,h,ink,light));
  }
  for(const side of [-1,1])footbridge(S,side);
  terracedGarden(S);
  S.plant(-5.42,-2.37,g=>{
    for(const z of [-.32,.36]){
      for(const x of [-.18,.15])cyl(g,x,.087,z,.035,.041,.17,'#a07c5a',5);
    }
    for(let i=0;i<8;i++)box(g,0,.175,-.32+i*.09,.49,.055,.074,i%2?'#b69b75':'#cfaf82');
  });
}

export default {
  id:'map',land:'map',short:'全書首頁',title:'街角的決策智慧',sources:[],calm:true,
  look:{bg:'#36393b',table:'#63545b',key:'#fff0d6',fill:'#c3d9d1',sky:'#fff0d7'},
  ground:printTown,
  build(S) {
    const motions=[],register=fn=>motions.push(fn);
    landscape(S);
    for(const stop of townStops) {
      const {level,x,z,plaque,angle}=stop;
      S.plant(x,z,g=>{
        const booth=group(g);booth.rotation.y=angle;
        workshops[level-1](booth,register);neighbour(booth,level,register);
        const info=streetStops[level-1];
        g.name=info.place;
        S.pad(g,level===9?.75:.56,[0,level===3?.32:.54,.04]);
        S.prop(g,{id:'level-'+level,level,label:'第 '+String(level).padStart(2,'0')+' 幕 · '+info.place,aim:plaque,tap:()=>S.go(level)});
      });
    }
    const flock={leader:-1,u:1};
    fly(S,-3.54,-2.56,.91,.1,register,flock,0);
    fly(S,-1.38,-2.79,.67,2.05,register,flock,1);
    fly(S,2.22,-2.87,.73,3.1,register,flock,2);
    const paint=(t,still)=>{for(const motion of motions)motion(t,still);};
    paint(0,true);
    S.tick(t=>paint(t,S.stage.still.matches));
    S.ui(()=>({caption:'',buttons:[]}));
  },
};
