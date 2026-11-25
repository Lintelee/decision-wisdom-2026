/**
 * The printed sentence a scene cites on this page of the issue. A scene has one main sentence and may quote
 * its other source articles once each; any page it does not cite keeps pointing at the main one.
 */
export function citedAt(def, page) {
  const main = def?.quote || null;
  return [main, ...(def?.more || [])].find(cited => cited && cited.page === page) || main;
}
