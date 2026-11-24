import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';
import { 
  X, 
  Car, 
  Shield, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Server, 
  CheckCircle2 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAsDemoUser, loginAsDemoAdmin, loginWithCredentials, isSupabaseMode } = useAuth();
  const { addToast } = useNotifications();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDemoDriver = () => {
    loginAsDemoUser();
    addToast('Logged In as Driver', 'Welcome back, Alex Mercer.', 'success');
    onSuccess();
    onClose();
  };

  const handleDemoAdmin = () => {
    loginAsDemoAdmin();
    addToast('Admin Access Granted', 'Supervisor Dr. Elena Vance authenticated.', 'success');
    onSuccess();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await loginWithCredentials(email, selectedRole);
      addToast('Authenticated', `Signed in as ${email}`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast('Auth Error', err.message || 'Failed to authenticate', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-white">SmartPark Authentication</h3>
            <p className="text-xs text-slate-400 font-mono">
              {isSupabaseMode ? 'Supabase PostgreSQL Auth' : 'Zero-Config Cloud Demo Session'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Login Cards (Perfect for College Presentation!) */}
        <div className="mt-5 space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
            Instant 1-Click Demo Profiles (Presentation Mode):
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDemoDriver}
              className="p-3 rounded-2xl bg-navy-900 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 transition-all text-left flex flex-col justify-between group shadow-glow-cyan/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Car className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  DRIVER
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Alex Mercer</span>
                <span className="text-[10px] text-slate-400 font-mono block">Nexon EV • ₹550</span>
              </div>
            </button>

            <button
              onClick={handleDemoAdmin}
              className="p-3 rounded-2xl bg-navy-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 transition-all text-left flex flex-col justify-between group shadow-glow-emerald/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  ADMIN
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Dr. Elena Vance</span>
                <span className="text-[10px] text-slate-400 font-mono block">Full IoT Oversight</span>
              </div>
            </button>
          </div>
        </div>

        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-navy-950 px-3 text-[10px] uppercase font-mono text-slate-500">
            or sign in with email
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Role selector */}
          <div className="flex items-center gap-2 p-1 bg-navy-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                selectedRole === 'user'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400'
              }`}
            >
              Driver Role
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                selectedRole === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400'
              }`}
            >
              Cloud Admin Role
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'admin@smartpark.cloud' : 'driver@smartpark.io'}
                className="w-full bg-navy-900 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none font-mono focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-900 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none font-mono focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-navy-950 font-bold text-xs font-mono shadow-glow-cyan transition-all flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Create Cloud Account' : 'Authenticate Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
