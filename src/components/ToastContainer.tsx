import React from 'react';
import { useNotifications, ToastMessage } from '../context/NotificationContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, Radio, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  const getToastIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'sensor':
        return <Radio className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/40 shadow-glow-emerald';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/40 shadow-glow-amber';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/40 shadow-glow-rose';
      case 'sensor':
        return 'border-cyan-500/40 bg-cyan-950/40 shadow-glow-cyan';
      default:
        return 'border-cyan-500/40 bg-navy-900/80 shadow-glow-cyan';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${getBorderColor(
            toast.type
          )}`}
        >
          {getToastIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              {toast.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
