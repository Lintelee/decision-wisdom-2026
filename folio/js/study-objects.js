// All twelve props share a medium within each proposal. The silhouettes are drawn
// once, then rendered as folded stock, misregistered ink or a rod-operated shadow.
const materials = {
  fold: {body:'#78a69b',accent:'#c36d48',cream:'#ffdfad',edge:'#51473c',dark:'#546e5d',paper:'#f5e6c6'},
  ink: {body:'#6e9795',accent:'#da7053',cream:'#e9b750',edge:'#333d54',dark:'#4e5d78',paper:'#f7e9c7'},
  light: {body:'#59a9a0',accent:'#da7866',cream:'#edbb68',edge:'#473546',dark:'#715469',paper:'#5a4553'},
};
const path=(d,fill,more='')=>'<path d="'+d+'" fill="'+fill+'" '+more+'/>';
const line=(d,ink,weight=1.6)=>path(d,'none','stroke="'+ink+'" stroke-width="'+weight+'"');
const dot=(x,y,r,fill)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';
const oval=(x,y,rx,ry,fill)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'"/>';
function cup(x,y,scale,p) {
  return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+
    path('M-19 -10 Q-18 14 -8 17 Q0 21 10 15 Q18 6 19 -10Z',p.body)+
    path('M18 -7 Q33 -12 29 0 Q27 8 16 7 L17 3 Q24 3 24 -3 Q23 -6 18 -3Z',p.cream)+
    oval(0,-10,19,5.7,p.cream)+oval(1,-10,14,3.4,p.accent)+line('M-12 -4 Q-12 6 -8 10',p.cream,2)+'</g>';
}
function art(icon,p) {
  const {body,accent,cream,edge,dark}=p;
  switch(icon) {
    case 'cup': return oval(46,57,30,5,dark)+cup(45,39,1.03,p)+line('M41 22 C34 16 45 15 40 8 M48 21 Q58 16 50 9',accent);
    case 'photo': return '<g transform="rotate(-8 48 36)">'+path('M20 14H73V59H20Z',cream)+path('M24 18H69V49H24Z',body)+path('M29 47 Q47 30 63 47Z',dark)+oval(46,33,9,9,accent)+path('M34 30 L39 23 56 23 59 29Z',dark)+line('M29 54h16',edge)+'</g>'+path('M68 13l7 4-9 12-4-3Z',accent);
    case 'field': return path('M16 52l49-9 15 6-49 11Z',body)+line('M20 50l40-29',edge,3)+path('M53 24l15-11-7 14Z',accent)+path('M52 40V16l18 5-18 5Z',cream)+line('M52 16v28',edge)+line('M31 53l4 3m5-6 4 3m5-6 4 3',edge);
    case 'coat': return path('M41 14l10-1 9 9 9 3 10 16-9 6-8-8 4 20-16-6-16 8-3-20-8 6-7-7 11-17 9-2Z',body)+path('M37 20q0-18 12-15 12 2 12 17l-12 6Z',accent)+path('M42 19q-2-8 5-8 6 0 9 9l-7 5Z',cream)+line('M48 26l2 23m-14-6 6 2m13-2 6-2',edge)+path('M69 17l3-7 3 7q-1 4-6 0Z',dark);
    case 'tofu': return path('M14 44l39-12 29 11-8 13-36 7-17-8Z',body)+path('M22 42l10-11 14 1 5 11-16 7Z',cream)+path('M44 37l12-11 14 4 4 12-19 6Z',accent)+path('M33 30l8-12 14 1 6 10-13 8Z',cream)+line('M28 40l11-5m13-3 9-5m-23-3 8-3',dark)+line('M26 26q-4-7 2-12m41 10q7-5 3-12',accent);
    case 'paw': return path('M16 22l56-7 8 42-58 5Z',cream)+path('M31 49q-3-6 4-10l5-8q4-6 10 2l5 8q8 6 2 10-3 3-11 0-10 5-15-2Z',accent)+oval(30,34,3,5,body)+oval(37,26,3.5,5,accent)+oval(49,24,3.5,5,accent)+oval(58,30,3,5,body)+line('M65 48l7-2m-6 5 6-1',dark);
    case 'pair': return path('M14 47l44-13 26 8-2 10-45 10-22-7Z',dark)+cup(34,38,.66,p)+cup(60,32,.64,{...p,body:accent,accent:dark})+path('M31 56l7-2m18-3 7-2','none','stroke="'+cream+'" stroke-width="2"');
    case 'menu': return oval(48,48,34,11,dark)+oval(48,45,32,10,body)+path('M25 40l12-25 27-1 4 23-14 9Z',cream)+path('M57 15l8 1 6 18-6 3Z',accent)+line('M35 26l16-3m-18 8 16-3m-18 8 12-2',edge)+dot(56,33,4,accent);
    case 'lion': return path('M54 33q13-4 21 5l9-5-1 11-10 8-17-2Z',accent)+path('M57 37l6-4 4 8 7-4 3 6-9 7-10-4Z',cream)+path('M15 38l5-13 9-2 6-11 8 5 8-5 5 10 9 4 2 13-9 11-12-1-9 7-15-7Z',accent)+path('M19 39q13-10 24-2l12-8 9 3-4 10-11 7-15-3-9 2Z',cream)+dot(30,31,8,body)+dot(50,27,7,body)+dot(31,30,3,edge)+dot(51,26,3,edge)+dot(41,39,3,dark)+line('M30 44q9 5 19 0',edge);
    case 'melon': return path('M16 30q22-20 53-8l9 6q-3 28-28 34-23-5-34-32Z',dark)+path('M20 29q28-7 54-1-5 22-24 28-19-4-30-27Z',cream)+path('M24 29q25-8 47-1-4 19-21 24-16-4-26-23Z',accent)+dot(36,33,1.8,edge)+dot(52,39,1.8,edge)+dot(61,30,1.8,edge);
    case 'cloth': return path('M17 20l56-9 5 4-57 10Z',dark)+path('M25 24l43-7 2 28q-6 9-12 4l-5 9-10-4-10 7-6-6Z',body)+path('M35 26l7-2 6 27-8 2Z',cream)+path('M51 23l6-1 7 23-5 4Z',accent)+line('M23 17l-.4-6m45 1 .3-5M32 31l4 19m24-26 4 14',edge);
    case 'lantern': return path('M26 16q22-10 44 1l-5 24-10 13-15-1-10-13Z',accent)+path('M26 16l14 6 15 0 15-5',cream)+path('M40 22q-3 14 2 26l7 5 6-3q6-15 0-28Z',cream)+line('M30 17l10-5 15 1 11 5M40 53l4 5 9 0 3-5m-7 5q-7 7-13 4',edge)+dot(49,43,3,body);
    default: return '';
  }
}

