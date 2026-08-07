import Header from '@/components/(new)/common/header';
import { HeaderSearch } from '@/components/(new)/common/header-search';
import Footer from '@/components/(new)/common/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-white">
      <Header>
        <HeaderSearch />
      </Header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
