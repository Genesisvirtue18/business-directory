import React, { useState } from 'react';
import { importBusinessesCsv } from '../api';
import { BusinessListing } from '../types';

interface AdminBusinessesTabProps {
  activeBusinesses: BusinessListing[];
  pendingBusinesses: BusinessListing[];
  onInspectBusiness: (biz: BusinessListing) => void;
  onApproveBusiness: (id: string) => void;
  onRejectBusiness: (id: string, reason?: string) => void;
  onClearGooglePlaceMismatch: (id: string) => void;
  onBackToOverview: () => void;
  onBusinessesImported: (businesses: BusinessListing[]) => void;
}

export const AdminBusinessesTab: React.FC<AdminBusinessesTabProps> = ({
  activeBusinesses,
  pendingBusinesses,
  onInspectBusiness,
  onApproveBusiness,
  onRejectBusiness,
  onClearGooglePlaceMismatch,
  onBackToOverview,
  onBusinessesImported,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importResult, setImportResult] = useState<{ createdCount: number; failed: { row: number; businessName: string; message: string }[] } | null>(null);

  const allListings = [...pendingBusinesses, ...activeBusinesses];
  const categories = ['All', ...new Set(allListings.map(item => item.category))];

  const importFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError('');
    setImportResult(null);
    try {
      const result = await importBusinessesCsv(file);
      setImportResult({ createdCount: result.createdCount, failed: result.failed });
      onBusinessesImported(result.businesses);
    } catch (reason) {
      setImportError(reason instanceof Error ? reason.message : 'Unable to import business CSV');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const filtered = allListings.filter((b) => {
    if (filterCategory !== 'All' && b.category !== filterCategory) return false;
    if (filterStatus !== 'All' && b.status !== filterStatus) return false;
    if (
      search &&
      !b.name.toLowerCase().includes(search.toLowerCase()) &&
      !b.owner.toLowerCase().includes(search.toLowerCase()) &&
      !b.location.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 md:pb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToOverview}
            className="p-1 rounded-lg hover:bg-[#f0edf1] text-[#5300b7] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="text-[20px] font-bold text-[#1b1b1e] font-headline-md">
              Businesses
            </h2>
            <p className="text-[12px] text-[#7b7486]">
              {allListings.length} total local listings managed
            </p>
          </div>
        </div>

      </div>

      <section className="rounded-xl border border-[#ccc3d7] bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-[#1b1b1e]">Bulk upload businesses</h3>
            <p className="mt-1 max-w-3xl text-[12px] text-[#7b7486]">
              Import up to 500 listings at a time. Valid rows are submitted for admin review. Required fields: business name, owner email, category, description, services, phone, email, address line 1, city, and state. Use pipe separators (|) for lists and download the sample for all supported columns.
            </p>
          </div>
          <a href="/business-upload-template.csv" download className="rounded-lg border border-[#5300b7] px-3 py-2 text-[12px] font-semibold text-[#5300b7] hover:bg-[#f7f1ff]">
            Download CSV template
          </a>
        </div>
        <label className="mt-3 block text-[12px] font-medium text-[#4a4455]">
          Select a business CSV
          <input type="file" accept=".csv,text/csv" disabled={importing} onChange={event => void importFile(event)} className="mt-1 block w-full text-[12px] file:mr-3 file:rounded-lg file:border-0 file:bg-[#5300b7] file:px-3 file:py-2 file:font-semibold file:text-white disabled:opacity-50" />
        </label>
        {importing && <p role="status" className="mt-3 text-[12px] text-[#5300b7]">Importing CSV and validating each row…</p>}
        {importError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-[12px] text-red-700">{importError}</p>}
        {importResult && <div role="status" className="mt-3 rounded-lg bg-[#f7f1ff] p-3 text-[12px] text-[#3d176e]">
          <p className="font-semibold">{importResult.createdCount} business{importResult.createdCount === 1 ? '' : 'es'} submitted for admin review; {importResult.failed.length} row{importResult.failed.length === 1 ? '' : 's'} failed.</p>
          {importResult.failed.length > 0 && <ul className="mt-2 space-y-1">
            {importResult.failed.slice(0, 20).map(failure => <li key={`${failure.row}-${failure.businessName}`}>Row {failure.row}{failure.businessName ? ` (${failure.businessName})` : ''}: {failure.message}</li>)}
            {importResult.failed.length > 20 && <li>And {importResult.failed.length - 20} more failed rows.</li>}
          </ul>}
        </div>}
      </section>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
              filterCategory === cat
                ? 'bg-[#5300b7] text-white shadow-xs'
                : 'bg-[#f0edf1] text-[#4a4455] hover:bg-[#ebdcff]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and status filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#7b7486]">
            search
          </span>
          <input
            type="text"
            placeholder="Search businesses, owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-[13px] pl-9 pr-3 py-2 rounded-xl bg-white border border-[#ccc3d7] focus:outline-none focus:border-[#5300b7]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-[12px] px-2.5 py-2 rounded-xl border border-[#ccc3d7] bg-white font-medium text-[#1b1b1e] focus:outline-none"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Listings items */}
      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((biz) => (
          <div
            key={biz.id}
            className="bg-white p-3.5 rounded-xl border border-[#ccc3d7] shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-[14px] text-[#1b1b1e]">{biz.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${biz.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : biz.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' : biz.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}
                  >
                    {biz.status}
                  </span>
                </div>
                <p className="text-[12px] text-[#4a4455] mt-0.5">Owner: {biz.owner}</p>
                <p className="text-[11px] text-[#7b7486]">
                  {biz.category} • {biz.location}
                </p>
                {biz.googlePlaceVerificationStatus === 'mismatch' && <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900"><p className="font-semibold">Google Place ID mismatch. It is not proof of ownership.</p><button onClick={() => onClearGooglePlaceMismatch(biz.id)} className="mt-1 font-semibold underline">Clear mismatched Place ID</button></div>}
              </div>

              <button
                onClick={() => onInspectBusiness(biz)}
                className="p-1 text-[#5300b7] hover:bg-[#ebdcff] rounded-lg cursor-pointer"
                title="View Listing Details"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>

            {biz.status === 'Pending' ? (
              <div className="pt-2 border-t border-[#f0edf1] space-y-2">
                <label className="block text-[11px] font-medium text-[#7b7486]">Reason if rejecting<textarea value={rejectionReasons[biz.id] || ''} onChange={event => setRejectionReasons(current => ({ ...current, [biz.id]: event.target.value }))} maxLength={2000} className="mt-1 w-full rounded-lg border border-[#ccc3d7] p-2 text-[12px] text-[#1b1b1e]" placeholder="Tell the owner what needs to change (optional)" /></label>
                <div className="flex items-center gap-2">
                <button
                  onClick={() => onApproveBusiness(biz.id)}
                  disabled={biz.googlePlaceVerificationStatus === 'mismatch'}
                  title={biz.googlePlaceVerificationStatus === 'mismatch' ? 'A mismatched Google Place ID must be corrected before approval.' : undefined}
                  className="flex-1 py-1.5 bg-[#6d28d9] hover:bg-[#5300b7] text-white text-[12px] font-bold rounded-lg cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => onRejectBusiness(biz.id, rejectionReasons[biz.id]?.trim())}
                  className="flex-1 py-1.5 bg-white border border-[#ccc3d7] text-[#ba1a1a] text-[12px] font-bold rounded-lg cursor-pointer"
                >
                  Reject
                </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-[#f0edf1] flex items-center justify-between text-[11px] text-[#7b7486]">
                <span className={`flex items-center gap-1 font-semibold ${biz.status === 'Active' ? 'text-emerald-700' : biz.status === 'Rejected' ? 'text-red-700' : 'text-slate-600'}`}>
                  <span className="material-symbols-outlined text-xs">{biz.status === 'Active' ? 'verified' : biz.status === 'Rejected' ? 'cancel' : 'draft'}</span>
                  {biz.status === 'Active' ? 'Live on Directory' : biz.status}
                </span>
                <span>Phone: {biz.phone}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};
