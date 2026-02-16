import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { getFoundStatistic, getReportCount } from "../services/statistic";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const PIE_CONFIG = {
  Ditemukan: { color: "#22C55E", desc: "Barang sudah berhasil ditemukan" },
  Hilang: { color: "#EF4444", desc: "Barang masih dalam pencarian" },
  Dikembalikan: {
    color: "#3B82F6",
    desc: "Barang sudah dikembalikan ke pemilik",
  },
  Tersimpan: { color: "#F59E0B", desc: "Barang disimpan sementara di admin" },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-gray-600 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: p.color }}
          />
          <span style={{ color: p.color }} className="font-bold">
            {p.value}
          </span>
          <span className="text-gray-400">
            {p.dataKey === "hilang" ? "Hilang" : "Ditemukan"}
          </span>
        </div>
      ))}
    </div>
  );
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const Statistik = () => {
  const [lineData, setLineData] = useState([]);
  const [rawCount, setRawCount] = useState({});
  const [monthlyRaw, setMonthlyRaw] = useState([]);
  const [totalAll, setTotalAll] = useState(0);
  const [loading, setLoading] = useState(true);

  // "year" | "month"
  const [pieFilter, setPieFilter] = useState("year");
  const currentMonth = new Date().getMonth(); // 0-indexed

  // Peak bulan
  const peakHilang = lineData.reduce(
    (acc, d) => (d.hilang > acc.hilang ? d : acc),
    { month: "-", hilang: 0 },
  );
  const peakDitemukan = lineData.reduce(
    (acc, d) => (d.ditemukan > acc.ditemukan ? d : acc),
    { month: "-", ditemukan: 0 },
  );
  const allZero = lineData.every((d) => d.hilang === 0 && d.ditemukan === 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statRes, countRes] = await Promise.all([
          getFoundStatistic(),
          getReportCount(),
        ]);

        const lost = statRes.data.data.statistic_lost ?? {};
        const ret = statRes.data.data.statistic_return ?? {};

        const builtLineData = MONTHS.map((month, i) => ({
          month,
          hilang: lost[String(i + 1)] ?? 0,
          ditemukan: ret[String(i + 1)] ?? 0,
        }));
        setLineData(builtLineData);
        setMonthlyRaw(builtLineData);

        const counts = countRes.data.data ?? {};
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        setTotalAll(total);
        setRawCount(counts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPieData = () => {
    if (pieFilter === "year") {
      return {
        counts: rawCount,
        total: totalAll,
      };
    } else {
      const thisMonth = monthlyRaw[currentMonth] ?? { hilang: 0, ditemukan: 0 };
      const counts = {
        Hilang: thisMonth.hilang,
        Ditemukan: thisMonth.ditemukan,
      };
      const total = thisMonth.hilang + thisMonth.ditemukan;
      return { counts, total };
    }
  };

  const { counts: activeCounts, total: activeTotal } = getPieData();

  const activePieData = Object.entries(activeCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF]">
        <Header />
        <div className="bg-gray-100 rounded-t-[35px] mt-5 px-5 py-6 min-h-screen space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
          <div className="bg-white rounded-2xl p-4 shadow-md h-52 animate-pulse" />
          <div className="bg-white rounded-2xl p-4 shadow-md h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF] pb-20">
      <Header />

      <div className="bg-gray-100 rounded-t-[35px] mt-5 px-5 py-6 min-h-screen space-y-5">
        <h2 className="text-center text-xl font-bold text-gray-800">
          Statistik
        </h2>

        {/* line chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800">
              📈 Laporan Per Bulan
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Perbandingan laporan barang{" "}
              <span className="text-red-400 font-medium">hilang</span> dan{" "}
              <span className="text-emerald-500 font-medium">ditemukan</span>{" "}
              setiap bulan di tahun {new Date().getFullYear()}.
            </p>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 bg-red-400 inline-block rounded" />
              <span className="text-xs text-gray-500">Hilang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 bg-emerald-500 inline-block rounded" />
              <span className="text-xs text-gray-500">Ditemukan</span>
            </div>
          </div>

          {/* Peak info */}
          {!allZero && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {peakHilang.hilang > 0 && (
                <div className="bg-red-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-base">📌</span>
                  <p className="text-xs text-red-600">
                    Hilang terbanyak:{" "}
                    <span className="font-bold">{peakHilang.month}</span>{" "}
                    <span className="font-bold">({peakHilang.hilang})</span>
                  </p>
                </div>
              )}
              {peakDitemukan.ditemukan > 0 && (
                <div className="bg-emerald-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-base">📌</span>
                  <p className="text-xs text-emerald-600">
                    Ditemukan terbanyak:{" "}
                    <span className="font-bold">{peakDitemukan.month}</span>{" "}
                    <span className="font-bold">
                      ({peakDitemukan.ditemukan})
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {allZero ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <p className="text-2xl mb-1">📊</p>
              <p className="text-sm">Belum ada data statistik</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart
                data={lineData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="hilang"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ fill: "#EF4444", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="ditemukan"
                  stroke="#22C55E"
                  strokeWidth={2.5}
                  dot={{ fill: "#22C55E", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* pie chat */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Header + filter dropdown */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800">
                🥧 Distribusi Status Barang
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {pieFilter === "year"
                  ? `Seluruh tahun ${new Date().getFullYear()} · ${activeTotal} laporan`
                  : `${MONTHS_FULL[currentMonth]} ${new Date().getFullYear()} · ${activeTotal} laporan`}
              </p>
            </div>

            {/* Dropdown filter */}
            <select
              value={pieFilter}
              onChange={(e) => setPieFilter(e.target.value)}
              className="ml-3 flex-shrink-0 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="month">{MONTHS_FULL[currentMonth]}</option>
              <option value="year">Tahun {new Date().getFullYear()}</option>
            </select>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-50 my-3" />

          {activePieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <p className="text-2xl mb-1">🥧</p>
              <p className="text-sm">
                {pieFilter === "month"
                  ? `Tidak ada laporan di ${MONTHS_FULL[currentMonth]}`
                  : "Belum ada data laporan"}
              </p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={activePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {activePieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_CONFIG[entry.name]?.color ?? "#CBD5E1"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Legend cards */}
              <div className="mt-2 space-y-2">
                {Object.entries(
                  pieFilter === "month"
                    ? Object.fromEntries(
                        Object.entries(PIE_CONFIG).filter(
                          ([k]) => activeCounts[k] !== undefined,
                        ),
                      )
                    : PIE_CONFIG,
                ).map(([name, cfg]) => {
                  const value = activeCounts[name] ?? 0;
                  const pct =
                    activeTotal > 0
                      ? ((value / activeTotal) * 100).toFixed(1)
                      : 0;
                  return (
                    <div
                      key={name}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                        value > 0
                          ? "bg-gray-50 border-gray-100"
                          : "bg-white border-gray-50 opacity-40"
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-700">
                            {name}
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {value}{" "}
                            <span className="text-xs font-normal text-gray-400">
                              ({pct}%)
                            </span>
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {cfg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Statistik;
