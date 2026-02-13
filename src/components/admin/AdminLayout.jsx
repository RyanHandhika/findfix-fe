import { useState } from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content — offset by sidebar width on large screens */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Left: Hamburger + Page Title */}
          <div className="flex items-center gap-4">
            {/* Hamburger — only visible on mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              ☰
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#4A3AFF] to-[#5B4CFF] rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-pointer">
              R
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
