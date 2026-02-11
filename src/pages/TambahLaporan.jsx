import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addNewReport } from "../services/report";

const TambahLaporan = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    room_id: "",
    found_name: "",
    found_category_id: "",
    found_status_id: "1",
    found_description: "",
    found_phone_number: "",
    found_date: new Date().toISOString().split("T")[0],
    found_img: [],
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  // Fetch categories dan statuses dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch(
          "/api/founds/get-found-category",
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch statuses
        const statusesResponse = await fetch("/api/founds/get-found-status");
        const statusesData = await statusesResponse.json();
        setStatuses(statusesData);
      } catch (error) {
        console.error("Error fetching data:", error);

        // Fallback ke data hardcoded jika API gagal
        setCategories([
          { id: 1, name: "Elektronik" },
          { id: 2, name: "Dokumen dan Identitas" },
          { id: 3, name: "Tas dan Dompet" },
          { id: 4, name: "Kendaraan dan Perlengkapannya" },
          { id: 5, name: "Pakaian dan Aksesoris" },
          { id: 6, name: "Lainnya" },
        ]);

        setStatuses([
          { id: 1, name: "Ditemukan" },
          { id: 2, name: "Hilang" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (statusId) => {
    setFormData({
      ...formData,
      found_status_id: statusId.toString(),
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imagePreview.length > 3) {
      alert("Maksimal 3 foto");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImagePreview([...imagePreview, ...newImages]);
    setFormData({
      ...formData,
      found_img: [...formData.found_img, ...files],
    });
  };

  const removeImage = (index) => {
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    const newImages = formData.found_img.filter((_, i) => i !== index);

    setImagePreview(newPreviews);
    setFormData({
      ...formData,
      found_img: newImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.found_name) {
      alert("Judul/Nama Barang harus diisi");
      return;
    }
    if (!formData.found_category_id) {
      alert("Kategori harus dipilih");
      return;
    }
    if (!formData.found_description) {
      alert("Deskripsi Detail harus diisi");
      return;
    }
    if (!formData.room_id) {
      alert("Lokasi Terakhir harus diisi");
      return;
    }
    if (formData.found_img.length === 0) {
      alert("Minimal upload 1 foto");
      return;
    }

    // Buat FormData untuk upload file
    const submitData = new FormData();
    submitData.append("room_id", formData.room_id);
    submitData.append("found_name", formData.found_name);
    submitData.append("found_category_id", formData.found_category_id);
    submitData.append("found_status_id", formData.found_status_id);
    submitData.append("found_description", formData.found_description);
    submitData.append("found_phone_number", formData.found_phone_number);
    submitData.append("found_date", formData.found_date);

    // Append multiple images
    formData.found_img.forEach((image) => {
      submitData.append("found_img[]", image);
    });

    try {
      const response = await addNewReport(submitData);
      console.log("Success:", response);
      alert("Laporan berhasil ditambahkan!");
      navigate("/laporan");
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menambahkan laporan. Silakan coba lagi.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A3AFF] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A3AFF]">
      {/* Header */}
      <div className="px-4 py-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
        >
          <svg
            className="w-6 h-6 text-gray-700"
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
        <h1 className="text-xl font-bold text-white">Tambah Laporan</h1>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative"
        >
          <svg
            className="w-6 h-6 text-[#4A3AFF]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Help Tooltip */}
      {showHelp && (
        <div className="absolute top-20 right-4 bg-white rounded-2xl shadow-xl p-4 w-64 z-50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-800">Panduan Laporan</h3>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-400"
            >
              <svg
                className="w-5 h-5"
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
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Isi semua field dengan lengkap</li>
            <li>• Upload minimal 1 foto</li>
            <li>• Deskripsikan ciri-ciri barang dengan jelas</li>
            <li>• Cantumkan lokasi spesifik</li>
          </ul>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-[#F3F7FF] rounded-t-[32px] px-4 pt-8 pb-32 min-h-screen">
        <form onSubmit={handleSubmit}>
          {/* Judul / Nama Barang */}
          <div className="mb-5">
            <label className="block text-black font-semibold text-base mb-2">
              Judul / Nama Barang
            </label>
            <input
              type="text"
              name="found_name"
              value={formData.found_name}
              onChange={handleInputChange}
              placeholder="Contoh: Dompet Kulit Cokelat"
              className="w-full bg-white rounded-2xl px-5 py-4 text-sm text-gray-700 placeholder-gray-400 outline-none border-2 border-transparent focus:border-[#4A3AFF] focus:shadow-lg focus:shadow-[#4A3AFF]/20 transition-all"
            />
          </div>

          {/* Kategori */}
          <div className="mb-5">
            <label className="block text-black font-semibold text-base mb-2">
              Kategori
            </label>
            <div className="relative">
              <select
                name="found_category_id"
                value={formData.found_category_id}
                onChange={handleInputChange}
                className="w-full bg-white rounded-2xl px-5 py-4 text-sm text-gray-700 outline-none border-2 border-transparent focus:border-[#4A3AFF] focus:shadow-lg focus:shadow-[#4A3AFF]/20 transition-all appearance-none"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
            </div>
          </div>

          {/* Status */}
          <div className="mb-5">
            <label className="block text-black font-semibold text-base mb-2">
              Status
            </label>
            <div className="flex gap-3">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => handleStatusChange(status.id)}
                  className={`flex-1 py-3 px-5 rounded-full font-medium text-sm transition-all ${
                    formData.found_status_id === status.id.toString()
                      ? status.name === "Ditemukan"
                        ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/30"
                        : "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/30"
                      : "bg-white text-gray-600 border-2 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {formData.found_status_id === status.id.toString() && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d={
                            status.name === "Ditemukan"
                              ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              : "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          }
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {status.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi Detail */}
          <div className="mb-5">
            <label className="block text-black font-semibold text-base mb-2">
              Deskripsi Detail
            </label>
            <textarea
              name="found_description"
              value={formData.found_description}
              onChange={handleInputChange}
              placeholder="Jelaskan ciri-ciri atau detail barang..."
              rows={5}
              className="w-full bg-white rounded-2xl px-5 py-4 text-sm text-gray-700 placeholder-gray-400 outline-none border-2 border-transparent focus:border-[#4A3AFF] focus:shadow-lg focus:shadow-[#4A3AFF]/20 transition-all resize-none"
            />
          </div>

          {/* Lokasi Terakhir (Room ID) */}
          <div className="mb-5">
            <label className="block text-black font-semibold text-base mb-2">
              Lokasi Terakhir
            </label>
            <div className="relative">
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                name="room_id"
                value={formData.room_id}
                onChange={handleInputChange}
                placeholder="Contoh: 1 (untuk Gedung Perpustakaan)"
                className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 text-sm text-gray-700 placeholder-gray-400 outline-none border-2 border-transparent focus:border-[#4A3AFF] focus:shadow-lg focus:shadow-[#4A3AFF]/20 transition-all"
              />
            </div>
          </div>

          {/* Nomor Telepon (Opsional) */}
          <div className="mb-5">
            <label className="block text-black font-semibold text-base mb-2">
              Nomor Telepon{" "}
              <span className="text-gray-400 text-sm">(Opsional)</span>
            </label>
            <input
              type="tel"
              name="found_phone_number"
              value={formData.found_phone_number}
              onChange={handleInputChange}
              placeholder="08123456789"
              className="w-full bg-white rounded-2xl px-5 py-4 text-sm text-gray-700 placeholder-gray-400 outline-none border-2 border-transparent focus:border-[#4A3AFF] focus:shadow-lg focus:shadow-[#4A3AFF]/20 transition-all"
            />
          </div>

          {/* Foto Barang */}
          <div className="mb-8">
            <label className="block text-black font-semibold text-base mb-2">
              Foto Barang
            </label>

            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-xl border-2 border-[#4A3AFF]/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-[#4A3AFF]/30 rounded-2xl py-12 flex flex-col items-center justify-center cursor-pointer hover:border-[#4A3AFF] hover:bg-[#4A3AFF]/5 transition-all">
                <div className="w-16 h-16 bg-[#E8E8FF] rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#4A3AFF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  Ketuk untuk mengunggah foto
                </p>
                <p className="text-gray-400 text-xs mt-1">Maksimal 3 foto</p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4A3AFF] text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#3F35D3] transition-colors shadow-lg shadow-[#4A3AFF]/30"
          >
            Kirim Laporan
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>

      <Navbar />
    </div>
  );
};

export default TambahLaporan;
