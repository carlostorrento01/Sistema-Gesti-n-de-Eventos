import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  User,
  UserRole,
} from "../services/eventStorage";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario guardado
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getCurrentUser();
      if (storedUser) setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (name: string, role: UserRole) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      role,
    };
    await setCurrentUser(newUser);
    setUser(newUser);
  };

  const logout = async () => {
    await clearCurrentUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
