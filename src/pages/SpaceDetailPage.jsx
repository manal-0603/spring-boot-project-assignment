import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiMapPin,
  FiDollarSign,
  FiStar,
  FiCheckCircle,
  FiLogIn,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { mockSpaces, mockReviews, mockAvailability } from "../data/mockData";
import ReviewItem from "../components/reviews/ReviewItem";
import ReviewForm from "../components/reviews/ReviewForm";
import ReservationForm from "../components/reservations/ReservationForm";
import { useAuth } from "../context/AuthContext";

const TYPE_CONFIG = {
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

const SpaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isMember } = useAuth();

  const space = mockSpaces.find((s) => s.id === Number(id));

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [reviews, setReviews] = useState(
    mockReviews.filter((r) => r.spaceId === Number(id))
  );

  // Calculate average rating from current reviews
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Handle photo navigation
  const nextPhoto = () => {
    if (space && space.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % space.photos.length);
    }
  };

  const prevPhoto = () => {
    if (space && space.photos.length > 1) {
      setCurrentPhotoIndex(
        (prev) => (prev - 1 + space.photos.length) % space.photos.length
      );
    }
  };

  // Handle reservation submit
  const handleReservationSubmit = (data) => {
    alert(
      `Réservation soumise !\n\nEspace : ${space.name}\nDate : ${data.date}\nCréneaux : ${data.timeSlots.join(", ")}\nTotal : ${data.totalPrice.toFixed(2)} MAD`
    );
  };

  // Handle review submit
  const handleReviewSubmit = async ({ rating, comment }) => {
    const newReview = {
      id: Date.now(),
      spaceId: Number(id),
      spaceName: space.name,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  // Handle review delete
  const handleReviewDelete = (reviewId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
  };

  // 404 state
  if (!space) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiMapPin className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Espace non trouvé
          </h1>
          <p className="text-gray-500 mb-6 max-w-md">
            L'espace que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/spaces"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Retour aux espaces
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = TYPE_CONFIG[space.type] || {
    label: space.type,
    badgeClass: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <div className="relative h-72 md:h-96 lg:h-[28rem] bg-gray-900 overflow-hidden">
        {space.photos && space.photos.length > 0 ? (
          <img
            src={space.photos[currentPhotoIndex]}
            alt={space.name}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">{space.name}</span>
          </div>
        )}

        {/* Photo Navigation */}
        {space.photos && space.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {space.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    idx === currentPhotoIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Back Button Overlay */}
        <button
          onClick={() => navigate("/spaces")}
          className="absolute top-4 left-4 inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <FiArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Space Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {space.name}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${typeConfig.badgeClass}`}
                    >
                      {typeConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">{space.siteName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {space.pricePerHour} MAD
                  </div>
                  <span className="text-sm text-gray-500">par heure</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 py-4 border-t border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUsers className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium">
                    {space.capacity}{" "}
                    {space.capacity > 1 ? "personnes" : "personne"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">
                    {averageRating} ({reviews.length}{" "}
                    {reviews.length <= 1 ? "avis" : "avis"})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiDollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">
                    {space.pricePerHour} MAD/h
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {space.description}
                </p>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Équipements
              </h2>
              <div className="flex flex-wrap gap-2">
                {space.equipments.map((equipment) => (
                  <span
                    key={equipment}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    {equipment}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Avis ({reviews.length})
                </h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">
                      {averageRating}
                    </span>
                    <span className="text-gray-500 text-sm">/5</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Aucun avis pour le moment. Soyez le premier à donner votre
                    avis !
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewItem
                      key={review.id}
                      review={review}
                      onDelete={
                        isAuthenticated && user?.id === review.userId
                          ? handleReviewDelete
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Review Form (authenticated members only) */}
            {isAuthenticated && isMember ? (
              <ReviewForm onSubmit={handleReviewSubmit} />
            ) : (
              !isAuthenticated && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <FiLogIn className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">
                    Connectez-vous pour laisser un avis.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                  >
                    <FiLogIn className="w-4 h-4" />
                    Se connecter
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Right Column: Reservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {isAuthenticated ? (
                <ReservationForm
                  space={space}
                  availability={mockAvailability}
                  onSubmit={handleReservationSubmit}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiLogIn className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Connectez-vous pour réserver
                  </h3>
                  <p className="text-gray-500 text-sm mb-5">
                    Vous devez être connecté pour effectuer une réservation.
                  </p>
                  <Link
                    to="/login"
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Se connecter
                  </Link>
                  <p className="mt-3 text-xs text-gray-400">
                    Pas encore de compte ?{" "}
                    <Link
                      to="/register"
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Inscrivez-vous
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetailPage;
