import { Fragment, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCalm } from '../../lib/calm';

/**
 * A section title that rises into view one word at a time, once, when it enters the screen.
 * Words sit in a clipping mask (see .wr in bands.css). The OUTER span is what is observed: a word that is translated
 * out of its own mask counts as not visible, so observing the word itself would never fire.
 * Under reduced motion it is plain text.
 */
export default function SplitTitle({ text }: { text: string }) {
  const calm = useCalm();
  const box = useRef<HTMLSpanElement>(null);
  const seen = useInView(box, { once: true, margin: '0px 0px -12% 0px' });
  if (calm) return <>{text}</>;
  const words = text.split(' ');
  return (
    <span ref={box}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="wr">
            <motion.span
              className="wr__w"
              initial={{ y: '110%' }}
              animate={{ y: seen ? 0 : '110%' }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: seen ? i * 0.055 : 0 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
