import { createContext, useContext, useState } from "react";
import { mockUsers } from "../data/mockData";

const AuthContext = createContext(null);

// ============================================================
// CONTEXTE D'AUTHENTIFICATION
// ============================================================
// Actuellement utilise des données statiques.
// TODO (Étudiants) : Remplacer par de vrais appels API :
//   - login()  -> POST /api/auth/login  -> stocker le JWT
//   - register() -> POST /api/auth/register
//   - logout() -> supprimer le JWT
// ============================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Connexion (simulée avec données statiques)
  const login = async (email, password) => {
    // TODO: Remplacer par : const res = await authApi.login({ email, password });
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      // TODO: Stocker le token JWT
      // localStorage.setItem("accessToken", res.data.accessToken);
      // localStorage.setItem("refreshToken", res.data.refreshToken);
      return { success: true };
    }
    return { success: false, message: "Email ou mot de passe incorrect" };
  };

  // Inscription (simulée)
  const register = async (userData) => {
    // TODO: Remplacer par : await authApi.register(userData);
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: "ROLE_MEMBER",
      active: true,
      registrationDate: new Date().toISOString().split("T")[0],
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const isAdmin = user?.role === "ROLE_ADMIN";
  const isMember = user?.role === "ROLE_MEMBER";

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, isMember, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
