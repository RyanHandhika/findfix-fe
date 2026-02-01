import { Link } from "react-router";
import OnboardingImg from "../assets/onboarding.png";

const Onboarding = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="w-90 h-90 rounded-full mb-6 flex items-center justify-center">
        <img
          src={OnboardingImg}
          alt="Onboarding illustration"
          className="w-full h-full object-contain"
        />
      </div>

      <h2 className="text-3xl font-bold text-indigo-600">Temukan & Laporkan</h2>
      <h3 className="text-xl font-semibold mb-3">Barang Hilang di Kampus</h3>

      <p className="text-gray-500 mb-6">
        Temukan barang hilang dengan cepat dan mudah di lingkungan kampus.
      </p>

      <Link
        to="/login"
        className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:bg-indigo-700 transition w-70 cursor-pointer"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Onboarding;
