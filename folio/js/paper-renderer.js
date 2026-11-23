// A small depth-buffered paper renderer for browsers without WebGL2. It renders the very same
// meshes, joints and printed textures; the scene timelines and Three's pointer picking stay live.
import { T } from './paper.js';

const toSrgb = Float32Array.from({length:2049}, (_,i) => {
  const v = i/2048; return 255*(v<=.0031308 ? 12.92*v : 1.055*v**(1/2.4)-.055);
});
const srgb = v => toSrgb[Math.min(2048,Math.max(0,Math.round(v*2048)))];
const linear = Float32Array.from({length:256}, (_,i) => {
  const v=i/255;
  return v<=.04045 ? v/12.92 : ((v+.055)/1.055)**2.4;
});
export function createPaperRenderer(canvas) {
  const ctx=canvas.getContext('2d',{alpha:true});
  const matrix=new T.Matrix4(), cameraMatrix=new T.Matrix4(), normal=new T.Matrix3();
  const cache=new WeakMap();
  const lightPools=[];
  let poolCoverage;
  let width=1,height=1,frame,depth,positions=new Float32Array(0);
  function setSize(w,h) {
    const scale=Math.min(1,830/Math.max(w,h,1));
    width=canvas.width=Math.max(1,Math.round(w*scale)); height=canvas.height=Math.max(1,Math.round(h*scale));
    frame=ctx.createImageData(width,height); depth=new Float32Array(width*height);
    frame.data.fill(255);
  }
  function pixels(map) {
    if(!map || !map.image?.width) return null;
    const cached=cache.get(map); if(cached?.version===map.version) return cached;
    if(map.image.data) {
      const image=map.image; const result={data:image.data,w:image.width,h:image.height,version:map.version};
      cache.set(map,result);return result;
    }
    const bitmap=document.createElement('canvas'), k=Math.min(1,1024/Math.max(map.image.width,map.image.height));
    bitmap.width=Math.max(1,Math.round(map.image.width*k)); bitmap.height=Math.max(1,Math.round(map.image.height*k));
    const g=bitmap.getContext('2d',{willReadFrequently:true}); g.drawImage(map.image,0,0,bitmap.width,bitmap.height);
    const image=g.getImageData(0,0,bitmap.width,bitmap.height);
    const result={data:image.data,w:image.width,h:image.height,version:map.version};cache.set(map,result);return result;
  }
  function drawMesh(mesh, material, first, last, poolPass=false) {
    if(!mesh.isMesh || mesh.isInstancedMesh || mesh.material?.isShadowMaterial || mesh.userData.pad) return;
    const geo=mesh.geometry;
    if(Array.isArray(mesh.material) && !material) {
      for(const g of geo.groups) drawMesh(mesh,mesh.material[g.materialIndex],g.start,g.start+g.count);
      return;
    }
    const mat=material || mesh.material;
    if(!mat?.visible || (poolPass ? mat.opacity<=0 : mat.opacity<.04) || !geo.attributes.position || geo.parameters?.width===380) return;
    const attr=geo.attributes, coords=attr.position, indices=geo.index?.array, raw=coords.array;
    const uv=attr.uv?.array, colors=attr.color?.array, normals=attr.normal?.array;
    const tex=uv ? pixels(mat.map) : null;
    if(poolPass && !tex)return;
    const tileX=tex && mat.map.wrapS===T.RepeatWrapping, tileY=tex && mat.map.wrapT===T.RepeatWrapping;
    matrix.multiplyMatrices(cameraMatrix,mesh.matrixWorld); normal.getNormalMatrix(mesh.matrixWorld);
    const m=matrix.elements, n=normal.elements;
    if(positions.length<coords.count*4)positions=new Float32Array(coords.count*4);
    for(let i=0;i<coords.count;i++){
      const j=i*3,k=i*4,x=raw[j],y=raw[j+1],z=raw[j+2];
      const q=1/(m[3]*x+m[7]*y+m[11]*z+m[15]);
      positions[k]=((m[0]*x+m[4]*y+m[8]*z+m[12])*q+1)*.5*width;
      positions[k+1]=(1-(m[1]*x+m[5]*y+m[9]*z+m[13])*q)*.5*height;
      positions[k+2]=(m[2]*x+m[6]*y+m[10]*z+m[14])*q; positions[k+3]=q;
    }
    const count=last ?? (indices?.length || coords.count), out=frame.data;
    for(let i=first||0;i<count;i+=3){
      const a=indices?indices[i]:i, b=indices?indices[i+1]:i+1,c=indices?indices[i+2]:i+2;
      const A=a*4,B=b*4,D=c*4,az=positions[A+2],bz=positions[B+2],cz=positions[D+2];
      if(positions[A+3]<=0||positions[B+3]<=0||positions[D+3]<=0 || Math.min(az,bz,cz)>1) continue;
      const ax=positions[A],ay=positions[A+1], bx=positions[B],by=positions[B+1],cx=positions[D],cy=positions[D+1];
      const denom=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);
      if(Math.abs(denom)<.13 || (mat.side===T.FrontSide && denom>=0) || (mat.side===T.BackSide && denom<=0)) continue;
      const x0=Math.max(0,Math.ceil(Math.min(ax,bx,cx)-.5)),x1=Math.min(width-1,Math.floor(Math.max(ax,bx,cx)-.5));
      const y0=Math.max(0,Math.ceil(Math.min(ay,by,cy)-.5)),y1=Math.min(height-1,Math.floor(Math.max(ay,by,cy)-.5));
      if(x0>x1||y0>y1)continue;
      let light=1;
      const k=a*3;
      if(normals && !mat.isMeshBasicMaterial){
        const nx=normals[k],ny=normals[k+1],nz=normals[k+2];
        const dx=n[0]*nx+n[3]*ny+n[6]*nz,dy=n[1]*nx+n[4]*ny+n[7]*nz,dz=n[2]*nx+n[5]*ny+n[8]*nz;
        const intensity=(-.45*dx+.78*dy+.43*dz)/(Math.hypot(dx,dy,dz)||1);
        light=.79+.24*Math.max(-.35,intensity*(denom>0?-1:1));
      }
      const red=light*srgb(colors?colors[k]:mat.color.r),green=light*srgb(colors?colors[k+1]:mat.color.g),blue=light*srgb(colors?colors[k+2]:mat.color.b);
      const dax=(by-cy)/denom,dbx=(cy-ay)/denom,day=(cx-bx)/denom,dby=(ax-cx)/denom;
      let rowA=dax*(x0+.5-cx)+day*(y0+.5-cy),rowB=dbx*(x0+.5-cx)+dby*(y0+.5-cy);
      const qa=positions[A+3],qb=positions[B+3],qc=positions[D+3];
      const au=tex?uv[2*a]*qa:0,bu=tex?uv[2*b]*qb:0,cu=tex?uv[2*c]*qc:0;
      const av=tex?uv[2*a+1]*qa:0,bv=tex?uv[2*b+1]*qb:0,cv=tex?uv[2*c+1]*qc:0;
      for(let y=y0;y<=y1;y++,rowA+=day,rowB+=dby){
        let u=rowA,v=rowB,j=y*width+x0;
        for(let x=x0;x<=x1;x++,j++,u+=dax,v+=dbx){
          const w=1-u-v;if(u<-.00002||v<-.00002||w<-.00002)continue;
          const z=az*u+bz*v+cz*w; if(z>depth[j]+.00000003)continue;
          let R=red,G=green,Bl=blue;
          if(tex){
            const q=1/(qa*u+qb*v+qc*w);
            let tu=(au*u+bu*v+cu*w)*q, tv=(av*u+bv*v+cv*w)*q;
            if(tileX)tu-=Math.floor(tu);
            if(tileY)tv-=Math.floor(tv);
            const tx=Math.min(tex.w-1,Math.max(0,Math.floor(tu*tex.w)));
            const ty=Math.min(tex.h-1,Math.max(0,Math.floor((1-tv)*tex.h)));
            const k=4*(ty*tex.w+tx);
            if(poolPass){
              const dst=j*4, amount=mat.opacity*tex.data[k+3]/255;
              if(amount<=0 || !out[dst+3] || poolCoverage[j])continue;
              // Add the graded light to the printed ink. The two triangles of the
              // lamp's sheet share a diagonal; illuminate those pixels only once.
              poolCoverage[j]=1;
              out[dst]=srgb(linear[out[dst]] + mat.color.r*linear[tex.data[k]]*amount);
              out[dst+1]=srgb(linear[out[dst+1]] + mat.color.g*linear[tex.data[k+1]]*amount);
              out[dst+2]=srgb(linear[out[dst+2]] + mat.color.b*linear[tex.data[k+2]]*amount);
              continue;
            }
            if(tex.data[k+3]<90)continue;
            R*=tex.data[k]/255;G*=tex.data[k+1]/255;Bl*=tex.data[k+2]/255;
          }
          const k=j*4;out[k]=R;out[k+1]=G;out[k+2]=Bl;out[k+3]=255;depth[j]=z;
        }
      }
    }
  }
  function collect(mesh){
    const mat=mesh.material;
    if(mesh.isMesh && mesh.geometry.type==='PlaneGeometry' && mat?.map &&
        mat.transparent && !mat.depthWrite && mat.blending===T.AdditiveBlending){
      if(mat.visible && mat.opacity>0)lightPools.push(mesh);
      return;
    }
    drawMesh(mesh);
  }
  function render(scene,camera){
    depth.fill(Infinity);frame.data.fill(0);
    scene.updateMatrixWorld();camera.updateMatrixWorld();cameraMatrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    lightPools.length=0;
    scene.traverseVisible(collect);
    for(const pool of lightPools){
      // The complete paper depth buffer masks the light behind feet and furniture.
      if(poolCoverage?.length!==depth.length)poolCoverage=new Uint8Array(depth.length);
      poolCoverage.fill(0);
      drawMesh(pool,undefined,0,undefined,true);
    }
    ctx.putImageData(frame,0,0);
  }
  return {software:true,shadowMap:{},setPixelRatio(){},setSize,render};
}
