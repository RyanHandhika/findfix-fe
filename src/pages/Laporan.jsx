import Header from "../components/Header";
import ReportItem from "../components/ReportItem";
import Navbar from "../components/Navbar";

const Laporan = () => {
  const stats = [
    { count: 200, label: "Hilang" },
    { count: 200, label: "Ditemukan" },
    { count: 200, label: "Dikembalikan" },
    { count: 200, label: "Tersimpan" },
  ];

  const reports = [
  {
    id: 1,
    title: "Casan Laptop",
    image: "charger",
    location: "Gedung baru - Lt5",
    date: "02/01/2025",
    status: "DITEMUKAN",
  },
  {
    id: 2,
    title: "Casan Laptop",
    image: "charger",
    location: "Gedung baru - Lt5",
    date: "02/01/2025",
    status: "Hilang",
  },
];


  return (
    <div className="min-h-screen bg-[#3F35D3]">
      <Header />

      {/* White Container */}
      <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 px-4 pt-6 pb-28">
        <h2 className="text-lg font-semibold mb-5">
          Temukan barang hilang anda disini
        </h2>

        {/* Statistik */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-[#F7F7F7] rounded-xl py-3 text-center"
              >
                <p className="text-lg font-semibold text-gray-700">
                  {s.count}
                </p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            ⭕
          </span>
          <input
            placeholder="Search"
            className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-sm outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <button className="w-10 h-10 rounded-full border bg-white flex items-center justify-center">
            ☰
          </button>

          <button className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-600 text-sm font-medium bg-white">
            Smart Building ⌄
          </button>

          <button className="px-4 py-2 rounded-full border text-sm bg-white">
            Elektronik ⌄
          </button>

          <button className="px-4 py-2 rounded-full border text-sm bg-white">
            Hari ini ⌄
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {reports.map((item) => (
            <ReportItem
              key={item.id}
              title={item.title}
              image={item.image}
              location={item.location}
              date={item.date}
              status={item.status}
            />
          ))}
        </div>

      </div>

      <Navbar />
    </div>
  );
};

export default Laporan;
