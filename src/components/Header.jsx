import PersonImg from "../assets/person.png";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-[#4A3AFF] to-[#5B4CFF] px-5 py-6 flex justify-between items-center text-white">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={PersonImg}
            alt="Person Image"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm opacity-90">Selamat Datang,</p>
          <p className="text-lg font-semibold">Hi, Ryan</p>
        </div>
      </div>
      <div className="relative">
        <span className="text-2xl">🔔</span>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          3
        </span>
      </div>
    </header>
  );
};

export default Header;
