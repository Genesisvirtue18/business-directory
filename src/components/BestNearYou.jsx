"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { getBusinesses } from "@/lib/api";
import { businessDetailPath, toHomeBusiness } from "@/lib/directory-data";
import { getSavedLocation, requestUserLocation, USER_LOCATION_EVENT } from "@/lib/user-location";

export default function BestNearYou({ fallbackBusinesses = [] }) {
  const [businesses, setBusinesses] = useState(fallbackBusinesses.slice(0, 3));
  const [message, setMessage] = useState("Turn on location to find local businesses around you.");
  const [loading, setLoading] = useState(false);

  const showBusinesses = useCallback((result) => {
    const nearby = (result.items || []).map(toHomeBusiness);
    setBusinesses(nearby);
    setMessage(nearby.length ? "Businesses near your current location." : "No businesses found nearby yet. Try the full directory.");
  }, []);

  const loadNearby = useCallback(async (location) => {
    if (!location) return;
    setLoading(true);
    const result = await getBusinesses({ lat: location.lat, lng: location.lng, sort: "relevance", limit: 3 });
    showBusinesses(result);
    setLoading(false);
  }, [showBusinesses]);

  useEffect(() => {
    const savedLocation = getSavedLocation();
    let active = true;
    if (savedLocation) {
      getBusinesses({ lat: savedLocation.lat, lng: savedLocation.lng, sort: "relevance", limit: 3 })
        .then((result) => { if (active) showBusinesses(result); });
    }
    const onLocationUpdated = (event) => loadNearby(event.detail);
    window.addEventListener(USER_LOCATION_EVENT, onLocationUpdated);
    return () => { active = false; window.removeEventListener(USER_LOCATION_EVENT, onLocationUpdated); };
  }, [loadNearby, showBusinesses]);

  function findNearby() {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      loadNearby(savedLocation);
      return;
    }
    setLoading(true);
    requestUserLocation((location) => {
      if (!location) {
        setMessage("Could not save your location. You can still browse the directory.");
        setLoading(false);
        return;
      }
      loadNearby(location);
    }, (reason) => {
      setMessage(reason === "denied" ? "Location permission was denied. You can still browse the directory." : "Location is unavailable. You can still browse the directory.");
      setLoading(false);
    });
  }

  return (
    <section id="nearby" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-10 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Best Near You</h2>
          <p className="mt-1 text-sm text-slate-500">{message}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/directory" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-50">
            Browse all businesses <ArrowRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={findNearby} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-violet-700 px-4 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-60">
            <MapPin className="h-4 w-4" />{loading ? "Finding nearby..." : "Use my location"}
          </button>
        </div>
      </div>
      {businesses.length ? <div className="grid gap-4 md:grid-cols-3">
        {businesses.map((business) => (
          <Link key={business._id || business.id || business.name} href={businessDetailPath(business)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative h-40 bg-slate-100">
              {business.image ? <Image src={business.image} alt={business.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-3xl font-semibold text-slate-400">{business.name?.slice(0, 1)}</div>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{business.name}</h3>
              </div>
              <p className="mt-1 text-sm text-slate-500">{business.category}</p>
              <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{business.city}</p>
            </div>
          </Link>
        ))}
      </div> : null}
    </section>
  );
}
