import { Take, Words, ranges, useBeat } from '../components/Beat';
import { Mark } from '../components/SceneBits';
import { EMAIL, useNote, writeClipboard } from '../components/s3/copy';
import CircuitSwitch from './contact/CircuitSwitch';
import type { SceneProps } from './types';
import '../styles/s3-contact.css';

/**
 * ## say hello: the destination of the film. The heading, ONE primary action (the closing-circuit switch) and quiet links.
 * Everything real here is focusable; the words themselves are decorative (the hidden article carries them).
 */
export default function ContactScene({ beat }: SceneProps) {
  const { read, active } = useBeat();
  const r = ranges(beat.paragraphs, 0.02, 0.45);
  const { note, say } = useNote();
  const copy = async () => say((await writeClipboard(EMAIL)) ? 'Copied' : 'Copy is blocked here. Select the address instead.');
  const links = (beat.links ?? []).filter(l => l.note !== 'email');
  return (
    <div className="v2-scene s3-hello">
      <Take range={[0.92, 1]} dir="up" distance={80} className="s3-hello__take">
        <div className="s3-hello__grid">
          <div className="s3-hello__text">
            <Mark>## {beat.section}</Mark>
            <div className="s3-hello__h" aria-hidden="true">{beat.heading}</div>
            {beat.paragraphs.map((p, i) => <Words key={i} text={p} source={read} range={r[i]} className="v2-body s3-hello__p" />)}
          </div>
          <div className="s3-hello__panel"><CircuitSwitch active={active} /></div>
          <div className="s3-hello__links">
            <ul className="s3-hello__row">
              {links.map(l => (
                <li key={l.href}>
                  <a className="s3-hello__a" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}<span className="v2-sr"> (opens in a new tab)</span></a>
                </li>
              ))}
            </ul>
            <p className="s3-hello__row s3-hello__mail">
              <a className="s3-hello__a" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <p className="s3-hello__row s3-hello__where">
              <button type="button" className="s3-hello__copy" onClick={copy}>Copy email</button>
              <span>Hyderabad, India</span>
              <span className="s3-hello__note" role="status">{note}</span>
            </p>
          </div>
        </div>
      </Take>
    </div>
  );
}
