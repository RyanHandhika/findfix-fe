import { useState } from "react";

const ReportTable = ({ reports, onView, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 5;

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchSearch =
      report.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" || report.status.toLowerCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "proses":
        return "bg-blue-100 text-blue-700";
      case "selesai":
        return "bg-green-100 text-green-700";
      case "ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case "rendah":
        return "🟢";
      case "sedang":
        return "🟡";
      case "tinggi":
        return "🟠";
      case "urgent":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">📋 Laporan Terbaru</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola semua laporan dari pengguna
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="🔍 Cari laporan, pelapor, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent text-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent text-sm font-medium cursor-pointer"
          >
            <option value="all">📊 Semua Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="proses">🔄 Proses</option>
            <option value="selesai">✅ Selesai</option>
            <option value="ditolak">❌ Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Pelapor
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Prioritas
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">
                      #{report.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#4A3AFF] to-[#5B4CFF] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {report.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {report.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.user?.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 font-medium">
                      {report.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {report.location}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getPriorityBadge(report.priority)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {report.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView(report.id)}
                        className="w-9 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors"
                        title="Lihat Detail"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => onEdit(report.id)}
                        className="w-9 h-9 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(report.id)}
                        className="w-9 h-9 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-5xl">📭</span>
                    <p className="text-gray-500 font-medium">
                      Tidak ada laporan ditemukan
                    </p>
                    <p className="text-sm text-gray-400">
                      Coba ubah filter atau kata kunci pencarian
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Menampilkan{" "}
              <span className="font-semibold text-gray-800">
                {indexOfFirstItem + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-gray-800">
                {Math.min(indexOfLastItem, filteredReports.length)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-800">
                {filteredReports.length}
              </span>{" "}
              laporan
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    currentPage === index + 1
                      ? "bg-[#4A3AFF] text-white shadow-lg"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;