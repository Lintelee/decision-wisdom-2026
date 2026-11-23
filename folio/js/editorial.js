// These four article openers print a colon at the line break.
const printedColons = new Set([4, 16, 20, 22]);

export function sourceTitle(article) {
  const kicker = article.kicker === '特別企劃' ? '' : article.kicker;
  return [kicker, article.title, article.sub].filter(Boolean)
    .join(printedColons.has(article.n) ? '：' : '　');
}

export function authorName({ zh, en }) {
  return [...new Set([zh, en].filter(Boolean))].join(' ');
}

export function sourceAuthors(article) {
  return article.authors.map(authorName).join('、');
}
