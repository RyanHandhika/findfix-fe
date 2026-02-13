import { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/Header";
import ReportItem from "../components/ReportItem";
import Navbar from "../components/Navbar";
import {
  getReportStats,
  getAllReport,
  getFoundCategories,
  getFoundStatuses,
  getBuildings,
} from "../services/report";
import { useLocation, useSearchParams } from "react-router-dom";

const Laporan = () => {
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showTimeFilter, setShowTimeFilter] = useState(false);

  const [stats, setStats] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const timeOptions = [
    "Semua Waktu",
    "Hari Ini",
    "3 Hari Terakhir",
    "7 Hari Terakhir",
    "30 Hari Terakhir",
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    location: searchParams.get("location") ?? "Semua Lokasi",
    category: searchParams.get("category") ?? "Semua Kategori",
    time: "Semua Waktu",
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catRes, statusRes, buildingRes] = await Promise.all([
          getFoundCategories(),
          getFoundStatuses(),
          getBuildings(),
        ]);

        setCategories(catRes.data.data.data ?? []);
        setStatuses(statusRes.data.data.data ?? []);

        const buildings = buildingRes.data.data ?? [];
        const flatRooms = buildings.flatMap((building) =>
          building.rooms.map((room) => ({
            id: room.id,
            name_room: room.name_room,
            building_name: building.building_name,

            label: `R${room.name_room} (${building.building_name})`,
          })),
        );
        setRooms(flatRooms);
      } catch (error) {
        console.error("Failed to fetch master data:", error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (location.state?.focusSearch) {
      searchRef.current?.focus();
    }
  }, [location.state]);

  useEffect(() => {
    const statusName = searchParams.get("status");
    const foundName = searchParams.get("found_name");
    const categoryName = searchParams.get("category");
    const locationLabel = searchParams.get("location");

    const filters = {};

    if (statusName) {
      const found = statuses.find((s) => s.name === statusName);
      if (found) filters.found_status_id = found.id;
    }
    if (foundName) {
      filters.found_name = foundName;
    }
    if (categoryName) {
      const found = categories.find((c) => c.name === categoryName);
      if (found) filters.found_category_id = found.id;
    }
    if (locationLabel) {
      const found = rooms.find((r) => r.label === locationLabel);
      if (found) filters.room_id = found.id;
    }

    setLoading(true);
    getAllReport(filters)
      .then((res) => setReports(res.data.data.founds ?? []))
      .catch((err) => console.error("Failed to fetch reports:", err))
      .finally(() => setLoading(false));
  }, [searchParams, statuses, categories, rooms]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getReportStats();
        setStats([
          { count: res.data.data.Hilang, label: "Hilang" },
          { count: res.data.data.Ditemukan, label: "Ditemukan" },
          { count: res.data.data.Dikembalikan, label: "Dikembalikan" },
          { count: res.data.data.Tersimpan, label: "Tersimpan" },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (value.trim()) {
            next.set("found_name", value.trim());
          } else {
            next.delete("found_name");
          }
          return next;
        });
      }, 500);
    },
    [setSearchParams],
  );

  const handleCategoryFilter = useCallback(
    (option) => {
      setSelectedFilters((prev) => ({ ...prev, category: option }));
      setShowCategoryFilter(false);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (option === "Semua Kategori") {
          next.delete("category");
        } else {
          next.set("category", option);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const handleLocationFilter = useCallback(
    (option) => {
      setSelectedFilters((prev) => ({ ...prev, location: option }));
      setShowLocationFilter(false);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (option === "Semua Lokasi") {
          next.delete("location");
        } else {
          next.set("location", option);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const handleTimeFilter = useCallback((option) => {
    setSelectedFilters((prev) => ({ ...prev, time: option }));
    setShowTimeFilter(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF]">
      <Header />

      <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 px-4 pt-6 pb-28 min-h-screen">
        <h2 className="text-[17px] font-semibold mb-5 text-black">
          Temukan barang hilang anda disini
        </h2>

        {/* Statistik */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#F5F5F5] rounded-xl py-3 text-center">
              <p className="text-[20px] font-bold text-gray-800">{s.count}</p>
              <p className="text-[10px] text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300"
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
            ref={searchRef}
            type="text"
            placeholder="Search..."
            defaultValue={searchParams.get("found_name") ?? ""}
            onChange={handleSearch}
            className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-sm outline-none text-gray-700"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Lokasi */}
          <button
            onClick={() => {
              setShowLocationFilter(!showLocationFilter);
              setShowCategoryFilter(false);
              setShowTimeFilter(false);
            }}
            className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium bg-white flex items-center gap-1 flex-shrink-0 transition-colors ${
              selectedFilters.location !== "Semua Lokasi"
                ? "border-[#3F35D3] text-[#3F35D3]"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {selectedFilters.location}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Kategori */}
          <button
            onClick={() => {
              setShowCategoryFilter(!showCategoryFilter);
              setShowLocationFilter(false);
              setShowTimeFilter(false);
            }}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium bg-white flex items-center gap-1 flex-shrink-0 transition-colors ${
              selectedFilters.category !== "Semua Kategori"
                ? "border-[#3F35D3] text-[#3F35D3]"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {selectedFilters.category}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Waktu */}
          <button
            onClick={() => {
              setShowTimeFilter(!showTimeFilter);
              setShowLocationFilter(false);
              setShowCategoryFilter(false);
            }}
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium bg-white flex items-center gap-1 flex-shrink-0"
          >
            {selectedFilters.time}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Lokasi */}
        {showLocationFilter && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
            <h3 className="text-center text-[#3F35D3] font-semibold text-lg mb-4">
              Lokasi
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleLocationFilter("Semua Lokasi")}
                className={`w-full py-3 px-4 rounded-full border text-sm ${
                  selectedFilters.location === "Semua Lokasi"
                    ? "border-[#3F35D3] bg-[#3F35D3] text-white"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                Semua Lokasi
              </button>
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleLocationFilter(room.label)}
                  className={`w-full py-3 px-4 rounded-full border text-sm ${
                    selectedFilters.location === room.label
                      ? "border-[#3F35D3] bg-[#3F35D3] text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {/* ✅ Tampilkan format "5001 (Dago)" */}
                  {room.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dropdown Kategori */}
        {showCategoryFilter && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
            <h3 className="text-center text-[#3F35D3] font-semibold text-lg mb-4">
              Kategori
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryFilter("Semua Kategori")}
                className={`w-full py-3 px-4 rounded-full border text-sm ${
                  selectedFilters.category === "Semua Kategori"
                    ? "border-[#3F35D3] bg-[#3F35D3] text-white"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryFilter(cat.name)}
                  className={`w-full py-3 px-4 rounded-full border text-sm ${
                    selectedFilters.category === cat.name
                      ? "border-[#3F35D3] bg-[#3F35D3] text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dropdown Waktu */}
        {showTimeFilter && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
            <h3 className="text-center text-[#3F35D3] font-semibold text-lg mb-4">
              Waktu
            </h3>
            <div className="space-y-2">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleTimeFilter(option)}
                  className={`w-full py-3 px-4 rounded-full border text-sm ${
                    selectedFilters.time === option
                      ? "border-[#3F35D3] bg-[#3F35D3] text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Report Cards */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Memuat data...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Tidak ada laporan ditemukan.
            </p>
          ) : (
            reports.map((item) => (
              <ReportItem
                key={item.id}
                title={item.found_name}
                image={
                  item.found_images?.[0]?.found_img_url ??
                  "https://placehold.co/400x300?text=No+Image"
                }
                location={
                  item.room?.name_room ? `R${item.room.name_room}` : "-"
                }
                date={item.found_date?.split(" ")[0]}
                status={item.status?.name ?? "-"}
                category={item.category?.name ?? "-"}
                building={item.room?.building?.description ?? "-"}
              />
            ))
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Laporan;
