import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  user: { id: number; nome: string; email: string; tipo: string } | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isBibliotecario: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sempre inicia com null, ignorando qualquer dado salvo
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const login = (newToken: string, userData: any) => {
    // Não salva em localStorage, apenas no estado
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    // Limpa estado
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        isBibliotecario: user?.tipo === "BIBLIOTECARIO",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};