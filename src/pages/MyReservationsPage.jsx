import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInbox,
} from "react-icons/fi";
import { mockReservations } from "../data/mockData";
import ReservationCard from "../components/reservations/ReservationCard";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "ALL", label: "Toutes", icon: FiCalendar },
  { key: "EN_ATTENTE", label: "En attente", icon: FiClock },
  { key: "CONFIRMEE", label: "Confirmées", icon: FiCheckCircle },
  { key: "TERMINEE", label: "Terminées", icon: FiAlertCircle },
  { key: "ANNULEE", label: "Annulées", icon: FiXCircle },
];

const MyReservationsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("ALL");

  // Local state for reservations (allows cancellation updates)
  const [reservations, setReservations] = useState(mockReservations);

  // Filter reservations for the current user, sorted by date descending
  const userReservations = useMemo(() => {
    if (!user) return [];

    return reservations
      .filter((r) => r.userId === user.id)
      .sort((a, b) => {
        // Sort by date descending, then by startTime descending
        const dateCompare = new Date(b.date) - new Date(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.startTime > a.startTime ? 1 : -1;
      });
  }, [reservations, user]);

  // Apply tab filter
  const filteredReservations = useMemo(() => {
    if (activeTab === "ALL") return userReservations;
    return userReservations.filter((r) => r.status === activeTab);
  }, [userReservations, activeTab]);

  // Count by status for tab badges
  const statusCounts = useMemo(() => {
    const counts = { ALL: userReservations.length };
    TABS.forEach((tab) => {
      if (tab.key !== "ALL") {
        counts[tab.key] = userReservations.filter(
          (r) => r.status === tab.key
        ).length;
      }
    });
    return counts;
  }, [userReservations]);

  // Handle cancellation
  const handleCancel = (reservationId) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment annuler cette réservation ? Cette action est irréversible."
    );
    if (confirmed) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, status: "ANNULEE" } : r
        )
      );
    }
  };

  // Not authenticated guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCalendar className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Connexion requise
          </h1>
          <p className="text-gray-500 mb-6 max-w-md">
            Vous devez être connecté pour accéder à vos réservations.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FiCalendar className="w-8 h-8 text-white/80" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Mes Réservations
            </h1>
          </div>
          <p className="text-indigo-100 text-lg">
            Gérez et suivez toutes vos réservations d'espaces de coworking.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const count = statusCounts[tab.key] || 0;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reservations List */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiInbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Aucune réservation
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              {activeTab === "ALL"
                ? "Vous n'avez pas encore de réservation. Explorez nos espaces et réservez dès maintenant !"
                : "Aucune réservation avec ce statut."}
            </p>
            {activeTab === "ALL" && (
              <Link
                to="/spaces"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
              >
                Explorer les espaces
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {userReservations.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Résumé
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">
                  {statusCounts["EN_ATTENTE"] || 0}
                </div>
                <div className="text-xs text-yellow-600 font-medium mt-1">
                  En attente
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {statusCounts["CONFIRMEE"] || 0}
                </div>
                <div className="text-xs text-green-600 font-medium mt-1">
                  Confirmées
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-700">
                  {statusCounts["TERMINEE"] || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">
                  Terminées
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {statusCounts["ANNULEE"] || 0}
                </div>
                <div className="text-xs text-red-600 font-medium mt-1">
                  Annulées
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;
