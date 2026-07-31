import fetch from "node-fetch";

/**
 * Returns distance in km between two lat/lng points.
 * Uses Google Distance Matrix API if a key is configured (accounts for real
 * road distance/travel time). Falls back to straight-line Haversine distance
 * otherwise, so the app works before you plug in a real key.
 */
export async function getDistanceKm(origin, destination) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey && apiKey !== "your_google_maps_api_key_here") {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const meters = data?.rows?.[0]?.elements?.[0]?.distance?.value;
      if (meters) return meters / 1000;
    } catch (err) {
      console.error("Google Maps API failed, falling back to Haversine:", err.message);
    }
  }

  return haversineKm(origin, destination);
}

function haversineKm(a, b) {
  const R = 6371; // Earth radius km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
