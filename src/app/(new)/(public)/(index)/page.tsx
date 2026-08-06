import Hero from './hero';
import VirtualLabs from './virtual-labs';
import HowItWorks from './how-it-works';

export const metadata = {
  title: 'OpenLearn — Interactive Science Labs for Ghana',
  description:
    'Access free, curriculum-aligned 3D science simulations verified by the Ghana Education Service (GES). Play immediately in your browser—no login required.',
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Hero />
      <VirtualLabs />
      <HowItWorks />
    </div>
  );
}
