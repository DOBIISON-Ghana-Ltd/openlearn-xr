import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Logo } from './logo';

export interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'w-full bg-surface-white border-t border-primary-light/60 pt-16 pb-12 transition-all',
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20">
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
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources Links */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
            <h4 className="text-normal font-semibold text-primary-text-dark tracking-wider uppercase">
              Resources
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="https://github.com/DOBIISON-Ghana-Ltd/openlearn-xr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-normal font-normal text-secondary-text hover:text-primary-cta transition-colors"
                >
                  Contact School Setup
                </Link>
              </li>
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
