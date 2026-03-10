import API from "./axiosConfig";

// ============================================================
// API RÉSERVATIONS
// ============================================================
// TODO (Étudiants) : Ces fonctions appellent le backend Spring Boot.
// Endpoints attendus :
//   POST /api/reservations           (créer une réservation - MEMBER)
//   GET  /api/reservations/me        (mes réservations - MEMBER)
//   PUT  /api/reservations/:id/cancel (annuler une réservation)
//   GET  /api/admin/reservations     (toutes les réservations - ADMIN)
// ============================================================

export const reservationApi = {
  // Créer une réservation
  create: (reservationData) => API.post("/reservations", reservationData),

  // Mes réservations (utilisateur connecté)
  getMyReservations: () => API.get("/reservations/me"),

  // Annuler une réservation
  cancel: (id) => API.put(`/reservations/${id}/cancel`),

  // Toutes les réservations (ADMIN)
  getAll: (params) => API.get("/admin/reservations", { params }),
};
