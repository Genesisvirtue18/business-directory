"use client";

import { useEffect } from "react";
import { getSavedLocation, requestUserLocation } from "@/lib/user-location";

let requestedOnEntry = false;

export default function LocationPermissionOnEntry() {
  useEffect(() => {
    // Ask once per browser profile after entry unless coordinates are already saved.
    if (!requestedOnEntry && !getSavedLocation()) {
      requestedOnEntry = true;
      requestUserLocation();
    }
  }, []);

  return null;
}
