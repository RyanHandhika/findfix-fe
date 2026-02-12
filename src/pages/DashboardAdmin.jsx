import { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import StatCard from "../components/admin/StatCard";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalReports: 490,
    activeUsers: 1248,
    completedReports: 356,
    pendingReports: 134,
  });

  const [timeRange, setTimeRange] = useState("7days");

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: { size: 12, weight: "500" },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  // Activity Chart Data
  const activityData = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Laporan Masuk",
        data: [45, 52, 38, 65, 58, 42, 48],
        borderColor: "#4A3AFF",
        backgroundColor: "rgba(74, 58, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Diselesaikan",
        data: [32, 40, 28, 48, 42, 35, 38],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Category Chart Data
  const categoryData = {
    labels: [
      "Elektronik",
      "Dokumen",
      "Tas & Dompet",
      "Kendaraan",
      "Pakaian",
      "Lainnya",
    ],
    datasets: [
      {
        label: "Jumlah Laporan",
        data: [125, 98, 87, 65, 48, 67],
        backgroundColor: [
          "#4A3AFF",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#6B7280",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Status Distribution Data
  const statusData = {
    labels: ["Pending", "Proses", "Selesai", "Ditolak"],
    datasets: [
      {
        data: [134, 128, 356, 22],
        backgroundColor: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  // Recent Activity
  const recentActivities = [
    {
      id: 1,
      user: "Ryan Pratama",
      action: "membuat laporan baru",
      item: "Laptop Dell",
      time: "5 menit lalu",
      type: "report",
    },
    {
      id: 2,
      user: "Admin Sistem",
      action: "mengubah status",
      item: "Laporan #1234",
      time: "15 menit lalu",
      type: "update",
    },
    {
      id: 3,
      user: "Siti Nurhaliza",
      action: "mengembalikan barang",
      item: "Tas Ransel",
      time: "1 jam lalu",
      type: "return",
    },
    {
      id: 4,
      user: "Ahmad Zaki",
      action: "mendaftar sebagai user",
      item: null,
      time: "2 jam lalu",
      type: "user",
    },
  ];

  // Top Locations
  const topLocations = [
    { name: "Smart Building", count: 142, percentage: 29 },
    { name: "Kampus Dago", count: 98, percentage: 20 },
    { name: "Lab Komputer", count: 76, percentage: 15 },
    { name: "Parkiran Utama", count: 54, percentage: 11 },
    { name: "Lainnya", count: 120, percentage: 25 },
  ];

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Monitoring dan analisis sistem FindFix secara real-time"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Laporan"
          value={stats.totalReports}
          icon="📋"
          color="blue"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Pengguna Aktif"
          value={stats.activeUsers}
          icon="👥"
          color="green"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Laporan Selesai"
          value={stats.completedReports}
          icon="✅"
          color="purple"
          trend="up"
          trendValue="+15%"
        />
        <StatCard
          title="Pending"
          value={stats.pendingReports}
          icon="⏳"
          color="orange"
          trend="down"
          trendValue="-5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                📈 Aktivitas Laporan
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Grafik laporan masuk vs diselesaikan
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4A3AFF]"
            >
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="90days">90 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-80">
            <Line data={activityData} options={chartOptions} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            📊 Status Laporan
          </h3>
          <p className="text-sm text-gray-500 mb-6">Distribusi status saat ini</p>
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={statusData}
              options={{
                ...chartOptions,
                cutout: "70%",
                plugins: {
                  ...chartOptions.plugins,
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Chart and Top Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            🏷️ Laporan per Kategori
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Distribusi berdasarkan jenis barang
          </p>
          <div className="h-80">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            📍 Lokasi Terpopuler
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Area dengan laporan terbanyak
          </p>
          <div className="space-y-4">
            {topLocations.map((location, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4A3AFF] to-[#5B4CFF] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">
                      {location.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">
                      {location.count}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({location.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#4A3AFF] to-[#5B4CFF] h-full transition-all duration-500"
                    style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              🕐 Aktivitas Terbaru
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Timeline aktivitas sistem real-time
            </p>
          </div>
          <button className="text-sm text-[#4A3AFF] font-medium hover:underline">
            Lihat Semua
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  activity.type === "report"
                    ? "bg-blue-100"
                    : activity.type === "update"
                    ? "bg-yellow-100"
                    : activity.type === "return"
                    ? "bg-green-100"
                    : "bg-purple-100"
                }`}
              >
                {activity.type === "report"
                  ? "📝"
                  : activity.type === "update"
                  ? "🔄"
                  : activity.type === "return"
                  ? "✅"
                  : "👤"}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  {activity.item && (
                    <span className="font-semibold text-[#4A3AFF]">
                      {activity.item}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;