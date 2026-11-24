import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Radio, 
  Car, 
  ShieldAlert, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'check_in':
      case 'check_out':
        return <Car className="w-4 h-4 text-emerald-400" />;
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'system':
        return <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-navy-900 border border-slate-800 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Cloud Notification Stream</h3>
              <p className="text-xs text-slate-400 font-mono">
                {unreadCount} unread realtime alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-cyan-400 text-xs flex items-center gap-1 font-mono px-2.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 overflow-y-auto space-y-2.5 flex-1 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-mono">No notifications in your stream.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-navy-900/40 border-slate-800/80 text-slate-400'
                    : 'bg-navy-900 border-cyan-500/30 text-white shadow-glow-cyan/50'
                }`}
              >
                <div className="p-2 rounded-xl bg-navy-950 border border-slate-800 shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {n.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 font-mono shrink-0">
            <span>Synchronized with Supabase Realtime</span>
            <button
              onClick={clearNotifications}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Feed</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
