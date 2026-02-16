import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { getMe } from "../../services/auth";
import {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../services/building";

const EMPTY_BUILDING_FORM = { building_name: "", description: "" };
const EMPTY_ROOM_FORM = { name_room: "", room_description: "" };
const EMPTY_EDIT_ROOM_FORM = { name_room: "", description: "" };

const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-gray-500 text-xs font-medium mb-1 block">
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 bg-gray-50"
    />
  </div>
);

const AdminBuilding = () => {
  const [admin, setAdmin] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});

  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [editBuilding, setEditBuilding] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [buildingForm, setBuildingForm] = useState(EMPTY_BUILDING_FORM);
  const [editBuildingForm, setEditBuildingForm] = useState(EMPTY_BUILDING_FORM);

  const [initRooms, setInitRooms] = useState([]);
  const [initRoomInput, setInitRoomInput] = useState({
    name_room: "",
    description: "",
  });

  const [showAddRoom, setShowAddRoom] = useState(null); // building object
  const [editRoom, setEditRoom] = useState(null); // room + building_id
  const [deleteRoomTarget, setDeleteRoomTarget] = useState(null);
  const [roomForm, setRoomForm] = useState(EMPTY_ROOM_FORM);
  const [editRoomForm, setEditRoomForm] = useState(EMPTY_EDIT_ROOM_FORM);

  useEffect(() => {
    getMe()
      .then((r) => setAdmin(r.data.data))
      .catch(console.error);
  }, []);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const res = await getBuildings();
      setBuildings(res.data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddBuilding = async () => {
    if (
      !buildingForm.building_name.trim() ||
      !buildingForm.description.trim()
    ) {
      alert("Nama dan deskripsi building wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await createBuilding({ ...buildingForm, rooms: initRooms });
      setBuildingForm(EMPTY_BUILDING_FORM);
      setInitRooms([]);
      setInitRoomInput({ name_room: "", description: "" });
      setShowAddBuilding(false);
      fetchBuildings();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal menambah building.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditBuilding = async () => {
    if (
      !editBuildingForm.building_name.trim() ||
      !editBuildingForm.description.trim()
    ) {
      alert("Nama dan deskripsi building wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await updateBuilding(editBuilding.id, editBuildingForm);
      setEditBuilding(null);
      fetchBuildings();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal mengubah building.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBuilding = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteBuilding(deleteTarget.id);
      setDeleteTarget(null);
      fetchBuildings();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal menghapus building.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRoom = async () => {
    if (
      !roomForm.name_room.trim() ||
      !roomForm.room_description.trim() ||
      !showAddRoom
    ) {
      alert("Semua field wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await createRoom({
        building_id: showAddRoom.id,
        name_room: roomForm.name_room,
        room_description: roomForm.room_description,
      });
      setRoomForm(EMPTY_ROOM_FORM);
      setShowAddRoom(null);
      fetchBuildings();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal menambah room.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditRoom = async () => {
    if (
      !editRoomForm.name_room.trim() ||
      !editRoomForm.description.trim() ||
      !editRoom
    ) {
      alert("Semua field wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await updateRoom(editRoom.id, {
        building_id: editRoom.building_id,
        name_room: editRoomForm.name_room,
        description: editRoomForm.description,
      });
      setEditRoom(null);
      fetchBuildings();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal mengubah room.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deleteRoomTarget) return;
    setSaving(true);
    try {
      await deleteRoom(deleteRoomTarget.id);
      setDeleteRoomTarget(null);
      fetchBuildings();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal menghapus room.");
    } finally {
      setSaving(false);
    }
  };

  const addInitRoom = () => {
    if (!initRoomInput.name_room.trim()) return;
    setInitRooms([...initRooms, { ...initRoomInput }]);
    setInitRoomInput({ name_room: "", description: "" });
  };
  const removeInitRoom = (idx) =>
    setInitRooms(initRooms.filter((_, i) => i !== idx));

  const totalRooms = buildings.reduce(
    (acc, b) => acc + (b.rooms?.length ?? 0),
    0,
  );

  return (
    <AdminLayout admin={admin} pageTitle="Manajemen Building">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Manajemen Building
            </h2>
            <p className="text-gray-500 text-sm">
              {buildings.length} building · {totalRooms} room terdaftar
            </p>
          </div>
          <button
            onClick={() => {
              setBuildingForm(EMPTY_BUILDING_FORM);
              setInitRooms([]);
              setShowAddBuilding(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Tambah Building
          </button>
        </div>

        {/* Building List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse"
              >
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : buildings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="text-gray-400 font-medium">Belum ada building</p>
            <p className="text-gray-300 text-sm mt-1">
              Klik "+ Tambah Building" untuk menambahkan
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {buildings.map((building) => {
              const isExpanded = expanded[building.id] ?? true;
              return (
                <div
                  key={building.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Building Header */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <button
                      onClick={() => toggleExpand(building.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                        🏛️
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {building.building_name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {building.description} · {building.rooms?.length ?? 0}{" "}
                          room
                        </p>
                      </div>
                      <span className="ml-2 text-gray-400 text-sm">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setRoomForm(EMPTY_ROOM_FORM);
                          setShowAddRoom(building);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        + Room
                      </button>
                      <button
                        onClick={() => {
                          setEditBuildingForm({
                            building_name: building.building_name,
                            description: building.description,
                          });
                          setEditBuilding(building);
                        }}
                        className="p-1.5 bg-amber-50 text-amber-500 rounded-lg hover:bg-amber-100 transition-colors text-sm"
                        title="Edit Building"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteTarget(building)}
                        className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus Building"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Rooms Grid */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-gray-50 pt-3">
                      {building.rooms?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                          {building.rooms.map((room) => (
                            <div
                              key={room.id}
                              className="bg-gray-50 rounded-xl p-3 flex items-start justify-between group border border-gray-100 hover:border-indigo-200 transition-colors"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-700 text-sm">
                                  R{room.name_room}
                                </p>
                                <p className="text-gray-400 text-xs truncate mt-0.5">
                                  {room.description}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1 flex-shrink-0 ml-1 transition-all">
                                <button
                                  onClick={() => {
                                    setEditRoomForm({
                                      name_room: room.name_room,
                                      description: room.description,
                                    });
                                    setEditRoom({
                                      ...room,
                                      building_id: building.id,
                                    });
                                  }}
                                  className="w-5 h-5 rounded flex items-center justify-center text-amber-400 hover:bg-amber-50 text-xs"
                                  title="Edit Room"
                                >
                                  ✏
                                </button>
                                <button
                                  onClick={() => setDeleteRoomTarget(room)}
                                  className="w-5 h-5 rounded flex items-center justify-center text-red-400 hover:bg-red-50 text-xs"
                                  title="Hapus Room"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-400 text-sm">
                            Belum ada room di building ini.
                          </p>
                          <button
                            onClick={() => {
                              setRoomForm(EMPTY_ROOM_FORM);
                              setShowAddRoom(building);
                            }}
                            className="mt-2 text-indigo-600 text-sm font-medium hover:underline"
                          >
                            + Tambah room pertama
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddBuilding && (
        <AdminModal
          title="Tambah Building Baru"
          onClose={() => setShowAddBuilding(false)}
        >
          <div className="space-y-4">
            <Field
              label="Nama Building"
              value={buildingForm.building_name}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  building_name: e.target.value,
                })
              }
              placeholder="Contoh: Gedung Utara"
            />
            <Field
              label="Deskripsi"
              value={buildingForm.description}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  description: e.target.value,
                })
              }
              placeholder="Contoh: Gedung di sisi utara kampus"
            />

            {/* Room opsional */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Room Awal{" "}
                <span className="text-gray-300 font-normal">(opsional)</span>
              </p>
              <div className="flex gap-2 mb-2">
                <input
                  value={initRoomInput.name_room}
                  onChange={(e) =>
                    setInitRoomInput({
                      ...initRoomInput,
                      name_room: e.target.value,
                    })
                  }
                  placeholder="Nama room (mis. R1001)"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-gray-50"
                />
                <input
                  value={initRoomInput.description}
                  onChange={(e) =>
                    setInitRoomInput({
                      ...initRoomInput,
                      description: e.target.value,
                    })
                  }
                  placeholder="Deskripsi"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-gray-50"
                />
              </div>
              <button
                onClick={addInitRoom}
                className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 whitespace-nowrap"
              >
                + Tambah
              </button>
              {initRooms.length > 0 && (
                <div className="space-y-1">
                  {initRooms.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-1.5"
                    >
                      <span className="text-sm text-gray-700">
                        {r.name_room} —{" "}
                        <span className="text-gray-400 text-xs">
                          {r.description}
                        </span>
                      </span>
                      <button
                        onClick={() => removeInitRoom(i)}
                        className="text-red-400 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddBuilding(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleAddBuilding}
                disabled={saving}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Tambah Building"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {editBuilding && (
        <AdminModal
          title={`Edit — ${editBuilding.building_name}`}
          onClose={() => setEditBuilding(null)}
        >
          <div className="space-y-4">
            <Field
              label="Nama Building"
              value={editBuildingForm.building_name}
              onChange={(e) =>
                setEditBuildingForm({
                  ...editBuildingForm,
                  building_name: e.target.value,
                })
              }
              placeholder="Nama building"
            />
            <Field
              label="Deskripsi"
              value={editBuildingForm.description}
              onChange={(e) =>
                setEditBuildingForm({
                  ...editBuildingForm,
                  description: e.target.value,
                })
              }
              placeholder="Deskripsi building"
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditBuilding(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleEditBuilding}
                disabled={saving}
                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminModal
          title="Hapus Building?"
          onClose={() => setDeleteTarget(null)}
        >
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
            <p className="text-red-600 text-sm font-medium">⚠️ Peringatan!</p>
            <p className="text-red-500 text-xs mt-1">
              Building{" "}
              <span className="font-bold">"{deleteTarget.building_name}"</span>{" "}
              beserta{" "}
              <span className="font-bold">
                {deleteTarget.rooms?.length ?? 0} room
              </span>{" "}
              di dalamnya akan dihapus permanen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteBuilding}
              disabled={saving}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </AdminModal>
      )}

      {showAddRoom && (
        <AdminModal
          title={`Tambah Room — ${showAddRoom.building_name}`}
          onClose={() => setShowAddRoom(null)}
        >
          <div className="space-y-4">
            <Field
              label="Nomor / Nama Room"
              value={roomForm.name_room}
              onChange={(e) =>
                setRoomForm({ ...roomForm, name_room: e.target.value })
              }
              placeholder="Contoh: 5001"
            />
            <Field
              label="Deskripsi"
              value={roomForm.room_description}
              onChange={(e) =>
                setRoomForm({ ...roomForm, room_description: e.target.value })
              }
              placeholder="Contoh: Ruang kelas lantai 5"
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddRoom(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleAddRoom}
                disabled={saving}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Tambah Room"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {editRoom && (
        <AdminModal
          title={`Edit Room — R${editRoom.name_room}`}
          onClose={() => setEditRoom(null)}
        >
          <div className="space-y-4">
            <Field
              label="Nomor / Nama Room"
              value={editRoomForm.name_room}
              onChange={(e) =>
                setEditRoomForm({ ...editRoomForm, name_room: e.target.value })
              }
              placeholder="Nomor room"
            />
            <Field
              label="Deskripsi"
              value={editRoomForm.description}
              onChange={(e) =>
                setEditRoomForm({
                  ...editRoomForm,
                  description: e.target.value,
                })
              }
              placeholder="Deskripsi room"
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditRoom(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleEditRoom}
                disabled={saving}
                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {deleteRoomTarget && (
        <AdminModal
          title="Hapus Room?"
          onClose={() => setDeleteRoomTarget(null)}
        >
          <p className="text-gray-500 text-sm mb-6">
            Room{" "}
            <span className="font-semibold text-gray-800">
              R{deleteRoomTarget.name_room}
            </span>{" "}
            —{" "}
            <span className="text-gray-400">
              {deleteRoomTarget.description}
            </span>{" "}
            akan dihapus permanen.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteRoomTarget(null)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteRoom}
              disabled={saving}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default AdminBuilding;
