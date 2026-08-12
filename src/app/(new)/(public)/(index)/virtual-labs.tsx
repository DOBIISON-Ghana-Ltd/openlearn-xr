import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { PATHS } from '@/lib/constants/paths';

export interface VirtualLabsProps {
  className?: string;
}

const SUBJECTS = [
  {
    id: 'chemistry',
    title: 'Chemistry',
    image: '/(new)/chemistry.png',
    description: 'Experiment with chemical reactions, atomic structure, and molecular bonding safely.',
    href: `${PATHS.MODULES}?subject=chemistry`,
    imageStyle: 'scale-110 object-contain',
  },
  {
    id: 'physics',
    title: 'Physics',
    image: '/(new)/physics-engineering.png',
    description: 'Explore mechanics, optics, electricity, and wave physics in interactive 3D environments.',
    href: `${PATHS.MODULES}?subject=physics`,
    imageStyle: 'scale-125 object-center',
  },
  {
    id: 'engineering',
    title: 'Engineering',
    image: '/(new)/physics-engineering.png',
    description: 'Build circuit diagrams, test structural designs, and master applied technical concepts.',
    href: `${PATHS.MODULES}?subject=engineering`,
    imageStyle: 'scale-125 object-right',
  },
];

export default function VirtualLabs({ className }: VirtualLabsProps) {
  return (
    <section className={cn('w-full min-h-[573px] bg-surface-white py-16 md:py-20 flex items-center justify-center', className)}>
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20 text-center">
        {/* Section Title */}
        <h2 className="text-h5 sm:text-h4 text-primary-text-dark max-w-[1069px] mx-auto tracking-tight">
          Curriculum-Aligned Virtual Labs
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-normal text-dark-bg max-w-[769px] mx-auto leading-normal">
          Interactive 3D labs built directly around the Ghana Education Service (GES) curriculum to help you master core practical skills and abstract concepts.
        </p>

        {/* Subjects Grid (Fixed 270x270px Square Cards from Figma) */}
        <div className="mt-[38px] flex flex-wrap items-center justify-center gap-8 lg:gap-[35px] max-w-5xl mx-auto">
          {/* Chemistry Card */}
          <Link
            href={`${PATHS.MODULES}?subject=chemistry`}
            className="group relative flex flex-col items-center justify-between w-[270px] h-[270px] p-[16px] bg-primary-subtle border-2 border-primary-light rounded-[20px] overflow-hidden transition-all hover:border-primary-cta hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative size-[192px] overflow-hidden flex items-center justify-center">
              <img
                src="/(new)/chemistry.png"
                alt="Chemistry"
                className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-h6 text-primary-text-dark group-hover:text-primary-cta transition-colors pb-1">
              Chemistry
            </h3>
          </Link>

          {/* Physics Card (Cropped Atom Icon from Sprite) */}
          <Link
            href={`${PATHS.MODULES}?subject=physics`}
            className="group relative flex flex-col items-center justify-between w-[270px] h-[270px] p-[16px] bg-primary-subtle border-2 border-primary-light rounded-[20px] overflow-hidden transition-all hover:border-primary-cta hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative w-[196px] h-[192px] overflow-hidden pointer-events-none flex items-center justify-center">
              <img
                src="/(new)/physics-engineering.png"
                alt="Physics"
                className="absolute h-[205%] left-0 top-[-47%] w-[200%] max-w-none transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-h6 text-primary-text-dark group-hover:text-primary-cta transition-colors pb-1">
              Physics
            </h3>
          </Link>

          {/* Engineering Card (Cropped Gear/Caliper Icon from Sprite) */}
          <Link
            href={`${PATHS.MODULES}?subject=engineering`}
            className="group relative flex flex-col items-center justify-between w-[270px] h-[270px] p-[16px] bg-primary-subtle border-2 border-primary-light rounded-[20px] overflow-hidden transition-all hover:border-primary-cta hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative w-[207px] h-[192px] overflow-hidden pointer-events-none flex items-center justify-center">
              <img
                src="/(new)/physics-engineering.png"
                alt="Engineering"
                className="absolute h-[205%] left-[-90%] top-[-52%] w-[190%] max-w-none transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-h6 text-primary-text-dark group-hover:text-primary-cta transition-colors pb-1">
              Engineering
            </h3>
          </Link>
        </div>
      </div>
    </section>
  );
}


