// The pop-up book is a hardback: boards wider than its leaves, a back board between them, a ribbon.
// The issue it opens onto is a paperback, whose soft cover is cut flush with its pages.
const mix = (a, b, t) => a + (b - a) * t;

/**
 * Where one board or page layer of the pop-up book sits while the issue is read (k = 1), and on the way there.
 * `part` is its centre and size as built, `page` the printed page. A part on the binding closes up.
 */
export function trimToPage(part, page, k) {
  const side = Math.sign(part.x);
  return {
    x: mix(part.x, side * page.width / 2, k),
    scaleX: mix(1, side ? page.width / part.width : 0.001, k),
    scaleZ: mix(1, page.depth / part.depth, k),
  };
}
