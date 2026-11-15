import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '../ui/Button';
import Tag from '../ui/Tag';
import BlurReveal from '../motion/BlurReveal';
import TiltCard from '../motion/TiltCard';
import { useOnScreen } from '../motion/useOnScreen';
import { fadeUp, staggerParent, EASE, DURATION } from '../motion/motion-presets';
import { projects } from '../../data/projects';
import Img from './Img';
import '../../styles/case-v2.css';

interface CaseStudyHeroProps {
  title: string;
  subtitle: string;
  tags: string[];
  prototypeUrl?: string;
  githubUrl?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImage2?: string;
  heroImageAlt2?: string;
  prototypeUrlLabel?: string;
  label?: string;
  prototypeLabel?: string;
  githubLabel?: string;
  /** Replaces the year / category / format strip when a project has facts worth showing instead. */
  meta?: { k: string; v: string }[];
}

const WORDS_PER_MINUTE = 220;

/**
 * Shared dark hero for every case study.
 *
 * The metadata strip (year, category, format) comes from src/data/projects.ts,
 * matched on the current route, so nothing is duplicated per page. Read time is
 * measured from the rendered content, so it can never drift from the page.
 */
export default function CaseStudyHero({
  title,
  subtitle,
  tags,
  prototypeUrl,
  githubUrl,
  heroImage,
  heroImageAlt,
  heroImage2,
  heroImageAlt2,
  prototypeUrlLabel = 'renewly-ux.vercel.app',
  label = 'Case study',
  prototypeLabel = 'View live prototype ↗',
  githubLabel = 'View GitHub repository ↗',
  meta: metaOverride,
}: CaseStudyHeroProps) {
  const reduced = useReducedMotion();
  const start = reduced ? false : 'hidden';
  const { pathname } = useLocation();
  const ref = useRef<HTMLElement>(null);
  const onScreen = useOnScreen(ref);
  const [minutes, setMinutes] = useState<number | null>(null);

  const project = projects.find(p => p.href === pathname);
  const meta = metaOverride ?? (project
    ? [
        { k: 'Year', v: project.year },
        { k: 'Category', v: project.category },
        { k: 'Format', v: project.sprint ?? '—' },
      ]
    : []);

  // Datasheet strip: Role / Platform / Year / Status, only from data that exists.
  // Keys already shown in the meta strip below are skipped so nothing repeats.
  const metaHas = (k: string) => meta.some(m => m.k.toLowerCase() === k.toLowerCase());
  const fromMeta = (k: string) => (metaOverride ?? []).find(m => m.k.toLowerCase() === k.toLowerCase())?.v;
  const STATUS: Record<string, string> = {
    complete: 'Shipped', 'in-progress': 'In progress', 'process-showcase': 'Process study', 'creative-showcase': 'Creative study',
  };
  const datasheet = [
    { k: 'Role', v: fromMeta('Role') },
    { k: 'Platform', v: fromMeta('Platform') },
    { k: 'Year', v: project?.year },
    { k: 'Status', v: project ? STATUS[project.status] : undefined },
  ].filter((d): d is { k: string; v: string } => Boolean(d.v) && !metaHas(d.k));

  useEffect(() => {
    const text = document.querySelector('.cs-content')?.textContent ?? '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setMinutes(words > 0 ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : null);
  }, [pathname]);

  return (
    <section ref={ref} className="cs-hero" data-paused={!onScreen}>

      <motion.div className="container cs-hero__inner" variants={staggerParent(0.08)} initial={start} animate="show">
        <motion.div className="cs-hero__top" variants={fadeUp(10)}>
          <p className="cs-hero__label">{label}</p>
          {minutes && <span className="cs-hero__read">{minutes} min read</span>}
        </motion.div>

        <h1 className="cs-hero__title">
          <BlurReveal immediate delay={0.1} text={title} />
        </h1>
        <motion.p className="cs-hero__subtitle" variants={fadeUp(16)}>{subtitle}</motion.p>
        <motion.div className="cs-hero__tags" variants={fadeUp(12)}>
          {tags.map(t => <Tag key={t}>{t}</Tag>)}
        </motion.div>
        {(prototypeUrl || githubUrl) && (
          <motion.div className="cs-hero__actions" variants={fadeUp(12)}>
            {prototypeUrl && <Button href={prototypeUrl} external size="lg">{prototypeLabel}</Button>}
            {githubUrl && <Button href={githubUrl} variant="secondary" external size="lg">{githubLabel}</Button>}
          </motion.div>
        )}

        {meta.length + datasheet.length > 0 && (
          <motion.dl className="cs-hero__meta cs-datasheet" variants={fadeUp(12)}>
            {meta.map(m => (
              <div key={m.k} className="cs-hero__meta-item">
                <dt>{m.k}</dt>
                <dd>{m.v}</dd>
              </div>
            ))}
            {datasheet.map(d => (
              <div key={d.k} className="cs-hero__meta-item cs-hero__meta-item--sheet">
                <dt>{d.k}</dt>
                <dd>{d.v}</dd>
              </div>
            ))}
          </motion.dl>
        )}

        {heroImage && (
          <motion.div
            className="cs-hero__preview"
            initial={reduced ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE, delay: 0.3 }}
          >
            <TiltCard className="cs-hero__tilt" max={3}>
              <div className="cs-hero__browser">
                <div className="cs-hero__browser-bar">
                  <span className="cs-hero__browser-dot" />
                  <span className="cs-hero__browser-dot" />
                  <span className="cs-hero__browser-dot" />
                  <span className="cs-hero__browser-url">{prototypeUrlLabel}</span>
                </div>
                <div className={`cs-hero__browser-body${heroImage2 ? ' cs-hero__browser-body--dual' : ''}`}>
                  <Img
                    src={heroImage}
                    alt={heroImageAlt ?? title}
                    className="cs-hero__browser-img"
                    priority
                  />
                  {heroImage2 && (
                    <Img
                      src={heroImage2}
                      alt={heroImageAlt2 ?? title}
                      className="cs-hero__browser-img"
                    />
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
