import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DISCLAIMER } from '@/data/legalData';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/legal-advisor');
    } catch {
      setError('Unable to sign in. Please check your credentials.');
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
          <p className="eyebrow mb-3">Sign In</p>
          <h1 className="font-serif text-3xl text-ivory mb-2">Welcome back.</h1>
          <p className="text-sm text-ivory-muted mb-8">
            Access your legal consultations and study materials.
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
                placeholder="Enter your password"
                className="input-field"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/register" className="text-ivory-muted hover:text-bronze-300 transition-colors">
              Create an account
            </Link>
            <button className="text-ivory-muted hover:text-bronze-300 transition-colors">
              Forgot password?
            </button>
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-label text-ivory-muted/60 text-center mt-6 max-w-sm mx-auto leading-relaxed">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
