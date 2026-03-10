import API from "./axiosConfig";

// ============================================================
// API AUTHENTIFICATION
// ============================================================
// TODO (Étudiants) : Ces fonctions appellent le backend Spring Boot.
// Assurez-vous que votre backend expose les endpoints correspondants :
//   POST /api/auth/register
//   POST /api/auth/login
//   POST /api/auth/refresh
//   POST /api/auth/forgot-password
// ============================================================

export const authApi = {
  // Inscription d'un nouvel utilisateur
  register: (userData) => API.post("/auth/register", userData),

  // Connexion et obtention du JWT
  login: (credentials) => API.post("/auth/login", credentials),

  // Rafraîchir le token d'accès
  refreshToken: (refreshToken) =>
    API.post("/auth/refresh", { refreshToken }),

  // Demande de réinitialisation du mot de passe
  forgotPassword: (email) =>
    API.post("/auth/forgot-password", { email }),

  // Obtenir le profil de l'utilisateur connecté
  getProfile: () => API.get("/auth/profile"),

  // Modifier le profil
  updateProfile: (data) => API.put("/auth/profile", data),

  // Changer le mot de passe
  changePassword: (data) => API.put("/auth/change-password", data),
};
