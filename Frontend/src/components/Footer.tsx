import { Link } from 'react-router-dom';
import { Scale, ArrowUpRight } from 'lucide-react';
import { DISCLAIMER } from '@/data/legalData';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Legal Advisor', path: '/legal-advisor' },
  { label: 'Law Students', path: '/law-students' },
  { label: 'Legal Resources', path: '/legal-resources' },
  { label: 'How It Works', path: '/#how-it-works' },
];

const LEGAL_LINKS = [
  { label: 'Privacy', path: '/#privacy' },
  { label: 'Terms', path: '/#terms' },
  { label: 'Disclaimer', path: '/#disclaimer' },
];

export default function Footer() {
  return (
    <footer className="bg-ink-800 border-t border-ink-600">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <Scale className="w-5 h-5 text-bronze-400" />
              <span className="font-serif text-lg text-ivory">AI Legal Advisor</span>
            </div>
            <p className="font-serif text-xl text-ivory/90 leading-snug italic">
              Understand the law.
              <br />
              Know your rights.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-ivory-muted hover:text-bronze-300 transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Legal</p>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-ivory-muted hover:text-bronze-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Contact</p>
            <ul className="space-y-3">
              <li className="text-sm text-ivory-muted">contact@ailegaladvisor.example</li>
              <li className="text-sm text-ivory-muted">Mon — Fri, 9:00 — 18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-ink-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-ivory-muted max-w-2xl leading-relaxed">
              {DISCLAIMER}
            </p>
            <p className="text-xs text-ivory-muted whitespace-nowrap">
              © {new Date().getFullYear()} AI Legal Advisor
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
