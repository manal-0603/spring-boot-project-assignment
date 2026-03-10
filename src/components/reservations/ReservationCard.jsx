import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiX } from "react-icons/fi";

const STATUS_CONFIG = {
  EN_ATTENTE: {
    label: "En attente",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  CONFIRMEE: {
    label: "Confirmée",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  ANNULEE: {
    label: "Annulée",
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
  TERMINEE: {
    label: "Terminée",
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  },
};

const TYPE_LABELS = {
  MEETING_ROOM: "Salle de réunion",
  PRIVATE_OFFICE: "Bureau individuel",
  OPEN_SPACE: "Open Space",
};

function formatDate(dateString) {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export default function ReservationCard({ reservation, onCancel }) {
  const {
    id,
    spaceName,
    spaceType,
    siteName,
    date,
    startTime,
    endTime,
    status,
    totalAmount,
  } = reservation;

  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.EN_ATTENTE;
  const typeLabel = TYPE_LABELS[spaceType] || spaceType;
  const canCancel = status === "EN_ATTENTE" || status === "CONFIRMEE";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
      {/* Header: Space name + Status badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {spaceName}
          </h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {typeLabel}
          </span>
        </div>
        <span
          className={`flex-shrink-0 inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
          <span>{siteName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiClock className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
          <span>
            {startTime} - {endTime}
          </span>
        </div>
      </div>

      {/* Footer: Amount + Cancel button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-lg font-bold text-gray-900">
          {totalAmount != null ? `${totalAmount.toFixed(2)} MAD` : "—"}
        </div>
        {canCancel && (
          <button
            onClick={() => onCancel(id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-150 cursor-pointer"
          >
            <FiX className="w-4 h-4" />
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}
