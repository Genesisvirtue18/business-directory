import React, { useState } from 'react';
import { BusinessListing } from '../types';

interface AdminBusinessesTabProps {
  activeBusinesses: BusinessListing[];
  pendingBusinesses: BusinessListing[];
  onInspectBusiness: (biz: BusinessListing) => void;
  onApproveBusiness: (id: string) => void;
  onRejectBusiness: (id: string, reason?: string) => void;
  onBackToOverview: () => void;
}

export const AdminBusinessesTab: React.FC<AdminBusinessesTabProps> = ({
  activeBusinesses,
  pendingBusinesses,
  onInspectBusiness,
  onApproveBusiness,
  onRejectBusiness,
  onBackToOverview,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const allListings = [...pendingBusinesses, ...activeBusinesses];
  const categories = ['All', ...new Set(allListings.map(item => item.category))];

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
              Business Directory
            </h2>
            <p className="text-[12px] text-[#7b7486]">
              {allListings.length} total local listings managed
            </p>
          </div>
        </div>

      </div>

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
