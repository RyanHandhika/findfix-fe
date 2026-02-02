const ReportItem = ({
  title,
  image,
  location,
  date,
  status, // "DITEMUKAN" | "Hilang"
}) => {
  const isFound = status === "DITEMUKAN";
  
  return (
    <div
      className="bg-white rounded-2xl shadow-md mb-5 overflow-hidden"
      style={{
        borderLeft: `6px solid ${isFound ? "#22C55E" : "#EF4444"}`,
      }}
    >
      {/* CONTENT */}
      <div className="flex gap-4 p-4">
        {/* IMAGE */}
        <img
          src={image}
          alt={title}
          className="w-24 h-24 rounded-xl object-cover"
        />
        
        {/* INFO */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-[16px]">{title}</h3>
            <span
              className={`text-[11px] px-3 py-1 rounded-full font-medium ${
                isFound
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              STATUS : {status}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-1">
            📍 Lokasi&nbsp;&nbsp;{location}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            📅 Tanggal&nbsp;{date}
          </div>
          
          <div className="flex gap-2">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              Elektronik
            </span>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              Smart building
            </span>
          </div>
        </div>
      </div>
      
      {/* BUTTON */}
      <div className="px-4 pb-4">
        <button className="w-full bg-[#3F35D3] text-white py-3 rounded-xl font-semibold">
          Detail
        </button>
      </div>
    </div>
  );
};

export default ReportItem;