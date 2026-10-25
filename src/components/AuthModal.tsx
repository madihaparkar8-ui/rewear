import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Lock, Mail, User as UserIcon, MapPin, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        await signup({
          name: name.trim(),
          email: email.trim(),
          password,
          location: location.trim(),
        });
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      // All demo seed accounts use password "rewear2026"
      await login(demoEmail, 'rewear2026');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E9E1D5] max-w-md w-full shadow-2xl relative p-6 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F8F6F0] text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center pb-4">
          <div className="w-9 h-9 rounded-full bg-[#24483D] text-[#F8F6F0] flex items-center justify-center font-serif text-lg font-bold mx-auto mb-2">
            R
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#24483D]">
            {mode === 'login' ? 'Welcome Back to ReWear' : 'Join the ReWear Wardrobe'}
          </h3>
          <p className="text-xs text-[#262A27]/70 mt-1">
            {mode === 'login'
              ? 'Sign in to manage your swaps and listed garments'
              : 'Start exchanging pre-loved pieces with our circular community'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E9E1D5] mb-5">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
              mode === 'login'
                ? 'border-[#24483D] text-[#24483D]'
                : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
              mode === 'signup'
                ? 'border-[#24483D] text-[#24483D]'
                : 'border-transparent text-[#262A27]/60 hover:text-[#262A27]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#24483D] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#24483D] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-[#24483D] mb-1">City & Country</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or London, UK"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E9E1D5] bg-white focus:outline-none focus:ring-1 focus:ring-[#24483D]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#24483D] hover:bg-[#1a342c] rounded-md transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log In to Wardrobe' : 'Create Free Account'}
          </button>
        </form>

        {/* Quick Demo Sign In Box */}
        <div className="mt-5 pt-4 border-t border-[#E9E1D5]">
          <p className="text-[11px] font-medium text-[#24483D] flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3 h-3 text-[#C77D62]" />
            <span>Instant Demo Accounts (One-Click Sign In):</span>
          </p>

          <div className="grid grid-cols-1 gap-1.5 text-left text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('madihaparkar8@gmail.com')}
              className="p-2 rounded border border-[#E9E1D5] hover:border-[#24483D] hover:bg-[#24483D]/5 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-[#24483D]">Madiha Parkar (Admin)</span>
                <span className="text-[10px] text-gray-500 block">madihaparkar8@gmail.com</span>
              </div>
              <span className="text-[10px] text-[#24483D] font-semibold bg-[#A8B8A0]/20 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('clara.moreau@example.com')}
              className="p-2 rounded border border-[#E9E1D5] hover:border-[#24483D] hover:bg-[#24483D]/5 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-[#24483D]">Clara Moreau (Member, Paris)</span>
                <span className="text-[10px] text-gray-500 block">clara.moreau@example.com</span>
              </div>
              <span className="text-[10px] text-gray-500">Member</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('soren.lind@example.com')}
              className="p-2 rounded border border-[#E9E1D5] hover:border-[#24483D] hover:bg-[#24483D]/5 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold text-[#24483D]">Soren Lind (Member, Copenhagen)</span>
                <span className="text-[10px] text-gray-500 block">soren.lind@example.com</span>
              </div>
              <span className="text-[10px] text-gray-500">Member</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
