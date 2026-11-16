import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Character from './Character';
import AskBox from './AskBox';
import { quirks } from '../../data/quirks';
import HeroActions from '../home/HeroActions';
import FeaturedStrip from '../home/FeaturedStrip';
import ScrollCue from '../home/ScrollCue';
import '../../styles/home-v2.css';

/**
 * The opening is a conversation, not a banner: a greeting, one box, three suggestions. The
 * mascot drops in and settles, its eyes follow you, and a soft clay glow trails the pointer.
 */
export default function HomeHero() {
  const nav = useNavigate();
  const reduced = useReducedMotion();
  const sec = useRef<HTMLElement>(null);
  const [wave, setWave] = useState(false);

  // glow follows the pointer a little behind it (fine pointers, no reduced motion)
  useEffect(() => {
    const el = sec.current; if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, tx = 50, ty = 30, x = 50, y = 30;
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width) * 100; ty = ((e.clientY - r.top) / r.height) * 100; };
    const tick = () => { x += (tx - x) * 0.06; y += (ty - y) * 0.06; el.style.setProperty('--gx', `${x}%`); el.style.setProperty('--gy', `${y}%`); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { if (e!.isIntersecting && !raf) raf = requestAnimationFrame(tick); if (!e!.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(el); window.addEventListener('pointermove', move, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('pointermove', move); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // the mascot waves hello once, shortly after it lands
  useEffect(() => {
    if (reduced) return;
    const a = window.setTimeout(() => setWave(true), 1500), b = window.setTimeout(() => setWave(false), 3300);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [reduced]);

  const rise = (d: number) => ({ initial: reduced ? false : { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: d } });

  return (
    <section ref={sec} className="hhero" id="top" aria-label="Introduction">
      <div className="hhero__glow" aria-hidden="true" />
      <motion.div
        className="hhero__char"
        initial={reduced ? false : { y: -120, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.9, delay: 0.15 }}
      >
        <Character pose={wave ? 'wave' : 'rest'} size={124} track boot label="Clay, the site’s mascot" />
      </motion.div>
      <motion.h1 className="hhero__title" {...rise(0.45)}>
        Hi, I’m Vijay. I turn messy user journeys into <em>clear</em> ones.
      </motion.h1>
      <motion.p className="hhero__sub" {...rise(0.6)}>UX/UI product designer in Hyderabad. Ask me anything, or see the work below.</motion.p>
      <motion.div className="hhero__ask" {...rise(0.75)}>
        <AskBox onAsk={q => nav(`/ask?q=${encodeURIComponent(q)}`)} nudges={quirks.askNudges} />
        <HeroActions />
        <p className="el-aside">{quirks.hero.aside}</p>
      </motion.div>
      <motion.div className="hhero__proof" {...rise(0.9)}>
        <FeaturedStrip />
      </motion.div>
      <ScrollCue />
    </section>
  );
}
