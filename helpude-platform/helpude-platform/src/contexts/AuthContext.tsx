import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  checkLevelUpgrade: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuário para demonstração
const mockUser: User = {
  id: '1',
  email: 'clinica@exemplo.com',
  name: 'Dr. João Silva',
  cnpj: '12.345.678/0001-90',
  clinicName: 'Clínica Saúde Total',
  level: 1,
  consultasUsadas: 23,
  consultasLimite: 50,
  createdAt: new Date('2024-01-15'),
  phone: '(11) 99999-9999',
  whatsappConnected: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simula verificação de sessão
    const checkAuth = () => {
      const savedUser = localStorage.getItem('helpude_user');
      if (savedUser) {
        setState({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    setTimeout(checkAuth, 500);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simula chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para demonstração, aceita qualquer login
    if (email && password) {
      const user = { ...mockUser, email };
      localStorage.setItem('helpude_user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('helpude_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...data };
      localStorage.setItem('helpude_user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  const checkLevelUpgrade = useCallback((): boolean => {
    if (!state.user) return false;
    
    // Verifica se pode subir de nível
    if (state.user.level === 1 && state.user.consultasUsadas >= 25) {
      return true; // Pode solicitar nível 2
    }
    if (state.user.level === 2) {
      const daysSinceApproval = state.user.approvedAt 
        ? Math.floor((Date.now() - new Date(state.user.approvedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      if (daysSinceApproval >= 90) {
        return true; // Pode solicitar nível 3
      }
    }
    return false;
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser, checkLevelUpgrade }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
