'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { disconnectGoogleProfile, loadGoogleProfileLocations, loadGoogleProfileStatus, selectGoogleProfileLocation, startGoogleProfileConnect } from '../api';

type Location = { accountName: string; locationName: string; title: string; address?: string; city?: string };
export function GoogleBusinessProfileCard({ businessId }: { businessId: string }) {
  const [status, setStatus] = useState<{ configured?: boolean; connected?: boolean; selectedLocation?: { title: string } | null } | null>(null);
  const [locationState, setLocationState] = useState<{ businessId: string; locations: Location[] }>({ businessId: '', locations: [] });
  const locations = locationState.businessId === businessId ? locationState.locations : [];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const autoChooseAttempted = useRef('');
  const locationsLoadedFor = useRef('');
  const refresh = useCallback(async () => { try { setStatus(await loadGoogleProfileStatus(businessId)); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load Google connection'); } }, [businessId]);
  useEffect(() => { const timer = window.setTimeout(() => void refresh(), 0); return () => window.clearTimeout(timer); }, [refresh]);
  useEffect(() => { const timer = window.setTimeout(() => { const result = new URLSearchParams(window.location.search).get('googleBusinessProfile'); if (result === 'error') setError('Google authorization did not complete. Please try connecting again.'); }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    if (!status?.connected) { autoChooseAttempted.current = ''; return; }
    if (status.selectedLocation || autoChooseAttempted.current === businessId) return;
    autoChooseAttempted.current = businessId;
    void (async () => {
      setBusy(true); setError('');
      try {
        const result = await loadGoogleProfileLocations(businessId);
        const availableLocations: Location[] = result.locations || [];
        locationsLoadedFor.current = businessId;
        setLocationState({ businessId, locations: availableLocations });
        if (availableLocations.length === 1) {
          await selectGoogleProfileLocation(businessId, availableLocations[0]);
          await refresh();
        }
      } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load Google locations'); }
      finally { setBusy(false); }
    })();
  }, [businessId, refresh, status?.connected, status?.selectedLocation]);
  const connect = async () => { setBusy(true); setError(''); try { const result = await startGoogleProfileConnect(businessId); window.location.assign(result.authorizationUrl); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to connect Google'); setBusy(false); } };
  const fetchLocations = async () => {
    if (locationsLoadedFor.current === businessId && locations.length > 0) return;
    setBusy(true); setError('');
    try {
      const result = await loadGoogleProfileLocations(businessId);
      locationsLoadedFor.current = businessId;
      setLocationState({ businessId, locations: result.locations || [] });
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load Google locations'); }
    finally { setBusy(false); }
  };
  const choose = async (location: Location) => { setBusy(true); setError(''); try { await selectGoogleProfileLocation(businessId, location); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to select location'); } finally { setBusy(false); } };
  const disconnect = async () => { setBusy(true); setError(''); try { await disconnectGoogleProfile(businessId); locationsLoadedFor.current = ''; setLocationState({ businessId, locations: [] }); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to disconnect Google'); } finally { setBusy(false); } };
  return <section className="rounded-xl border border-[#ccc3d7] bg-white p-4" aria-labelledby="google-profile-heading">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 id="google-profile-heading" className="text-[16px] font-bold">Google Business Profile reviews</h3><p className="mt-1 text-[13px] text-[#4a4455]">{status?.selectedLocation ? `Connected to ${status.selectedLocation.title}` : status?.connected ? 'Connected. Select a location to display reviews.' : 'Connect an account you manage to show its Google reviews separately.'}</p></div>
      {!status?.configured ? <span className="text-sm text-slate-600">Integration is being set up.</span> : status?.connected ? <div className="flex gap-2"><button disabled={busy} onClick={() => void fetchLocations()} className="rounded-lg border border-[#ccc3d7] px-3 py-2 text-[13px] font-semibold disabled:opacity-50">Choose location</button><button disabled={busy} onClick={() => void disconnect()} className="rounded-lg border border-red-200 px-3 py-2 text-[13px] font-semibold text-red-700 disabled:opacity-50">Disconnect</button></div> : <button disabled={busy} onClick={() => void connect()} className="rounded-lg bg-[#5300b7] px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-50">{busy ? 'Connecting…' : 'Connect Google Business Profile'}</button>}
    </div>
    {locations.length > 0 && <label className="mt-4 block text-sm font-medium">Choose the location for this listing<select defaultValue="" disabled={busy} onChange={event => { const location = locations[Number(event.target.value)]; if (location) void choose(location); }} className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3"><option value="" disabled>Select a Google location</option>{locations.map((location, index) => <option key={location.locationName} value={index}>{location.title}{location.address ? ` · ${location.address}` : ''}{location.city ? `, ${location.city}` : ''}</option>)}</select></label>}
    {status?.connected && locations.length === 0 && !busy && <p className="mt-3 text-sm text-slate-600">Use “Choose location” to load locations available to this Google account.</p>}
    {busy && status?.connected && <p className="mt-3 text-sm text-slate-600" role="status">Loading…</p>}{error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
    <p className="mt-3 text-xs text-slate-500">Google reviews remain separate from reviews submitted on this directory.</p>
  </section>;
}
