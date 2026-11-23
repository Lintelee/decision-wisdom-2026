// Front endpaper. The glass palm, awning and page stock are separate cut pieces.
export const frontPaperArt = `<svg xmlns="http://www.w3.org/2000/svg" class="front-paper-print" viewBox="0 0 720 442" preserveAspectRatio="xMidYMid meet" width="720" height="442" aria-hidden="true" focusable="false" style="display:block;width:100%;height:100%">
  <defs>
    <linearGradient id="fp-left-paper" x1="5%" y1="85%" x2="96%" y2="32%"><stop stop-color="#e2c99a"/><stop offset=".64" stop-color="#f7e7bd"/><stop offset="1" stop-color="#baa176"/></linearGradient>
    <linearGradient id="fp-right-paper" x2=".97" y2=".17" gradientUnits="objectBoundingBox"><stop stop-color="#b0966e"/><stop offset=".13" stop-color="#e8cf9e"/><stop offset=".49" stop-color="#f5e3b7"/><stop offset="1" stop-color="#e9d3a3"/></linearGradient>
    <linearGradient id="fp-sun" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f3cd84"/><stop offset="1" stop-color="#d49262"/></linearGradient>
    <pattern id="fp-fibres" width="31" height="25" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)"><g fill="none" stroke-linecap="round"><path d="m3 4 2-.5m16 3 1.8-.3m-10 8 3.7-.8m5.4 7 .9-.2m-20-6 .8-.2" stroke="#fff3cd" stroke-width=".8" opacity=".42"/><path d="m14 3 2.2-.6m8 12 3-.7m-23 7 1.5-.4" stroke="#4c4c3a" stroke-width=".7" opacity=".23"/></g></pattern>
    <pattern id="fp-woven" width="6" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)"><path d="M0 1h6m-4 1v5" stroke="#f7d7a1" stroke-opacity=".16" stroke-width=".65"/></pattern>
    <path id="fp-left-leaf" d="M32 345 107 225Q232 203 341 235l9 152Q232 346 38 358Z"/>
    <path id="fp-right-leaf" d="M341 235Q434 189 563 182l117 113 10 12Q484 333 350 387Z"/>
    <path id="fp-arch" d="M0 35V15Q0 3 8 2q9 0 9 13v20Z"/>
    <path id="fp-dock-window" d="M0 0h13v17H0zM2 2v6h4V2Zm6 0v6h3V2ZM2 10v5h4v-5Zm6 0v5h3v-5Z" fill-rule="evenodd"/>
    <path id="fp-cup" d="M-8.4 0Q0-3.3 8.5-.7L7 6.3 4.8 8.3l-6.2 1-4.1-1.1Z"/>
    <path id="fp-plane-shadow" d="m85 283 63-12 63 .9 40-12 99 6 176-25 54 13-48 12 30 2-62 16-98 7-40 27-61 8-36-7-109 12-18-1 27-9 10-6-78 5-40-3 42-17Z"/>
  </defs>
  <style>
    .front-paper-print .fp-lantern-drift{animation:fp-lantern-drift 6.8s ease-in-out infinite;transform-origin:0 0}
    .front-paper-print .fp-kettle-steam{animation:fp-kettle-steam 3.5s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom}
    .front-paper-print .fp-teacup-steam{animation:fp-kettle-steam 3.9s ease-in-out -.95s infinite;transform-box:fill-box;transform-origin:center bottom}
    .front-paper-print .fp-eye-glint{animation:fp-eye-glint 6.8s ease-in-out -.7s infinite;transform-box:fill-box;transform-origin:50% 72%}
    @keyframes fp-lantern-drift{0%,100%{transform:translate(0,2px) rotate(1.1deg)}50%{transform:translate(3px,-3px) rotate(-1.8deg)}}
    @keyframes fp-kettle-steam{0%,100%{transform:translate(0,1.5px) scale(.96,.90);opacity:.52}50%{transform:translate(1px,-2.5px) scale(1.04,1.06);opacity:.93}}
    @keyframes fp-eye-glint{0%,45%,49%,100%{transform:scaleY(1)}47%{transform:scaleY(.2)}}
    @media(prefers-reduced-motion:reduce){.front-paper-print *{animation:none!important}}
    html.still .front-paper-print *,html[data-motion="off"] .front-paper-print *,html[data-motion="reduce"] .front-paper-print *,html[data-reduced-motion="true"] .front-paper-print *{animation:none!important}
  </style>
  <!-- The sky is the green cloth of the surrounding binding. -->
  <g id="fp-distant-light">
    <circle cx="429" cy="86" r="45" fill="url(#fp-sun)"/><circle cx="429" cy="86" r="45" fill="url(#fp-fibres)"/>
    <path d="M380 102a53 53 0 0 1 16-56m48-11a53 53 0 0 1 24 17" fill="none" stroke="#e7c786" stroke-width="1.05" opacity=".58"/>
    <g fill="#d8cca2"><path d="m94 145 7-3 6 1 6-7 8 1 6 5 8 1 4 4-28 1Z"/><path d="m548 80 8-3 7 1 4-6 9-3 5 3 3 6 9 1 5 3-24 2-23-2Z" opacity=".87"/></g>
    <g fill="none" stroke="#c7c5a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M237 107q5-4 11-.5 2-5 8-5"/><path d="M260 97q3.5-2 6 0 1.5-3 5-3.2"/></g>
    <g transform="translate(531 59)"><g class="fp-lantern-drift"><path d="m-13-11 8-5 14 1 6 9-2 15-6 5-10-1-7-11Z" fill="#c16a4f"/><path d="m-5-16 13 1 2 10-3 17-7 .5-7-14Z" fill="#e89960"/><path d="m-6-8 3-5 8 1-1 17-3 8-4-2Z" fill="#efba76"/><path d="m.8 12 7-.1-2.6 4-4-.4Z" fill="#705443"/></g></g>
  </g>
  <!-- Sewn spine, stacked leaves, ribbon and two curved page faces. -->
  <g id="fp-binding">
    <path d="M27 366q131-14 239 15l81 33 27 3q143-50 328-68l4-9-15-12-337 52-256-25Z" fill="#142d2b" opacity=".72"/>
    <path d="m23 352 80-117 238 10 222-55 134 117 3 13q-174 26-325 76l-15 9-19 4-14-8Q182 362 26 376l-6-5Z" fill="#86503c"/>
    <path d="m23 352 77-118 240 8 221-54 136 119-1 8Q518 338 371 390l-14 10-18 3-13-8Q163 358 22 370Z" fill="#ba7654"/>
    <path d="m30 347 76-117q130-21 233 12 112-49 222-54l125 115 4 11q-186 22-330 80-8 6-18 4-158-43-315-34Z" fill="#c3a578"/>
    <g fill="none" stroke="#e9d5a9" stroke-width="1.65"><path d="M33 356q168-12 307 32m-298-27q155-9 292 28m28-1q141-54 319-78m-291 71q119-45 276-67"/></g>
    <path d="m520 336 20-4 14 27-10-3-7 9Z" fill="#9c513e"/><path d="m525 336 4-.9 14 24-4 3Z" fill="#d58d65"/>
    <use href="#fp-left-leaf" fill="url(#fp-left-paper)"/><use href="#fp-right-leaf" fill="url(#fp-right-paper)"/>
    <use href="#fp-left-leaf" fill="url(#fp-fibres)"/><use href="#fp-right-leaf" fill="url(#fp-fibres)"/>
    <path d="M38 347q177-16 293 28m21 7q147-55 318-80" fill="none" stroke="#fcefcb" stroke-width="1.6"/>
    <path d="m339 239 8 114 3 34 5-5-8-128-3-18Z" fill="#9b8861" opacity=".52"/>
    <g fill="none" stroke="#7c7054" opacity=".65" stroke-width="1.6" stroke-linecap="round"><path d="m344 281 5-1m-4 19 5-1m-4 19 5-1m-4 19 5-1m-4 19 5-1m-4 19 5-1"/></g>
    <use href="#fp-plane-shadow" fill="#928c68" opacity=".36"/>
    <g fill="none" stroke="#b3a077" stroke-width="1" opacity=".7"><path d="m76 328 43-5 9 1m-39 9 18-1m26-30 31-3m363 18 22-5 13-1m35-20 29-4m-442 32 38-4m232 10 26-7"/></g>
  </g>
  <!-- A continuous row of folded Taiwanese shopfronts sits along the back leaf. -->
  <g id="fp-near-street">
    <path d="m100 237 3-5 53-10 33 3 29-9 32 4 44-9 33 6 44-9 17 5-41 17-180 29-33-1Z" fill="#bca87f"/>
    <g transform="translate(116 162)">
      <path d="m0 65 2-28 7-4 2-11 8 1 6-9 10-1 7 5 5 1 2 8 9 1-1 29-47 11Z" fill="#b2b19a"/><path d="m0 65 7 4 58-10-9-6-48 8Z" fill="#879785"/>
      <path d="m8 33 11-2 2-6 6-.7 4-3 8 1-3-5-8-.5-6 8-11-.8Z" fill="#d7c49c"/>
      <g fill="#678781"><use href="#fp-dock-window" transform="translate(11 40) scale(.60 .68)"/><use href="#fp-dock-window" transform="translate(27 37) scale(.63 .73)"/><use href="#fp-dock-window" transform="translate(42 35) scale(.59 .67)"/></g>
    </g>
    <g transform="translate(160 139)">
      <path d="m0 84 2-51 8-1 4-8 16-2 7-10 7-2 4-7 8-1 4 4 7 1 6 8 11 1v8l9 1-1 44-18 8Z" fill="#b57659"/>
      <path d="m0 84 2-51 9-.5 12-5 14-.4 5-7 6-3 5-6 5-1 5 2 11 11 10 .3v43l-22 6-56 13Z" fill="#ce9f75"/>
      <path d="m5 33 6-.6 4-6 17-2 7-10 9-3 2-5 5-2 4 3 6 1 6 8 11 2-1 4-13-2-6-8-8-2-4 5-8 3-4 8-18 2-5 7-10 1Z" fill="#e9c79a"/>
      <g fill="#797e68"><use href="#fp-arch" transform="matrix(.72,-.11,0,.88,10,46)"/><use href="#fp-arch" transform="matrix(.72,-.11,0,.88,33,42)"/><use href="#fp-arch" transform="matrix(.72,-.11,0,.88,56,38)"/></g>
      <path d="m9 39 60-9v3L9 42Zm17-5 17-2v2l-17 2Z" fill="#e5bc8e"/><path d="m49 22 8-1 .2 5-8 1Z" fill="#849383"/>
    </g>
    <g transform="translate(247 159)"><path d="m0 53 1-33 10-1 1-7 7-3 5-8 26-1 5 7 8 1 2 5 8 1v30Z" fill="#a3ad98"/><path d="m3 19 10-1 3-7 7-2 3-6h23l4 7 8 1 2 5-11-1-4-7-19-.2-4 6-8 2-2 6-12 1Z" fill="#ded1a8"/><g fill="#5d7773"><use href="#fp-dock-window" transform="translate(12 27) scale(.78 .90)"/><use href="#fp-dock-window" transform="translate(36 23) scale(.78 .9)"/><use href="#fp-dock-window" transform="translate(56 21) scale(.64 .8)"/></g></g>
    <path d="m96 245 202-38 27 4-206 45Z" fill="#d5bd94"/><path d="m100 246 194-36" fill="none" stroke="#f3daaf" stroke-width="1.7"/>
  </g>
  <g id="fp-tea-stall">
    <!-- Feet hold the walls perpendicular to the page. A dark inside plane sets off the tea steam. -->
    <path d="m328 286 85 12 145-34 23-16-32-5-101 7Z" fill="#9a906f" opacity=".47"/>
    <path d="m366 264 3-119 128-33 52 14-2 123-139 28Z" fill="#738877"/>
    <path d="m367 145 120-23 1 123-119 23Z" fill="#8e9b83"/>
    <path d="m368 154 116-23 1 114-117 19Z" fill="url(#fp-fibres)"/>
    <path d="m486 121 56-11v130l-52 12Z" fill="#4b6b61"/>
    <path d="m493 139 42-8v82l-42 8Z" fill="#b9b595"/>
    <path d="m495 143 37-7v72l-37 9Z" fill="#69867c"/>
    <g fill="none" stroke="#a9b19a" stroke-width="2.6"><path d="M506 140v74m13-76v74m-22-48 34-6m-34 27 34-7"/></g>
    <path d="m329 163 6-.7 1 106-7 3Z" fill="#ae8057"/><path d="m329 164 3-.5.7 106-3.8 1Z" fill="#d9ae75"/>
    <path d="m512 148 5-2-1 102-6 2Z" fill="#b08359"/><path d="m543 121 5-1 1 121-6 2Z" fill="#c39d6a"/>
    <g id="fp-awning">
      <path d="m310 157 41-43 146-25 47 17 17 14-40 34-207 24Z" fill="#735847"/>
      <path d="m314 154 38-42 144-25 48 17-32 37Z" fill="#d49a69"/>
      <path d="m351 111 145-25 48 16-8 4-42-12-136 22Z" fill="#f1d4a5"/>
      <path d="m355 115 141-23 43 13-31 34-194 27Z" fill="#eddbb1"/>
      <path d="m358 115 17-2-27 47-31 5Z" fill="#bc6950"/><path d="m386 111 20-3-22 47-26 4Z" fill="#b8654c"/><path d="m418 106 20-3-14 45-28 5Z" fill="#ba6c50"/><path d="m449 101 18-2-8 45-23 3Z" fill="#b6684e"/><path d="m479 96 17-3 6 2-14 44-20 3Z" fill="#b56449"/>
      <path d="m506 97 10 3-9 37-10 2Z" fill="#c1855a"/><path d="m518 101 20 6-29 32-4 2Z" fill="#dec197"/>
      <path d="m312 162 198-27v10l-6 7-7-4-5 1-5 6-8-4-6 .5-5 6-7-3-7 .2-7 6-9-3-6 1-5 6-9-3-6 1-7 6-8-4-8 1-8 7-8-4-8 1-6 7-9-5-9 1-6 6-8-3-7 1-5 5-8-4Z" fill="#edcfa0"/>
      <path d="m313 162 32-4v10l-7 7-7-4-7 1-7 5-5-4Zm45-5 25-3.5v9l-7 7-8-4-10 1Zm39-6 26-3 .5 9-5 6-9-4-7 2-6 5Zm40-5 23-3 1 9-7 6-7-2-10 .5Zm33-4 20-3 1 9-6 6-7-3-8 2Zm27-4 13-2v9l-6 7-7-5Z" fill="#aa5a44"/>
      <path d="m314 162 196-27" fill="none" stroke="#f5dfb2" stroke-width="2.2"/><path d="m515 137 24-31 18 13-42 28Z" fill="#ae805e"/><path d="m318 158 37-43 142-23 42 14-31 31Z" fill="url(#fp-fibres)"/>
    </g>
    <!-- The otter leans out; tiny cup and outstretched paw share the same sightline. -->
    <g id="fp-otter" transform="translate(423 198)">
      <path d="m-17 8 13-8 14 2 12 10 7 18-9 11-39 3-8-19Z" fill="#c29b68"/>
      <path d="m-8 9 7-8 10 2 1 16-6 3-10-5-11 18-12-4 7-18Z" fill="#e9d6ad"/>
      <path d="m0 16 6 2 8-17 6 4-5 18 6 16-42 1 8-20 6 3Z" fill="#456f65"/>
      <path d="m-12 23 24 1 6 13-35 2Z" fill="url(#fp-woven)"/>
      <path d="m-16 11-7 1-6 7-11 2-1 7 14 1 15-9Z" fill="#c39d6d"/><path d="m-44 18 8 .5 1 8-9 4-9-2-5-4 2-3 5 .2 2-2Z" fill="#986f4e"/>
      <g transform="translate(-47 16) scale(.79)"><use href="#fp-cup" fill="#efdbad"/><path d="m-7 2 14-1-.5 2-12.5 1Z" fill="#70948a"/></g>
      <path d="m-18-30-5-4-5 1-4 5 .3 6 6 5 8-3m27-18 6-3 6 2 4 5-1 6-8 4-6-4Z" fill="#8a634d"/>
      <path d="m12-32 6-2 4 4-1 5-5 2-6-4Z" fill="#c19578"/>
      <path d="m-22-25 8-9 12-4 12 1 11 8 3 13-1 8-5 8-10 6-10-.4-8-3-8-5-10-1-7-6 1-8Z" fill="#a77e59"/>
      <path d="m-29-18 8-8 7-3-3 8 9 1 4 6 6 3 8 1-4 7-12 4-10-3-9-5-10-2-5-5Z" fill="#e1c69a"/>
      <path d="m-27-17 4-2 6 1 2 2-4 5-7-.5-3-3Z" fill="#3e4035"/>
      <g class="fp-eye-glint"><ellipse cx="-11" cy="-23" rx="3.3" ry="3.6" fill="#433f32"/><circle cx="-12" cy="-24.3" r="1" fill="#faeac3"/></g>
      <path d="m-17-9 4 2 4-1m-13-11 4.5-.9m-15.5 9.6 5 .2m-3.8 3.4 4.7-1" fill="none" stroke="#705944" stroke-width="1.3" stroke-linecap="round"/>
    </g>
    <!-- Counter, side-handled tea pot, cups and the maker's three tins. -->
    <path d="m324 224 182-25 48 13-45 21-183 27Z" fill="#cfad78"/>
    <path d="m326 233 183-26 3 55-184 37Z" fill="#31594f"/>
    <path d="m332 240 172-25 1 43-172 32Z" fill="#608477"/>
    <path d="m332 240 172-25 1 43-172 32Z" fill="url(#fp-fibres)"/>
    <path d="m335 245 164-25m-162 62 164-29" fill="none" stroke="#adad82" stroke-width="1.3"/>
    <g fill="#d1bc89"><path d="m342 251 2-.4v23l-2 .5Zm151-23 2-.3v21l-2 .3Z"/></g>
    <path d="m509 211 42-11-.5 50-39 13Z" fill="#99774f"/><g fill="none" stroke="#c39b68" stroke-width="1.7"><path d="M519 215v41m10-44v40m10-43v41"/></g>
    <path d="m322 224 177-27 55 2.5-44 16-187 29Z" fill="#e6c48d"/><path d="m322 228 187-28 43-2-42 13-187 30Z" fill="#f0d29f"/><path d="m323 238 187-28 43-12 .8 5-42 13-189 29Z" fill="#a77c58"/>
    <g fill="none" stroke="#e3d5aa" stroke-width="1.7" stroke-linejoin="round"><path d="M365 270q12-8 21-20m-11 13q-7-1-8-8 8-1 10.5 4m-.5 2q10 0 14-7-6-2-12 4"/><path d="M437 259q11-7 21-20m-11 13q-7-1-7-7 7-.5 9.2 4m-1.3 1.6q10 1 15-7-8 0-13.2 5"/></g>
    <g transform="translate(470 201) rotate(-4)">
      <path d="m-20-13-7-7-3 1-3-2-2 1 3 7 6 7 8 2 3-4Z" fill="#a86645"/>
      <path d="M11-18q7-8 14-4l1.5 6-10 10-5-2 10-10-.8-1L13-15Z" fill="#7e523a"/>
      <path d="m-18-17 5-6 13-2 12 2 6 8-1 9-8 6-18 1-10-3-4-8Z" fill="#a56845"/>
      <path d="m-19-14 11 1 15-2 7-3 4 6-2 7-7 6-17 1-10-3Z" fill="#986044"/>
      <path d="m-15-21 3-3 8-3 14 .4 6 3-1 3-8 2-14 .7Z" fill="#c18a5d"/><path d="m-4-29 3-3 4-.4 3 2-1 5-7 .5Z" fill="#88583e"/>
      <path d="m-22-12-6-5m12 10 3 4" fill="none" stroke="#d39b6b" stroke-width="1.2" stroke-linecap="round"/>
    </g>
    <g class="fp-kettle-steam" fill="none" stroke="#fbefd0" stroke-linecap="round"><path d="M452 179q-6-6-.1-13 4-5 1-10" stroke-width="2.6"/><path d="M457 173q3-4 1-8" stroke-width="1.3"/></g>
    <g transform="translate(504 199) rotate(-8)"><path d="M-7 1v-17l13-.3V1Z" fill="#a08056"/><path d="M-8-16v-3l15 .2v3Z" fill="#d3ab70"/><path d="M-7-11h13v6H-7Z" fill="#72503f"/></g>
    <g transform="translate(523 195) rotate(-7)"><path d="M-6.5 1v-13l12-.3V1Z" fill="#c59b63"/><path d="M-7-12v-3l14 .2v3Z" fill="#e5b977"/><path d="M-6.5-8h12v4.3h-12Z" fill="#c5814e"/></g>
    <g transform="translate(368 219)"><use href="#fp-cup" fill="#fae9c0"/><path d="m-7 2 14-1-.6 2.3-12.6 1Z" fill="#6d8d7c"/><path d="m-6.4-.2 12-1-4 .9-6.5.7Z" fill="#9d6c44"/></g>
    <g transform="translate(389 216) scale(.84)"><use href="#fp-cup" fill="#ecd6a8"/><path d="m-7 2 14-1-.6 2.3-12.6 1Z" fill="#7e9782"/></g>
    <path d="m326 296 23-4 8 4-19 5Zm166-33 18-4 6 2-19 5Z" fill="#9e8d69"/>
  </g>
  <!-- 阿梅姨 reaches towards the tasting counter, with her own market basket. -->
  <g id="fp-auntie" transform="translate(265 285)">
    <path d="m-63 44 11-5 40-2 47-8 21 .5-14 6-42 9-53 4Z" fill="#b29870" opacity=".65"/>
    <path d="M-22-7q-17-2-31 10l-16 5-11-2-5-9-4 2 1 12 8 10 14 3 19-4 28-11Z" fill="#866c58"/>
    <path d="m-54 3-5 11 5 4 9-3 3-15Z" fill="#524c40"/><path d="m-76 7-3 6 5 5 9 2 5-5 1-5-7 1Z" fill="#c5af87"/>
    <path d="m-16 5 16-1 .5 30-7 8-16 .3-3-4 7-7Z" fill="#685849"/>
    <path d="m6 4 14-1-2 25 9 3 1 4-20 4-5-2Z" fill="#81705a"/>
    <path d="m-21 36 9-3 11 .6-1 6-6 4-18 2-2-2Zm27-4 13-3 8 .8 3 3-1 3-19 5-5-2Z" fill="#4d4d40"/>
    <path d="m-21-45 18-7 18 2 8 8 8 18 2 24-7 13-26 6-28-2 3-13-5-25Z" fill="#d9c7a2"/>
    <path d="m-15-48 6-3 17 14 10-14 7 5-9 16L25 8l-10 7-30 7-17-4 9-38-4-17 5-4 6 17 15-4Z" fill="#935e62"/>
    <path d="m-17-17 30-7L24 8l-10 7-29 6-14-4Z" fill="url(#fp-woven)"/>
    <path d="m-27-27 12 9-6 4-13-5-7 8-5-2 5-9-3-4 5-2Z" fill="#b47b79"/>
    <path d="m-16-2 15-2 1 10-6 6-8-1Z" fill="#ac7971"/><path d="m-15 .2 12-1.6" fill="none" stroke="#e0b38e" stroke-width="1" stroke-dasharray="2 2"/>
    <path d="m16-47 10 .8 7 11 11-7 6 4-3 8-16 10-9-3-7-12Z" fill="#c4af8b"/>
    <path d="m30-39 6 8 5-4-2-5 6-4 3-2 6 .2 6-3 3 1-2 4-10 8-10 5-6-2Z" fill="#a78c6e"/>
    <path d="m16-43 5-4 5 1 7 6 1 3-8 9-4-3Z" fill="#eee0b9"/><path d="m26-31 6-8" fill="none" stroke="#bea383" stroke-width="1.3"/>
    <g transform="translate(52 -48)"><ellipse cy="6" rx="10" ry="2.5" fill="#917b59"/><use href="#fp-cup" fill="#f6e2b4"/><path d="m-7 1.4 14-1-.6 2.5-12.5 .8Z" fill="#4e7970"/><path d="m-5.7-.5 6.7-1 4.2.2-4.7.9-4.9.4Z" fill="#a06d43"/></g>
    <g class="fp-teacup-steam" fill="none" stroke="#f6dfb2" stroke-linecap="round"><path d="M52-52q-4-5-.7-9 3-3.8 1-7.7" stroke-width="2"/></g>
    <!-- Her round ears, white blaze, eye-mask and long nose distinguish her from the otter. -->
    <path d="m-23-83-7-6-9 2-6 8 1 7 6 6 7 .4 7-7m26-20 7-6 8 1 5 5-.2 7-7 8-7-2Z" fill="#9b8066"/>
    <path d="m7-91 6-3 5 5-1.5 5-5.5 3-5-3Z" fill="#715d51"/>
    <path d="m-32-74 3-10 8-8 13-4 14 2 12 6 8 8 8 8 12 6 4.5.8.5 4.5-6 4-14 3-9 6-11 7-11-.5-14-5-12-13-8-4 3-3-6-3Z" fill="#ab8d6f"/>
    <path d="m-32-81 5-6 7 .5 5 5-.5 7-4 6-7-1-4-5Z" fill="#806754"/><path d="m-28-77 1-5 5-2 3.5 3-.5 5-2.5 3.3-4-1Z" fill="#b48b71"/>
    <path d="m-28-65 15-9 13-3 11 2 13 7 13 7-8 3-12-2-12-5-11-1-8 4-13 3 7-6Z" fill="#555046"/>
    <path d="m-19-55 9-5 13-2 11 1 13 4 13-3-5 5-12 5-11 6-8 2-13-3-11-7 5 .1Z" fill="#e0c9a0"/>
    <path d="m-15-87 7-4 9 .5 11 6 9 9 7 7 10 6 .5 2-13-4-10-8L3-81l-9-3-10 1Z" fill="#f1dfb6"/>
    <path d="m36-63 7-1 4 1-.5 4-5 3-6-.4-2-2Z" fill="#3b4037"/>
    <g class="fp-eye-glint"><path d="M0-69q6-5 12 .5l-2 4.5-5 1.2-4-2Z" fill="#e8cc9d"/><ellipse cx="7.3" cy="-67.8" rx="2.9" ry="3.1" fill="#403c33"/><circle cx="8.1" cy="-69.2" r=".85" fill="#fcecca"/></g>
    <path d="m19-50 8-2 5-3m-2 1 5 .3m-2-3 7-.2" stroke="#77654f" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <g fill="none" stroke="#b79155" stroke-width="2"><ellipse cx="-1" cy="-92" rx="7" ry="5.5" transform="rotate(14 -1 -92)"/><ellipse cx="13" cy="-86" rx="4.9" ry="3.9" transform="rotate(24 13 -86)"/><path d="m-7-93-11 4m22.5-2 3.8 1.3"/></g>
    <path d="m-27-37-10 6-1 15 4 7 5 .5 4-4-2-9 6-7Z" fill="#e7d7b1"/><path d="m-36-16 6-1 5 5-2 7-6 1-4-4Z" fill="#92775e"/>
    <g transform="translate(-34 0) rotate(-6)"><path d="m-9-1q1-15 11-16Q9-15 11-2" fill="none" stroke="#8d6648" stroke-width="2.8"/><path d="m-13-3 28-2-3 17-9 4-14-3Z" fill="#bc8e58"/><path d="m-10 1 22-2m-20 6 18-1m-16 5 14-.2m-12-11 1.5 14M1-3l1.2 16M8-3l-.7 15" stroke="#e8bd80" stroke-width="1" fill="none"/><path d="m-14-5 29-1 .7 4-29 2Z" fill="#d6aa70"/></g>
  </g>
  <!-- Two folded trees and a fan of grasses form the bookends. -->
  <g id="fp-tree-right" transform="translate(571 245)">
    <path d="m-8 7 22 .4 34-9-6-2-36 2Z" fill="#9d9875" opacity=".68"/>
    <path d="m-1-63 6-2 2 38 6-12 3-1-7 22 4 21-4 2-7-5-1-23-12-16 3 1 9 10Z" fill="#8f714f"/><path d="m0-62 3-1 3 52-2 10-2-19Z" fill="#c09b6b"/>
    <path d="m-27-69 9-15 6-4 2-9 13-10 13 2 5 9 11 4 5 13 8 9-3 14-10 8-13 2-7 8-14 2-13-8-9-2-8-10Z" fill="#6c8b79"/>
    <path d="m-28-67 9-16 8-2-2 19 12 15-9 10-9-6-8-2Z" fill="#779582"/><path d="m-12-67 3-26 12-12 9 .4-3 24 11 14-13 17-8-.2Z" fill="#a5a780"/><path d="m11-81 3-24 9 12 12 5 5 16-12 2-8 4Z" fill="#839c85"/><path d="m19-69 21-4 5 6-4 13-12 8-9-1-8 8-12 1 7-13Z" fill="#577d6b"/>
    <path d="m-21-52 11 4m10-35 7-9m12 28 3-4" stroke="#c1b78c" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>
    <path d="m-29-68 12-17 7-12 15-8 20 10 12 9 6 19-16 22-25 9-23-11Z" fill="url(#fp-fibres)"/>
  </g>
  <g id="fp-little-plants">
    <path d="m88 300 11-3 40-1 5 2-27 5-29-1Z" fill="#b1a27a"/>
    <path d="m96 301-9-14 10 4 5 7-3-24 8 15 2 10 7-22 1 15 9-8-5 14Z" fill="#688472"/><path d="m111 300 5-11 8-8-3 10 12-5-9 10Z" fill="#8a9b79"/>
    <path d="m89 288-6-13m8 9 1-18m1 22 5-15" fill="none" stroke="#819071" stroke-width="1.6"/><g fill="#e7bd76"><path d="m82 275-3-3 2-4 4 1 2 4Zm8-9-2-5 3-3 3 2 .4 5Zm6 8 1-5 4 1 .5 3-3 3Z"/></g>
    <path d="m565 271 23-4 13 1-19 5Z" fill="#b1a17a"/><path d="m572 270-6-6 6 1 1-12 5 9 5-10-1 12 10-6-6 9Z" fill="#7a8b6c"/>
  </g>
</svg>`;
