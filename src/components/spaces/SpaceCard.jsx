import React from "react";
import { Link } from "react-router-dom";
import { FiStar, FiUsers, FiMapPin, FiDollarSign } from "react-icons/fi";

const typeConfig = {
  MEETING_ROOM: {
    label: "Salle de réunion",
    badgeClass: "bg-blue-100 text-blue-800",
  },
  PRIVATE_OFFICE: {
    label: "Bureau individuel",
    badgeClass: "bg-green-100 text-green-800",
  },
  OPEN_SPACE: {
    label: "Open Space",
    badgeClass: "bg-purple-100 text-purple-800",
  },
};

const SpaceCard = ({ space }) => {
  const {
    id,
    name,
    type,
    capacity,
    description,
    pricePerHour,
    photos,
    siteName,
    averageRating,
    totalReviews,
  } = space;

  const { label: typeLabel, badgeClass } = typeConfig[type] || {
    label: type,
    badgeClass: "bg-gray-100 text-gray-800",
  };

  const hasPhoto = photos && photos.length > 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FiStar
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FiStar
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current opacity-50"
          />
        );
      } else {
        stars.push(
          <FiStar key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {hasPhoto ? (
          <img
            src={photos[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">{name}</span>
          </div>
        )}

        {/* Type Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
        >
          {typeLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
          {name}
        </h3>

        {/* Site Name */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{siteName}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Details Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Capacity */}
          <div className="flex items-center text-gray-600 text-sm">
            <FiUsers className="w-4 h-4 mr-1" />
            <span>
              {capacity} {capacity > 1 ? "personnes" : "personne"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center text-indigo-600 font-semibold text-sm">
            <FiDollarSign className="w-4 h-4 mr-0.5" />
            <span>{pricePerHour} MAD/h</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-0.5">{renderStars(averageRating)}</div>
          <span className="ml-2 text-sm text-gray-600">
            {averageRating.toFixed(1)} ({totalReviews} avis)
          </span>
        </div>

        {/* CTA Link */}
        <Link
          to={`/spaces/${id}`}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
        >
          Voir détails
        </Link>
      </div>
    </div>
  );
};

export default SpaceCard;
