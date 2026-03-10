import API from "./axiosConfig";

// ============================================================
// API ADMINISTRATION
// ============================================================
// TODO (Étudiants) : Ces fonctions appellent le backend Spring Boot.
// Endpoints attendus :
//   GET /api/admin/users              (liste des utilisateurs)
//   PUT /api/admin/users/:id/role     (changer le rôle)
//   PUT /api/admin/users/:id/toggle   (activer/désactiver)
//   GET /api/admin/stats/dashboard    (statistiques)
// ============================================================

export const adminApi = {
  // Liste des utilisateurs
  getUsers: (params) => API.get("/admin/users", { params }),

  // Changer le rôle d'un utilisateur
  changeRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),

  // Activer/Désactiver un utilisateur
  toggleActive: (id) => API.put(`/admin/users/${id}/toggle`),

  // Statistiques du tableau de bord
  getDashboardStats: () => API.get("/admin/stats/dashboard"),
};
