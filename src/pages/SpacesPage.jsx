import { useState, useMemo } from "react";
import { FiGrid, FiSearch } from "react-icons/fi";
import { mockSpaces, spaceTypes } from "../data/mockData";
import SpaceFilter from "../components/spaces/SpaceFilter";
import SpaceList from "../components/spaces/SpaceList";
import Pagination from "../components/common/Pagination";

const ITEMS_PER_PAGE = 6;

const SpacesPage = () => {
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    city: "",
    capacityMin: "",
    capacityMax: "",
    priceMax: "",
    equipments: [],
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Client-side filtering
  const filteredSpaces = useMemo(() => {
    return mockSpaces.filter((space) => {
      // Filter by name (search)
      if (
        filters.name &&
        !space.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }

      // Filter by type
      if (filters.type && space.type !== filters.type) {
        return false;
      }

      // Filter by city (match against siteName which contains the city context)
      if (filters.city) {
        const site = space.siteName || "";
        // mockSpaces don't have a direct city field, but sites have cities.
        // We match city from the mockSites via siteName or check siteId.
        // For simplicity, we compare against known site-city mappings.
        const siteCityMap = {
          "CoWork Centre-Ville": "Casablanca",
          "CoWork Technopolis": "Rabat",
          "CoWork Marina": "Casablanca",
        };
        const spaceCity = siteCityMap[site] || "";
        if (spaceCity !== filters.city) {
          return false;
        }
      }

      // Filter by capacity min
      if (filters.capacityMin && space.capacity < Number(filters.capacityMin)) {
        return false;
      }

      // Filter by capacity max
      if (filters.capacityMax && space.capacity > Number(filters.capacityMax)) {
        return false;
      }

      // Filter by price max
      if (filters.priceMax && space.pricePerHour > Number(filters.priceMax)) {
        return false;
      }

      // Filter by equipments
      if (filters.equipments && filters.equipments.length > 0) {
        const spaceEquipments = space.equipments || [];
        const hasAllEquipments = filters.equipments.every((eq) =>
          spaceEquipments.includes(eq)
        );
        if (!hasAllEquipments) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredSpaces.length / ITEMS_PER_PAGE);
  const paginatedSpaces = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSpaces.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSpaces, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FiGrid className="w-8 h-8 text-white/80" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Nos Espaces de Coworking
            </h1>
          </div>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Trouvez l'espace de travail idéal pour vos besoins. Salles de
            réunion, bureaux privés et open spaces disponibles.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Section */}
        <SpaceFilter filters={filters} onFilterChange={handleFilterChange} />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiSearch className="w-5 h-5 text-gray-400" />
            <p className="text-gray-600 font-medium">
              <span className="text-indigo-600 font-bold">
                {filteredSpaces.length}
              </span>{" "}
              {filteredSpaces.length <= 1 ? "espace trouvé" : "espaces trouvés"}
            </p>
          </div>
          {totalPages > 1 && (
            <p className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </p>
          )}
        </div>

        {/* Space List */}
        <SpaceList spaces={paginatedSpaces} />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SpacesPage;
