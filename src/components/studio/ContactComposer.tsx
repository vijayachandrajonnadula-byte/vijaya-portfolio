import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '../../data/profile';
import ChapterLabel from '../story/ChapterLabel';
import ClosedCircuit from '../home/ClosedCircuit';

const WINK_OPEN = 'Switch open. Close it, say hello.';

/** Nothing is sent from the page. The form builds a draft and hands it to your email app, or you copy it. */
export default function ContactComposer() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [note, setNote] = useState('');
  const reduced = useReducedMotion();
  const [wink, setWink] = useState<string | null>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  /** Closes the little circuit for a few seconds. Pure feedback: the draft behaviour is unchanged. */
  const close = (line: string) => { setWink(line); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setWink(null), 4800); };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF(s => ({ ...s, [k]: e.target.value }));

  const body = `${f.message}\n\n${f.name}${f.email ? `\n${f.email}` : ''}`.trim();
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(f.subject || 'Hello from your portfolio')}&body=${encodeURIComponent(body)}`;
  const copy = async (text: string, what: string) => {
    try { await navigator.clipboard.writeText(text); close(what === 'Draft' ? 'Switch closed. Draft copied, paste it anywhere.' : 'Switch closed. Address copied, go ahead.'); setNote(`${what} copied`); window.setTimeout(() => setNote(''), 2000); } catch { setNote('Copy is blocked here. Select the text instead.'); }
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-h">
      <motion.div
        className="contact__in"
        initial={reduced ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <ChapterLabel n="05" name="pinout" />
        <h2 id="contact-h">Get in touch.</h2>
        <p className="contact__lead">Whether it’s about a role, a project, or just a conversation about design systems, I’m open.</p>
        <form className="composer" onSubmit={e => { e.preventDefault(); close('Switch closed. Handed to your email app, over to you.'); window.location.href = mailto; }}>
          <h3>Write to Vijay</h3>
          <div className="composer__two">
            <label><span className="sr-only">Your name</span><input placeholder="Your name" value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <label><span className="sr-only">Your email, so I can reply</span><input type="email" placeholder="Your email (so I can reply)" value={f.email} onChange={set('email')} autoComplete="email" /></label>
          </div>
          <label><span className="sr-only">Subject</span><input placeholder="Subject" value={f.subject} onChange={set('subject')} /></label>
          <label><span className="sr-only">Your message</span><textarea placeholder="Your message…" rows={5} value={f.message} onChange={set('message')} /></label>
          <div className="composer__row">
            <button type="submit" className="btn-c">Continue in your email app ↗</button>
            <button type="button" className="btn-c btn-c--ghost" onClick={() => copy(profile.email, 'Email address')}>Copy email address</button>
            <button type="button" className="btn-c btn-c--ghost" onClick={() => copy(`To: ${profile.email}\nSubject: ${f.subject}\n\n${body}`, 'Draft')}>Copy draft</button>
          </div>
          <p className="composer__note" role="status">{note || profile.email}</p>
          <ClosedCircuit closed={wink !== null} wink={wink ?? WINK_OPEN} />
        </form>
        <ul className="contact__links">
          <li><a href={`mailto:${profile.email}`}><b>Email</b><span>{profile.email}</span></a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><b>LinkedIn</b><span>vijaya-chandra</span></a></li>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer"><b>GitHub</b><span>vijayachandrajonnadula-byte</span></a></li>
          <li><a href="/Vijaya_Chandra_Jonnadula.pdf" download="Vijaya_Chandra_Jonnadula.pdf"><b>Resume</b><span>PDF download</span></a></li>
        </ul>
      </motion.div>
    </section>
  );
}
