import { T, group, beam, poly, tri, quad, tab, strut } from './paper.js';

// World dressing is measured from the glue joint on each leaf. An outline has
// two cut edges and a scored face, so it reads as folded card when the book turns.
const mixed = (a, b, weight) => '#' + new T.Color(a).lerp(new T.Color(b), weight).getHexString();

function foldedCrown(parent, x, y, z, w, h, colors, lean = 0) {
  const tuft = group(parent);
  tuft.position.set(x, y, z);
  tuft.rotation.z = lean;
  const outline = [[-.51,-.15],[-.55,.09],[-.29,.39],[.04,.52],[.33,.37],[.52,.09],[.44,-.18],[.15,-.40],[-.20,-.37]]
    .map(([u,v]) => [u*w,v*h]);
  const depth = Math.min(w,h)*.102;
  const edge = mixed(colors.leaf,colors.shade,.47);
  poly(tuft,outline,.032,edge,0,0,-.065);
  const face = outline.map(([u,v])=>[u,v,-.032]);
  const spine = [-.09*w,.045*h,depth];
  const ink = [colors.shade,colors.leaf,colors.light,colors.light,colors.leaf,colors.leaf,colors.shade,colors.shade,colors.shade];
  for (let k=0;k<face.length;k++) tri(tuft,face[k],face[(k+1)%face.length],spine,ink[k]);
}

function broadleaf(parent, kind, colors) {
  const {bark} = colors;
  beam(parent,[.015,.012,0],[-.045,.47,-.018],.039,bark,5);
  beam(parent,[-.036,.31,-.014],[-.24,.60,.02],.021,bark,5);
  beam(parent,[-.04,.39,-.012],[.21,.64,-.014],.023,bark,5);
  if (kind === 'willow') {
    foldedCrown(parent,.055,.66,-.052,.64,.67,colors,-.09);
    foldedCrown(parent,-.17,.55,.022,.43,.57,colors,.25);
    for (const [x,y,h,tilt] of [[-.26,.57,.28,-.1],[-.13,.61,.25,.08],[.20,.65,.30,-.12],[.29,.64,.22,-.06]]) {
      const spray=group(parent); spray.position.set(x,y,.056); spray.rotation.z=tilt;
      const ridge=[.006,-h*.40,.023];
      tri(spray,[-.043,0,0],ridge,[.016,-h,0],colors.shade);
      tri(spray,ridge,[.048,-.01,0],[.016,-h,0],colors.leaf);
    }
    return;
  }
  const wide = kind === 'banyan' || kind === 'camphor';
  foldedCrown(parent,wide ? .17 : .12,.70,-.055,wide ? .68 : .56,.64,colors,-.13);
  foldedCrown(parent,wide ? -.21 : -.15,.60,.018,wide ? .55 : .46,.46,colors,.19);
  foldedCrown(parent,.06,wide ? .61 : .66,.068,wide ? .57 : .41,wide ? .44 : .47,colors,-.05);
  if (kind === 'orchard') {
    for(const [x,y] of [[-.22,.60],[.15,.77],[.23,.65]]) {
      poly(parent,[[-.023,.018],[0,.032],[.026,.014],[.02,-.018],[-.013,-.027],[-.03,-.007]],.011,'#d9a34f',x,y,.154);
    }
  }
}

function needles(parent, colors, slim) {
  beam(parent,[.01,0,0],[-.014,.86,-.024],.030,colors.bark,5);
  const levels = [[.16,.68,.26],[.33,.84,.20],[.52,1,.14]];
  for(const [base,top,width] of levels) {
    const w=slim ? width*.66 : width;
    const crown=group(parent); crown.position.z=(1-top)*.14;
    const outline=[[-w,base+.056],[-w*.54,base+.11],[-w*.62,base+.087],[-.025,top],[w*.78,base+.18],[w*.62,base+.17],[w,base+.01],[w*.29,base+.033],[-.020,base-.012]];
    poly(crown,outline,.021,colors.shade,0,0,-.012);
    const apex=[-.025,top,.013],fold=[-.017,base-.012,w*.31];
    tri(crown,[-w,base+.056,.013],fold,apex,colors.leaf);
    tri(crown,apex,fold,[w,base+.01,.013],colors.shade);
    tri(crown,apex,[-w*.62,base+.087,.015],[-w*.37,base+.19,.026],colors.light);
  }
}

