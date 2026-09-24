import ClientPage from './client';

export const metadata = {
  title: 'Teaching Library',
  description:
    'Browse curriculum-aligned SHS science lab modules, search by topic, and filter by subject or year group.',
};

export default async function Page() {

  return <ClientPage />;
}
