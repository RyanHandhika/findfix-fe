import Header from "../components/Header";
import Navbar from "../components/Navbar";

const Statistik = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A3AFF]  pb-20">
      <Header />
      <div className="bg-gray-100 rounded-t-[35px] mt-5 px-5 py-6 min-h-screen">
        <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
          Statistics
        </h2>

        {/* LINE CHART CARD */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">
            Barang Hilang
          </h3>

          {/* Chart Box */}
          <div className="border rounded-xl p-3">
            <svg viewBox="0 0 300 120" className="w-full h-[120px]">
              {/* Dashed Line */}
              <polyline
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeDasharray="6,6"
                points="10,90 70,40 130,50 190,20 250,60 290,30"
              />

              <polyline
                fill="none"
                stroke="#9B5CFF"
                strokeWidth="3"
                points="10,100 70,70 130,55 190,65 250,80 290,40"
              />
            </svg>

            {/* yang bulan*/}
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAI</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-2">Deskripsi</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Saya kehilangan casan laptop Lenovo di Lt 5 gedung baru, ketika saya
            sedang mengerjakan tugas kelompok disana, cirinya: berwarna hitam,
            diikat dengan karet, sedikit besar dan berat casannya.
          </p>
        </div>

        {/* chart donat */}
        <div className="bg-white rounded-2xl p-5 shadow-md mb-6 flex justify-center">
          <div className="relative w-[180px] h-[180px] rounded-full bg-conic-gradient">
            <div className="absolute inset-0 m-auto w-[70px] h-[70px] bg-white rounded-full"></div>

            {/* Persen label*/}
            <span className="absolute top-6 right-10 text-xs font-bold text-white">
              25%
            </span>
            <span className="absolute bottom-10 right-6 text-xs font-bold text-white">
              25%
            </span>
            <span className="absolute bottom-6 left-8 text-xs font-bold text-white">
              40%
            </span>
            <span className="absolute top-10 left-6 text-xs font-bold text-white">
              10%
            </span>
          </div>
        </div>

        {/* DESCRIPTION BOTTOM */}

        <div>
          <h3 className="text-base font-bold text-gray-800 mb-2">Deskripsi</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Saya kehilangan casan laptop Lenovo di Lt 5 gedung baru, ketika saya
            sedang mengerjakan tugas kelompok disana, cirinya: berwarna hitam,
            diikat dengan karet, sedikit besar dan berat casannya.
          </p>
        </div>
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* EXTRA STYLE */}
      <style>
        {`
          .bg-conic-gradient {
            background: conic-gradient(
              #ff4d4d 0% 25%,
              #3b82f6 25% 50%,
              #6b7280 50% 90%,
              #f59e0b 90% 100%
            );
          }
        `}
      </style>
    </div>
  );
};

export default Statistik;
