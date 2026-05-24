import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import HeroSection from '@/components/home/HeroSection'
import ProductInsideSection from '@/components/home/ProductInsideSection'
import ProdutoSection from '@/components/home/ProdutoSection'
import ModulosSection from '@/components/home/ModulosSection'
import DashboardSection from '@/components/home/DashboardSection'
import BenefitsSection from '@/components/home/BenefitsSection'
import IntegracoesSection from '@/components/home/IntegracoesSection'
import CTASection from '@/components/home/CTASection'
import RevealScript from '@/components/home/RevealScript'

export default function HomePage() {
  return (
    <>
      {/* SVG Symbol defs — shared across page */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <radialGradient id="sunRG" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fde047" />
            <stop offset="0.6" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </radialGradient>
          <linearGradient id="waveG" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <symbol id="logoMark" viewBox="0 0 40 40">
            <circle cx="20" cy="16" r="6.5" fill="url(#sunRG)" />
            <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <line x1="20" y1="3" x2="20" y2="6.5" />
              <line x1="20" y1="25.5" x2="20" y2="28.5" />
              <line x1="6" y1="16" x2="9" y2="16" />
              <line x1="31" y1="16" x2="34" y2="16" />
              <line x1="10" y1="6" x2="12" y2="8" />
              <line x1="28" y1="6" x2="26" y2="8" />
            </g>
            <path d="M2 32 Q8 26 14 32 T26 32 T38 32" fill="none" stroke="url(#waveG)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </symbol>
        </defs>
      </svg>

      <a id="top" />
      <Navbar />
      <HeroSection />
      <ProductInsideSection />
      <ProdutoSection />
      <ModulosSection />
      <DashboardSection />
      <BenefitsSection />
      <IntegracoesSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
      <RevealScript />
    </>
  )
}