export function drawProp(icon, medium, uid) {
  const p=materials[medium], figure=art(icon,p), id='object-'+uid;
  let details='';
  if(medium==='fold') {
    details=oval(50,61,27,2.8,'#b89c77')+
      '<use href="#'+id+'" transform="translate(1 1)" stroke="#fff3d7" stroke-width="3.6"/><use href="#'+id+'"/>';
  } else if(medium==='ink') {
    const printId=id+'-grain';
    details='<defs><pattern id="'+printId+'" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="#25344a"/></pattern><clipPath id="'+id+'-clip"><use href="#'+id+'"/></clipPath></defs>'+
      '<use href="#'+id+'" transform="translate(-2.7 1.8)" stroke="#d97858" stroke-width="3"/><use href="#'+id+'"/>'+
      '<rect width="96" height="70" opacity=".23" fill="url(#'+printId+')" clip-path="url(#'+id+'-clip)"/>';
  } else {
    details=oval(49,35,41,28,'#dbc29a')+line('M19 65l20-26m32 20-12-20','#684759',1.5)+
      '<use href="#'+id+'" transform="translate(4 2.5)" opacity=".28" stroke="#372b3a" stroke-width="3"/><use href="#'+id+'" opacity=".94" stroke="#453445" stroke-width="1.1"/>'+
      dot(39,41,2.2,'#f7d48a');
  }
  return '<svg viewBox="0 0 96 70" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs><g id="'+id+'" stroke-linecap="round" stroke-linejoin="round">'+figure+'</g></defs>'+details+'</svg>';
}
