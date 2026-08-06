import Header from '@/components/(new)/common/header';
import { TeachingSidebar } from './sidebar';

export default function TeachingGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="mx-auto w-full max-w-[1440px] flex flex-col md:flex-row flex-1 min-h-[850px]">
        <TeachingSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
