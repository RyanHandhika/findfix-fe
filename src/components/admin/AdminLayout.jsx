import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: "📊",
      label: "Dashboard",
      path: "/admin/dashboard",
      badge: null,
    },
    {
      icon: "📋",
      label: "Laporan",
      path: "/admin/laporan",
      badge: "134",
    },
    {
      icon: "👥",
      label: "Manajemen User",
      path: "/admin/users",
      badge: null,
    },
    {
      icon: "📈",
      label: "Analytics",
      path: "/admin/analytics",
      badge: null,
    },
    {
      icon: "🏢",
      label: "Lokasi & Gedung",
      path: "/admin/locations",
      badge: null,
    },
    {
      icon: "🏷️",
      label: "Kategori",
      path: "/admin/categories",
      badge: null,
    },
    {
      icon: "📁",
      label: "Arsip",
      path: "/admin/archive",
      badge: null,
    },
    {
      icon: "⚙️",
      label: "Pengaturan",
      path: "/admin/settings",
      badge: null,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="h-20 bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-white">
              <h2 className="font-bold text-lg">FindFix</h2>
              <p className="text-xs opacity-80">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-medium text-sm transition-all ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isActive(item.path)
                      ? "bg-white/20 text-white"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Bottom Menu */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-100 transition-all">
            <span className="text-xl">❓</span>
            <span>Bantuan & Support</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-all">
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-[#4A3AFF]/10 to-[#5B4CFF]/10 rounded-xl p-4 border border-[#4A3AFF]/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4A3AFF] to-[#5B4CFF] rounded-full flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Ryan Admin</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;