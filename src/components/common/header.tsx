import Link from 'next/link';
import { PATHS } from '@/lib/constants/paths';
import { Logo } from './logo';
import HeaderProfile from './header-profile';

const NAV_ITEMS = [
  { label: 'Simulations', href: PATHS.MODULES },
  { label: 'Teaching', href: PATHS.TEACHING.ROOT },
  { label: 'Licensing', href: PATHS.LICENSING },
] as const;

export interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full h-20 bg-surface-white flex items-center">
      <div className="mx-auto flex size-full max-w-8xl items-center justify-between px-2 sm:px-6">
        <div className="flex items-center gap-6 lg:gap-10">
          <Logo />
          {children && <div className="hidden sm:block">{children}</div>}
        </div>

        {/* Right Column: Nav links & Sign in / Profile */}
        <div className="flex items-center gap-6 lg:gap-8">
          <nav className="hidden md:flex items-center gap-7.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-normal text-primary-text-dark hover:text-primary-cta transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <HeaderProfile />
        </div>
      </div>
    </header>
  );
};