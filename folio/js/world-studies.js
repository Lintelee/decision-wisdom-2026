// Four sets are drawn with the same viewpoint so the material and the setting can be compared.
const settings = {
  prologue: {name:'港邊茶攤',sky:['#eab986','#f0cd92','#e7b480'],ground:['#a5b7a1','#b5b797','#869589']},
  people: {name:'面對面的攤街',sky:['#d6d7ad','#efd8ad','#e5c2a1'],ground:['#a7bd85','#bcb98a','#a69b85']},
  model: {name:'能擺兩個樣品的工桌',sky:['#bdcbd0','#b8c4bf','#b0b4b0'],ground:['#c7ae91','#d0ad85','#a78f80']},
  ai: {name:'天燈升起前的夜街',sky:['#385767','#414862','#40364c'],ground:['#617c78','#6c7375','#64556a']},
};
const stocks={
  fold:{edge:'#61534a',light:'#fff0c9',red:'#b96546',teal:'#59897d',dim:'#90775b'},
  ink:{edge:'#353e55',light:'#f5dda6',red:'#d76b52',teal:'#688b8c',dim:'#4e5d6c'},
  light:{edge:'#493446',light:'#ffe2a2',red:'#c77966',teal:'#739a94',dim:'#785e70'},
};
const path=(d,fill)=>'<path d="'+d+'" fill="'+fill+'"/>';
const line=(d,color,width=2)=>'<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"/>';
const rect=(x,y,w,h,fill)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'"/>';
const circle=(x,y,r,c)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/>';
const resident=(family,species,x,y,size)=>'<use href="art/animal-studies.svg#'+family+'-'+species+'" x="'+x+'" y="'+y+'" width="'+size+'" height="'+size*1.125+'"/>';
function lantern(x,y,size,p) {
  return '<g transform="translate('+x+' '+y+') scale('+size+')">'+line('M0 -14v7',p.edge,1.5)+
    path('M-10 -5l4 -4h12l4 4-2 12-6 4h-4l-6-4Z',p.red)+path('M-4 -8h7l2 4-1 12-4 3-3-5Z',p.light)+
    line('M-7 -7H7m-10 17h6m-3 1v5',p.edge,1.5)+'</g>';
}
function harbor(f,p) {
  return circle(211,40,19,'#ffda91')+path('M0 67l20-9 14 7 21-10 29 12 27-5 25 8 36-12 15 3 17-7 32 9 24-2 20-6v17H0Z',p.teal)+
    line('M183 77h41m7-6h34m-72 12h15',p.light,1.5)+line('M15 104h110m-105-4 4-53m85 53-1-54',p.edge,4)+
    path('M10 47l12-20h84l13 18-7 7-96 1Z',p.red)+path('M24 28h15l-7 21-14 2Zm31 0h13l-1 22-17 1Zm30 0h15l8 20-17 2Z',p.light)+
    resident(f,'cat',47,52,40)+rect(16,89,101,5,p.edge)+rect(23,94,84,8,p.dim)+
    path('M37 84q4-6 10-1l-2 4h-7Zm51 0q5-6 10-1l-2 4h-7Z',p.light)+
    line('M130 101v-28m16 27V73m-19 4h22M154 99l35-13 3 4-29 12',p.edge,2)+resident(f,'hare',177,66,37);
}
function market(f,p) {
  return path('M0 57l21-14 12 7 24-22 18 15 18-12 29 15 24-13 21 10 23-16 23 8 24-9 26 14 18-4v24H0Z',p.teal)+
    line('M17 29q80 39 164 7t91-11',p.edge,1)+path('M65 43l9 2-3 8Zm35 4h9l-4 8Zm40-2 10-2-2 8Zm48-13 8-4v8Z',p.red)+
    rect(20,61,4,44,p.dim)+rect(90,60,4,43,p.dim)+path('M11 62l16-18h56l18 15-5 6-82 2Z',p.red)+
    path('M26 45h12l-5 17H19Zm28-1h12l6 17-16 1Z',p.light)+
    resident(f,'badger',28,64,40)+rect(12,98,56,5,p.edge)+path('M15 103h50l-4 8H16Z',p.teal)+
    path('M180 61l12-27h68l12 23-5 6Z',p.teal)+path('M195 35h16l-7 23-16 2Zm30 0h12l4 24h-14Z',p.light)+
    line('M190 60v42m71-43v45',p.edge,3)+resident(f,'hare',206,65,36)+
    rect(207,94,59,6,p.red)+rect(210,100,51,6,p.dim)+line('M101 100q24-12 48-6m-42 11q22-10 41-9',p.light,2);
}
function workshop(f,p) {
  return rect(14,20,87,50,p.dim)+rect(19,24,77,40,p.light)+rect(54,24,3,40,p.teal)+line('M23 58l19-25m24 24 16-20',p.teal,1)+
    line('M180 32h80m-71 1v14m10-14v8m11-8v13m17-13v9m16-9v15',p.edge,2)+
    resident(f,'owl',23,58,43)+line('M68 106l170-4m-154 1-3 12m140-12 3 11',p.edge,5)+
    path('M88 95l12-37 38 1-2 35Z',p.teal)+path('M94 91l10-28 28 1-1 26Z',p.light)+
    path('M102 82l10-11 9 11Z',p.red)+path('M145 94l10-41 40 3-2 38Z',p.red)+path('M151 89l7-30 32 2-2 28Z',p.light)+
    path('M159 82l11-14 12 14Z',p.teal)+line('M119 100l25-4m60-6 10-5 10 7',p.edge,2)+resident(f,'squirrel',217,65,38);
}
function night(f,p){
  return circle(46,30,10,'#f7dc99')+circle(50,26,8,settings.ai.sky[{fold:0,ink:1,light:2}[f]])+
    path('M0 66l19-13 15 4 18-14 12 7 19-16 27 18 20-10 17 7 22-21 17 15 24-9 23 13 30-10 17 4v19H0Z',p.dim)+
    rect(11,70,79,35,p.edge)+path('M5 71l14-13h55l22 12-5 5Z',p.teal)+rect(21,78,20,16,'#e9b26d')+line('M30 79v14',p.edge,2)+
    rect(191,63,79,40,p.edge)+path('M178 64l24-18h48l25 16-7 5Z',p.red)+rect(214,70,28,18,p.light)+line('M227 71v16',p.edge,2)+
    line('M75 38q52 24 135-12',p.light,1)+lantern(105,52,.62,p)+lantern(142,48,.54,p)+lantern(179,38,.55,p)+
    resident(f,'squirrel',68,68,37)+resident(f,'owl',148,67,38)+lantern(129,82,.82,p)+line('M129 94q-1 6-11 7',p.light,1);
}
const drawSet={prologue:harbor,people:market,model:workshop,ai:night};
export function worldStudy(family,land) {
  const set=settings[land],p=stocks[family],i={fold:0,ink:1,light:2}[family];
  const id='set-'+family+'-'+land,ground=set.ground[i],sky=set.sky[i];
  let surface='',frame='';
  if(family==='fold') {
    surface=path('M10 109l98-13 40 10 103-10 22 15-130 13Z',p.light)+line('M143 121v-18m0 0 19-4',p.dim,1);
  }else if(family==='ink') {
    const dots=id+'-dots';
    surface='<defs><pattern id="'+dots+'" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="'+p.edge+'"/></pattern></defs>'+
      '<rect width="280" height="118" opacity=".16" fill="url(#'+dots+')"/>'+line('M5 13V6h6m259 0h6v6M4 110v5h6m258 0h7v-6',p.red,1);
  }else{
    frame='<path fill-rule="evenodd" d="M0 0h280v120H0ZM9 17v88l10 7h243l10-7V17l-12-9H20Z" fill="'+p.edge+'"/>'+
      line('M4 16l14-12h245l12 11M5 105l12 11h246l11-9',p.light,1)+circle(141,5,2,p.red);
  }
  const terrain=path('M0 81q47-8 95 0t96 0 89-6v46H0Z',ground);
  return '<svg class="set-study" role="img" aria-label="'+set.name+'" viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">'+
    rect(0,0,280,120,sky)+terrain+surface+drawSet[land](family,p)+frame+'</svg>';
}
