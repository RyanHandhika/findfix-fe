import Header from "../components/Header";
import ReportCard from "../components/ReportCard";
import Navbar from "../components/Navbar";

const Laporan = () => {
  const stats = [
    { count: 200, label: "Hilang" },
    { count: 200, label: "Ditemukan" },
    { count: 200, label: "Dikembalikan" },
    { count: 200, label: "Tersimpan" },
  ];

  const lostReports = [
    {
      id: 1,
      name: "Wade Waren",
      role: "Mahasiswa",
      time: "2 Jam Lalu",
      itemName: "Charger Laptop",
      location: "Gedung Baru lt 9",
      description: "Charger Berwarna Pink Dengan Stiker Hello Kitty",
      status: "HILANG",
      statusColor: "red",
      borderColor: "#FF4444",
    },
  ];

  const foundReports = [
    {
      id: 2,
      name: "Satpam Kampus",
      role: "Staff",
      time: "15 Menit lalu",
      itemName: "Kunci Motor Honda",
      location: "Parkiran B2",
      description:
        "Kunci Motor Dengan Gantungan Kunci Bentuk Bola Ditemukan Dekat Pos",
      status: "DITEMUKAN",
      statusColor: "green",
      borderColor: "#4CAF50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF] to-[#5B4CFF] pb-20">
      <Header />

      <div className="bg-gray-50 rounded-t-[30px] mt-5 p-5 min-h-screen">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Temukan barang hilang anda disini{" "}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Jumlah Laporan
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.count}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Laporan Kehilangan Terbaru
            </h3>
            <a href="#" className="text-[#4A3AFF] text-sm font-medium">
              View all →
            </a>
          </div>
          {lostReports.map((report) => (
            <ReportCard key={report.id} {...report} />
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Barang Ditemukan Terbaru
            </h3>
            <a href="#" className="text-[#4A3AFF] text-sm font-medium">
              View all →
            </a>
          </div>
          {foundReports.map((report) => (
            <ReportCard key={report.id} {...report} />
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Laporan;
