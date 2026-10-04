import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRINCIPLES } from '@/data/legalData';
import { getIcon } from '@/utils/icons';

gsap.registerPlugin(ScrollTrigger);

export default function TrustSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.trust-heading', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.trust-heading',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.trust-principle', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.trust-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="section-label mb-6 text-center">Trust & Responsibility</p>
        <h2 className="trust-heading editorial-heading text-4xl sm:text-5xl md:text-6xl text-center mb-20 text-balance">
          Built around clarity
          <br />
          and <span className="italic text-bronze-300">responsibility.</span>
        </h2>

        <div className="trust-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRINCIPLES.map((principle) => {
            const Icon = getIcon(principle.icon);
            return (
              <div
                key={principle.title}
                className="trust-principle text-center border-t border-ink-500 pt-8"
              >
                <Icon className="w-7 h-7 text-bronze-400 mx-auto mb-6" strokeWidth={1.5} />
                <h3 className="font-serif text-xl text-ivory mb-4 uppercase tracking-label text-[12px] tracking-wide-label">
                  {principle.title}
                </h3>
                <p className="text-sm text-ivory-muted leading-relaxed">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
