"use client";

import { useState } from "react";
import { getSavedLocation, requestUserLocation } from "@/lib/user-location";

export default function UseMyLocationButton({ category, searchTerm }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function locate() {
    setLoading(true);
    setMessage("Finding your location...");
    const continueWithLocation = ({ lat, lng }) => {
        const query = new URLSearchParams(window.location.search);
        if (category) query.set("category", category);
        if (searchTerm) query.set("q", searchTerm);
        query.delete("city"); query.delete("locality"); query.delete("state");
        query.set("lat", Number(lat).toFixed(6));
        query.set("lng", Number(lng).toFixed(6));
        query.set("radiusMeters", query.get("radiusMeters") || "10000");
        query.set("sort", "distance"); query.delete("page");
        window.location.assign(`/directory?${query.toString()}`);
    };
    const savedLocation = getSavedLocation();
    if (savedLocation) return continueWithLocation(savedLocation);
    requestUserLocation(continueWithLocation, (reason) => {
      setLoading(false);
      setMessage(reason === "denied" ? "Location permission was denied. You can still search by city." : "Could not get your location. Try searching by city.");
    });
  }

  return <div className="mt-3 flex flex-wrap items-center gap-3">
    <button type="button" onClick={locate} disabled={loading} className="rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 disabled:opacity-60">
      {loading ? "Finding nearby businesses..." : "Use my location"}
    </button>
    <p role="status" aria-live="polite" className="text-sm text-slate-200">{message}</p>
  </div>;
}
