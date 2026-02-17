import api from "./axios";

const getNotifications = () => {
    return api.get("/notifications");
};

const getUnreadCount = () => {
    return api.get("/notifications/unread-count");
};

const markAsRead = (id) => {
    return api.post(`/notifications/${id}/read`);
};

const markAllAsRead = () => {
    return api.post("/notifications/read-all");
};

export { getNotifications, getUnreadCount, markAsRead, markAllAsRead };
