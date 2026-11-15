/**
 * Decodes the Kiwi-encoded canvas inside a Figma .fig export into plain JSON.
 * Usage: node scripts/figma/fig-decode.mjs <unzipped-dir-with-canvas.fig> <out.json>
 * (A .fig is a zip: unzip it first.) Output: { nodeChanges: [...] } - Figma's flat node list.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { join } from 'node:path';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

const [dir, out] = process.argv.slice(2);
const buf = readFileSync(join(dir, 'canvas.fig'));
const magic = buf.subarray(0, 8).toString();
if (magic !== 'fig-kiwi' && magic !== 'fig-jam.') throw new Error(`Unexpected header "${magic}"`);
let off = 12; // 8 magic + uint32 version
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
const msg = schema.decodeMessage(new Uint8Array(unpack(chunks[1])));
console.log('chunks', chunks.length, 'nodeChanges', msg.nodeChanges?.length);
writeFileSync(out, JSON.stringify(msg, (_k, v) => (v instanceof Uint8Array ? undefined : typeof v === 'bigint' ? Number(v) : v)));
