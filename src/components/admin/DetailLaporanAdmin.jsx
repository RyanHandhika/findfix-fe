import { useState } from "react";

const DetailLaporan = ({ report, isOpen, onClose, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState("detail");
  const [newStatus, setNewStatus] = useState(report?.status || "");
  const [notes, setNotes] = useState("");

  if (!isOpen || !report) return null;

  const statusOptions = ["Pending", "Proses", "Selesai", "Ditolak"];

  const handleUpdateStatus = () => {
    if (newStatus && newStatus !== report.status) {
      onUpdateStatus(report.id, newStatus, notes);
      setNotes("");
      onClose();
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "proses":
        return "bg-blue-500";
      case "selesai":
        return "bg-green-500";
      case "ditolak":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const timeline = [
    {
      date: "2025-02-10 08:00",
      action: "Laporan dibuat",
      user: report.user?.name,
      status: "Pending",
    },
    {
      date: "2025-02-10 10:30",
      action: "Laporan sedang diverifikasi",
      user: "Admin Sistem",
      status: "Proses",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
              📋
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Detail Laporan #{report.id}</h2>
              <p className="text-sm opacity-90">{report.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("detail")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "detail"
                  ? "border-[#4A3AFF] text-[#4A3AFF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📄 Detail
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "timeline"
                  ? "border-[#4A3AFF] text-[#4A3AFF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ⏱️ Timeline
            </button>
            <button
              onClick={() => setActiveTab("action")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "action"
                  ? "border-[#4A3AFF] text-[#4A3AFF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              ⚡ Tindakan
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Detail Tab */}
          {activeTab === "detail" && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`${getStatusStyle(
                    report.status
                  )} w-3 h-3 rounded-full`}
                ></div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    report.status.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : report.status.toLowerCase() === "proses"
                      ? "bg-blue-100 text-blue-700"
                      : report.status.toLowerCase() === "selesai"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {report.status}
                </span>
                <span className="text-sm text-gray-500">
                  Prioritas: <strong>{report.priority}</strong>
                </span>
              </div>

              {/* Pelapor Info */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  👤 Informasi Pelapor
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4A3AFF] to-[#5B4CFF] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {report.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {report.user?.name}
                    </p>
                    <p className="text-sm text-gray-600">{report.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Kategori</p>
                  <p className="font-semibold text-gray-800">{report.category}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                  <p className="font-semibold text-gray-800">{report.location}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Tanggal Laporan</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(report.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">ID Laporan</p>
                  <p className="font-semibold text-gray-800">#{report.id}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  📝 Deskripsi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>

              {/* Attachments */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  📎 Lampiran
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <img
                        src={`https://via.placeholder.com/200?text=Image+${i}`}
                        alt={`Attachment ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${getStatusStyle(
                        item.status
                      )} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {index + 1}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {item.action}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status.toLowerCase() === "proses"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">oleh {item.user}</p>
                      <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Tab */}
          {activeTab === "action" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Anda dapat mengubah status laporan dan menambahkan catatan
                  di sini.
                </p>
              </div>

              {/* Status Update */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                  🔄 Update Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Baru
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tambahkan catatan untuk perubahan status ini..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent resize-none"
                      rows="4"
                    ></textarea>
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={!newStatus || newStatus === report.status}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💾 Simpan Perubahan
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                  ⚡ Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors">
                    ✅ Approve
                  </button>
                  <button className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition-colors">
                    ❌ Reject
                  </button>
                  <button className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors">
                    📧 Email User
                  </button>
                  <button className="px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-medium transition-colors">
                    🔔 Send Notification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] text-white rounded-xl font-medium hover:shadow-lg transition-all">
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailLaporan;