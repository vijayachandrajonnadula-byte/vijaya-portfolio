import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '../../data/profile';
import SectionHead from '../home/SectionHead';
import CloseTheCircuit from '../home/CloseTheCircuit';

/**
 * Contact. One primary action (the switch, see CloseTheCircuit) on the left, and the other ways to reach me on the right.
 * Resume sits second in the list: it is the second thing a recruiter looks for after the email.
 * There is no form: nothing on this site collects input, so it would have nowhere to send it.
 * Email opens the visitor's own mail app. Both columns share the 1060px container the other sections use.
 */
export default function ContactComposer() {
  const reduced = useReducedMotion();
  return (
    <section className="contact sec band band--ink band--wipe" id="contact" aria-labelledby="contact-h">
      <motion.div
        className="contact__in"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionHead n="05" name="pinout" id="contact-h" title="Get in touch.">
          Open to roles, projects, or a conversation about design systems.
        </SectionHead>
        <div className="contact__grid">
          <CloseTheCircuit />
          <div className="contact__side">
            <h3 className="contact__or">Or reach me directly</h3>
            <ul className="contact__links">
              <li><a href={`mailto:${profile.email}`}><b>Email</b><span>{profile.email}</span></a></li>
              <li><a href="/Vijaya_Chandra_Jonnadula.pdf" download="Vijaya_Chandra_Jonnadula.pdf"><b>Resume</b><span>PDF download</span></a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><b>LinkedIn</b><span>vijaya-chandra</span></a></li>
              <li><a href={profile.github} target="_blank" rel="noopener noreferrer"><b>GitHub</b><span>vijayachandrajonnadula-byte</span></a></li>
            </ul>
            <p className="contact__loc">{profile.location}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
