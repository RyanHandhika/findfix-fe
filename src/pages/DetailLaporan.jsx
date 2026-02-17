import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { getReportById } from "../services/report";
import { getDetailHubs } from "../services/hubs";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

const STATUS_STYLE = {
  Ditemukan: { bg: "bg-green-100", text: "text-green-600" },
  Hilang: { bg: "bg-red-100", text: "text-red-600" },
  Dikembalikan: { bg: "bg-blue-100", text: "text-blue-600" },
  Tersimpan: { bg: "bg-yellow-100", text: "text-yellow-600" },
};

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const DetailLaporan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getReportById(id);
        const reportData = res.data.data;
        setReport(reportData);

        // Fetch hub jika ada location_hub_id
        if (reportData.location_hub_id) {
          try {
            const hubRes = await getDetailHubs(reportData.location_hub_id);
            setHub(hubRes.data.data);
          } catch (hubErr) {
            console.error("Hub tidak ditemukan:", hubErr);
            setHub(null);
          }
        }
      } catch (e) {
        console.error(e);
        setError("Laporan tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3F35D3] flex flex-col">
        <Header />
        <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 flex-1 px-4 pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
          </div>
          <div className="w-full h-[250px] bg-gray-200 rounded-2xl animate-pulse mb-6" />
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#3F35D3] flex flex-col">
        <Header />
        <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-gray-600 font-semibold mb-1">
            Laporan tidak ditemukan
          </p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/laporan")}
            className="px-6 py-2.5 bg-[#3F35D3] text-white rounded-full text-sm font-medium"
          >
            Kembali ke Laporan
          </button>
        </div>
      </div>
    );
  }

  const images =
    report.found_images?.length > 0
      ? report.found_images.map((img) => img.found_img_url)
      : [FALLBACK_IMAGE];

  const statusName = report.status?.name ?? "-";
  const statusStyle = STATUS_STYLE[statusName] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[#3F35D3]">
      <Header />

      <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 px-4 pt-6 pb-28 min-h-screen">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/laporan")}
            className="w-12 h-12 bg-[#3F35D3] rounded-full flex items-center justify-center hover:bg-[#342CB8] transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-black">Detail Laporan</h1>
        </div>

        {/* Image Carousel */}
        <div className="relative mb-6 rounded-2xl overflow-hidden bg-gray-200">
          <img
            src={images[currentImageIndex]}
            alt={report.found_name}
            className="w-full h-[250px] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${index === currentImageIndex ? "bg-white w-6" : "bg-white/50 w-2"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black mb-4">
          {report.found_name}
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Jenis</p>
              <p className="text-sm font-medium text-black break-words">
                {report.category?.name ?? "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Tanggal</p>
              <p className="text-sm font-medium text-black break-words">
                {formatDate(report.found_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Lokasi</p>
              <p className="text-sm font-medium text-black">
                R{report.room?.name_room ?? "-"}
              </p>
              <p className="text-xs text-gray-400">
                {report.room?.building?.building_name ?? "-"}
              </p>
            </div>
          </div>

          {/* Hub Info - selalu tampil */}
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Hubspot</p>
              {report.location_hub_id ? (
                hub ? (
                  <>
                    <p className="text-sm font-medium text-black">
                      {hub.hub_name}
                    </p>
                    {hub.hub_description && (
                      <p className="text-xs text-gray-400">
                        {hub.hub_description}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-400 italic">
                    Loading...
                  </p>
                )
              ) : (
                <p className="text-sm font-medium text-black">-</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
              {report.user?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-black">
                {report.user?.name ?? "Tidak diketahui"}
              </p>
              <p className="text-xs text-gray-400">Pelapor</p>
            </div>
          </div>
          <button
            onClick={() => setShowPhonePopup(true)}
            className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center hover:bg-[#C8E6C9] transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#4CAF50]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-black mb-2">Status</h3>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusName}
          </span>
        </div>

        {/* Deskripsi */}
        {report.found_description && (
          <div>
            <h3 className="text-lg font-bold text-black mb-3">Deskripsi</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {report.found_description}
            </p>
          </div>
        )}
      </div>

      {/* Popup Telepon */}
      {showPhonePopup && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6"
          onClick={() => setShowPhonePopup(false)}
        >
          <div
            className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
              <button
                onClick={() => setShowPhonePopup(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Kontak Pelapor</p>
                <p className="font-semibold text-gray-800">
                  {report.user?.name ?? "Tidak diketahui"}
                </p>
              </div>
            </div>
            {report.found_phone_number ? (
              <div className="bg-gray-50 rounded-2xl p-4 text-center mb-4">
                <p className="text-2xl font-bold text-gray-800 tracking-wide">
                  {report.found_phone_number}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-5 text-center mb-4">
                <p className="text-2xl mb-2">📵</p>
                <p className="text-gray-500 text-sm font-medium">
                  No telp tidak ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default DetailLaporan;
