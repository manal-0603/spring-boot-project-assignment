import React from "react";
import { mockDashboardStats } from "../../data/mockData";
import StatCard from "../../components/admin/StatCard";
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

const DashboardPage = () => {
  const {
    totalReservations,
    totalRevenue,
    occupancyRate,
    totalUsers,
    revenueByMonth,
    reservationsBySpace,
    occupancyBySpace,
  } = mockDashboardStats;

  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue));
  const maxReservations = Math.max(...reservationsBySpace.map((s) => s.count));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Tableau de bord
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Reservations"
          value={totalReservations}
          icon={<FiCalendar className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Revenus"
          value={`${totalRevenue.toLocaleString("fr-FR")} MAD`}
          icon={<FiDollarSign className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Taux d'occupation"
          value={`${occupancyRate}%`}
          icon={<FiTrendingUp className="w-5 h-5" />}
          color="yellow"
        />
        <StatCard
          title="Utilisateurs"
          value={totalUsers}
          icon={<FiUsers className="w-5 h-5" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Month Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Revenus par mois
          </h2>
          <div className="flex items-end justify-between gap-3 h-52">
            {revenueByMonth.map((item) => {
              const heightPercent = (item.revenue / maxRevenue) * 100;
              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-gray-600">
                    {(item.revenue / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full relative" style={{ height: "160px" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reservations by Space Horizontal Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Reservations par espace
          </h2>
          <div className="space-y-4">
            {reservationsBySpace.map((item) => {
              const widthPercent = (item.count / maxReservations) * 100;
              return (
                <div key={item.spaceName}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 truncate max-w-[60%]">
                      {item.spaceName}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Occupancy by Space Progress Bars */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Taux d'occupation par espace
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {occupancyBySpace.map((item) => {
            let barColor = "bg-green-500";
            if (item.rate < 50) barColor = "bg-red-400";
            else if (item.rate < 70) barColor = "bg-yellow-400";

            return (
              <div key={item.spaceName}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700">
                    {item.spaceName}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.rate}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
