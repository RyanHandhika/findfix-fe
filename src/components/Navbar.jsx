import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { icon: "🏠", label: "Home", path: "/home" },
    { icon: "📋", label: "Laporan", path: "/laporan" },
    { icon: "📊", label: "Statistik", path: "/statistik" },
    { icon: "👤", label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-5 py-2 transition-colors
             ${isActive ? "text-[#4A3AFF]" : "text-gray-400"}`
          }
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
