import { useEffect, useState } from "react";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return showSplash ? <Splash /> : <Onboarding />;
}

export default App;
