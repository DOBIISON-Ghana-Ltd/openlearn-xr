import Hero from './hero'
import HowItWorks from './how-it-works'
import Features from './features'
import Audience from './audience'
import Modules from './modules'
import Gamification from './gamification'
import CTA from './cta'

export const metadata = {
  title: 'OpenLearn — AI-Powered 3D Virtual Science Labs',
  description:
    'Turn any curriculum into interactive 3D simulations. Host live sessions, track student progress, and make science unforgettable.',
}

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Features />
      <Audience />
      <Modules />
      <Gamification />
      <CTA />
    </div>
  )
}
