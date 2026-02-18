import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonImg from "../assets/person.png";
import { getUnreadCount } from "../services/notifications";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchUnread = async () => {
      try {
        const res = await getUnreadCount();
        setUnread(res.data.data.count ?? 0);
      } catch (e) {
        // silently fail — user might not be logged in yet
      }
    };
    fetchUnread();
  }, []);

  return (
    <header className="px-5 py-6 flex justify-between items-center text-white">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={PersonImg}
            alt="Person Image"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm opacity-90">Selamat Datang,</p>
          <p className="text-lg font-semibold">Hi, {user?.name || "User"}</p>
        </div>
      </div>

      <button
        onClick={() => navigate("/notifications")}
        className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full min-w-[20px] h-5 text-xs font-bold flex items-center justify-center px-1">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
