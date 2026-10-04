import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PIPELINE_STEPS } from '@/data/legalData';

gsap.registerPlugin(ScrollTrigger);

export default function KnowledgePipeline() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.pipeline-heading', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pipeline-heading',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.utils.toArray<HTMLElement>('.pipeline-step').forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      });

      gsap.fromTo(
        '.pipeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 2,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: '.pipeline-steps',
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={rootRef} className="relative py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="section-label mb-6 text-center">How It Works</p>
        <h2 className="pipeline-heading editorial-heading text-4xl sm:text-5xl md:text-6xl text-center mb-24 text-balance">
          From question
          <br />
          to <span className="italic text-bronze-300">legal guidance.</span>
        </h2>

        <div className="pipeline-steps relative pl-12 sm:pl-16">
          <div className="pipeline-line absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-bronze-500/60 via-bronze-500/30 to-transparent" />

          <div className="space-y-16">
            {PIPELINE_STEPS.map((step) => (
              <div key={step.id} className="pipeline-step relative">
                <div className="absolute -left-12 sm:-left-16 top-0 flex items-center justify-center w-8 h-8 border border-bronze-500/50 bg-ink-900">
                  <span className="text-[10px] text-bronze-300 font-medium">{step.number}</span>
                </div>
                <h3 className="font-serif text-2xl text-ivory mb-3 uppercase tracking-label text-[13px] tracking-wide-label">
                  {step.label}
                </h3>
                <p className="text-ivory-muted leading-relaxed max-w-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
