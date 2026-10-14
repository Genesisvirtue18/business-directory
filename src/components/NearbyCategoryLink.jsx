"use client";

import { getSavedLocation, requestUserLocation } from "@/lib/user-location";

export default function NearbyCategoryLink({ category, fallbackHref, children, className }) {
  function openNearby(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    const fallback = () => window.location.assign(fallbackHref);
    const goToNearby = ({ lat, lng }) => {
        const query = new URLSearchParams({
          category,
          lat: Number(lat).toFixed(6),
          lng: Number(lng).toFixed(6),
          sort: "distance",
        });
        window.location.assign(`/directory?${query.toString()}`);
    };
    const savedLocation = getSavedLocation();
    if (savedLocation) return goToNearby(savedLocation);
    requestUserLocation((location) => location ? goToNearby(location) : fallback(), fallback);
  }

  return <a href={fallbackHref} onClick={openNearby} className={className}>{children}</a>;
}
