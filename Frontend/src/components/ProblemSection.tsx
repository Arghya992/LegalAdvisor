import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROBLEMS } from '@/data/legalData';

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.problem-item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1,
          },
          delay: i * 0.05,
        });
      });

      gsap.from('.problem-heading', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.problem-heading',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="section-label mb-6 text-center">The Challenge</p>
        <h2 className="problem-heading editorial-heading text-4xl sm:text-5xl md:text-6xl text-center mb-20 text-balance">
          The law is complex.
          <br />
          <span className="italic text-bronze-300">Understanding it shouldn't be.</span>
        </h2>

        <div className="space-y-16">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.number}
              className="problem-item grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 max-w-3xl mx-auto"
            >
              <span className="font-serif text-5xl text-bronze-500/60 leading-none">
                {problem.number}
              </span>
              <div>
                <h3 className="font-serif text-2xl text-ivory mb-3 uppercase tracking-wide text-[15px] tracking-label">
                  {problem.title}
                </h3>
                <p className="text-ivory-muted leading-relaxed text-base max-w-xl">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
