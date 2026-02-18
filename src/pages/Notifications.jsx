import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "../services/notifications";

const TYPE_STYLE = {
    info: { bg: "bg-blue-50", icon: "bg-blue-500", border: "border-blue-100" },
    success: { bg: "bg-emerald-50", icon: "bg-emerald-500", border: "border-emerald-100" },
    warning: { bg: "bg-amber-50", icon: "bg-amber-500", border: "border-amber-100" },
    error: { bg: "bg-red-50", icon: "bg-red-500", border: "border-red-100" },
};

const DEFAULT_STYLE = { bg: "bg-gray-50", icon: "bg-indigo-500", border: "border-gray-100" };

const TypeIcon = ({ type }) => {
    const cls = "w-5 h-5 text-white";
    switch (type) {
        case "success":
            return (
                <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        case "warning":
            return (
                <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86a1 1 0 00.87 1.5h17.16a1 1 0 00.87-1.5l-8.6-14.86a1 1 0 00-1.74 0z" />
                </svg>
            );
        case "error":
            return (
                <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        default:
            return (
                <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            );
    }
};

const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
};

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data.data.data ?? []);
        } catch (err) {
            console.error("Gagal fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleClick = async (notif) => {
        try {
            if (!notif.read_at) {
                await markAsRead(notif.id);
            }
        } catch (err) {
            console.error("Gagal mark as read:", err);
        }
        if (notif.data?.action_url) {
            navigate(notif.data.action_url);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
            );
        } catch (err) {
            console.error("Gagal mark all as read:", err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF] to-[#4A3AFF] pb-20">
            <Header />

            <div className="bg-gray-50 rounded-t-[30px] mt-5 p-5 min-h-screen">
                {/* Title bar */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Notifikasi</h1>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Tandai semua dibaca
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-full" />
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium">Belum ada notifikasi</p>
                        <p className="text-gray-400 text-sm mt-1">Notifikasi akan muncul di sini</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => {
                            const style = TYPE_STYLE[notif.data?.type] ?? DEFAULT_STYLE;
                            const isUnread = !notif.read_at;

                            return (
                                <button
                                    key={notif.id}
                                    onClick={() => handleClick(notif)}
                                    className={`w-full text-left rounded-2xl p-4 border transition-all hover:shadow-md active:scale-[0.98] ${isUnread
                                            ? `${style.bg} ${style.border} shadow-sm`
                                            : "bg-white border-gray-100"
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl ${style.icon} flex items-center justify-center flex-shrink-0`}
                                        >
                                            <TypeIcon type={notif.data?.type} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p
                                                    className={`font-semibold text-sm truncate ${isUnread ? "text-gray-900" : "text-gray-600"
                                                        }`}
                                                >
                                                    {notif.data?.title ?? "Notifikasi"}
                                                </p>
                                                {isUnread && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                                                {notif.data?.message}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1.5">
                                                {timeAgo(notif.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <Navbar />
        </div>
    );
};

export default Notifications;
