import { useState, useEffect } from "react";

function useDeviceType() {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const checkDeviceType = () => {
      const isMobile = window.innerWidth <= 768;
      setDeviceType(isMobile ? "mobile" : "desktop");
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  return deviceType;
}

export default useDeviceType;
