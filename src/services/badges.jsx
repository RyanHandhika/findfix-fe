import api from "./axios";

const getBadges = () => {
  return api.get("/badges/get-badges");
};

const getDetailBadge = (id) => {
  return api.get(`/badges/get-badges/${id}`);
};

const createBadge = (payload) => {
  return api.post("/badges/create-badge", payload);
};

const updateBadge = (id, payload) => {
  return api.post(`/badges/update-badge/${id}`, payload);
};

const deleteBadge = (id) => {
  return api.delete(`/badges/delete-badge/${id}`);
};

// --- Client-side badge utilities (used by Profile.jsx) ---

export const BADGES = [
  {
    id: "super_find_hero",
    name: "Super Find Hero",
    description: "Menemukan lebih dari 10 barang",
    icon: "🏆",
    color: "bg-yellow-50",
    minFound: 10,
  },
  {
    id: "honesty_hero",
    name: "Honesty Hero",
    description: "Menemukan lebih dari 3 barang",
    icon: "⭐",
    color: "bg-blue-50",
    minFound: 3,
  },
  {
    id: "eagle_eye",
    name: "Eagle Eye",
    description: "Orang pertama yang melaporkan di lokasi tertentu",
    icon: "👁️",
    color: "bg-orange-50",
    minFound: 1,
  },
  {
    id: "nothing",
    name: "Nothing",
    description: "Anda belum memiliki badge",
    icon: "➖",
    color: "bg-gray-200",
    minFound: 0,
  },
];

const countFoundReports = (reports, userId) => {
  return reports.filter(
    (f) =>
      f.user_id === userId &&
      (f.found_status_id === 1 || f.found_status_id === 3 || f.found_status_id === 4),
  ).length;
};

const getBadge = (foundCount) => {
  if (foundCount > 10) return BADGES[0];
  if (foundCount > 3) return BADGES[1];
  if (foundCount >= 1) return BADGES[2];
  return BADGES[3];
};

export { getBadges, getDetailBadge, createBadge, updateBadge, deleteBadge, countFoundReports, getBadge };
