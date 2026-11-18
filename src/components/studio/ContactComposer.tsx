import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '../../data/profile';
import ChapterLabel from '../story/ChapterLabel';
import CloseTheCircuit from '../home/CloseTheCircuit';

/**
 * Contact. One primary action (the switch, see CloseTheCircuit) and four quiet secondary links below it.
 * There is no form: nothing on this site collects input, so it would have nowhere to send it.
 * Email opens the visitor's own mail app.
 */
export default function ContactComposer() {
  const reduced = useReducedMotion();
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
        <CloseTheCircuit />
        <p className="contact__or">Or reach me directly</p>
        <ul className="contact__links">
          <li><a href={`mailto:${profile.email}`}><b>Email</b><span>{profile.email}</span></a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><b>LinkedIn</b><span>vijaya-chandra</span></a></li>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer"><b>GitHub</b><span>vijayachandrajonnadula-byte</span></a></li>
          <li><a href="/Vijaya_Chandra_Jonnadula.pdf" download="Vijaya_Chandra_Jonnadula.pdf"><b>Resume</b><span>PDF download</span></a></li>
        </ul>
        <p className="contact__loc">{profile.location}</p>
      </motion.div>
    </section>
  );
}
