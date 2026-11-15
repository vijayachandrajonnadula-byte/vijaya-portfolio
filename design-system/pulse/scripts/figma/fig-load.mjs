/**
 * Loads a Figma .fig export as a node tree. Caches the decoded message (v8 format) in the OS temp dir.
 * Usage: const { nodes, byId, children, pages } = await loadFig('pulse 2.0.fig');
 * Node ids are "sessionID:localID" strings, the same ids Figma shows in URLs.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { deserialize, serialize } from 'node:v8';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

export const gid = (g) => (g ? `${g.sessionID}:${g.localID}` : null);

export async function loadFig(figPath) {
  const stamp = `${statSync(figPath).size}`;
  const work = join(tmpdir(), `figload-${stamp}`);
  mkdirSync(work, { recursive: true });
  const cache = join(work, 'msg.v8');
  let msg;
  if (existsSync(cache)) {
    msg = deserialize(readFileSync(cache));
  } else {
    const canvas = join(work, 'canvas.fig');
    if (!existsSync(canvas)) {
      // .fig is a zip; extract canvas.fig with tar (bsdtar ships with Windows 10+).
      execFileSync('tar', ['-xf', figPath, '-C', work, 'canvas.fig']);
    }
    const buf = readFileSync(canvas);
    let off = 12;
    const chunks = [];
    while (off + 4 <= buf.length) {
      const len = buf.readUInt32LE(off);
      off += 4;
      chunks.push(buf.subarray(off, off + len));
      off += len;
    }
    const unpack = (b) => {
      try {
        return inflateRawSync(b);
      } catch {
        return zstdDecompressSync(b);
      }
    };
    const schema = compileSchema(decodeBinarySchema(new Uint8Array(unpack(chunks[0]))));
    msg = schema.decodeMessage(new Uint8Array(unpack(chunks[1])));
    writeFileSync(cache, serialize(msg));
  }
  const nodes = msg.nodeChanges;
  const byId = new Map();
  for (const n of nodes) byId.set(gid(n.guid), n);
  const children = new Map();
  for (const n of nodes) {
    const p = gid(n.parentIndex?.guid);
    if (!p) continue;
    if (!children.has(p)) children.set(p, []);
    children.get(p).push(n);
  }
  for (const list of children.values()) list.sort((a, b) => (a.parentIndex.position < b.parentIndex.position ? -1 : 1));
  const pages = nodes.filter((n) => n.type === 'CANVAS');
  return { msg, nodes, byId, children, pages };
}
