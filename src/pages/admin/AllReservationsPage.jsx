import React, { useState, useMemo } from "react";
import { mockReservations, reservationStatuses } from "../../data/mockData";
import { FiCalendar } from "react-icons/fi";

const statusTabs = [
  { value: "ALL", label: "Toutes" },
  ...reservationStatuses,
];

const statusBadgeStyles = {};
reservationStatuses.forEach((s) => {
  statusBadgeStyles[s.value] = s.color;
});

const statusLabels = {};
reservationStatuses.forEach((s) => {
  statusLabels[s.value] = s.label;
});

const AllReservationsPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");

  const filteredReservations = useMemo(() => {
    const sorted = [...mockReservations].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    if (activeTab === "ALL") return sorted;
    return sorted.filter((r) => r.status === activeTab);
  }, [activeTab]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Toutes les Reservations
      </h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusTabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
              {tab.value !== "ALL" && (
                <span
                  className={`ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {
                    mockReservations.filter((r) => r.status === tab.value)
                      .length
                  }
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Espace
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Creneau
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Montant
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReservations.map((res) => (
              <tr
                key={res.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-500">
                    #{res.id}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-800">
                    {res.userName}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div>
                    <span className="text-sm text-gray-800">
                      {res.spaceName}
                    </span>
                    <p className="text-xs text-gray-500">{res.siteName}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-600">
                    {formatDate(res.date)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-600">
                    {res.startTime} - {res.endTime}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusBadgeStyles[res.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusLabels[res.status] || res.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-gray-800">
                    {res.totalAmount} MAD
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReservations.length === 0 && (
          <div className="p-10 text-center">
            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Aucune reservation trouvee pour ce filtre.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredReservations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Aucune reservation trouvee pour ce filtre.
            </p>
          </div>
        )}
        {filteredReservations.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-400">
                    #{res.id}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusBadgeStyles[res.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusLabels[res.status] || res.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {res.spaceName}
                </h3>
                <p className="text-xs text-gray-500">{res.siteName}</p>
              </div>
              <span className="text-sm font-bold text-gray-800">
                {res.totalAmount} MAD
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
              <div>
                <span className="text-gray-400">Utilisateur : </span>
                {res.userName}
              </div>
              <div>
                <span className="text-gray-400">Date : </span>
                {formatDate(res.date)}
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Creneau : </span>
                {res.startTime} - {res.endTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 text-sm text-gray-500">
        {filteredReservations.length} reservation{filteredReservations.length !== 1 ? "s" : ""}{" "}
        {activeTab !== "ALL" && (
          <>
            avec le statut{" "}
            <span className="font-medium text-gray-700">
              {statusLabels[activeTab]}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default AllReservationsPage;