export function foldedTree(parent, {kind='broadleaf',height=2.1,leaf='#778556',light='#a7ac79',shade='#596b50',bark='#806849'}={}) {
  const tree=group(parent); tree.scale.setScalar(height);
  const colors={leaf,light,shade,bark};
  if (kind==='pine' || kind==='cypress') needles(tree,colors,kind==='cypress');
  else broadleaf(tree,kind,colors);
  tab(tree,.16,mixed(bark,'#e9d3a6',.42));
  return tree;
}

export function ridgeLine(parent, {profile=[[-2.5,.48],[-1.63,.79],[-.76,.56],[.25,1.20],[.98,.71],[1.70,.93],[2.5,.58]],base='#748a79',light='#a0ad85',shade='#546e67',depth=.18}={}) {
  if (profile.length < 2) return;
  const stock=mixed(base,'#ddc9a3',.31);
  // Alternating forward and backward folds make a freestanding concertina.
  const ridge=profile.map(([x,y],i)=>[x,y,i%2 ? -depth*.30 : depth*.06]);
  const foot=profile.map(([x],i)=>[x,.016,i%2 ? depth*.14 : depth]);
  for(let i=0;i<ridge.length-1;i++) {
    const a=ridge[i],b=ridge[i+1],l=foot[i],r=foot[i+1];
    const rise=b[1]>a[1],tone=rise ? base : shade;
    tri(parent,l,r,rise?b:a,tone);
    if(rise) tri(parent,l,b,a,light); else tri(parent,a,r,b,base);
    const rearA=[a[0],a[1],a[2]-.031],rearB=[b[0],b[1],b[2]-.031];
    quad(parent,a,b,rearB,rearA,stock);
    quad(parent,rearA,rearB,[r[0],.016,r[2]-.039],[l[0],.016,l[2]-.039],shade);
  }
  const support=group(parent);
  const middle=ridge[Math.floor(ridge.length/2)];
  support.position.set(middle[0],0,middle[2]-.04);
  strut(support,middle[1]*.76,stock);
}

export function bankPlants(parent,{kind='grass',width=.8,height=.5,leaf='#73815b',light='#a4ac75',shade='#546b56'}={}) {
  const reed=kind==='reed'||kind==='reeds'||kind==='rush';
  const broad=kind==='fern'||kind==='broadleaf'||kind==='ginger'||kind==='taro';
  const offsets=[[-.45,.62],[-.26,.89],[-.10,.63],[.05,1],[.21,.71],[.40,.83]];
  for(const [index,[x,h]] of offsets.entries()) {
    const foot=x*width*.43,dx=x*width,dy=h*height,z=(index%3)*.031;
    const half=width*(broad ? .093 : reed ? .034 : .054);
    const root=[foot,.014,z],tip=[dx,dy,z-.037],mid=[foot*.6+dx*.4,dy*.45,z+.045];
    const lo=[mid[0]-half,dy*.38,z],hi=[mid[0]+half,dy*.51,z];
    tri(parent,root,mid,lo,shade);tri(parent,mid,tip,lo,leaf);
    tri(parent,root,hi,mid,leaf);tri(parent,mid,hi,tip,index%3===0?light:leaf);
  }
  if(reed) for(const [x,h] of [[-.16,1.10],[.15,.89]]) {
    beam(parent,[x*width*.48,.016,-.014],[x*width,h*height,-.046],.012,leaf,4);
    beam(parent,[x*width,h*height-.075,-.046],[x*width+.013,h*height+.05,-.046],.022,'#96714f',5);
  }
}
