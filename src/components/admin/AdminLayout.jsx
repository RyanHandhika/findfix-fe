import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../services/auth";

const NAV_ITEMS = [
  { path: "/dashboard", icon: "📖", label: "Overview" },
  { path: "/admin/laporan", icon: "📋", label: "Laporan" },
  { path: "/admin/badge", icon: "🏆", label: "Badge" },
  { path: "/admin/users", icon: "👥", label: "Users" },
  { path: "/admin/building", icon: "🏛️", label: "Building" },
];

const AdminLayout = ({ children, admin, pageTitle }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Mobile drawer state — desktop tidak terpengaruh
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tutup drawer saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false); // tutup drawer mobile setelah navigasi
  };

  // Konten sidebar (dipakai di desktop & mobile drawer)
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100 flex-shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          F
        </div>
        <span className="font-bold text-gray-800 text-lg">FindFix</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin Info + Logout */}
      <div className="p-3 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
            {admin?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-semibold truncate">
              {admin?.name ?? "Admin"}
            </p>
            <p className="text-gray-400 text-xs truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════════════
          Selalu tampil di desktop (lg+), tidak bisa di-hide.
          Static — tidak overlay, mendorong konten ke kanan.
      ════════════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* ══ MOBILE DRAWER ════════════════════════════════════════════════════
          Hanya muncul di mobile (<lg), sebagai overlay drawer.
      ════════════════════════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40
          bg-white border-r border-gray-100 flex flex-col shadow-xl
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent />
      </aside>

      {/* ══ MAIN CONTENT ═════════════════════════════════════════════════════
          Desktop: mengisi sisa ruang di sebelah sidebar.
          Mobile:  full width.
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger — hanya tampil di mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Buka menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              <h1 className="font-bold text-gray-800 text-base lg:text-lg leading-tight">
                {pageTitle}
              </h1>
              <p className="text-gray-400 text-xs">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Halo,{" "}
              <span className="font-semibold text-gray-800">{admin?.name}</span>{" "}
              👋
            </span>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
              {admin?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
