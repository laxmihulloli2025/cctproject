import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER, INITIAL_ADMIN } from '../lib/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isSupabaseMode: boolean;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  loginWithCredentials: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  topUpWallet: (amount: number) => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('smartpark_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [isSupabaseMode] = useState<boolean>(isSupabaseConfigured);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smartpark_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('smartpark_user');
    }
  }, [currentUser]);

  // If Supabase is configured, listen to auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch or create profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser(profile);
        } else {
          // Fallback profile
          const newProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || 'user@smartpark.io',
            full_name: session.user.user_metadata?.full_name || 'Cloud Driver',
            role: session.user.user_metadata?.role || 'user',
            wallet_balance: 500.00,
            vehicle_plate: 'KA-01-EQ-7799',
            vehicle_model: 'Tata Nexon EV Max',
          };
          setCurrentUser(newProfile);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginAsDemoUser = () => {
    setCurrentUser(INITIAL_USER);
  };

  const loginAsDemoAdmin = () => {
    setCurrentUser(INITIAL_ADMIN);
  };

  const loginWithCredentials = async (email: string, chosenRole: UserRole = 'user'): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        // Attempt sign in with OTP or demo password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!',
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Supabase auth fallback to demo session:', err);
      }
    }

    // Demo Mode login fallback
    if (chosenRole === 'admin' || email.toLowerCase().includes('admin')) {
      setCurrentUser({
        ...INITIAL_ADMIN,
        email: email || INITIAL_ADMIN.email,
      });
    } else {
      setCurrentUser({
        ...INITIAL_USER,
        email: email || INITIAL_USER.email,
        full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      });
    }
    return true;
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(console.error);
    }
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (isSupabaseConfigured) {
        supabase.from('profiles').update(updates).eq('id', prev.id).then();
      }
      return updated;
    });
  };

  const topUpWallet = (amount: number) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const newBalance = Number((prev.wallet_balance + amount).toFixed(2));
      const updated = { ...prev, wallet_balance: newBalance };
      if (isSupabaseConfigured) {
        supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', prev.id).then();
      }
      return updated;
    });
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setCurrentUser(INITIAL_ADMIN);
    } else {
      setCurrentUser(INITIAL_USER);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'user',
        isAuthenticated: !!currentUser,
        isSupabaseMode,
        loginAsDemoUser,
        loginAsDemoAdmin,
        loginWithCredentials,
        logout,
        updateProfile,
        topUpWallet,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
