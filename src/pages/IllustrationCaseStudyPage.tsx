import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CaseStudyHero from '../components/case-study/CaseStudyHero';
import CaseStudyNav from '../components/case-study/CaseStudyNav';
import Button from '../components/ui/Button';
import { illustrationCaseStudy as cs } from '../data/illustrationCaseStudy';

const illustNavItems = [
  { id: 'about', label: 'About this work' },
  { id: 'company', label: 'Company portraits' },
  { id: 'illustrator', label: 'Illustrator work' },
  { id: 'wpap', label: 'WPAP portraits' },
  { id: 'craft', label: 'Craft & tools' },
];

export default function IllustrationCaseStudyPage() {
  return (
    <>
      <Header />
      <main className="case-study-page">
        <CaseStudyHero
          label="Creative showcase"
          title={cs.title}
          subtitle={cs.subtitle}
          tags={cs.tags}
        />

        {/* Hero collage — full artwork, no crop */}
        <div className="illus-collage-section">
          <div className="container">
            <div className="illus-collage">
              {cs.heroCollage.map((src, i) => (
                <div key={src} className="illus-collage__item">
                  <img
                    src={src}
                    alt={`Illustration sample ${i + 1}`}
                    className="illus-collage__img"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cs-layout">
          <CaseStudyNav items={illustNavItems} />
          <div className="cs-content">

            {/* ABOUT */}
            <section className="cs-section" id="about">
              <h2 className="cs-section__title">About this work</h2>
              <p className="cs-section__body">{cs.intro}</p>
              <div className="illus-snapshot-row">
                {cs.snapshot.map(s => (
                  <div key={s.label} className="illus-snapshot-item">
                    <span className="illus-snapshot-item__label">{s.label}</span>
                    <span className="illus-snapshot-item__value">{s.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* COMPANY PORTRAITS */}
            <section className="cs-section" id="company">
              <div className="illus-section-header">
                <h2 className="cs-section__title cs-section__title--no-mb">{cs.companySection.title}</h2>
                <span className="illus-tool-badge">{cs.companySection.tool}</span>
              </div>
              <p className="cs-section__body">{cs.companySection.description}</p>
              <div className="illus-portrait-grid">
                {cs.companySection.images.map(img => (
                  <div key={img.src} className="illus-portrait-card">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="illus-portrait-img"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* ILLUSTRATOR WORK */}
            <section className="cs-section" id="illustrator">
              <div className="illus-section-header">
                <h2 className="cs-section__title cs-section__title--no-mb">{cs.illustratorSection.title}</h2>
                <span className="illus-tool-badge">{cs.illustratorSection.tool}</span>
              </div>
              <p className="cs-section__body">{cs.illustratorSection.description}</p>
              <div className="illus-artwork-grid">
                {cs.illustratorSection.images.map(img => (
                  <div key={img.src} className="illus-artwork-card">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="illus-artwork-img"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* WPAP PORTRAITS */}
            <section className="cs-section" id="wpap">
              <div className="illus-section-header">
                <h2 className="cs-section__title cs-section__title--no-mb">{cs.wpapSection.title}</h2>
                <span className="illus-tool-badge">{cs.wpapSection.tool}</span>
              </div>
              <p className="cs-section__body">{cs.wpapSection.description}</p>
              <div className="illus-artwork-grid">
                {cs.wpapSection.images.map(img => (
                  <div key={img.src} className="illus-artwork-card">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="illus-artwork-img"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* CRAFT & TOOLS */}
            <section className="cs-section" id="craft">
              <h2 className="cs-section__title">Craft & tools</h2>
              <p className="cs-section__body">{cs.craftNote}</p>
              <div className="illus-tool-pills-row">
                {cs.tools.map(t => <span key={t} className="wf-tool-pill">{t}</span>)}
              </div>

              <div className="cs-cta-section">
                <h3 className="cs-cta-section__title">See the product design work</h3>
                <div className="cs-cta-section__actions">
                  <Button href="/projects/riverside-general">Riverside General</Button>
                  <Button href="/projects/renewly" variant="ghost">Renewly</Button>
                  <Button href="/projects/ai-assisted-product-workflow" variant="ghost">AI workflow</Button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
