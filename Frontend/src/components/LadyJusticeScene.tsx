import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LADY_JUSTICE_IMG = '/lady-justice.jpg';

export default function LadyJusticeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      if (imgRef.current) {
        imgRef.current.style.opacity = '0.4';
        imgRef.current.style.filter = 'brightness(0.55)';
      }
      if (overlayRef.current) overlayRef.current.style.opacity = '0.4';
      if (vignetteRef.current) vignetteRef.current.style.opacity = '0.35';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(imgRef.current, {
        opacity: 0.35,
        scale: 1.05,
        y: 0,
        filter: 'brightness(0.45) blur(1px)',
      });
      gsap.set(overlayRef.current, { opacity: 0.45 });
      gsap.set(vignetteRef.current, { opacity: 0.4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      tl.to(imgRef.current, {
        opacity: 0.42,
        scale: 1.03,
        y: 15,
        filter: 'brightness(0.55) blur(0px)',
      }, 0)
        .to(imgRef.current, {
          opacity: 0.48,
          scale: 1.0,
          y: 30,
          filter: 'brightness(0.65) blur(0px)',
        }, 0.5)
        .to(imgRef.current, {
          opacity: 0.5,
          scale: 0.97,
          y: 50,
          filter: 'brightness(0.7) blur(0px)',
        }, 1);

      tl.to(overlayRef.current, { opacity: 0.35 }, 0)
        .to(overlayRef.current, { opacity: 0.25 }, 0.5)
        .to(overlayRef.current, { opacity: 0.2 }, 1);

      tl.to(vignetteRef.current, { opacity: 0.3 }, 0)
        .to(vignetteRef.current, { opacity: 0.2 }, 1);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <img
        ref={imgRef}
        src={LADY_JUSTICE_IMG}
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'contain',
          objectPosition: 'center center',
        }}
      />
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/30 to-ink-900/70"
      />
      <div
        ref={vignetteRef}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 15%, rgba(11,13,14,0.7) 100%)',
        }}
      />
      <div className="absolute inset-0 grain" />
    </div>
  );
}
