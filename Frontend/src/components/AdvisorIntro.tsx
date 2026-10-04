import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AdvisorIntro() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.advisor-intro-content', {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-32 px-5 sm:px-8">
      <div className="advisor-intro-content mx-auto max-w-3xl text-center">
        <p className="section-label mb-6">The Legal Advisor</p>
        <h2 className="editorial-heading text-5xl sm:text-6xl md:text-7xl mb-8 text-balance">
          Ask the law.
        </h2>
        <p className="text-lg text-ivory/70 mb-12 max-w-xl mx-auto leading-relaxed font-light">
          Describe your legal question in your own words. The system identifies the
          relevant legal area, retrieves applicable provisions, and explains them in
          clear, understandable language.
        </p>
        <Link to="/legal-advisor" className="btn-primary group">
          Start a Consultation
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
