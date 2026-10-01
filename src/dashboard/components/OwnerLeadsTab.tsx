import React, { useState } from 'react';
import { Lead } from '../types';

interface OwnerLeadsTabProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onBackToDashboard: () => void;
}

export const OwnerLeadsTab: React.FC<OwnerLeadsTabProps> = ({
  leads,
  onSelectLead,
  onBackToDashboard,
}) => {
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Converted'>('All');
  const [search, setSearch] = useState('');

  const filtered = leads.filter((l) => {
    if (filter !== 'All' && l.status !== filter) return false;
    if (
      search &&
      !l.name.toLowerCase().includes(search.toLowerCase()) &&
      !l.message.toLowerCase().includes(search.toLowerCase()) &&
      !l.phone.includes(search)
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
            onClick={onBackToDashboard}
            className="p-1 rounded-lg hover:bg-[#f0edf1] text-[#5300b7] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="text-[20px] font-bold text-[#1b1b1e] font-headline-md">
              Leads CRM &amp; Inquiries
            </h2>
            <p className="text-[12px] text-[#7b7486]">
              {leads.length} high-intent patient inquiries recorded
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['All', 'New', 'Contacted', 'Converted'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
              filter === st
                ? 'bg-[#5300b7] text-white shadow-xs'
                : 'bg-[#f0edf1] text-[#4a4455] hover:bg-[#ebdcff]'
            }`}
          >
            {st} ({st === 'All' ? leads.length : leads.filter((l) => l.status === st).length})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#7b7486]">
          search
        </span>
        <input
          type="text"
          placeholder="Search leads by name, quote, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-[13px] pl-9 pr-3 py-2 rounded-xl bg-white border border-[#ccc3d7] focus:outline-none focus:border-[#5300b7]"
        />
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filtered.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className="bg-white p-3.5 rounded-xl border border-[#ccc3d7] hover:border-[#5300b7] shadow-xs cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#ebdcff] text-[#260059] font-bold text-xs flex items-center justify-center">
                  {lead.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#1b1b1e]">{lead.name}</h4>
                  <p className="text-[12px] text-[#5300b7]">{lead.phone}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  lead.status === 'New'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : lead.status === 'Contacted'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {lead.status}
              </span>
            </div>

            <p className="mt-2 text-[12px] italic text-[#4a4455] bg-[#fbf8fc] p-2 rounded border border-[#ccc3d7]/50">
              "{lead.message}"
            </p>

            <div className="mt-2 flex items-center justify-between text-[11px] text-[#7b7486]">
              <span>{lead.timestamp}</span>
              <span className="text-[#5300b7] font-semibold flex items-center">
                Manage &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
