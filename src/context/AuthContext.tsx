import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API_URL } from "../utils/api";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Inicialización rápida desde localStorage si existe
    try {
      const cached = localStorage.getItem("fing_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem("fing_user");
    } catch {
      return true;
    }
  });
  const [error, setError] = useState<string | null>(null);

  // Validar sesión activa contra el backend mediante la cookie HTTP-Only
  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          localStorage.setItem("fing_user", JSON.stringify(data.data));
          return;
        }
      }

      // Si el backend responde 401 o no está autenticado, limpiar sesión
      setUser(null);
      localStorage.removeItem("fing_user");
    } catch {
      // Si hay error de red no borramos inmediatamente la caché para evitar parpadeos offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });

      // Parseo seguro según reglas de Frontend
      let responseData: any = {};
      const isJson = res.headers.get("content-type")?.includes("application/json");

      if (isJson) {
        try {
          responseData = await res.json();
        } catch {
          responseData = {};
        }
      }

      if (!res.ok) {
        const errMsg =
          responseData.error?.message ||
          responseData.message ||
          "Error al iniciar sesión. Verifica tus credenciales.";
        setError(errMsg);
        setLoading(false);
        return false;
      }

      const loggedUser: User = responseData.data;
      setUser(loggedUser);
      localStorage.setItem("fing_user", JSON.stringify(loggedUser));
      setLoading(false);
      return true;
    } catch (err: any) {
      const errMsg = err.error?.message || err.message || "Error de red al conectar con el servidor.";
      setError(errMsg);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignorar fallo de red en logout
    } finally {
      setUser(null);
      localStorage.removeItem("fing_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
