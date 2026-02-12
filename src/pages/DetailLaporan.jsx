import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' rx='25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3E%3F%3C/text%3E%3C/svg%3E";

const DetailLaporan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const reportData = location.state || {
    title: "Casan Laptop (hilang)",
    images: [],
    type: "Elektronik",
    date: "02/01/2025",
    location: "Gedung Baru - Lt5",
    status: "HILANG",
    finder: {
      name: "Kasim Ahmad",
      role: "Mahasiswa",
      avatar: null,
    },
    description:
      "Saya kehilangan casan laptop Lenovo di Lt 5 gedung baru, ketika saya sedang mengerjakan tugas kelompok disana.",
  };

  const isFound = reportData.status === "DITEMUKAN";

  const images =
    reportData.images && reportData.images.length > 0
      ? reportData.images
      : [FALLBACK_IMAGE];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleBack = () => {
    navigate("/laporan");
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  const handleAvatarError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_AVATAR;
  };

  return (
    <div className="min-h-screen bg-[#3F35D3]">
      <Header />

      <div className="bg-[#F3F7FF] rounded-t-[32px] mt-6 px-4 pt-6 pb-28 min-h-screen">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
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
            alt="Report"
            className="w-full h-[250px] object-cover"
            onError={handleImageError}
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

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50 w-2"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black mb-4">
          {reportData.title}
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
                {reportData.type}
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
                {reportData.date}
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
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-black break-words">
                {reportData.location}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Person Card */}
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={reportData.finder.avatar || FALLBACK_AVATAR}
              alt={reportData.finder.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={handleAvatarError}
            />
            <div>
              <p className="font-semibold text-black">
                {reportData.finder.name}
              </p>
              <p className="text-sm text-gray-500">{reportData.finder.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center hover:bg-[#C8E6C9] transition-colors">
              <svg
                className="w-5 h-5 text-[#4CAF50]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-[#E3F2FD] rounded-full flex items-center justify-center hover:bg-[#BBDEFB] transition-colors">
              <svg
                className="w-5 h-5 text-[#2196F3]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-black mb-2">Status</h3>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
              isFound
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {reportData.status}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-bold text-black mb-3">Deskripsi</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {reportData.description}
          </p>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default DetailLaporan;
