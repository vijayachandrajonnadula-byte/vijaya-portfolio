import { useCallback, useEffect, useRef, useState } from 'react';
import { useCalm } from '../../lib/calm';
import '../../styles/glimpse.css';

interface Props {
  /** Project id, e.g. 'pulse-design-system'. The clip is /videos/projects/<id>.webm (see src/data/glimpses.ts). */
  id: string;
  /** Still shown before the clip loads, when it cannot play, and under reduced motion until the visitor presses play. */
  poster: string;
  /** What the clip shows, in one plain sentence. Used for the group label and the play/pause button. */
  label: string;
  className?: string;
  /** CSS aspect-ratio, default 16 / 10. */
  ratio?: string;
  /** Start playing as soon as it is in view even on a slow-looking connection. Leave off for cards below the fold. */
  eager?: boolean;
}

/**
 * A short, silent, looping glimpse of a project: a recording of the real prototype or a pan through its real screens.
 *
 * Rules it keeps (AGENTS.md: no looping animation off-screen, respect reduced motion):
 * - The file is not requested until the card is within 300px of the viewport.
 * - It plays only while at least 40% is on screen, the tab is visible, the visitor has not paused it, the system does not
 *   ask for reduced motion, and the connection is not in data-saver mode. Otherwise the poster stays.
 * - WCAG 2.2.2: a 44px play/pause button is always available once a clip exists. Under reduced motion it starts paused
 *   and a press plays it (a visitor's own action is allowed).
 * - The video is decorative (aria-hidden, silent). The group carries the label.
 * - If the file is missing or fails, the poster remains and no button is shown.
 */
export default function GlimpseVideo({ id, poster, label, className, ratio = '16 / 10', eager }: Props) {
  const calm = useCalm();
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false); // the visitor's own choice
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const saver = typeof navigator !== 'undefined' && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  // Under reduced motion or data saver the clip starts paused; the visitor can still press play.
  const [userPlay, setUserPlay] = useState(false);
  const auto = !calm && !saver;
  const wants = failed ? false : userPlay ? !paused : auto && !paused;

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setNear(true); setVisible(true); return; }
    const a = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setNear(true); }, { rootMargin: '300px 0px' });
    const b = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.4 });
    a.observe(el); b.observe(el);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);

  const sync = useCallback(() => {
    const v = vid.current;
    if (!v || !near) return;
    const shouldPlay = wants && visible && document.visibilityState === 'visible';
    if (shouldPlay) { v.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
    else { v.pause(); setPlaying(false); }
  }, [near, wants, visible]);

  useEffect(() => { sync(); }, [sync]);
  useEffect(() => {
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [sync]);

  const toggle = () => {
    if (!userPlay && !auto) { setUserPlay(true); setPaused(false); return; } // first press under reduced motion: play
    if (!userPlay && auto) setUserPlay(true);
    setPaused(p => !p);
  };
  const isOn = wants && playing;

  return (
    <div ref={box} className={`gv${className ? ` ${className}` : ''}`} style={{ aspectRatio: ratio }} role="group" aria-label={label} data-playing={isOn}>
      <video
        ref={vid}
        className="gv__video"
        src={near && !failed ? `/videos/projects/${id}.webm` : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'none'}
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        onError={() => setFailed(true)}
      />
      {!failed && near && (
        <button type="button" className="gv__btn" onClick={toggle} aria-pressed={isOn} aria-label={`${isOn ? 'Pause' : 'Play'} preview: ${label}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor">
            {isOn ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
      )}
    </div>
  );
}
