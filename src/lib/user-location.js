export const USER_LOCATION_KEY = "genesis_virtue_user_location";
export const USER_LOCATION_EVENT = "genesis-virtue:location-updated";

export function getSavedLocation() {
  try {
    const location = JSON.parse(window.localStorage.getItem(USER_LOCATION_KEY) || "null");
    return Number.isFinite(location?.lat) && Number.isFinite(location?.lng) ? location : null;
  } catch {
    return null;
  }
}

export function saveLocation({ lat, lng }) {
  const location = { lat: Number(lat), lng: Number(lng), savedAt: Date.now() };
  if (!Number.isFinite(location.lat) || !Number.isFinite(location.lng)) return null;
  try {
    window.localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(location));
    window.dispatchEvent(new CustomEvent(USER_LOCATION_EVENT, { detail: location }));
  } catch {
    // Location features still work for this visit when storage is unavailable.
  }
  return location;
}

export function requestUserLocation(onSuccess, onFailure) {
  if (!navigator.geolocation) {
    onFailure?.("unsupported");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const location = saveLocation({ lat: coords.latitude, lng: coords.longitude });
      onSuccess?.(location);
    },
    (error) => onFailure?.(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
}
