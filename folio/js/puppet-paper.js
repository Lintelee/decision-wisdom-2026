// Reusable die cuts measured in hundredths of a scene unit above the paper hinge.
import { T, keep, poly, tri, disc, beam } from './paper.js';
const STOCK='#f2d9ad', INK='#332f30';
const mm=path=>typeof path==='string'?path.trim().split(/\s+/).map(p=>p.split(',').map(Number)):path;
const at=(g,x=0,y=0,z=0)=>keep(g,x/100,y/100,z/100);
function expanded(v,r) {
  const area=v.reduce((a,[x,y],i)=>{const n=v[(i+1)%v.length];return a+x*n[1]-y*n[0];},0);
  const normals=v.map(([x,y],i)=>{const n=v[(i+1)%v.length],dx=n[0]-x,dy=n[1]-y,len=Math.hypot(dx,dy)||1,sign=area>0?1:-1;return [dy*sign/len,-dx*sign/len];});
  return v.map(([x,y],i)=>{const a=normals[(i+v.length-1)%v.length],b=normals[i],dx=a[0]+b[0],dy=a[1]+b[1],len=Math.hypot(dx,dy)||1;
    const k=Math.min(r*1.8,r/Math.max(.45,(dx*b[0]+dy*b[1])/len));return [x+k*dx/len,y+k*dy/len];});
}
function ink(g,path,color,z,depth=.32) {
  return poly(g,mm(path).map(([x,y])=>[x/100,y/100]),depth/100,color,0,0,z/100);
}
function split(v,axis,sign) {
  const out=[],d=([x,y])=>(x-axis[0]+y*axis[1])*sign;
  for(let i=0;i<v.length;i++){
    const p=v[i],q=v[(i+1)%v.length],a=d(p),b=d(q);
    if(a>=0)out.push(p);
    if((a>0&&b<0)||(a<0&&b>0)){const k=a/(a-b);out.push([p[0]+k*(q[0]-p[0]),p[1]+k*(q[1]-p[1])]);}
  }
  return out;
}
function folded(g,path,color,z=0,{edge=1.35,depth=3.8,shade=color,crease=[0,.1]}={}) {
  const v=mm(path);
  ink(g,expanded(v,edge),STOCK,z-depth,depth);
  const spread=Math.max(...v.map(([x,y])=>Math.abs(x-crease[0]+y*crease[1])),1);
  for(const [sign,tint] of [[-1,color],[1,shade]]){
    const side=split(v,crease,sign);
    if(side.length<3)continue;
    const plane=side.map(([x,y])=>new T.Vector2(x,y));
    const vertices=side.map(([x,y])=>[x/100,y/100,(z+.35+1.55*(1-Math.abs(x-crease[0]+y*crease[1])/spread))/100]);
    for(const [a,b,c] of T.ShapeUtils.triangulateShape(plane,[]))tri(g,vertices[a],vertices[b],vertices[c],tint);
  }
}
function line(g,x0,y0,x1,y1,z,w,color) {return beam(g,[x0/100,y0/100,z/100],[x1/100,y1/100,z/100],w/100,color,5);}
function pip(g,x,y,z,r,color,sides=10) {return disc(g,x/100,y/100,z/100,r/100,color,.006,sides);}
function eyes(head,locations,height=22) {
  const pupil=at(head,0,height,8);
  for(const [x,y,r=2.25] of locations){
    pip(pupil,x,y-height,0,r,INK,10);
    pip(pupil,x-r*.29,y-height+r*.32,.52,r*.29,'#fff0cf',7);
  }
  return pupil;
}
const cutters={at,folded,ink,line,pip,eyes};
export { cutters as puppetPaper };
