import { useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa";

const ReportItem = ({
  id,
  title,
  image,
  location,
  date,
  status,
  category,
  building,
}) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/laporan/${id}`);
  };

  const STATUS_THEME = {
    DITEMUKAN: {
      border: "#22C55E",
      badge: "bg-green-100 text-green-600",
    },
    HILANG: {
      border: "#EF4444",
      badge: "bg-red-100 text-red-600",
    },
    DIKEMBALIKAN: {
      border: "#3B82F6",
      badge: "bg-blue-100 text-blue-600",
    },
    TERSIMPAN: {
      border: "#F59E0B",
      badge: "bg-yellow-100 text-yellow-600",
    },
  };

  const normalizedStatus = status.toUpperCase();

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden relative"
      style={{
        borderLeft: `5px solid ${STATUS_THEME[normalizedStatus].border || "#CBD5E1"}`,
      }}
    >
      {/* CONTENT */}
      <div className="flex gap-4 p-4">
        {/* IMAGE */}
        <img
          src={image || "https://placehold.co/150x150"}
          alt={title}
          className="w-[100px] h-[100px] rounded-xl object-cover flex-shrink-0"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/150x150?text=No+Image";
          }}
        />

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <span
            className={`flex items-center gap-[5px] text-[9px] px-2.5 py-1 rounded-[5px] font-medium whitespace-nowrap
    ${STATUS_THEME[normalizedStatus].badge || "bg-gray-100 text-gray-600"}
  `}
          >
            <FaCircle className="text-[6px]" />
            STATUS : {normalizedStatus}
          </span>

          <div className="items-start mb-2">
            <h3 className="font-semibold text-[17px] text-black">{title}</h3>
          </div>

          <div className="text-[13px] text-gray-600 mb-1.5 flex items-center">
            <svg
              className="w-4 h-4 mr-1.5 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Lokasi</span>
            <span className="ml-8 truncate">{location}</span>
          </div>

          <div className="text-[13px] text-gray-600 mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-1.5 text-orange-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Tanggal</span>
            <span className="ml-6">{date}</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {category}
            </span>
            <span className="text-[11px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {building}
            </span>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div className="px-4 pb-4">
        <button
          onClick={handleDetailClick}
          className="w-full bg-[#3F35D3] text-white py-3 rounded-xl font-semibold text-[15px] hover:bg-[#342CB8] transition-colors"
        >
          Detail
        </button>
      </div>
    </div>
  );
};

export default ReportItem;
