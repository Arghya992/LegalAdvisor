import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FUTURE_ITEMS } from '@/data/legalData';
import { getIcon } from '@/utils/icons';

gsap.registerPlugin(ScrollTrigger);

export default function FutureScope() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.future-heading', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.future-heading',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.utils.toArray<HTMLElement>('.future-item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: i * 0.05,
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="section-label mb-6 text-center">Future Scope</p>
        <h2 className="future-heading editorial-heading text-4xl sm:text-5xl md:text-6xl text-center mb-20 text-balance">
          Where legal intelligence
          <br />
          goes <span className="italic text-bronze-300">next.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-600">
          {FUTURE_ITEMS.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={item.id}
                className="future-item bg-ink-800 p-8 group hover:bg-ink-700 transition-colors duration-300"
              >
                <Icon className="w-6 h-6 text-bronze-400 mb-5" strokeWidth={1.5} />
                <h3 className="font-serif text-lg text-ivory mb-3 group-hover:text-bronze-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-ivory-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
