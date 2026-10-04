import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Legal Advisor', path: '/legal-advisor' },
  { label: 'Law Students', path: '/law-students' },
  { label: 'Legal Resources', path: '/legal-resources' },
  { label: 'How It Works', path: '/#how-it-works' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink-900/85 backdrop-blur-md border-b border-ink-600'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-14' : 'h-20'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <Scale className="w-5 h-5 text-bronze-400 transition-colors duration-300 group-hover:text-bronze-300" />
            <span className="font-serif text-lg tracking-wide text-ivory">
              AI Legal Advisor
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="px-4 py-2 text-[13px] text-ivory/80 hover:text-bronze-300 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-[13px] text-ivory-muted">Signed in</span>
                <button
                  onClick={logout}
                  className="btn-ghost text-[13px]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-[12px] px-5 py-2.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-ivory"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-ink-900/95 backdrop-blur-md border-t border-ink-600">
          <div className="px-5 py-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="block py-3 text-sm text-ivory/80 hover:text-bronze-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-ink-600 flex flex-col gap-3">
              {isAuthenticated ? (
                <button onClick={logout} className="btn-secondary w-full">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary w-full">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
