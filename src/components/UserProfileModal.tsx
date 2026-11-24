import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  X, 
  User, 
  Wallet, 
  Car, 
  Phone, 
  Mail, 
  PlusCircle, 
  Check, 
  CreditCard, 
  Shield, 
  Sparkles
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'wallet';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'profile',
}) => {
  const { currentUser, updateProfile, topUpWallet, role, switchRole } = useAuth();
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'profile' | 'wallet'>(defaultTab);

  // Profile Form state
  const [fullName, setFullName] = useState<string>(currentUser?.full_name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [vehiclePlate, setVehiclePlate] = useState<string>(currentUser?.vehicle_plate || '');
  const [vehicleModel, setVehicleModel] = useState<string>(currentUser?.vehicle_model || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Wallet topup state
  const [customTopupAmount, setCustomTopupAmount] = useState<string>('250');

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      vehicle_plate: vehiclePlate.trim().toUpperCase(),
      vehicle_model: vehicleModel.trim(),
    });
    setIsSaved(true);
    addToast('Profile Updated', 'Driver and vehicle details saved successfully.', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTopUp = (amount: number) => {
    if (isNaN(amount) || amount <= 0) return;
    topUpWallet(amount);
    addToast('Funds Added', `₹${amount.toFixed(2)} credited to your Cloud Wallet.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-14 -right-14 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-glow-cyan">
              <div className="w-full h-full bg-navy-950 rounded-[11px] flex items-center justify-center">
                {activeTab === 'profile' ? (
                  <User className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Wallet className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {activeTab === 'profile' ? 'Driver Profile & Vehicle' : 'Smart Cloud Wallet'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {currentUser.email} • Role: {currentUser.role.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="mt-4 flex items-center gap-2 p-1 bg-navy-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Vehicle</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'wallet'
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Cloud Wallet (₹{currentUser.wallet_balance.toFixed(2)})</span>
          </button>
        </div>

        {/* Tab 1: Profile View */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-navy-900 border border-slate-800 focus:border-cyan-400 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Registered Plate
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                    className="w-full bg-navy-900 border border-slate-800 focus:border-cyan-400 text-xs font-mono text-cyan-300 font-bold rounded-xl pl-9 pr-3 py-2.5 outline-none tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-navy-900 border border-slate-800 focus:border-cyan-400 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Vehicle Make / Model
              </label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Tesla Model 3 / BMW i4"
                className="w-full bg-navy-900 border border-slate-800 focus:border-cyan-400 text-xs text-white rounded-xl px-3 py-2.5 outline-none font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Data saved across sessions in LocalStorage & Supabase
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan"
              >
                {isSaved ? <Check className="w-4 h-4" /> : null}
                <span>{isSaved ? 'Saved!' : 'Save Details'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Wallet View */}
        {activeTab === 'wallet' && (
          <div className="mt-5 space-y-5">
            {/* Balance Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-navy-900 border border-emerald-500/40 shadow-glow-emerald flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                  AVAILABLE CLOUD CREDITS
                </span>
                <span className="text-3xl font-extrabold font-mono text-white mt-1 block">
                  ₹{currentUser.wallet_balance.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Instant contactless barrier deduction
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Wallet className="w-8 h-8" />
              </div>
            </div>

            {/* Quick Top Up Options */}
            <div>
              <span className="text-xs font-mono text-slate-300 uppercase block mb-2">
                Instant Top-Up Options (Simulated INR)
              </span>

              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleTopUp(amt)}
                    className="py-2.5 rounded-xl bg-navy-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-300 font-mono font-bold text-xs transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <span>+₹{amt}</span>
                    <span className="text-[9px] text-slate-400 font-normal">ADD</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Form */}
            <div className="p-3.5 rounded-2xl bg-navy-900/60 border border-slate-800">
              <label className="text-xs font-mono text-slate-300 uppercase block mb-1.5">
                Custom Amount (₹)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={customTopupAmount}
                    onChange={(e) => setCustomTopupAmount(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-800 text-xs font-mono text-white rounded-xl pl-7 pr-3 py-2 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleTopUp(Number(customTopupAmount))}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs font-mono shadow-glow-emerald transition-all"
                >
                  Deposit
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
