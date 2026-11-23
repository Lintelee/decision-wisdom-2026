import { T, keep, tri, beam, cyl } from './paper.js';

const cane='#b48753', rim='#835d42', stock=['#f2c177','#e7ab63','#d59854','#dda662','#edb976','#f5cb84'];

/** Hang a folded six-sided bamboo lantern from the grip in the printed paw. */
export function handLantern(rig,reference,{hand=0,size=1}={}) {
  const grip=rig.grips[hand],hinge=keep(grip);
  hinge.name='竹篾小提燈的提耳';
  const shade=keep(hinge);
  shade.name='六面透光的竹篾提燈';
  shade.scale.setScalar(size);
  const handle=[[-.083,-.157,0],[-.068,-.080,0],[-.036,-.020,0],[0,0,0],[.036,-.020,0],[.068,-.080,0],[.083,-.157,0]];
  for(let i=1;i<handle.length;i++)beam(shade,handle[i-1],handle[i],.0082,cane,5);
  beam(shade,[-.023,-.008,.001],[.023,-.008,.001],.012,'#8e6042',6);
  const ring=(r,y)=>Array.from({length:6},(_,i)=>{
    const a=(i+.5)*Math.PI/3;
    return [Math.sin(a)*r,y,Math.cos(a)*r];
  });
  const top=ring(.094,-.153),shoulder=ring(.124,-.204),base=ring(.096,-.352);
  for(let i=0;i<6;i++){
    const j=(i+1)%6, light=stock[i],paper=stock[(i+1)%6];
    tri(shade,top[i],shoulder[i],shoulder[j],light);
    tri(shade,shoulder[j],top[j],top[i],light);
    tri(shade,shoulder[i],base[i],base[j],paper);
    tri(shade,base[j],shoulder[j],shoulder[i],light);
    beam(shade,top[i],shoulder[i],.0055,cane,5);
    beam(shade,shoulder[i],base[i],.0069,cane,5);
    beam(shade,shoulder[i],shoulder[j],.0043,cane,5);
  }
  cyl(shade,0,-.150,0,.097,.097,.023,rim,6).rotation.y=Math.PI/6;
  cyl(shade,0,-.352,0,.099,.094,.021,rim,6).rotation.y=Math.PI/6;
  cyl(shade,0,-.368,0,.054,.049,.019,cane,6).rotation.y=Math.PI/6;
  beam(shade,[0,-.374,.002],[0,-.400,.002],.0058,'#935d45',5);
  const source=keep(shade,0,-.256,.023);source.name='竹篾提燈內的燈芯';
  const gripToBody=new T.Matrix4(),relative=new T.Quaternion(),sway=new T.Quaternion();
  const axis=new T.Vector3(0,0,1);
  function hang(t=0,amount=0) {
    // Cancel the wrist's turn, but keep the lantern on this leaf when it folds.
    grip.updateWorldMatrix(true,false);
    gripToBody.copy(reference.matrixWorld).invert().multiply(grip.matrixWorld);
    relative.setFromRotationMatrix(gripToBody);
    sway.setFromAxisAngle(axis,Math.sin(t*2.0)*amount);
    hinge.quaternion.copy(relative).invert().multiply(sway);
  }
  hang();rig.workLantern={grip,hinge,shade,source,hang};
  return rig.workLantern;
}
