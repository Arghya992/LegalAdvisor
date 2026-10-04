import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function StudentSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.student-content', {
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
      <div className="student-content mx-auto max-w-4xl text-center">
        <p className="section-label mb-6">For Law Students</p>
        <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl mb-8 text-balance">
          Built for those who study the law.
        </h2>
        <p className="text-lg text-ivory/70 mb-4 max-w-xl mx-auto leading-relaxed font-light">
          Learn faster. Understand deeper. Revise smarter.
        </p>
        <p className="text-base text-ivory-muted mb-12 max-w-2xl mx-auto leading-relaxed">
          A dedicated study environment with case summarizers, provision explainers,
          flashcards, quiz generators, and a case law explorer — designed for serious
          legal study, not gamified distraction.
        </p>
        <Link to="/law-students" className="btn-primary group">
          Explore Student Tools
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
