export interface IllusImage { src: string; alt: string; }

// Generate all 47 company portrait paths
const companyImages: IllusImage[] = Array.from({ length: 47 }, (_, i) => ({
  src: `/images/projects/illustration/company/company-${String(i + 1).padStart(2, '0')}.png`,
  alt: `Team portrait ${i + 1}`,
}));

export const illustrationCaseStudy = {
  id: 'illustration-systems',
  title: 'Illustration Systems & Vector Portraits',
  subtitle: 'Hand-crafted vector illustrations across three bodies of work: team portraits in Figma, freelance work in Adobe Illustrator, and personal WPAP-style art.',
  tags: ['Vector Illustration', 'Figma', 'Adobe Illustrator', 'WPAP', 'Portrait Systems', 'Team Culture', 'Pen Tool Craft'],

  intro: "I've been making vector illustrations for a while alongside my UX/UI work. These are three separate bodies of work from different parts of my life: professional, freelance, and personal. All of them were built manually with the pen tool.",

  snapshot: [
    { label: 'Tools', value: 'Figma, Adobe Illustrator' },
    { label: 'Technique', value: 'Manual pen-tool, vector shapes, colour blocking' },
    { label: 'Output', value: 'Team avatars, character illustrations, WPAP portraits' },
  ],

  companySection: {
    title: 'Company team portraits',
    description: "At my previous organisation I created vector portraits for the entire design team in Figma. They replaced standard profile photos in the internal portal. People started using them on Slack and in presentations. We ended up printing some on T-shirts and gifting them on birthdays. 47 portraits total.",
    tool: 'Figma',
    images: companyImages,
  },

  illustratorSection: {
    title: 'Adobe Illustrator freelance work',
    description: "Work from my college freelance days. Made in Adobe Illustrator. This is where I learned path control, layering, and how to build complex shapes from scratch.",
    tool: 'Adobe Illustrator',
    images: [
      { src: '/images/projects/illustration/illustrator/illustrator-01.png', alt: 'Adobe Illustrator freelance illustration' },
      { src: '/images/projects/illustration/illustrator/illustrator-02.png', alt: 'Vector illustration, Illustrator' },
      { src: '/images/projects/illustration/illustrator/illustrator-03.png', alt: 'Illustrator composition' },
      { src: '/images/projects/illustration/illustrator/illustrator-04.jpg', alt: 'Kakashi character illustration' },
    ] as IllusImage[],
  },

  wpapSection: {
    title: 'WPAP personal portraits',
    description: "Personal WPAP-style portraits from school. WPAP is built entirely from geometric vector shapes and bold colour blocks. No gradients, no brushes, just the pen tool. It teaches you to break down a face into clean shapes, which turns out to be surprisingly useful for everything else.",
    tool: 'Adobe Illustrator, Pen Tool',
    images: [
      { src: '/images/projects/illustration/wpap/wpap-01.jpg', alt: 'WPAP portrait, geometric vector style' },
      { src: '/images/projects/illustration/wpap/wpap-02.jpg', alt: 'WPAP portrait, bold colour planes' },
      { src: '/images/projects/illustration/wpap/wpap-03.jpg', alt: 'WPAP portrait, pen-tool construction' },
      { src: '/images/projects/illustration/wpap/wpap-04.jpg', alt: 'WPAP portrait, colour segmentation' },
    ] as IllusImage[],
  },

  craftNote: "Everything here was built path by path. No auto-trace, no filters. The WPAP work is the most demanding. Getting a likeness from pure geometric shapes takes a lot of iteration. The Figma portraits had the added challenge of being consistent across 47 different people while still feeling individual.",

  tools: ['Figma', 'Adobe Illustrator', 'Pen Tool', 'Vector shapes', 'Colour blocking'],

  heroCollage: [
    '/images/projects/illustration/company/company-01.png',
    '/images/projects/illustration/company/company-05.png',
    '/images/projects/illustration/company/company-10.png',
    '/images/projects/illustration/wpap/wpap-01.jpg',
    '/images/projects/illustration/wpap/wpap-04.jpg',
    '/images/projects/illustration/illustrator/illustrator-04.jpg',
  ],
};
