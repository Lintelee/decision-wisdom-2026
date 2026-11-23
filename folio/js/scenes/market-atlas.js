// Original street-book presswork for the four market and workshop spreads.
// All raised silhouettes stop at the gutter so the two leaves fold independently.
import { keep, box, beam, poly, disc, cloud, words } from '../paper.js';

const stock = () => window.PaperKit;
const INK = '#354942';
const EDGE = '#e6dcc2';

function attached(parent, piece, x, y, z, angle=0) {
  piece.position.set(x,y,z);
  piece.rotation.y=angle;
  parent.add(piece);
  return piece;
}

export function pressPlate(g, text, x, y, z, width, height, field=INK, lettering='#efe1c1') {
  box(g,x,y,z,width+.056,height+.056,.047,'#785c45');
  box(g,x,y,z+.032,width+.016,height+.016,.021,'#d2ad73');
  box(g,x,y,z+.051,width,height,.016,field);
  const K=stock();
  if(K) attached(g,K.label(text,width*.87,height*.72,{ink:lettering,paper:'transparent'}),x,y,z+.064);
  else words(g,text,x,y,z+.065,height*.47,{color:lettering});
  for(const side of [-1,1]) disc(g,x+side*(width*.5-.039),y,z+.066,.011,'#e7c899',.009,7);
}

export function issuePrint(g, section, x, y, z, size, ink, width=size) {
  const K=stock();
  if(K) attached(g,K.engraving(section==='people' ? 'heart' : 'flower',width,size,ink),x,y,z);
}

export function fieldSun(g,{y,r}) {
  const K=stock(), face='#d9a54f', light='#e6c884';
  beam(g,[0,0,-.035],[0,y,-.035],.014,'#ac9670',6);
  const ring=keep(g,0,y,-.025);
  for(let i=0;i<12;i++) {
    const long=i%3===0 ? 1.39 : 1.24;
    const shape=[[-.012,r*1.10],[.014,r*1.09],[.010,r*long],[-.010,r*long]];
    const ray=K ? attached(ring,K.cut(shape,.014,'#caa65e',light),0,0,0) : poly(ring,shape,.014,light);
    ray.rotation.z=-Math.PI*i/6;
  }
  disc(ring,0,0,.025,r,light,.035,36);
  disc(ring,0,0,.05,r*.982,face,.015,36);
  return ring;
}

export function fieldCloud(g,width,height) {
  const K=stock();
  if(!K) return cloud(g,width,height,'#e8dfc4');
  const puff=K.cloud(width); puff.scale.y*=height/2.35; g.add(puff);
}

// A folded horizon with a half-tone mountain face and an uninked cut edge.
// Unequal ridge profiles let the tofu street and the mural square have distinct views.
function fieldRidge(S, page) {
  const near=page===5 ? '#67836b' : '#708b6d';
  const far=page===5 ? '#93a18a' : '#9fa98f';
  const shoulders=[
    [0,.41],[.38,.46],[.72,.62],[1.04,.57],[1.34,.91],[1.60,.86],[1.94,1.19],
    [2.19,1.10],[2.44,.86],[2.62,.94],[3.03,.69],[3.34,1.06],
    [3.71,1.0],[4.05,1.39],[4.44,1.20],[4.86,.87],[5.12,.99],[5.62,.64],
  ];
  for(const side of [-1,1]) {
    S.plant(side*2.90,-3.18,(g) => {
      const profile=shoulders.map(([x,h],i)=>[
        (x-2.81)*side,
        (page===5 ? 1.02 : .88)*h + Math.sin(i*.73+side*page)*.115,
      ]);
      const nearRidge=profile.map(([x,y],i)=>[x,y*.61+.11*Math.cos(i+page)]);
      const sheet=(outline,bottom,shade,z)=>{
        poly(g,[[outline[0][0],bottom],...outline,[outline.at(-1)[0],bottom]],.049,shade,0,0,z);
        for(let i=1;i<outline.length;i++){
          const a=outline[i-1],b=outline[i];
          beam(g,[a[0],a[1],z+.055],[b[0],b[1],z+.055],.012,EDGE,4);
        }
      };
      sheet(profile,0,far,-.14);
      sheet(nearRidge,0,near,.07);
      for(const i of [4,6,11,13]) {
        const [x,y]=profile[i],sgn=side;
        poly(g,[[0,0],[.11*sgn,-.13],[.31*sgn,-.31],[.23*sgn,-.12]],.008, '#b0b39a',x,y-.022,-.078);
        for(let j=0;j<3;j++) beam(g,[x+j*.036*sgn,y-.05-j*.045,-.067],[x+(.25+j*.057)*sgn,y-.26-j*.05,-.067],.006,'#7b8e79',4);
      }
      for(const i of [2,6,10,13]) {
        const [x,y]=nearRidge[i];
        beam(g,[x-.09,y-.09,.129],[x+.095,y-.13,.129],.006,'#93a187',4);
      }
    });
  }
}

