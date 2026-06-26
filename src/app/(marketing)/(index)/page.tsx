import Hero from './hero'
import CurriculumModules from './curriculum-modules'
import Pricing from './pricing'

export const metadata = {
  title: 'OpenLearn — Interactive Science Labs for Ghana',
  description:
    'Access free, curriculum-aligned 3D science simulations verified by the Ghana Education Service (GES). Play immediately in your browser—no login required.',
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CurriculumModules />
      <Pricing />
    </div>
  )
}
