'use client';

import { cn } from '@/lib/utils/cn';

const CONCEPTS = [
  {
    id: 'nucleus',
    title: 'The Nucleus',
    description:
      'The center of the atom i s called the nucleus. It contains protons (+) and neutrons (0). Almost all the mass of the atom is in the nucleus.',
    imageSrc: '/(new)/explain-nucleus.png',
    imageAlt: 'The Nucleus Diagram',
    imgClassName: 'w-[244px] h-[150px] object-cover',
  },
  {
    id: 'proton',
    title: 'The Proton',
    description:
      "Protons (+) \u00a0are positively charged subatomic particle found in the nucleus of an atom. \u00a0They are relatively heavy compared to electrons and make up the bulk of an atom's weight.",
    imageSrc: '/(new)/explain-proton.png',
    imageAlt: 'The Proton Icon',
    imgClassName: 'w-[179px] h-[179px] object-contain',
  },
  {
    id: 'neutron',
    title: 'The Neutron',
    description:
      "Neutron (0) \u00a0are neutral subatomic particle that resides in the nucleus of an atom. They carry no electric charge, and together with protons, they make up the bulk of an atom's mass.",
    imageSrc: '/(new)/explain-neutron.png',
    imageAlt: 'The Neutron Icon',
    imgClassName: 'w-[179px] h-[179px] object-cover',
  },
  {
    id: 'electrons',
    title: 'The Electrons',
    description:
      'Electrons (-) move around the nucleus in the shells or energy levels. they have a negative charge and very little mass compared to the protons and neutrons',
    imageSrc: '/(new)/explain-electron.png',
    imageAlt: 'The Electrons Icon',
    imgClassName: 'w-[179px] h-[179px] object-cover',
  },
];

const TAKEAWAYS = [
  {
    id: 'empty-space',
    title: 'Atoms are mostly empty spaces',
    description: 'The tiny nucleus sits at the center, and electrons move around it.',
    imageSrc: '/(new)/explain-takeaway-1.png',
  },
  {
    id: 'protons-element',
    title: 'Protons determine the element.',
    description: 'The number of protons in the nucleus is the atomic number.',
    imageSrc: '/(new)/explain-proton.png',
  },
  {
    id: 'neutrons-mass',
    title: 'Neutrons affect the mass.',
    description: 'They add mass to the nucleus but do not change the element',
    imageSrc: '/(new)/explain-takeaway-3.png',
  },
  {
    id: 'electrons-reactivity',
    title: 'Electrons determine reactivity',
    description: 'Electrons in the outer shells interact with other atoms during reactions',
    imageSrc: '/(new)/explain-electron.png',
  },
];

export default function ExplainFLow() {
  return (
    <div className="flex-1 bg-surface-white pt-5 pb-8 px-6 lg:px-20 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-6">
        {/* RED BOX 1: Main Section 1 (Title & Intro Subtext) */}
        <div className="flex flex-col gap-2 w-full max-w-[1024px]">
          <h1 className="text-h2 text-primary-cta leading-tight">
            Let’s understand what you discovered!
          </h1>
          <p className="text-normal text-primary-text-dark leading-normal max-w-[656px]">
            Great job exploring the atom. Here is how the atom is structured and how each part plays its role.
          </p>
        </div>

        {/* RED BOX 2: Main Section 2 (2 side-by-side items) */}
        <div className="flex flex-col xl:flex-row items-start gap-8 w-full">
          {/* GREEN BOX 1: Left Item - Concept Cards List */}
          <div className="flex-1 max-w-[952px] w-full flex flex-col gap-5">
            {CONCEPTS.map((concept) => (
              <div
                key={concept.id}
                className="bg-primary-subtle border border-primary-light rounded-[20px] p-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 overflow-hidden min-h-[184px] relative"
              >
                <div className="flex-1 flex flex-col justify-center gap-3 max-w-[580px]">
                  <h2 className="text-h5 text-primary-text-dark">{concept.title}</h2>
                  <p className="text-normal text-primary-text-dark leading-normal">{concept.description}</p>
                </div>
                <div className="shrink-0 flex items-center justify-center relative">
                  <img
                    src={concept.imageSrc}
                    alt={concept.imageAlt}
                    className={cn('max-w-full pointer-events-none', concept.imgClassName)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* GREEN BOX 2: Right Item - Key Takeaways Sidebar */}
          <div className="w-full xl:w-[302px] shrink-0">
            <div className="bg-primary-subtle border border-primary-light rounded-[20px] p-5 flex flex-col gap-3.5 w-full min-h-[439px]">
              <h3 className="text-button text-primary-text-dark px-1">Key Takeaways</h3>
              <div className="flex flex-col gap-3.5 w-full">
                {TAKEAWAYS.map((takeaway) => (
                  <div
                    key={takeaway.id}
                    className="bg-surface-slate border border-primary-light rounded-[20px] p-3.5 flex items-start gap-3 min-h-[83px]"
                  >
                    <div className="size-[42px] shrink-0 flex items-center justify-center mt-1">
                      <img
                        src={takeaway.imageSrc}
                        alt={takeaway.title}
                        className="size-full object-contain pointer-events-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <h4 className="text-caption font-semibold text-primary-text-dark leading-snug">{takeaway.title}</h4>
                      <p className="text-caption text-primary-text-dark leading-snug">{takeaway.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}