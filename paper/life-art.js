/* Two paper theatres. Shapes, fold lines, printed signs and hit targets are editable. */
(() => {
  'use strict';
  const esc = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
    );
  const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
  const line = (d, colour, weight = 2, extra = '') =>
    path(
      d,
      'none',
      `stroke="${colour}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round" ${extra}`,
    );
  const rect = (x, y, w, h, fill, rx = 0) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
  const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const label = (x, y, content, fill, size, extra = '') =>
    `<text x="${x}" y="${y}" fill="${fill}" text-anchor="middle" font-size="${size}" ${extra}>${esc(content)}</text>`;
  const group = (body, attr = '') => `<g ${attr}>${body}</g>`;
  const shift = (body, x, y, scale = 1) => group(body, `transform="translate(${x} ${y}) scale(${scale})"`);
  function fibre(id, ink) {
    return `<defs><pattern id="${id}" width="39" height="31" patternUnits="userSpaceOnUse"><path d="m5 7 5-1m12 11 4-1M2 27l3-1m25-21 4 0" fill="none" stroke="${ink}" stroke-opacity=".105" stroke-width=".8"/><circle cx="15" cy="25" r=".8" fill="${ink}" opacity=".14"/></pattern></defs>`;
  }
  function tree(x, y, size, colour, shadow) {
    const cut = path(
      'M-6 0-3-22-15-19-21-26-18-38-24-43-19-55-11-59-8-68 0-73 10-68 13-59 21-55 23-44 19-35 21-29 15-21 4-20 3 0Z',
      colour,
    );
    const fold = path('M0-73 1-27 7-39 15-44 7-32 3-23 3 0h-5l-1-22-7-12 8 8Z', shadow);
    return shift(cut + fold, x, y, size);
  }
  function bottle(which) {
    if (which === 0)
      return (
        path('M-8-35h15l1 8 6 6 1 39q0 5-5 5h-21q-5-1-5-6l1-35 6-8Z', '#a95056') +
        path('M-12-19q3-4 6-5L-7 17l-4 2Z', '#d7827c') +
        rect(-9, -38, 17, 8, '#643f46', 2) +
        rect(-4, -40, 10, 3, '#edba95', 1) +
        path('M-15-8 13-9l1 13-29 1Z', '#fae4be') +
        line('M-7-2 6-3', '#965663', 2)
      );
    return (
      path('M-10-43h19l1 8 7 7 1 48q0 6-5 7h-25q-6-1-6-6l1-49 7-7Z', '#3e7a7b') +
      path('M-15-24-9-31-9 20l-4 2Z', '#7ea8a1') +
      rect(-10, -47, 19, 8, '#334f51', 2) +
      line('M-5-46v-5q0-2 3-2h5q3 0 3 2v5', '#334f51', 3) +
      path('M-17-9 16-10l1 15-34 1Z', '#e7d8ad') +
      line('M-9-2H7', '#698f83', 2)
    );
  }
  const fairPeople = [
    { coat: '#a95d56', shadow: '#85484d', skin: '#be875f', hair: '#463936', style: 'bun' },
    { coat: '#507b77', shadow: '#345e62', skin: '#d5a37a', hair: '#493d37', style: 'cap' },
    { coat: '#d29c54', shadow: '#a77442', skin: '#e2b48b', hair: '#5d5148', style: 'glasses' },
    { coat: '#6e637e', shadow: '#514d68', skin: '#aa7350', hair: '#3f3d3d', style: 'curls' },
    { coat: '#8a9b69', shadow: '#5d785c', skin: '#d6ae8e', hair: '#d1c6b2', style: 'bob' },
    { coat: '#ad725c', shadow: '#85584b', skin: '#ca9773', hair: '#4b4343', style: 'hood' },
  ];
  function person(index, raised = false) {
    const p = fairPeople[index % fairPeople.length],
      skin = p.skin,
      hair = p.hair;
    const foot = path('m23 60 7 1-1 13-3 3h-7l.3-2 4.3-2zm9 1 7-1 2 13 4 2v2h-8l-2-4Z', '#394b51');
    const jeans = path('m21 48 19-1-1 15-1 9-5 1-3-16-1 14-5 1-2-9Z', '#53636b');
    const coat =
      path('m22 28 6-4h6l8 5-4 8 1 16-19 1 1-17-6 11-4-2 6-14Z', p.coat) +
      path(raised ? 'M37 29l5 0 6 4 2-16 5 1-2 20-5 3-9-6Z' : 'm37 30 5-1 6 14-4 2-7-8Z', p.coat);
    const side = path('m33 27 7 3-2 8 1 15-8 1 2-12Z', p.shadow);
    const arms =
      path('m12 45 4 2-1 4-3 3-3-1v-3Z', skin) +
      path(raised ? 'm50 18-1-6 1-3 2 3 1-8 2 1v6l2-3 1 1-1 6-2 4Z' : 'm43 44 4-2 3 4-1 4-3-1Z', skin);
    const neck = path('m27 21 5 1 1 5-3 3-4-3Z', skin),
      face = path('m22 13 3-6 10 1 4 6-1 6-3 4-6 1-5-4-3-4Z', skin);
    let head = '';
    if (p.style === 'bun')
      head = dot(21, 11, 5, hair) + path('m21 14 1-6 5-4 7 1 5 4 1 5-5-1-4-3-4 3-1 6-3-1Z', hair);
    if (p.style === 'cap')
      head =
        path('M21 15q-1-11 9-12 9 0 11 9l6 2-1 2-13-2-9 1Z', '#ad6954') + path('m24 15 3-1v4l-2 2Z', hair);
    if (p.style === 'glasses')
      head =
        path('m21 16 1-7 3-5 8-1 6 5 1 5-4-1-2-4-6 2-3 3-1 5Z', hair) +
        line('M26 14.8h4.3v3h-4.2zm6.6-.2h4.3v3h-4.3zm-2.3 1.5h2.3', '#38494c', 0.9);
    if (p.style === 'curls')
      head =
        dot(23, 10, 4.5, hair) +
        dot(27, 6.7, 4.5, hair) +
        dot(32, 6.1, 4.5, hair) +
        dot(36, 8.4, 4.4, hair) +
        dot(38, 11.9, 3, hair);
    if (p.style === 'bob') head = path('m20 18 1-9 5-5 8-1 5 4 2 9-2 7-3-2 1-7-5-4-7 4 1 8-5-1Z', hair);
    if (p.style === 'hood')
      head =
        path('m19 19 1-9 7-7 6 1 7 7 1 10-5 3 2-7-1-6-9-2-4 5 2 8Z', '#506c73') +
        path('m26 11 3-3 6 1 2 3-4-1-7 4Z', hair);
    const gear = [
      line('M23 29 36 48', '#e0b581', 2) + path('m32 45 9-1 1 7-9 2Z', '#684c43'),
      path('m36 29 6 1 4 12-5 1-4-6Z', '#c69658') + line('m36 30 1 15', '#e4bf87', 2),
      path('m21 40 15-3 1 10-13 3Z', '#f0d4a7') + line('m24 42 8-2', '#a37855', 1),
      line('m22 29 9 7 9-6', '#c4a5a9', 2) + line('M30 36v13', '#b29ca9', 1),
      path('m22 28 5-2 2 5 5-5 4 2-5 7-4-2-3 3Z', '#efe1bd') + path('m13 48 6-1 4 10-11 1Z', '#b28966'),
      path('m23 27 6 2 6-2 3 2-3 5-7 1Z', '#66858e') + line('M26 33v5m7-5v4', '#d3ccba', 1),
    ][index % 6];
    return foot + jeans + coat + side + arms + neck + face + head + dot(34.8, 16.2, 0.8, '#363c39') + gear;
  }
  function stall(s, rule) {
    const red = '#884653',
      gold = '#eac69a',
      cream = '#fff1d5';
    const chosen = Number(s.copy),
      posted = Number.isInteger(s.report) ? s.report : null;
    const sky =
      rect(0, 0, 720, 202, '#f5e4d2') +
      dot(78, 51, 27, '#efd0a5') +
      path('M0 108q68-24 141-5 53-19 115-11 63-24 128-15 75-13 139 5 102-18 197 11v80H0Z', '#dfc7b0') +
      path('M0 138q100-27 193-9 74-13 164-8 67-21 135-13 105-16 228 7v87H0Z', '#ccb9a0') +
      rect(0, 147, 720, 55, '#ead5bf') +
      path('M0 178q112-24 220-15 95-10 176-8 150-17 324 6v41H0Z', '#f0dfca');
    const school =
      path('M496 114V71h22V59h15v11h37V56h14v9h29v46Z', '#ccb4a6') +
      Array.from(
        { length: 6 },
        (_, i) => rect(508 + i * 18, 78, 7, 10, '#ede0ca') + rect(508 + i * 18, 94, 7, 8, '#e7d6c1'),
      ).join('');
    const pennants =
      line('M0 22Q82 61 183 29', '#9e8771', 1.5) +
      [17, 38, 61, 84, 108, 132, 155]
        .map((x, i) => {
          const y = 24 + Math.sin(((x + 12) / 180) * Math.PI) * 17;
          return path(`M${x} ${y}l13 2-8 13Z`, [red, '#db9d78', '#7a9b86'][i % 3]);
        })
        .join('');
    const scene =
      school +
      tree(35, 139, 0.86, '#98aa91', '#788f7c') +
      tree(85, 135, 1.12, '#b0b596', '#889a81') +
      tree(667, 136, 0.9, '#a2ad90', '#819680') +
      tree(701, 136, 1.12, '#b0b598', '#8c9e85') +
      pennants +
      line('M0 154 111 144m515-1 94 2', '#c4b59f', 2) +
      path('M120 170 168 139l427 3 37 27-58 9-417 4Z', '#c8ad99');
    const cabinet =
      path('m158 66 397-8 24 15-.5 84-413 6-9-10Z', '#8c5860') +
      path('m174 77 367-7v72l-366 9Z', '#e7caae') +
      path('m174 80 367-8v13l-367 14Z', '#c7a68c') +
      path('m542 71 19 5v72l-19-5Z', '#a87770') +
      rect(181, 63, 7, 95, '#b78678') +
      rect(531, 64, 6, 91, '#ad7a6e');
    const awning =
      path('m135 65 34-34 355-8 58 28-32 7Z', '#a25b61') +
      Array.from({ length: 12 }, (_, i) => {
        const x = 135 + i * 35.1,
          tx = 169 + i * 29.65;
        return path(
          `M${x} ${65 - i * 0.74} ${tx} ${31 - i * 0.66}l29.7-.66 0 0 ${x + 35.2 - (tx + 29.7)} ${32 - i * 0.08}Z`,
          i % 2 ? cream : '#a95761',
        );
      }).join('') +
      path('m135 65 418-9 29-6-2 15-28 9-416 9Z', '#7f414e') +
      Array.from({ length: 12 }, (_, i) => {
        const x = 136 + i * 34.7,
          y = 65 - i * 0.75;
        return path(`M${x} ${y}l34.9-.8-.4 10q-4 10-16.2 11-13 1-18-9Z`, i % 2 ? '#ead7b6' : '#b46c71');
      }).join('') +
      line('m169 31 355-8 58 27', '#f6dbb9', 2);
    const vendor = shift(person(0), 162, 80, 0.8);
    const counter =
      path('m145 140 409-6 28 7-419 13Z', '#f6dbba') +
      path('m162 154 420-13-.4 24-419 14Z', '#b67570') +
      path('m145 140 17 14 1 25-18-13Z', '#8e5b62') +
      path('m163 173 418-14v6l-418 14Z', '#9b6260') +
      [217, 264, 313, 364, 415, 471, 529].map((x) => line(`m${x} 153 0 18`, '#a56766', 0.7)).join('');
    const hanging = rule.messages
      .slice(0, 2)
      .map((message, i) => {
        const x = i ? 472 : 307,
          show = posted === i;
        const y = i ? 80 : 82;
        const tag =
          path('m-64-7 117-3 10 6-1 22-123 1Z', show ? '#88434e' : i === chosen ? '#edc0b5' : '#efe1c3') +
          line('m-47-7 1-9m87 8-1-10', '#745e57', 1.5) +
          label(0, 10, message, show ? '#fff1d3' : '#623e42', 17, 'font-weight="760"');
        const flipLid = show && i === 0 ? line('m-9-38 -10-10 11-4 9 10', '#704a51', 3) : '';
        return (
          shift(tag, x, y) +
          shift(bottle(i) + flipLid, x + 1, 133, i === 0 ? 0.7 : 0.69) +
          path(`m${x - 26} 149 47-2 7 3-48 2Z`, '#bd8c78')
        );
      })
      .join('');
    const brand =
      s.exposed && !s.covered
        ? path('m357 152 49-1 1 13-49 1Z', cream) + label(381, 162, '晴川', red, 11, 'font-weight="800"')
        : path('m357 152 49-1 1 13-49 1Z', '#b9a698') + line('m365 158 34-1', '#8e8076', 1.5);
    const pos =
      path('m600 151 24-8 14 6-2 14-23 6-13-6Z', '#a98068') +
      line('m605 153 8 3 23-6m-22 6v9', '#cfac87', 1.5) +
      path('m609 148 1-17 6-13 2 13-4 17m5-4 5-15 9-7-3 10-6 12Z', '#84977f');
    return `<svg class="la-scenery" viewBox="0 0 720 187" aria-hidden="true">${fibre('la-fair-fibre', '#705646')}${sky}${scene}${cabinet}${vendor}${awning}${counter}${hanging}${brand}${pos}${rect(0, 0, 720, 187, 'url(#la-fair-fibre)')}</svg>`;
  }
  function people(s, rule) {
    const opened = Array.isArray(s.opened) ? s.opened : [],
      last = Number.isInteger(s.lastPerson) ? s.lastPerson : -1;
    const cards = rule.cards || [],
      posted = Number.isInteger(s.report) ? s.report : null;
    const actors = cards
      .map((card, i) => {
        const open = opened.includes(i),
          selected = last === i,
          interested = posted !== null && !!card.match?.[posted];
        const effects =
          (open ? ' is-open' : '') + (selected ? ' is-last' : '') + (interested ? ' is-interested' : '');
        const folds = open
          ? '<g class="la-fold">' +
            path('M28 36 16 32 8 38l-4 22 12-6 12 4Z', '#fbecd3') +
            path('m16 32 12 4v22l-12-4Z', '#e1cdb5') +
            line('m8 40 7-4m-8 9 7-4m-8 9 7-4', '#a68b79', 1) +
            '</g>'
          : '';
        const survey = open
          ? path('m39 41 14-3 2 14-13 2Z', '#d4dbcf') + line('m43 43 6-1m-6 4 8-1m-7 4 4-.5', '#385d75', 1.25)
          : '';
        const stain = s.exposed
          ? '<g class="la-ink-stain">' +
            path('m25 35 3-3 3 2 3-1 1 4 3 1-2 4-3 1-1 3-4-2-3 1-1-4-3-2 3-2Z', '#254684') +
            '<circle cx="37" cy="33" r="1.7" fill="#254684"/><circle cx="21" cy="43" r="1.2" fill="#254684"/></g>'
          : '';
        const response = interested ? path('m46 7 7-4 4 5-6 5-2-3Z', '#406e83') : '';
        const choice = posted === null ? '' : interested ? '，舉手' : '，沒有舉手';
        const aria = card.name + choice + (s.exposed ? '，有提示墨痕' : '') + '，查看問卷';
        const figure = group(
          folds + person(i, interested) + survey + response + stain,
          'class="la-paper-person"',
        );
        return (
          '<button type="button" class="la-person' +
          effects +
          '" data-ap="person' +
          i +
          '" aria-expanded="' +
          selected +
          '" aria-label="' +
          esc(aria) +
          '"><svg viewBox="0 0 62 81" aria-hidden="true">' +
          '<ellipse cx="30" cy="76.5" rx="20" ry="3.2" fill="#8c6854" opacity=".18"/>' +
          figure +
          '</svg><span class="la-person-name">' +
          esc(card.name) +
          '</span></button>'
        );
      })
      .join('');
    const card = cards[last];
    const note =
      card && opened.includes(last)
        ? `<div class="la-crease"><b>${esc(card.name)}</b><span>${esc(card.need)}</span></div>`
        : '';
    return `<div class="la-art la-fair${s.exposed ? ' la-exposed' : ''}${s.covered ? ' la-covered' : ''}"><div class="la-booth">${stall(s, rule)}</div><div class="la-queue">${actors}</div>${note}</div>`;
  }
  const clock = (minutes) =>
    [Math.floor(minutes / 60), minutes % 60].map((n) => String(n).padStart(2, '0')).join(':');
  function breakfast() {
    const wall =
      path('m28 126 82-11 28 10-4 59-91 7-15-9Z', '#a96f54') +
      path('m41 132 89-9-2 58-87 9Z', '#e1b995') +
      path('m24 121 83-11 31 12-100 15Z', '#c68d6f') +
      path('m25 122 13 15 97-13-3 9-97 12-13-16Z', '#9d5b50') +
      path('m51 144 47-5-1 29-46 4Z', '#5c6c65') +
      path('m52 169 49-7 7 4-56 9Z', '#f4dab4') +
      path('m105 137 15-2-2 41-14 2Z', '#825f52') +
      line('m111 137-2 40', '#e5b998', 1);
    const wrapping =
      path('m69 157 8-5 6 3 1 11-15 2Z', '#e7be83') +
      path('m71 156 6-6 5 4-5 3Z', '#ffdd96') +
      line('m89 155q-4-5 0-9m-6 5q-3-4 0-8', '#f5ead3', 1.4);
    return (
      wall +
      wrapping +
      path('M31 118v-18l65-9 1 18Z', '#e7ddbc') +
      label(63, 108, '晨禾旅店', '#3c5354', 10, 'transform="rotate(-7 63 107)" font-weight="750"')
    );
  }
  function department(s) {
    const frame =
      path('m260 82 97-9 39 14-3 61-112 8-21-12Z', '#809c95') +
      path('m280 95 115-9-2 62-113 9Z', '#abc5b8') +
      path('m256 79 100-10 44 14-121 14Z', '#d9dcc0') +
      path('m256 79 23 18 121-14-2 8-119 14-23-17Z', '#658b89') +
      path('m286 106 97-9-1 50-96 7Z', '#415c5c');
    const shutter =
      path('m293 109 83-8-1 44-82 7Z', '#8a9d97') +
      Array.from(
        { length: 6 },
        (_, i) =>
          line(`m294 ${113 + i * 6} 81-7`, '#596f71', 1.6) +
          line(`m294 ${114.7 + i * 6} 81-7`, '#b0c2b6', 0.85),
      ).join('') +
      path('m331 133 9-1v6l-9 .8Z', '#445758') +
      line('m333 133v-3q2-4 5-1v3', '#42585a', 1.7);
    const trim =
      path('m305 79 51-4 13 5-63 7Z', '#638985') +
      label(334, 80, '百 貨', '#ecf1d8', 10, 'transform="rotate(-5 334 80)" font-weight="750"');
    const checked = s.gateTried
      ? path('m352 117 16-1v14l-16 1Z', '#ad6a56') + line('m356 121 7 5m0-6-7 7', '#f8dfb8', 1.7)
      : '';
    return (
      frame + group(shutter + checked, `class="la-shutter${s.last === 'gate' ? ' rattled' : ''}"`) + trim
    );
  }
  function train() {
    const rails =
      path('m512 141 200-19 8 9-201 22Z', '#749995') +
      line('m520 146 199-19', '#44656a', 2) +
      line('m526 150 193-18', '#d9d7bd', 1.6);
    const carriage =
      path('m533 105 169-15 14 13-.2 28-181 17-8-6 1-29Z', '#e5ddba') +
      path('m532 104 168-16 12 6-174 17-11 7v-7Z', '#456d70') +
      path('m528 133 187-18v7l-186 19Z', '#b77858') +
      path('m535 143 180-17 1 6-177 17Z', '#667a76');
    const windows = Array.from({ length: 8 }, (_, i) => {
      const x = 541 + i * 20,
        y = 113 - i * 1.9;
      return (
        path(`m${x} ${y} 15-1.6v11.8l-15 1.6Z`, i % 3 ? '#789b9d' : '#4e747b') +
        (i % 3 === 1 ? line(`m${x + 3} ${y + 6} 6-5`, '#bed0bc', 1.4) : '')
      );
    }).join('');
    const station =
      path('m494 91 165-16 33 6-179 18Z', '#557b7b') +
      path('m512 99 180-17-3 6-177 17Z', '#375b60') +
      line('m516 102-1 46m146-60v44', '#42666b', 5) +
      path('m520 149 86-8 13 5-96 11Z', '#d7cdb0') +
      path('m523 157 95-11 1 5-95 12Z', '#99aa9b') +
      path('m547 91 40-4 1 15-42 4Z', '#37575c') +
      label(566, 100, '07:00', '#f8dd9f', 10, 'font-weight="800" transform="rotate(-5 566 98)"');
    return rails + carriage + windows + station;
  }
  function traveller(x, y, withStroller) {
    const body =
      path('m-3-23 8 1-1 12-3 11h-3l1-12-4 8-3 3-2-2 5-11Z', '#465a62') +
      path('m-5-37 7-2 7 7 2 10-12 3-7-3 1-8-4 7-2-1Z', '#b77954') +
      path('m0-35 6 3 3 10-8 2Z', '#975e48') +
      path('M-3-46q2-5 7-3l4 4-1 5-4 3-5-2Z', '#c99776') +
      path('m-5-44 1-4 3-3 6 1 2 3 1 3-8-1-3 4Z', '#3d4948') +
      path('m4-28 4 1 7 5-2 2-9-4Z', '#ce9c78') +
      path('m9-17 10-1 2 12-13 1Z', '#edc677') +
      line('m11-17q0-7 5-2', '#927c54', 1.4) +
      path('m-8 0 5-2 2 2-7 2Zm9-1h3l3 2-7 1Z', '#314b55');
    const pram = withStroller
      ? line('m9-25 5 4 6 11 12 8m-10-11-5 11', '#5d6f6b', 1.7) +
        path('m16-18 6 0q0-10 7-12 7 4 8 14l-4 7-12 1Z', '#739b9d') +
        path('M23-19q2-6 6-9l4 9Z', '#9fb7aa') +
        dot(17, -2, 3, '#465e62') +
        dot(33, -2, 3, '#465e62')
      : '';
    return shift(
      '<ellipse cx="4" cy="2" rx="14" ry="3" fill="#647e75" opacity=".32"/>' + body + pram,
      x,
      y,
      0.92,
    );
  }
  function route(s, rule) {
    const trip = rule.itinerary(s),
      arrived = trip.status === 'arrived';
    const onStreet = s.route === 'street',
      atGate = s.route === 'gate';
    const air =
      rect(0, 0, 720, 260, '#daebdc') +
      dot(147, 44, 23, '#edd3a2') +
      path(
        'M0 79q48-7 76-21 24-12 55-12l37-22 27 2 21-12 30 10 38 9 40-8 49 16 52-13 40 15 30-2 54 19 29-13 27 6 23-15 35 6 37 14 64 3v50H0Z',
        '#bed3c6',
      ) +
      path(
        'm0 85 41-11 10-18 27 2 2 17 21-7 2-25 22 1 1 25 13-3 2-14 24-1 1 25 24 4 24-5 23-7 22 4 19-16 30 6 49-8 39 15 49-12 43 9 34-17 29 8 45 7 38-6 59 14 21-5 38 7v53H0Z',
        '#a8c4b6',
      ) +
      path('M0 112q147-8 254-17 134-14 209-9 145-5 257 6v168H0Z', '#b6cbb4');
    const routeGround =
      path('M0 190q123-19 218-31l114-35 206-13 80 13-292 29-89 25L0 223Z', '#dde0bf') +
      path('m-20 190 142-18 114 12 158 32 155-39 61-30 30 6-51 42-191 51-169-37-110-12L0 216Z', '#e9dfbb') +
      line('m-4 222 132-20 101 11 166 36 194-53 47-35', '#95a88f', 1.1) +
      path('m183 177 67-24 53-15 82-6 24 4-102 14-56 16-49 18Z', '#d5ccaa');
    const streetD = 'M137 178C184 178 203 184 232 191L394 227 549 185 609 153';
    const gateD = 'M137 178Q207 177 254 156L326 138';
    const traces =
      line(gateD, atGate ? '#ac6754' : '#889b86', atGate ? 4 : 2.2, 'stroke-dasharray="5 7"') +
      line(
        streetD,
        onStreet ? '#327d81' : s.streetTried ? '#59918b' : '#8d9e89',
        onStreet ? 4 : 2.2,
        'stroke-dasharray="5 7"',
      );
    const signs = s.noticeVisible
      ? shift(
          path('M0 0h42l-1 27H0Z', '#526d6a') +
            rect(3, 3, 35, 19, '#e6dda9') +
            line('M12 27v7m19-7v7', '#6a796a', 2) +
            label(21, 17, '開放', '#355e60', 12, 'font-weight="800"'),
          399,
          167,
        )
      : '';
    const gateNotice = s.noticeVisible
      ? path('m284 121 21-2v11l-21 2Z', '#eee0ad') +
        label(294.5, 127, '07:00', '#536864', 5.5, 'transform="rotate(-5 295 126)" font-weight="800"')
      : '';
    const railings =
      [0, 1, 2, 3, 4].map((i) => line(`m${488 + i * 12} ${208 - i * 3.3}v-9`, '#577b73', 1.7)).join('') +
      line('m485 201 56-15', '#6c9285', 1.4);
    const zebra = Array.from({ length: 5 }, (_, i) =>
      path(`m${466 + i * 5} ${208 - i * 1.4} 4-1 7 8-4 1Z`, '#f5e9c9'),
    ).join('');
    const east =
      s.stroller && s.accessChecked
        ? line('M542 186q5 7 19 2l60-24 8-12', '#4c8b81', 3, 'stroke-dasharray="4 4"')
        : '';
    let point = [131, 177];
    if (atGate) point = [324, 155];
    if (onStreet)
      point = arrived
        ? [604, 146]
        : !s.noticeVisible && !s.verified
          ? [391, 223]
          : s.stroller && !s.accessChecked
            ? [538, 191]
            : [559, 181];
    const tripMove =
      arrived && s.last === 'street' ? 'la-walk-route' : atGate && s.last === 'gate' ? 'la-walk-gate' : '';
    const figure = group(traveller(...point, s.stroller), `class="${tripMove}"`);
    const arrival = arrived && Number.isFinite(trip.arrival) ? clock(trip.arrival) : '';
    const timetable = `<div class="la-ticket-times"><span><b>06:45</b> 取早餐</span><span>${arrival ? '<em>' + arrival + ' 到站</em>' : ''}<b>07:00</b> 發車</span></div>`;
    const breeze =
      path('m66 25q7-8 14 0 4-4 8-2 3 0 7 4H66Zm380 3q7-7 13 0 9-5 15 3l3 1h-33Z', '#eff0db') +
      line('m193 33q4-3 7 0 3-4 6-5m201 3q3-1 5 1 1-2 5-3', '#7d9890', 1.2);
    const stage =
      fibre('la-street-fibre', '#476868') +
      air +
      breeze +
      routeGround +
      traces +
      tree(13, 146, 0.75, '#8eac97', '#779583') +
      tree(170, 138, 0.82, '#8cab94', '#729883') +
      tree(224, 113, 0.68, '#92ad97', '#789989') +
      tree(437, 126, 0.61, '#87a397', '#688c83') +
      tree(476, 126, 0.83, '#8caa98', '#77998a') +
      breakfast() +
      department(s) +
      gateNotice +
      train() +
      railings +
      zebra +
      east +
      signs +
      figure +
      rect(0, 0, 720, 260, 'url(#la-street-fibre)');
    return `<div class="la-art la-route"><div class="la-street-stage"><svg class="la-scenery" viewBox="0 0 720 252" aria-hidden="true">${stage}</svg>${timetable}<button type="button" class="la-place la-gate${atGate ? ' is-active' : ''}" data-ap="gate" aria-label="推百貨鐵門" aria-pressed="${atGate}"><span>推鐵門</span></button><button type="button" class="la-place la-street${onStreet ? ' is-active' : ''}" data-ap="street" aria-label="走大路到車站" aria-pressed="${onStreet}"><span>走大路</span></button></div></div>`;
  }
  window.AtlasLifeArt = Object.freeze({ people, route });
})();
