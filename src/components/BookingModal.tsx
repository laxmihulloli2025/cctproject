import React, { useState } from 'react';
import { ParkingSlot, VehicleType, PaymentMethod, Booking } from '../types';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Car, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Radio, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  slot: ParkingSlot | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  onOpenWallet: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  slot,
  onClose,
  onBookingSuccess,
  onOpenWallet,
}) => {
  const { reserveSlot } = useParking();
  const { currentUser } = useAuth();

  const [vehiclePlate, setVehiclePlate] = useState<string>(currentUser?.vehicle_plate || 'CYBER-779');
  const [vehicleType, setVehicleType] = useState<VehicleType>('EV');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [evCharging, setEvCharging] = useState<boolean>(slot?.type === 'ev_charging');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cloud Wallet');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!slot) return null;

  // Price calculations
  const baseRate = slot.hourly_rate;
  const evFeePerHour = evCharging ? 25.00 : 0;
  const totalHourly = baseRate + evFeePerHour;
  const subtotal = totalHourly * durationHours;
  const cloudFee = 0.00;
  const totalAmount = Number((subtotal + cloudFee).toFixed(2));

  const hasInsufficientWallet: boolean = Boolean(
    paymentMethod === 'Cloud Wallet' && 
    currentUser && 
    currentUser.wallet_balance < totalAmount
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!vehiclePlate.trim()) {
      setErrorMessage('Please enter a vehicle license plate number.');
      return;
    }

    if (hasInsufficientWallet) {
      setErrorMessage(`Insufficient wallet balance (₹${currentUser?.wallet_balance.toFixed(2)}). Please top up or select credit card.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate realistic cloud edge latency (600ms)
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newBooking = await reserveSlot({
        slotId: slot.id,
        vehiclePlate: vehiclePlate.trim().toUpperCase(),
        vehicleType,
        durationHours,
        evCharging,
        paymentMethod,
      });

      if (newBooking) {
        onBookingSuccess(newBooking);
      } else {
        setErrorMessage('Failed to reserve slot. It may have just been taken by another driver.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon glow */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-cyan">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-[10px] text-cyan-400 font-mono font-bold">RESERVE</span>
                <span className="text-lg font-mono font-extrabold text-white">{slot.slot_number}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Smart Slot Reservation</h3>
              <p className="text-xs text-slate-400 font-mono">
                {slot.zone} • Level {slot.floor} Deck • ₹{slot.hourly_rate.toFixed(2)}/h base
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Vehicle Plate & Vehicle Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                License Plate Number *
              </label>
              <input
                type="text"
                required
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                placeholder="e.g. CYBER-779"
                className="w-full bg-navy-900 border border-slate-800 focus:border-cyan-400 text-sm font-mono text-white rounded-xl px-3.5 py-2.5 outline-none tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Vehicle Category
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full bg-navy-900 border border-slate-800 focus:border-cyan-400 text-sm font-mono text-white rounded-xl px-3.5 py-2.5 outline-none cursor-pointer"
              >
                <option value="Sedan">Sedan / Hatchback</option>
                <option value="SUV">SUV / Crossover</option>
                <option value="EV">Electric Vehicle (EV)</option>
                <option value="Motorcycle">Motorcycle</option>
              </select>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Expected Duration
              </label>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {durationHours} {durationHours === 1 ? 'Hour' : 'Hours'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 8].map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setDurationHours(h)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    durationHours === h
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-navy-950 shadow-glow-cyan'
                      : 'bg-navy-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* EV Charging Add-on Toggle (if slot supports EV or user chose EV) */}
          <div className="p-3.5 rounded-2xl bg-navy-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Fast EV Charging (22 kW DC)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    +₹25.00/h
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated smart charger plug-in session
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              id="evToggle"
              checked={evCharging}
              onChange={(e) => setEvCharging(e.target.checked)}
              className="w-5 h-5 accent-cyan-400 cursor-pointer rounded"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
              Simulated Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Cloud Wallet', label: 'Cloud Wallet', icon: Wallet },
                { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
                { id: 'Apple Pay', label: 'UPI / GPay', icon: Smartphone },
                { id: 'RFID Fastag', label: 'RFID Fastag', icon: Radio },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/50 shadow-glow-cyan'
                        : 'border-slate-800 bg-navy-900/60 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-semibold text-white block">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'Cloud Wallet' && currentUser && (
              <div className="mt-2 flex items-center justify-between text-xs font-mono px-2 py-1 bg-navy-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Available Wallet Balance:</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${currentUser.wallet_balance >= totalAmount ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{currentUser.wallet_balance.toFixed(2)}
                  </span>
                  {currentUser.wallet_balance < totalAmount && (
                    <button
                      type="button"
                      onClick={onOpenWallet}
                      className="text-[11px] text-cyan-400 underline font-bold"
                    >
                      +Topup
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Price Calculation Summary */}
          <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Parking ({durationHours}h × ₹{baseRate.toFixed(2)}):</span>
              <span>₹{(baseRate * durationHours).toFixed(2)}</span>
            </div>

            {evCharging && (
              <div className="flex items-center justify-between text-slate-400">
                <span>EV Charging ({durationHours}h × ₹25.00):</span>
                <span>₹{(25.00 * durationHours).toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-400">
              <span>Cloud Edge Service Fee:</span>
              <span className="text-emerald-400">FREE (₹0.00 waived)</span>
            </div>

            <div className="border-t border-slate-800 my-1 pt-1.5 flex items-center justify-between text-sm font-bold text-white">
              <span>Estimated Total Due:</span>
              <span className="text-lg text-emerald-400 font-extrabold">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || hasInsufficientWallet}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-navy-950 font-extrabold text-xs shadow-glow-cyan hover:shadow-glow-cyan-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing Cloud Ingestion...</span>
                </>
              ) : (
                <>
                  <span>Confirm Reservation (₹{totalAmount.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
