import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Logo } from './logo';

export interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full h-[101px] backdrop-blur-[5px] bg-white/90 transition-all flex items-center',
        className
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6 sm:px-12 lg:px-20">
        {/* Left Column: 1st element = Logo, 2nd element = children (Search in public routes) */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Logo />
          {children && <div className="hidden sm:block">{children}</div>}
        </div>

        {/* Right Column: Nav links & Sign in button */}
        <div className="flex items-center gap-6 lg:gap-8">
          <nav className="hidden md:flex items-center gap-7.5">
            <Link
              href="/modules"
              className="text-base font-normal text-black hover:text-[#459d9f] transition-colors"
            >
              Simulations
            </Link>
            <Link
              href="/teaching"
              className="text-base font-normal text-black hover:text-[#459d9f] transition-colors"
            >
              Teaching
            </Link>
            <Link
              href="/licensing"
              className="text-base font-normal text-black hover:text-[#459d9f] transition-colors"
            >
              Licensing
            </Link>
          </nav>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center bg-[#459d9f] hover:bg-[#3b8789] text-[#f8fafc] text-[18px] font-semibold px-[20px] py-[10px] rounded-[10px] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

