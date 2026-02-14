import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { getAllReport, getFoundStatuses } from "../../services/report";
import { getMe } from "../../services/auth";
import api from "../../services/axios";

const STATUS_STYLE = {
  Ditemukan: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Hilang: { bg: "bg-red-100 text-red-700", dot: "bg-red-500" },
  Dikembalikan: { bg: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  Tersimpan: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
};

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const AdminLaporan = () => {
  const [admin, setAdmin] = useState(null);
  const [reports, setReports] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modals
  const [detailItem, setDetailItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newStatusId, setNewStatusId] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [userRes, statusRes] = await Promise.all([
          getMe(),
          getFoundStatuses(),
        ]);
        setAdmin(userRes.data.data);
        setStatuses(statusRes.data.data.data ?? []);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.found_status_id = filterStatus;
      if (search.trim()) params.found_name = search.trim();
      const res = await getAllReport(params);
      setReports(res.data.data.founds ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => {
    const t = setTimeout(fetchReports, 400);
    return () => clearTimeout(t);
  }, [fetchReports]);

  const handleUpdateStatus = async () => {
    if (!newStatusId || !editItem) return;
    setUpdating(true);
    try {
      await api.post(`/founds/update-found/${editItem.id}`, {
        found_status_id: newStatusId,
      });
      setEditItem(null);
      fetchReports();
    } catch {
      alert("Gagal mengubah status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/founds/delete-report/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchReports();
    } catch {
      alert("Gagal menghapus laporan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout admin={admin} pageTitle="Manajemen Laporan">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Manajemen Laporan
          </h2>
          <p className="text-gray-500 text-sm">
            {reports.length} laporan ditemukan
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari nama barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 shadow-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filterStatus === "" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
            >
              Semua
            </button>
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  setFilterStatus(
                    filterStatus === s.id.toString() ? "" : s.id.toString(),
                  )
                }
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filterStatus === s.id.toString() ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center animate-pulse text-gray-400">
              Memuat data...
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-gray-400">Tidak ada laporan ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      "Barang",
                      "Pelapor",
                      "Lokasi",
                      "Status",
                      "Tanggal",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports.map((item) => {
                    const sc = STATUS_STYLE[item.status?.name] ?? {
                      bg: "bg-gray-100 text-gray-600",
                      dot: "bg-gray-400",
                    };
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={
                                  item.found_images?.[0]?.found_img_url ??
                                  "https://placehold.co/100?text=N%2FA"
                                }
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://placehold.co/100?text=N%2FA";
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 max-w-[140px] truncate">
                                {item.found_name}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {item.category?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                          {item.user?.name ?? "-"}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          <p className="font-medium">{item.room?.name_room}</p>
                          <p className="text-gray-400">
                            {item.room?.building?.building_name}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${sc.bg}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                            />
                            {item.status?.name}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(item.found_date)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setDetailItem(item)}
                              title="Detail"
                              className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm"
                            >
                              👁
                            </button>
                            <button
                              onClick={() => {
                                setEditItem(item);
                                setNewStatusId(
                                  item.found_status_id?.toString(),
                                );
                              }}
                              title="Ubah Status"
                              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              title="Hapus"
                              className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {detailItem && (
        <AdminModal title="Detail Laporan" onClose={() => setDetailItem(null)}>
          {detailItem.found_images?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {detailItem.found_images.map((img, i) => (
                <img
                  key={i}
                  src={img.found_img_url}
                  alt=""
                  className="w-28 h-28 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                />
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Nama Barang", value: detailItem.found_name },
              { label: "Kategori", value: detailItem.category?.name },
              { label: "Status", value: detailItem.status?.name },
              { label: "Pelapor", value: detailItem.user?.name },
              {
                label: "Lokasi",
                value: `${detailItem.room?.name_room ?? "-"} (${detailItem.room?.building?.building_name ?? "-"})`,
              },
              { label: "Tanggal", value: formatDate(detailItem.found_date) },
              {
                label: "No. Telepon",
                value: detailItem.found_phone_number ?? "-",
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                <p className="text-gray-800 font-semibold text-sm">
                  {value ?? "-"}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mt-3">
            <p className="text-gray-400 text-xs mb-1">Deskripsi</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {detailItem.found_description ?? "-"}
            </p>
          </div>
        </AdminModal>
      )}

      {/* Modal Ubah Status */}
      {editItem && (
        <AdminModal
          title="Ubah Status Laporan"
          onClose={() => setEditItem(null)}
        >
          <p className="text-gray-500 text-sm mb-4 truncate font-medium">
            {editItem.found_name}
          </p>
          <div className="space-y-2 mb-5">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => setNewStatusId(s.id.toString())}
                className={`w-full py-3 px-4 rounded-xl border text-sm font-medium text-left transition-all ${
                  newStatusId === s.id.toString()
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {newStatusId === s.id.toString() ? "● " : "○ "}
                {s.name}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditItem(null)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {updating ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </AdminModal>
      )}

      {/* Modal Hapus */}
      {deleteTarget && (
        <AdminModal
          title="Hapus Laporan?"
          onClose={() => setDeleteTarget(null)}
        >
          <p className="text-gray-500 text-sm mb-6">
            Laporan{" "}
            <span className="font-semibold text-gray-800">
              "{deleteTarget.found_name}"
            </span>{" "}
            akan dihapus permanen dan tidak bisa dikembalikan.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default AdminLaporan;
