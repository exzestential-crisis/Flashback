// hooks/useMediaQuery.ts
import { useEffect, useState } from "react";

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handleChange = () => setMatches(media.matches);

    // Initial match
    setMatches(media.matches);

    // Listen for changes
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
