import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' })
        .from('.hero-heading-line', { opacity: 0, y: 40, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.3')
        .from('.hero-description', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.4')
        .from('.hero-cta', { opacity: 0, y: 16, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '-=0.3')
        .from('.hero-scroll', { opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.2');
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="hero-eyebrow eyebrow mb-8">AI-Powered Legal Assistance</p>

        <h1 className="editorial-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 text-balance">
          <span className="hero-heading-line block">Understand the law.</span>
          <span className="hero-heading-line block italic text-bronze-300">Know your rights.</span>
        </h1>

        <p className="hero-description text-base sm:text-lg text-ivory/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Ask legal questions in natural language, explore relevant legal information,
          and understand complex provisions in clear language.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/legal-advisor" className="hero-cta btn-primary group">
            Ask the Legal Advisor
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link to="/legal-resources" className="hero-cta btn-secondary">
            Explore Legal Resources
          </Link>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-wide-label text-ivory-muted">Scroll to discover</span>
        <ChevronDown className="w-4 h-4 text-ivory-muted animate-bounce" style={{ animationDuration: '2s' }} />
      </div>
    </section>
  );
}
