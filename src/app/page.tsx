import HeroSection from '@/components/home/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TheoryPreviewSection from '@/components/home/TheoryPreviewSection';
import AudienceSection from '@/components/home/AudienceSection';
import ProgressPreviewSection from '@/components/home/ProgressPreviewSection';
import TrustSection from '@/components/home/TrustSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TheoryPreviewSection />
      <AudienceSection />
      <ProgressPreviewSection />
      <TrustSection />
      <CTASection />
    </>
  );
}
