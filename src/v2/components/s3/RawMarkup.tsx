import { Fragment, type ReactNode } from 'react';

/**
 * The raw markdown, one block per line, with the markdown glyphs colour-coded (no parser, no dependency).
 * The text content stays exactly the file's text, so selecting and copying it gives the real VIJAY.md back.
 * Line numbers are a CSS counter (not selectable).
 */

const INLINE = /(\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*)/g;

function inline(s: string): ReactNode {
  return s.split(INLINE).map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) return (
      <Fragment key={i}>
        <span className="m-g">[</span><span className="m-lab">{link[1]}</span><span className="m-g">]</span>
        <span className="m-g">(</span><span className="m-url">{link[2]}</span><span className="m-g">)</span>
      </Fragment>
    );
    const em = /^\*([^*\n]+)\*$/.exec(part);
    if (em) return <span key={i} className="m-em"><span className="m-g">*</span>{em[1]}<span className="m-g">*</span></span>;
    return part;
  });
}

function Line({ text }: { text: string }) {
  const h = /^(#{1,3}) (.*)$/.exec(text);
  if (h) return <span className={`s3-l m-h m-h${h[1]!.length}`}><span className="m-g">{h[1]} </span>{inline(h[2]!)}</span>;
  const q = /^> (.*)$/.exec(text);
  if (q) return <span className="s3-l m-q"><span className="m-g">&gt; </span>{inline(q[1]!)}</span>;
  const li = /^- (.*)$/.exec(text);
  if (li) return <span className="s3-l"><span className="m-g">- </span>{inline(li[1]!)}</span>;
  if (/^---$/.test(text)) return <span className="s3-l m-g">{text}</span>;
  const pr = /^(proof:) (.*)$/.exec(text);
  if (pr) return <span className="s3-l"><span className="m-key">{pr[1]}</span> {inline(pr[2]!)}</span>;
  return <span className="s3-l">{inline(text)}</span>;
}

export default function MdLines({ md }: { md: string }) {
  const lines = md.replace(/\n$/, '').split('\n');
  return <>{lines.map((l, i) => <Line key={i} text={l} />)}</>;
}
