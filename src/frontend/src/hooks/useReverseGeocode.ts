import { useEffect, useState } from "react";

interface ReverseGeocodeResult {
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface UseReverseGeocodeReturn {
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useReverseGeocode(
  latitude: number | null,
  longitude: number | null,
): UseReverseGeocodeReturn {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      setAddress(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchAddress = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Using Nominatim OpenStreetMap API for reverse geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "BAT-BUDDY Battery Delivery App",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch address");
        }

        const data: ReverseGeocodeResult = await response.json();

        if (data.display_name) {
          setAddress(data.display_name);
        } else {
          throw new Error("No address found for these coordinates");
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setError("Unable to determine address from coordinates");
        setAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to respect Nominatim's usage policy (max 1 request per second)
    const timeoutId = setTimeout(fetchAddress, 100);

    return () => clearTimeout(timeoutId);
  }, [latitude, longitude]);

  return { address, isLoading, error };
}
