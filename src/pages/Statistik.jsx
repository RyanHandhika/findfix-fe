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
  Ditemukan: {
    color: "#22C55E",
    icon: "🟢",
    desc: "Barang sudah berhasil ditemukan",
  },
  Hilang: {
    color: "#EF4444",
    icon: "🔴",
    desc: "Barang masih dalam pencarian",
  },
  Dikembalikan: {
    color: "#3B82F6",
    icon: "🔵",
    desc: "Barang sudah dikembalikan ke pemilik",
  },
  Tersimpan: {
    color: "#F59E0B",
    icon: "🟡",
    desc: "Barang disimpan sementara di admin",
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs font-semibold text-gray-600">{label}</p>
        <p className="text-sm font-bold text-indigo-600">
          {payload[0].value} laporan
        </p>
      </div>
    );
  }
  return null;
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

const Statistik = () => {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [rawCount, setRawCount] = useState({});
  const [totalAll, setTotalAll] = useState(0);
  const [loading, setLoading] = useState(true);

  // Bulan dengan laporan terbanyak
  const peakMonth = lineData.reduce(
    (acc, d) => (d.total > acc.total ? d : acc),
    { month: "-", total: 0 },
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statRes, countRes] = await Promise.all([
          getFoundStatistic(),
          getReportCount(),
        ]);

        const statistic = statRes.data.data.statistic ?? {};
        setLineData(
          Object.entries(statistic).map(([month, total]) => ({
            month: MONTHS[parseInt(month) - 1],
            total,
          })),
        );

        const counts = countRes.data.data ?? {};
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        setTotalAll(total);
        setRawCount(counts);
        setPieData(
          Object.entries(counts)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value })),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

      <div className="bg-gray-100 rounded-t-[35px] mt-5 px-5 py-6 min-h-screen pb-28 space-y-5">
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
              Grafik ini menunjukkan jumlah laporan barang yang masuk setiap
              bulan sepanjang tahun {new Date().getFullYear()}.
            </p>
          </div>

          {peakMonth.total > 0 && (
            <div className="bg-indigo-50 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
              <span className="text-lg">📌</span>
              <p className="text-xs text-indigo-700">
                Laporan terbanyak di bulan{" "}
                <span className="font-bold">{peakMonth.month}</span> dengan{" "}
                <span className="font-bold">{peakMonth.total} laporan</span>
              </p>
            </div>
          )}

          {lineData.every((d) => d.total === 0) ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <p className="text-2xl mb-1">📊</p>
              <p className="text-sm">Belum ada data statistik</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
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
                  dataKey="total"
                  stroke="#4A3AFF"
                  strokeWidth={2.5}
                  dot={{ fill: "#4A3AFF", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* pie chat */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-800">
              🥧 Distribusi Status Barang
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Diagram ini memperlihatkan perbandingan status dari seluruh
              laporan. Total{" "}
              <span className="font-semibold text-gray-600">
                {totalAll} laporan
              </span>{" "}
              telah tercatat di sistem.
            </p>
          </div>

          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <p className="text-2xl mb-1">🥧</p>
              <p className="text-sm">Belum ada data laporan</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_CONFIG[entry.name]?.color ?? "#CBD5E1"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-2 space-y-2">
                {Object.entries(PIE_CONFIG).map(([name, cfg]) => {
                  const value = rawCount[name] ?? 0;
                  const pct =
                    totalAll > 0 ? ((value / totalAll) * 100).toFixed(1) : 0;
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      {/* Warna dot */}
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cfg.color }}
                      />
                      {/* Info */}
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
