import { useState } from "react";
import Header from "../components/Header";
import ReportItem from "../components/ReportItem";
import Navbar from "../components/Navbar";

const Laporan = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    location: "Smart Building",
    category: "Elektronik",
    time: "Hari ini"
  });
  
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showTimeFilter, setShowTimeFilter] = useState(false);

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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq8PVYPojyp_bVPcRmGtJphln9xFL31_hJ1w&s",
      location: "Gedung baru - Lt5",
      date: "02/01/2025",
      status: "DITEMUKAN",
      category: "Elektronik",
      building: "Smart building"
    },
    {
      id: 2,
      title: "Earphone Bluetooth",
      image: "https://i.pinimg.com/736x/37/fb/a3/37fba3a49bc445ebe669a9f52e6ed24e.jpg",
      location: "Gedung baru - Lt5",
      date: "02/01/2025",
      status: "Hilang",
      category: "Elektronik",
      building: "Smart building"
    },
  ];

  const locationOptions = [
    "Smart Building",
    "Kampus Dago",
    "Kampus Miracle",
    "Area Parkiran Smart Building",
    "Area Parkiran Kampus Dago",
    "Lainnya"
  ];

  const categoryOptions = [
    "Elektronik",
    "Dokumen dan Identitas",
    "Tas dan Dompet",
    "Kendaraan dan Perlengkapannya",
    "Pakaian dan Aksesoris",
    "Lainnya"
  ];

  const timeOptions = [
    "Hari Ini",
    "3 Hari Terakhir",
    "7 Hari Terakhir",
    "30 Hari Terakhir",
    "Semua Waktu"
  ];

  return (
    <div className="min-h-screen bg-[#3F35D3]">
      <Header />
      
      {/* White Container */}
      <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 px-4 pt-6 pb-28 min-h-screen">
        <h2 className="text-[17px] font-semibold mb-5 text-black">
          Temukan barang hilang anda disini
        </h2>

        {/* Statistik */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-[#F5F5F5] rounded-xl py-3 text-center"
            >
              <p className="text-[20px] font-bold text-gray-800">
                {s.count}
              </p>
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
            placeholder="Search"
            className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-sm outline-none text-gray-400"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setShowLocationFilter(!showLocationFilter);
              setShowCategoryFilter(false);
              setShowTimeFilter(false);
            }}
            className="px-5 py-2.5 rounded-full border-2 border-[#3F35D3] text-[#3F35D3] text-sm font-medium bg-white flex items-center gap-1 flex-shrink-0"
          >
            {selectedFilters.location}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setShowCategoryFilter(!showCategoryFilter);
              setShowLocationFilter(false);
              setShowTimeFilter(false);
            }}
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium bg-white flex items-center gap-1 flex-shrink-0"
          >
            {selectedFilters.category}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setShowTimeFilter(!showTimeFilter);
              setShowLocationFilter(false);
              setShowCategoryFilter(false);
            }}
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium bg-white flex items-center gap-1 flex-shrink-0"
          >
            {selectedFilters.time}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showLocationFilter && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
            <h3 className="text-center text-[#3F35D3] font-semibold text-lg mb-4">Lokasi</h3>
            <div className="space-y-2">
              {locationOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedFilters({...selectedFilters, location: option});
                    setShowLocationFilter(false);
                  }}
                  className={`w-full py-3 px-4 rounded-full border text-sm ${
                    selectedFilters.location === option 
                      ? 'border-[#3F35D3] bg-[#3F35D3] text-white' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {showCategoryFilter && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
            <h3 className="text-center text-[#3F35D3] font-semibold text-lg mb-4">Kategori</h3>
            <div className="space-y-2">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedFilters({...selectedFilters, category: option});
                    setShowCategoryFilter(false);
                  }}
                  className={`w-full py-3 px-4 rounded-full border text-sm ${
                    selectedFilters.category === option 
                      ? 'border-[#3F35D3] bg-[#3F35D3] text-white' 
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {showTimeFilter && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
            <h3 className="text-center text-[#3F35D3] font-semibold text-lg mb-4">Waktu</h3>
            <div className="space-y-2">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedFilters({...selectedFilters, time: option});
                    setShowTimeFilter(false);
                  }}
                  className={`w-full py-3 px-4 rounded-full border text-sm ${
                    selectedFilters.time === option 
                      ? 'border-[#3F35D3] bg-[#3F35D3] text-white' 
                      : 'border-gray-300 bg-white text-gray-700'
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
          {reports.map((item) => (
            <ReportItem
              key={item.id}
              title={item.title}
              image={item.image}
              location={item.location}
              date={item.date}
              status={item.status}
              category={item.category}
              building={item.building}
            />
          ))}
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Laporan;