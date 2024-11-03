import { useEffect, useState } from "react";

export default function useInViewRotation(ref, rotateDeg) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);
  return isInView ? `rotateY(${rotateDeg}deg)` : "rotateY(0deg)";
}
