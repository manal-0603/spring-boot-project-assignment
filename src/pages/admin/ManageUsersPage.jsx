import React, { useState, useMemo } from "react";
import { mockUsers } from "../../data/mockData";
import UserTable from "../../components/admin/UserTable";
import { FiSearch } from "react-icons/fi";

const ManageUsersPage = () => {
  const [users, setUsers] = useState(
    mockUsers.map((u) => ({
      ...u,
      name: `${u.firstName} ${u.lastName}`,
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.firstName && user.firstName.toLowerCase().includes(query)) ||
        (user.lastName && user.lastName.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  const handleToggleActive = (userId) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
  };

  const handleChangeRole = (userId, newRole) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Gestion des Utilisateurs
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2">
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""} trouve{filteredUsers.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* User Table */}
      <UserTable
        users={filteredUsers}
        onToggleActive={handleToggleActive}
        onChangeRole={handleChangeRole}
      />
    </div>
  );
};

export default ManageUsersPage;
