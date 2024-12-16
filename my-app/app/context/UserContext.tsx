"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

interface UserContextType {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Erro ao acessar o localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
