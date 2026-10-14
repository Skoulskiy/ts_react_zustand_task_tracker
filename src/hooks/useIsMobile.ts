import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}