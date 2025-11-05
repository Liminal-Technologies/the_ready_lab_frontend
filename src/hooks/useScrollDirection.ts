import { useState, useEffect, useRef } from "react";

type ScrollDirection = "up" | "down";

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("up");
  const prevScrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos > prevScrollPos.current && currentScrollPos > 100) {
        // Scrolling down & past threshold
        setScrollDirection("down");
      } else if (currentScrollPos < prevScrollPos.current) {
        // Scrolling up
        setScrollDirection("up");
      }

      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollDirection;
};
