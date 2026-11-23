import { ARTICLES } from './articles.js';
import { SECTION_NAMES } from './data.js';
import { sourceTitle, sourceAuthors } from './editorial.js';

export function bindBackmatter({ hasThanked, light, read, home }) {
  const page = document.getElementById('closing-page'), note = document.getElementById('closing-thanks');
  const lamp = document.getElementById('light-thanks'), label = lamp.querySelector('span');
  const dialog = document.getElementById('author-thanks'), credits = document.getElementById('closing-credits');
  const index = document.getElementById('authors-index'), invitation = note.textContent;
  let settle;
  function reflectThanks(delay = 0) {
    clearTimeout(settle);
    const lit = hasThanked();
    lamp.disabled = lit;
    const reflect = () => {
      label.textContent = lit ? '謝燈已亮' : '為作者點燈';
      note.textContent = lit ? '你點的燈，照亮了街坊的窗。謝謝你的留心，下次街角見。' : invitation;
    };
    if (delay) settle = setTimeout(reflect, delay); else reflect();
  }
  function openCredits() {
    if (!index.children.length) {
      const opening = document.createElement('div'), later = document.createElement('div');
      index.append(opening, later);
      for (const [key,name] of Object.entries(SECTION_NAMES)) {
        const section = document.createElement('section'), heading = document.createElement('h3'), list = document.createElement('ul');
        section.className = 'author-section'; heading.textContent = name;
        for (const source of ARTICLES.filter(article => article.ch === key)) {
          const li = document.createElement('li'), link = document.createElement('a');
          const title = document.createElement('strong'), authors = document.createElement('small');
          link.href = '#read/' + source.n + '/p/' + source.pages[0];
          title.textContent = sourceTitle(source); authors.textContent = sourceAuthors(source);
          link.append(title, authors); li.append(link); list.append(li);
          link.addEventListener('click', event => {
            if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); dialog.close(); read(source.n, source.pages[0], false, credits);
          });
        }
        section.append(heading, list);
        (key === 'intro' || key === 'people' ? opening : later).append(section);
      }
    }
    dialog.showModal(); dialog.scrollTop = 0;
  }
  lamp.onclick = light;
  credits.onclick = openCredits;
  document.getElementById('closing-home').addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); home();
  });
  return {
    reflectThanks,
    show(show) {
      page.hidden = !show;
      if (show) reflectThanks();
      else { clearTimeout(settle); if (dialog.open) dialog.close(); }
    },
  };
}
