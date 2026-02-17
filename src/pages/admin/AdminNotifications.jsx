import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getMe } from "../../services/auth";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "../../services/notifications";

const NOTIF_TYPE_STYLE = {
    info: { bg: "bg-blue-500", ring: "ring-blue-100" },
    success: { bg: "bg-emerald-500", ring: "ring-emerald-100" },
    warning: { bg: "bg-amber-500", ring: "ring-amber-100" },
    error: { bg: "bg-red-500", ring: "ring-red-100" },
};

const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    const mins = Math.floor(diff / 60);
    const hrs = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    if (hrs < 24) return `${hrs} jam lalu`;
    return `${days} hari lalu`;
};

const NotifIcon = ({ type }) => {
    const cls = "w-5 h-5 text-white";
    switch (type) {
        case "success":
            return (
                <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            );
        case "warning":
            return (
                <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
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

const AdminNotifications = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, notifsRes] = await Promise.all([
                    getMe(),
                    getNotifications(),
                ]);
                setAdmin(userRes.data.data);
                setNotifications(notifsRes.data.data.data ?? []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClick = async (notif) => {
        try {
            if (!notif.read_at) {
                await markAsRead(notif.id);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n,
                    ),
                );
            }
        } catch (e) {
            console.error(e);
        }
        if (notif.data?.action_url) {
            navigate("/admin/laporan");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
            );
        } catch (e) {
            console.error(e);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <AdminLayout admin={admin} pageTitle="Notifications">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Semua Notifikasi
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {unreadCount > 0
                                ? `${unreadCount} notifikasi belum dibaca`
                                : "Semua notifikasi sudah dibaca"}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            Tandai Semua Dibaca
                        </button>
                    )}
                </div>

                {/* Notification list */}
                {loading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-3 animate-pulse">
                                    <div className="w-11 h-11 rounded-xl bg-gray-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Belum ada notifikasi</p>
                        <p className="text-gray-400 text-sm mt-1">Notifikasi akan muncul di sini saat ada update</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
                        {notifications.map((notif) => {
                            const style = NOTIF_TYPE_STYLE[notif.data?.type] ?? NOTIF_TYPE_STYLE.info;
                            const isUnread = !notif.read_at;

                            return (
                                <button
                                    key={notif.id}
                                    onClick={() => handleClick(notif)}
                                    className={`w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-gray-50 transition-colors ${isUnread ? "bg-indigo-50/40" : ""
                                        }`}
                                >
                                    <div className={`w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0 ring-4 ${style.ring}`}>
                                        <NotifIcon type={notif.data?.type} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className={`text-sm ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
                                                {notif.data?.title ?? "Notifikasi"}
                                            </p>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-xs text-gray-400">{timeAgo(notif.created_at)}</span>
                                                {isUnread && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {notif.data?.message}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminNotifications;
