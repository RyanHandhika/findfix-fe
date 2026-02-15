import { useState } from "react";

const Avatar = ({ name = "", src = "" }) => {
  const [imgError, setImgError] = useState(false);

  const initial = name.trim().charAt(0).toUpperCase();

  const colors = [
    "bg-blue-400",
    "bg-purple-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-indigo-400",
    "bg-pink-400",
    "bg-teal-400",
  ];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
      {!imgError && src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`w-full h-full ${bgColor} flex items-center justify-center`}
        >
          <span className="text-white text-base font-semibold">{initial}</span>
        </div>
      )}
    </div>
  );
};

function ReportCard({
  name,
  role,
  time,
  avatar,
  itemName,
  location,
  description,
  status,
  statusColor,
  borderColor,
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-md mb-4"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={name} src={avatar} />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-xs text-gray-400">
            {role} | {time}
          </p>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Nama Barang :</span>
          <span className="text-sm font-semibold text-gray-800">
            {itemName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Lokasi :</span>
          <span className="text-sm font-semibold text-gray-800">
            📍 {location}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 italic mb-3 leading-relaxed">
        {description}
      </p>

      <div
        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
          statusColor === "red"
            ? "bg-red-50 text-red-500"
            : "bg-green-50 text-green-500"
        }`}
      >
        ● STATUS : {status}
      </div>
    </div>
  );
}

export default ReportCard;
