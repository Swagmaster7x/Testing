// Turning a creature (or a whole save) into a short text code and back, for sharing and backups.
// The JSON is trimmed, compressed where the browser can, and written as URL-safe base64.
const round = (o) => JSON.parse(JSON.stringify(o, (k, val) => (typeof val === 'number' ? Math.round(val * 1000) / 1000 : val)));
const b64 = (bytes) => { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64 = (s) => { const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/')); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; };
async function pipe(bytes, stream) {
  const w = stream.writable.getWriter(); w.write(bytes); w.close();
  return new Uint8Array(await new Response(stream.readable).arrayBuffer());
}
/** kind: 'c' for one creature, 's' for a whole save. */
export async function encode(kind, obj) {
  const raw = new TextEncoder().encode(JSON.stringify(round(obj)));
  if (typeof CompressionStream === 'function') { try { return 'CA' + kind + '1.' + b64(await pipe(raw, new CompressionStream('deflate-raw'))); } catch (e) { /* fall through */ } }
  return 'CA' + kind + '0.' + b64(raw);
}
/** Returns { kind, data } or null if the text is not a valid code. */
export async function decode(text) {
  try {
    const m = /CA([cs])([01])\.([A-Za-z0-9_-]+)/.exec(String(text || '').replace(/\s+/g, ''));
    if (!m) return null;
    let bytes = unb64(m[3]);
    if (m[2] === '1') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
    return { kind: m[1], data: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch (e) { return null; }
}
/** Is this a creature we can safely load? Codes come from other people, so check the shape. */
export function validCreature(d, templates, parts) {
  if (!d || typeof d !== 'object' || !templates[d.type] || !Array.isArray(d.nodes) || d.nodes.length < 2 || d.nodes.length > 40 || !Array.isArray(d.parts) || d.parts.length > 60 || !d.look) return false;
  if (d.nodes.some((n) => ![n.y, n.z, n.rx, n.ry].every(Number.isFinite) || n.rx <= 0 || n.ry <= 0 || n.rx > 2 || n.ry > 2 || Math.abs(n.y) > 8 || Math.abs(n.z) > 8)) return false;
  return d.parts.every((p) => p && parts[p.kind] && Number.isFinite(p.u) && Number.isFinite(p.a) && Number.isFinite(p.size) && p.size > 0 && p.size < 10 && p.p && typeof p.p === 'object');
}
