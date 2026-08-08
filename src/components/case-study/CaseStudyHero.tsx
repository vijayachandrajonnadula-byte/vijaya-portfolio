import { motion, useReducedMotion } from 'framer-motion';
import Button from '../ui/Button';
import Tag from '../ui/Tag';
import { fadeUp, staggerParent, EASE, DURATION } from '../motion/motion-presets';

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
}

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
}: CaseStudyHeroProps) {
  const reduced = useReducedMotion();
  const start = reduced ? false : 'hidden';

  return (
    <section className="cs-hero">
      <motion.div className="container" variants={staggerParent(0.08)} initial={start} animate="show">
        <motion.p className="cs-hero__label" variants={fadeUp(10)}>{label}</motion.p>
        <motion.h1 className="cs-hero__title" variants={fadeUp(22)}>{title}</motion.h1>
        <motion.p className="cs-hero__subtitle" variants={fadeUp(16)}>{subtitle}</motion.p>
        <motion.div className="cs-hero__tags" variants={fadeUp(12)}>
          {tags.map(t => <Tag key={t}>{t}</Tag>)}
        </motion.div>
        {(prototypeUrl || githubUrl) && (
          <motion.div className="cs-hero__actions" variants={fadeUp(12)}>
            {prototypeUrl && <Button href={prototypeUrl} external size="lg">{prototypeLabel}</Button>}
            {githubUrl && <Button href={githubUrl} variant="ghost" external size="lg">{githubLabel}</Button>}
          </motion.div>
        )}

        {heroImage && (
          <motion.div
            className="cs-hero__preview"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE, delay: 0.24 }}
          >
            <div className="cs-hero__browser">
              <div className="cs-hero__browser-bar">
                <span className="cs-hero__browser-dot" />
                <span className="cs-hero__browser-dot" />
                <span className="cs-hero__browser-dot" />
                <span className="cs-hero__browser-url">{prototypeUrlLabel}</span>
              </div>
              <div className={`cs-hero__browser-body${heroImage2 ? ' cs-hero__browser-body--dual' : ''}`}>
                <img
                  src={heroImage}
                  alt={heroImageAlt ?? title}
                  className="cs-hero__browser-img"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {heroImage2 && (
                  <img
                    src={heroImage2}
                    alt={heroImageAlt2 ?? title}
                    className="cs-hero__browser-img"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
