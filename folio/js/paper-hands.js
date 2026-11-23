// A two-hinge paper arm. The target is in the shoulder parent's coordinates.
export function aimPaperHand(shoulder, elbow, grip, target) {
  const dx = target.x - shoulder.position.x, dy = target.y - shoulder.position.y;
  const upper = Math.hypot(elbow.position.x, elbow.position.y);
  const fore = Math.hypot(grip.position.x, grip.position.y);
  const distance = Math.min(upper + fore - .00001, Math.max(Math.abs(upper - fore) + .00001, Math.hypot(dx, dy)));
  const cosine = (distance * distance - upper * upper - fore * fore) / (2 * upper * fore);
  const bend = Math.acos(Math.max(-1, Math.min(1, cosine)));
  const upperBias = Math.atan2(elbow.position.x, -elbow.position.y);
  const foreBias = Math.atan2(grip.position.x, -grip.position.y);
  const aim = Math.atan2(dx, -dy) - Math.atan2(fore * Math.sin(bend), upper + fore * Math.cos(bend));
  shoulder.rotation.set(0, 0, aim - upperBias);
  elbow.rotation.set(0, 0, bend + upperBias - foreBias);
  shoulder.position.z = Math.max(.018, Math.min(.115, target.z - elbow.position.z - grip.position.z));
}
