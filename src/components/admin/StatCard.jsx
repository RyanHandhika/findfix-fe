const StatCard = ({ title, value, icon, color, trend, trendValue }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${
            colorClasses[color] || colorClasses.blue
          } rounded-xl flex items-center justify-center text-2xl shadow-lg`}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
          <span
            className={`text-xs font-bold ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? "↗" : "↘"} {trendValue}
          </span>
          <span className="text-xs text-gray-400">vs bulan lalu</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;