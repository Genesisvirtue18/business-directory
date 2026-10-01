import React, { useState } from 'react';
import { BusinessListing, Lead } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessListing[];
  leads: Lead[];
  onSelectBusiness: (biz: BusinessListing) => void;
  onSelectLead: (lead: Lead) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  businesses,
  leads,
  onSelectBusiness,
  onSelectLead,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase()) ||
      b.location.toLowerCase().includes(query.toLowerCase()) ||
      b.owner.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.phone.toLowerCase().includes(query.toLowerCase()) ||
      l.message.toLowerCase().includes(query.toLowerCase()) ||
      l.targetBusiness.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-2xl shadow-2xl border border-[#ccc3d7] overflow-hidden">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#f0edf1] bg-[#fbf8fc]">
          <span className="material-symbols-outlined text-[#7b7486] text-xl mr-2">search</span>
          <input
            type="text"
            autoFocus
            placeholder="Search listings, categories, leads, or doctors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-[14px] bg-transparent focus:outline-none text-[#1b1b1e] placeholder-[#7b7486]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#7b7486] hover:text-[#1b1b1e] mr-1"
            >
              <span className="material-symbols-outlined text-sm">cancel</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[12px] font-semibold text-[#5300b7] hover:underline shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-3">
          {/* Quick Categories filter */}
          {!query && (
            <div className="p-2 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7b7486]">
                Popular Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Healthcare', 'Restaurants', 'Retail', 'Services', 'Education'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="px-2.5 py-1 rounded-full text-[12px] bg-[#f0edf1] hover:bg-[#ebdcff] hover:text-[#5300b7] text-[#4a4455] transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Business Results */}
          {filteredBusinesses.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7b7486] px-2 block">
                Business Directory ({filteredBusinesses.length})
              </span>
              {filteredBusinesses.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelectBusiness(b);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f6f2f7] cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1b1b1e]">{b.name}</h4>
                    <p className="text-[11px] text-[#7b7486]">
                      {b.category} • {b.location}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Lead Results */}
          {filteredLeads.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#f0edf1]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7b7486] px-2 block">
                Customer Leads ({filteredLeads.length})
              </span>
              {filteredLeads.slice(0, 4).map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    onSelectLead(l);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f6f2f7] cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1b1b1e]">{l.name}</h4>
                    <p className="text-[11px] text-[#4a4455] italic truncate max-w-xs">
                      "{l.message}"
                    </p>
                  </div>
                  <span className="text-[10px] text-[#7b7486] shrink-0">{l.phone}</span>
                </div>
              ))}
            </div>
          )}

          {filteredBusinesses.length === 0 && filteredLeads.length === 0 && query && (
            <div className="text-center py-8 text-[#7b7486]">
              <span className="material-symbols-outlined text-3xl">search_off</span>
              <p className="text-[13px] mt-1">No matching results for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
