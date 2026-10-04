import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DISCLAIMER } from '@/data/legalData';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/legal-advisor');
    } catch {
      setError('Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-14 min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-12">
          <Scale className="w-6 h-6 text-bronze-400" />
          <span className="font-serif text-xl text-ivory">AI Legal Advisor</span>
        </Link>

        <div className="border border-ink-600 bg-ink-800/50 p-8 sm:p-10">
          <p className="eyebrow mb-3">Create Account</p>
          <h1 className="font-serif text-3xl text-ivory mb-2">Get started.</h1>
          <p className="text-sm text-ivory-muted mb-8">
            Access AI-powered legal information and study tools.
          </p>

          {error && (
            <div className="flex items-center gap-2 border border-red-900/50 bg-red-950/30 px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-label text-ivory-muted mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-field"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-label text-ivory-muted mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-label text-ivory-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="input-field"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-label text-ivory-muted mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-ivory-muted hover:text-bronze-300 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-label text-ivory-muted/60 text-center mt-6 max-w-sm mx-auto leading-relaxed">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
