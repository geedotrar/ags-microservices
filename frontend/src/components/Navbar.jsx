import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ModalConfirmation from './ModalConfirmation';
import { FiMenu, FiX } from 'react-icons/fi';
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const hasPermission = (permission) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const decoded = jwtDecode(token);
  
      if (decoded.role === "admin") return true; 
      return decoded.permissions?.includes(permission);
    } catch (e) {
      console.error("Invalid token or permission check failed:", e);
      return false;
    }
  };
  
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialStatus = queryParams.get('status') || '';

  const [role, setRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole('');
    setShowModal(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchQuery.trim() !== '') {
      params.append('search', searchQuery.trim());
    }
    if (statusFilter !== '') {
      params.append('status', statusFilter);
    }

    navigate(`/products?${params.toString()}`);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-[#033149] p-4 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/products" className="font-bold text-xl">
            {role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'PRODUCT'}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white rounded-full shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-[#033149] transition-all duration-200"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="px-5 py-2 text-sm text-gray-700 bg-transparent w-60 focus:outline-none placeholder-gray-400"
              />

              {hasPermission('view_all_products') && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-gray-700 text-sm bg-transparent border-l border-gray-300 px-1 py-2 focus:outline-none"
                  aria-label="Filter by status"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">All</option>
                  <option value="1">Active</option>
                  <option value="0">Unactive</option>
                </select>
              )}
              <button
                type="submit"
                className="bg-[#033149] hover:bg-[#055a75] text-white text-sm font-medium px-5 py-2 rounded-r-full transition-colors duration-200"
              >
                Search
              </button>
            </form>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl border border-white text-white font-semibold hover:bg-[#055a75] shadow-sm hover:shadow-md transition"
              >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 px-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="px-4 py-2 text-sm text-gray-700 rounded border border-gray-300 focus:outline-none"
              />
              {hasPermission('view_all_products') && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-gray-700 text-sm rounded border border-gray-300 px-3 py-2 focus:outline-none"
                  aria-label="Filter by status"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">All</option>
                  <option value="1">Active</option>
                  <option value="0">Unactive</option>
                </select>
              )}
              <button
                type="submit"
                className="w-full bg-[#033149] hover:bg-[#055a75] font-semibold px-4 py-2 rounded"
              >
                Search
              </button>
            </form>
            <div className="px-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full hover:bg-[#055a75] text-white font-semibold px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <ModalConfirmation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
      />
    </>
  );
};

export default Navbar;
