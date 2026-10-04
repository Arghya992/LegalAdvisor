import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { RESOURCE_CATEGORIES } from '@/data/legalData';

gsap.registerPlugin(ScrollTrigger);

export default function ResourcesSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.resource-content', {
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

      gsap.from('.resource-cat', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.resource-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="resource-content text-center mb-16">
          <p className="section-label mb-6">Legal Resources</p>
          <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl mb-6 text-balance">
            Your legal reference library.
          </h2>
          <p className="text-base text-ivory-muted max-w-xl mx-auto">
            Browse acts, statutes, constitutional provisions, legal procedures, and a
            plain-language glossary — all in one structured reference.
          </p>
        </div>

        <div className="resource-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {RESOURCE_CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              to={`/legal-resources?category=${cat.id}`}
              className="resource-cat card-surface p-5 hover:border-bronze-500/50 group"
            >
              <p className="font-serif text-lg text-ivory mb-2 group-hover:text-bronze-300 transition-colors">
                {cat.name}
              </p>
              <p className="text-xs text-ivory-muted">{cat.count} items</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/legal-resources" className="btn-secondary group">
            Browse All Resources
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
