import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROVISION_TEXT =
  'Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property in violation of any direction of law prescribing the mode in which such trust is to be discharged, or of any legal contract, is said to commit criminal breach of trust.';

export default function LegalExplanation() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.explain-step');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );
      });

      gsap.from('.explain-heading', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.explain-heading',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="section-label mb-6 text-center">The Transformation</p>
        <h2 className="explain-heading editorial-heading text-4xl sm:text-5xl md:text-6xl text-center mb-24 text-balance">
          From legal language
          <br />
          to <span className="italic text-bronze-300">clear understanding.</span>
        </h2>

        <div className="space-y-32">
          <div className="explain-step">
            <p className="eyebrow mb-4">Legal Provision</p>
            <div className="border-l-2 border-ink-500 pl-6">
              <p className="font-serif text-xl sm:text-2xl text-ivory/80 leading-relaxed italic">
                {PROVISION_TEXT}
              </p>
              <p className="text-xs text-ivory-muted mt-4 uppercase tracking-label">
                Demo provision — illustrative example
              </p>
            </div>
          </div>

          <div className="explain-step">
            <p className="eyebrow mb-4">What It Means</p>
            <div className="border-l-2 border-bronze-500/50 pl-6">
              <p className="font-serif text-2xl sm:text-3xl text-ivory leading-relaxed">
                If someone is trusted with property or money and they dishonestly use
                it for themselves — instead of how they were supposed to — that is
                called criminal breach of trust.
              </p>
            </div>
          </div>

          <div className="explain-step">
            <p className="eyebrow mb-4">In Simple Language</p>
            <div className="border-l-2 border-bronze-400/60 pl-6">
              <p className="text-lg sm:text-xl text-ivory/90 leading-relaxed">
                Imagine a person is given money to hold or deliver somewhere. If they
                keep it or spend it for their own benefit, instead of doing what they
                were trusted to do, the law treats this as a serious offence. The key
                element is dishonesty — using the property in a way that breaks the
                trust placed in them.
              </p>
            </div>
          </div>

          <div className="explain-step">
            <p className="eyebrow mb-4">What You May Consider Doing</p>
            <div className="border-l-2 border-bronze-300/70 pl-6">
              <ul className="space-y-4 text-ivory/90">
                <li className="flex gap-3">
                  <span className="text-bronze-400 mt-1">—</span>
                  <span>Document the original agreement or arrangement that established the trust.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-bronze-400 mt-1">—</span>
                  <span>Gather evidence showing how the property was misused or converted.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-bronze-400 mt-1">—</span>
                  <span>File a formal complaint with the appropriate authority.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-bronze-400 mt-1">—</span>
                  <span>Consult a qualified legal professional to assess your specific situation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
