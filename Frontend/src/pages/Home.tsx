import Hero from '@/components/Hero';
import LadyJusticeScene from '@/components/LadyJusticeScene';
import ProblemSection from '@/components/ProblemSection';
import AdvisorIntro from '@/components/AdvisorIntro';
import LegalExplanation from '@/components/LegalExplanation';
import StudentSection from '@/components/StudentSection';
import ResourcesSection from '@/components/ResourcesSection';
import KnowledgePipeline from '@/components/KnowledgePipeline';
import TrustSection from '@/components/TrustSection';
import FutureScope from '@/components/FutureScope';

export default function Home() {
  return (
    <div className="relative">
      <LadyJusticeScene />
      <div className="relative z-10">
        <Hero />
        <ProblemSection />
        <AdvisorIntro />
        <LegalExplanation />
        <StudentSection />
        <ResourcesSection />
        <KnowledgePipeline />
        <TrustSection />
        <FutureScope />
      </div>
    </div>
  );
}
