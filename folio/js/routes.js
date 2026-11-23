// Story bookmarks remain usable across editions.
const bookmarks = ['map', 'growth', 'distance', 'witness', 'want', 'voice', 'memory', 'persona', 'context', 'friction', 'signal', 'spec', 'permission'];
const firstInLand = { prologue: 1, intro: 1, people: 3, model: 7, ai: 10 };
export const storyHash = (i) => i === bookmarks.length ? '#ending' : i ? '#game/' + bookmarks[i] : '#home';
export function routeFor(hash, defs) {
  if (hash === '#ending') return { kind:'story', index:bookmarks.length };
  if (hash === '#read/back') return { kind: 'reader', article: 0, page: -1 };
  const read = hash.match(/^#read(?:\/(\d+))?(?:\/p\/(\d+))?\/?$/);
  if (read) return { kind: 'reader', article: Number(read[1]) || 0, page: read[2] === undefined ? undefined : Number(read[2]) };
  if (!hash || hash === '#cover') return { kind: 'cover' };
  if (hash === '#home' || hash === '#map') return { kind: 'cover', index: 0 };
  const key = hash.replace(/^#(?:game\/|\/)?/, '').replace(/\/$/, '');
  const land = key.match(/^(?:land|region)\/(\w+)$/)?.[1];
  let index = land && firstInLand[land] || bookmarks.indexOf(key);
  if (index < 0) index = /^\d+$/.test(key) ? Number(key) : defs.findIndex(d => d.id === key);
  return index > 0 && index < defs.length ? { kind: 'story', index } : { kind: 'cover', index: 0 };
}
