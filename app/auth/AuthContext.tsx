import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tip tanımlamaları
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Context oluşturma
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider bileşeni
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // Burada gerçek bir API çağrısı ve token yönetimi olabilir.
    // Şimdilik sadece durumu değiştiriyoruz.
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook oluşturma
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 