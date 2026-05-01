import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useNetworkStatus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOffline = () => {
      navigate("/no-internet");
    };

    const handleOnline = () => {
      navigate('/dashboard'); 
    };

    if (!navigator.onLine) {
      navigate("/no-internet");
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate]);
};

export default useNetworkStatus;