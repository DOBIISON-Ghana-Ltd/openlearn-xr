import Link from 'next/link';
import { Logo } from './logo';
import { PATHS } from '@/lib/constants/paths';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: PATHS.LEGAL.PRIVACY },
  { label: 'Terms of Use', href: PATHS.LEGAL.TERMS },
  { label: 'Cookie Policy', href: PATHS.LEGAL.COOKIES },
];

const RESOURCE_LINKS = [
  { label: 'GitHub Repository', href: 'https://github.com/DOBIISON-Ghana-Ltd/openlearn-xr', external: true },
  { label: 'Contact School Setup', href: PATHS.CONTACT, external: false },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-white border-t border-primary-light/60 pt-16 pb-12 transition-all">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-20">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-16">
          {/* Column 1: Logo & Mission Statement */}
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
            <Logo />
            <p className="text-normal font-normal text-secondary-text max-w-xs leading-relaxed">
              Open-source, personalized curriculum and labs for classrooms worldwide. Deploy locally, ensure student privacy.
            </p>
          </div>

          {/* Column 2: Legal Links */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
            <h4 className="text-normal font-semibold text-primary-text-dark tracking-wider uppercase">
              Legal
            </h4>
            <ul className="flex flex-col gap-4">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources Links */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
            <h4 className="text-normal font-semibold text-primary-text-dark tracking-wider uppercase">
              Resources
            </h4>
            <ul className="flex flex-col gap-4">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Compliance Bar */}
        <div className="border-t border-primary-light/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-small font-normal text-secondary-text">
            © 2026 OpenLearn. All rights reserved.
          </p>
          <p className="text-small font-normal text-secondary-text">
            Safe for classrooms · Student data privacy compliant
          </p>
        </div>
      </div>
    </footer>
  );
}

