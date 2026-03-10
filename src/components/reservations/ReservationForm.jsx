import React, { useState, useMemo } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";
import { mockAvailability } from "../../data/mockData";

export default function ReservationForm({
  space,
  onSubmit,
  availability = mockAvailability,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Get available slots for the selected date
  const availableSlots = useMemo(() => {
    if (!selectedDate || !availability) return [];
    return availability[selectedDate] || [];
  }, [selectedDate, availability]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return selectedSlots.length * (space?.pricePerHour || 0);
  }, [selectedSlots, space]);

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlots([]);
  };

  // Toggle a time slot selection
  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSlots.length === 0) return;

    onSubmit({
      spaceId: space.id,
      date: selectedDate,
      timeSlots: selectedSlots,
      totalPrice,
    });
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Réserver : {space?.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {space?.pricePerHour?.toFixed(2)} MAD / heure
        </p>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label
          htmlFor="reservation-date"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
        >
          <FiCalendar className="w-4 h-4" />
          Date
        </label>
        <input
          id="reservation-date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={today}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      {/* Time Slots */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <FiClock className="w-4 h-4" />
          Créneaux disponibles
        </label>

        {!selectedDate && (
          <p className="text-sm text-gray-400 italic">
            Veuillez sélectionner une date pour voir les créneaux disponibles.
          </p>
        )}

        {selectedDate && availableSlots.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            Aucun créneau disponible pour cette date.
          </p>
        )}

        {selectedDate && availableSlots.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSlots.map((slot) => {
              const isSelected = selectedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Total Price */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{selectedSlots.length}</span>{" "}
            {selectedSlots.length <= 1 ? "heure" : "heures"} x{" "}
            {space?.pricePerHour?.toFixed(2)} MAD
          </div>
          <div className="text-xl font-bold text-gray-900">
            {totalPrice.toFixed(2)} MAD
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={selectedSlots.length === 0}
        className={`w-full py-3 px-4 text-sm font-semibold rounded-lg transition-colors duration-150 ${
          selectedSlots.length > 0
            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Réserver
      </button>
    </form>
  );
}
