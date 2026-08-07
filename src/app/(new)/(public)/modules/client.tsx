'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type YearTab = 'YEAR 1' | 'YEAR 2' | 'YEAR 3';
type SubjectId = 'chemistry' | 'physics' | 'engineering';

interface ModuleItem {
  id: string;
  title: string;
  status: 'Completed' | '40% Progress' | 'Not Started';
  image: string;
}

const MODULES_DATA: Record<SubjectId, Record<YearTab, ModuleItem[]>> = {
  chemistry: {
    'YEAR 1': [
      { id: 'c1-1', title: 'Measurement of Physical Quantities', status: 'Completed', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-2', title: 'Measurement of Physical Quantities', status: 'Completed', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-3', title: 'Measurement of Physical Quantities', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-4', title: 'Measurement of Physical Quantities', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-5', title: 'Measurement of Physical Quantities', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-6', title: 'Measurement of Physical Quantities', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-7', title: 'Measurement of Physical Quantities', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-8', title: 'Measurement of Physical Quantities', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'c1-9', title: 'Measurement of Physical Quantities', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
    'YEAR 2': [
      { id: 'c2-1', title: 'Atomic Structure & Chemical Bonding', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'c2-2', title: 'Stoichiometry & Mole Concept', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c2-3', title: 'States of Matter & Gas Laws', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c2-4', title: 'Chemical Thermodynamics', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c2-5', title: 'Acid-Base Equilibria & pH', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c2-6', title: 'Electrochemistry & Redox Reactions', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
    'YEAR 3': [
      { id: 'c3-1', title: 'Organic Chemistry & Functional Groups', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c3-2', title: 'Hydrocarbons & Polymerization', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c3-3', title: 'Chemical Kinetics & Rate Laws', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'c3-4', title: 'Nuclear Chemistry & Radioactivity', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
  },
  physics: {
    'YEAR 1': [
      { id: 'p1-1', title: 'Kinematics & Motion in 1D/2D', status: 'Completed', image: '/(new)/module-thumbnail.png' },
      { id: 'p1-2', title: 'Vectors & Forces in Equilibrium', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'p1-3', title: 'Work, Energy & Power Laws', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'p1-4', title: 'Linear Momentum & Collisions', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'p1-5', title: 'Pressure & Fluid Mechanics', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'p1-6', title: 'Thermal Expansion & Heat Transfer', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
    'YEAR 2': [
      { id: 'p2-1', title: 'Wave Motion & Sound Waves', status: 'Completed', image: '/(new)/module-thumbnail.png' },
      { id: 'p2-2', title: 'Geometrical Optics & Refraction', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'p2-3', title: 'Electric Charges & Coulomb Law', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
    'YEAR 3': [
      { id: 'p3-1', title: 'Electromagnetism & Faraday Law', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'p3-2', title: 'Quantum Physics & Photoelectric Effect', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
  },
  engineering: {
    'YEAR 1': [
      { id: 'e1-1', title: 'Basic Circuit Analysis & Ohm Law', status: 'Completed', image: '/(new)/module-thumbnail.png' },
      { id: 'e1-2', title: 'Electrical Symbols & Schematics', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'e1-3', title: 'Resistors in Series & Parallel', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'e1-4', title: 'Digital Logic Gates & Boolean Algebra', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
    'YEAR 2': [
      { id: 'e2-1', title: 'AC Circuits & Impedance', status: '40% Progress', image: '/(new)/module-thumbnail.png' },
      { id: 'e2-2', title: 'Semiconductor Diodes & Rectification', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
    'YEAR 3': [
      { id: 'e3-1', title: 'Transistors & Amplification', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
      { id: 'e3-2', title: 'Microcontrollers & Sensors', status: 'Not Started', image: '/(new)/module-thumbnail.png' },
    ],
  },
};

export default function ModulesClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<YearTab>('YEAR 1');
  const [activeSubject, setActiveSubject] = useState<SubjectId>('chemistry');

  useEffect(() => {
    const subjectParam = searchParams.get('subject') as SubjectId | null;
    if (subjectParam && ['chemistry', 'physics', 'engineering'].includes(subjectParam)) {
      setActiveSubject(subjectParam);
    }
  }, [searchParams]);

  const modules = MODULES_DATA[activeSubject]?.[activeTab] || [];

  return (
    <main className="w-full min-h-screen bg-surface-white relative">
      {/* Top Year Tabs Bar (Full Width) */}
      <div className="w-full bg-surface-slate border-b border-primary-light">
        <div className="mx-auto flex h-[63px] w-full max-w-[1440px] items-center justify-center gap-[36px] px-6">
          {(['YEAR 1', 'YEAR 2', 'YEAR 3'] as YearTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'h-full px-4 text-large text-primary-text-dark transition-all border-b-3 flex items-center justify-center cursor-pointer',
                {
                  'border-primary-cta font-semibold': activeTab === tab,
                  'border-transparent text-tertiary hover:text-primary-text-dark': activeTab !== tab,
                }
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Full-bleed Left Sidebar + Right Modules Grid */}
      <div className="mx-auto w-full max-w-[1440px] flex flex-col md:flex-row min-h-[700px]">
        {/* Left Sidebar Strip: Touches top bar and left edge of screen */}
        <aside className="w-full md:w-[356px] shrink-0 bg-surface-slate pt-12 pb-20 px-6 md:pl-20 md:pr-8 flex flex-col gap-[20px]">
          {/* Chemistry Option */}
          <button
            type="button"
            onClick={() => setActiveSubject('chemistry')}
            className={cn(
              'w-full max-w-[232px] flex items-center gap-[10px] h-[77px] px-[24px] rounded-[20px] transition-all cursor-pointer text-left',
              {
                'bg-primary-cta text-primary-text-light shadow-md': activeSubject === 'chemistry',
                'bg-primary-subtle text-primary-text-dark hover:bg-primary-light/60': activeSubject !== 'chemistry',
              }
            )}
          >
            <div className="relative size-[40px] shrink-0 overflow-hidden flex items-center justify-center">
              <img src="/(new)/chemistry.png" alt="Chemistry" className="size-full object-contain" />
            </div>
            <span className="text-h6">Chemistry</span>
          </button>

          {/* Physics Option */}
          <button
            type="button"
            onClick={() => setActiveSubject('physics')}
            className={cn(
              'w-full max-w-[232px] flex items-center gap-[10px] h-[77px] px-[24px] rounded-[20px] transition-all cursor-pointer text-left',
              {
                'bg-primary-cta text-primary-text-light shadow-md': activeSubject === 'physics',
                'bg-primary-subtle text-primary-text-dark hover:bg-primary-light/60': activeSubject !== 'physics',
              }
            )}
          >
            <div className="relative w-[40px] h-[39px] shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src="/(new)/physics-engineering.png"
                alt="Physics"
                className="absolute h-[205%] left-0 top-[-47%] w-[200%] max-w-none"
              />
            </div>
            <span className="text-h6">Physics</span>
          </button>

          {/* Engineering Option */}
          <button
            type="button"
            onClick={() => setActiveSubject('engineering')}
            className={cn(
              'w-full max-w-[232px] flex items-center gap-[10px] h-[77px] px-[24px] rounded-[20px] transition-all cursor-pointer text-left',
              {
                'bg-primary-cta text-primary-text-light shadow-md': activeSubject === 'engineering',
                'bg-primary-subtle text-primary-text-dark hover:bg-primary-light/60': activeSubject !== 'engineering',
              }
            )}
          >
            <div className="relative w-[40px] h-[37px] shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src="/(new)/physics-engineering.png"
                alt="Engineering"
                className="absolute h-[205%] left-[-90%] top-[-52%] w-[190%] max-w-none"
              />
            </div>
            <span className="text-h6">Engineering</span>
          </button>
        </aside>

        {/* Modules Cards Grid Area */}
        <section className="flex-1 py-12 px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[26px] max-w-[1020px]">
            {modules.map((item) => (
              <Link
                key={item.id}
                href={`/simulations?module=${item.id}`}
                className="group relative flex flex-col justify-between w-full h-[263px] bg-primary-subtle border-2 border-primary-light rounded-[20px] overflow-hidden transition-all hover:border-primary-cta hover:shadow-lg hover:-translate-y-1"
              >
                {/* Background Image / Thumbnail */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Bottom Glass Overlay Info Area */}
                <div className="absolute bottom-0 inset-x-0 h-[101px] z-10 backdrop-blur-[5px] bg-gradient-to-t from-primary-light via-surface-white/80 to-surface-white/40 p-4 flex flex-col justify-between border-t border-surface-white/50">
                  <h4 className="text-normal text-primary-text-dark leading-snug line-clamp-2">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={cn('text-small', {
                        'text-success': item.status === 'Completed',
                        'text-warning': item.status === '40% Progress',
                        'text-disable': item.status === 'Not Started',
                      })}
                    >
                      {item.status}
                    </span>

                    {item.status === 'Completed' && (
                      <div className="size-[24px] relative shrink-0">
                        <img src="/(new)/check-circle.svg" alt="Completed" className="size-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