function workshopSkyline(S,page) {
  const banks=page===7
    ? [[-2.92,5.30,'#b09a9c','#8f8b8b'],[2.92,5.42,'#b49a98','#908989']]
    : [[-2.92,5.28,'#b19b91','#998c82'],[2.94,5.38,'#baa195','#998e84']];
  for(const [centre,width,mist,shade] of banks) S.plant(centre,-3.18,(g)=>{
    const steps=[.51,.62,.43,.78,.59,.73,.50];
    const fronts=[.36,.54,.42,.62,.40];
    for(let i=0;i<steps.length;i++) {
      const x=-width/2+(i+.5)*width/steps.length;
      const h=steps[(i+(centre<0 ? page : 1))%steps.length], w=width/steps.length*.94;
      const cap=i%3===0 ? .16 : .04;
      poly(g,[[-w/2,0],[-w/2,h],[0,h+cap],[w/2,h],[w/2,0]],.052,mist,x,0,-.08);
      if(i%3===1) {
        box(g,x+w*.32,h+.07,-.075,w*.11,.19,.071,mist);
        box(g,x+w*.32,h+.17,-.075,w*.15,.025,.083,'#bcb0a0');
      }
      for(const dx of [-.23,0,.23]) box(g,x+w*dx,h*.67,-.016,.057,.094,.009,'#d0b6a0');
    }
    for(let i=0;i<fronts.length;i++) {
      const x=-width/2+(i+.5)*width/fronts.length, h=fronts[(i+page)%fronts.length], w=width/fronts.length*.82;
      const outline=[[-w/2,0],[-w/2,h-.042],[-w*.34,h],[w*.02,h+.10],[w*.38,h],[w/2,h-.025],[w/2,0]];
      poly(g,outline,.053,shade,x,0,.075);
      for(let j=-1;j<=1;j++) {
        box(g,x+j*w*.23,h*.50,.134,.081,.115,.012,'#b7aea0');
        box(g,x+j*w*.23,h*.50,.142,.012,.115,.006,shade);
      }
      beam(g,[x-w*.46,h-.049,.139],[x-w*.02,h+.072,.139],.009,EDGE,4);
    }
  });
}

const groves = {
  5: [[-5.10,-2.36,1.50,'round'],[-4.43,-2.81,1.35,'pine'],[-.35,-2.91,1.49,'cypress'],[.96,-3.00,.88,'round'],[4.71,-2.84,1.65,'round'],[5.15,-1.64,1.18,'pine']],
  6: [[-5.17,-2.73,1.71,'pine'],[-.13,-3.02,1.40,'round'],[.85,-2.95,1.17,'cypress'],[4.91,-2.81,1.64,'round'],[5.03,-1.91,.99,'cypress']],
  7: [[-5.07,-2.59,1.18,'cypress'],[-.57,-2.50,.84,'round'],[4.69,-2.79,1.23,'cypress'],[5.11,-1.47,.79,'cypress']],
  8: [[-5.02,-2.54,1.09,'cypress'],[-.13,-2.67,.99,'cypress'],[4.59,-2.79,1.47,'cypress'],[5.05,-1.97,.89,'round']],
};
const verge = {
  5: [[-4.70,1.49],[4.96,.54],[-.16,-1.98],[3.90,2.47]],
  6: [[-4.90,1.54],[4.77,2.04],[.71,-1.89],[1.04,2.15]],
  7: [[-5.05,-.20],[.12,-1.87],[4.90,.75]],
  8: [[-4.71,1.36],[-.62,-1.56],[4.97,1.59]],
};

// This folded tab sits in the outer margin of the physical leaf.
function articleTab(S, stock, people) {
  S.plant(2.92,2.83,g=>{
    const tab=keep(g), flap=keep(tab,0,.040,.032);
    tab.name='本幕的原刊頁籤';
    flap.rotation.x=-1.33;
    const outline=[[-.53,-.13],[.42,-.13],[.54,-.02],[.54,.085],[.43,.165],[-.53,.165]];
    poly(flap,outline,.018,'#d9cba8');
    poly(flap,[[-.51,-.096],[.408,-.096],[.505,-.012],[.505,.065],[.411,.130],[-.51,.130]],.012,people?'#60766a':'#86655d',0,0,.021);
    const icon='#e6d9bb';
    poly(flap,[[-.37,-.050],[-.37,.080],[-.31,.098],[-.235,.062],[-.235,-.053],[-.305,-.024]],.005,icon,0,0,.040);
    poly(flap,[[-.222,-.053],[-.222,.062],[-.15,.098],[-.092,.080],[-.092,-.045],[-.153,-.025]],.005,icon,0,0,.040);
    attached(flap,stock.label('原 刊',.38,.20,{ink:icon,paper:'transparent'}),.172,.012,.045);
    for(const x of [-.255,.255]) S.pad(tab,.32,[x,.10,-.012]);
    S.prop(tab,{id:'issue-copy',label:'翻開這篇原文',aim:[0,.072,.025],tap:()=>S.app.read(S.def.quote.n,S.def.quote.page)});
  });
}

export function fieldPress(S, page) {
  const people=page<=6, K=stock();
  if(people) fieldRidge(S,page); else workshopSkyline(S,page);
  if(!K) return;
  for(const [i,[x,z,height,type]] of groves[page].entries()) {
    S.plant(x,z,g=>g.add(K.tree(type,height,page*21+i)));
  }
  for(const [i,[x,z]] of verge[page].entries()) {
    S.plant(x,z,g=>{
      attached(g,K.grass(i%2 ? .83 : 1.06),0,0,0,.13*i);
      if(i%2===0) attached(g,K.rock(.49),.25,0,-.06);
    });
  }
  articleTab(S,K,people);
}

// A short physical ledge gives market and laboratory signs a home on their stall.
// The object it labels stays under the reader's eye while the page turns.
export function wallHanger(g,x,y,z,w) {
  box(g,x,y,z,w,.048,.15,'#7c684e');
  for(const side of [-1,1]) beam(g,[x+side*w*.40,y-.18,z-.06],[x+side*w*.40,y,z+.06],.019,'#917255',5);
}
