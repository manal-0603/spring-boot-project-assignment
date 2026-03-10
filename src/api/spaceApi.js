import API from "./axiosConfig";

// ============================================================
// API ESPACES
// ============================================================
// TODO (Étudiants) : Ces fonctions appellent le backend Spring Boot.
// Endpoints attendus :
//   GET    /api/spaces          (liste avec filtres et pagination)
//   GET    /api/spaces/:id      (détail d'un espace)
//   POST   /api/spaces          (créer - ADMIN)
//   PUT    /api/spaces/:id      (modifier - ADMIN)
//   DELETE /api/spaces/:id      (supprimer - ADMIN)
//   GET    /api/spaces/:id/availability  (disponibilité)
// ============================================================

export const spaceApi = {
  // Liste des espaces avec filtres et pagination
  getAll: (params) => API.get("/spaces", { params }),

  // Détail d'un espace
  getById: (id) => API.get(`/spaces/${id}`),

  // Créer un espace (ADMIN uniquement)
  create: (spaceData) => API.post("/spaces", spaceData),

  // Modifier un espace (ADMIN uniquement)
  update: (id, spaceData) => API.put(`/spaces/${id}`, spaceData),

  // Supprimer un espace (ADMIN uniquement)
  delete: (id) => API.delete(`/spaces/${id}`),

  // Vérifier la disponibilité d'un espace
  getAvailability: (id, date) =>
    API.get(`/spaces/${id}/availability`, { params: { date } }),
};
