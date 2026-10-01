import React, { useState } from 'react';
import { Lead } from '../types';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (leadId: string, newStatus: Lead['status']) => void;
  onAddNote?: (leadId: string, note: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const [showCallToast, setShowCallToast] = useState(false);

  if (!isOpen || !lead) return null;

  const handleStatusChange = (status: Lead['status']) => {
    onUpdateStatus(lead.id, status);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !onAddNote) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
  };

  const handleCall = () => {
    setShowCallToast(true);
    setTimeout(() => setShowCallToast(false), 3000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${lead.name}, thank you for reaching out to ${lead.targetBusiness} regarding "${lead.message}". How may we assist you today?`
    );
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl shadow-2xl border border-[#ccc3d7] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#f0edf1] bg-[#fbf8fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5300b7] text-xl">contact_phone</span>
            <h3 className="font-bold text-[16px] text-[#1b1b1e]">Customer Lead Details</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#7b7486] hover:text-[#1b1b1e]">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {showCallToast && (
            <div className="bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between animate-fade-in">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                Connecting direct call to {lead.phone}...
              </span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Connected</span>
            </div>
          )}

          {/* Lead Header info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ebdcff] text-[#260059] font-bold text-base flex items-center justify-center">
                {lead.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-[16px] text-[#1b1b1e]">{lead.name}</h4>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-[13px] text-[#5300b7] font-medium hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">call</span>
                  {lead.phone}
                </a>
                <p className="text-[11px] text-[#7b7486] mt-0.5">Logged {lead.timestamp}</p>
              </div>
            </div>
            <div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
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
          </div>

          {/* Inquiry quote */}
          <div className="bg-[#f6f2f7] p-3.5 rounded-xl border border-[#ccc3d7]/60">
            <span className="text-[11px] uppercase font-bold text-[#7b7486] tracking-wider block mb-1">
              Customer Message / Inquiry
            </span>
            <p className="text-[13px] text-[#1b1b1e] italic leading-relaxed">"{lead.message}"</p>
            <p className="text-[11px] text-[#7b7486] mt-2">Target Storefront: {lead.targetBusiness}</p>
          </div>

          {/* Direct Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCall}
              className="h-9 px-3 rounded-lg bg-[#6d28d9] hover:bg-[#5300b7] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Call +91 {lead.phone.replace(/[^0-9]/g, '').slice(-10)}</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="h-9 px-3 rounded-lg border border-[#ccc3d7] bg-[#ffffff] hover:bg-[#f6f2f7] text-[#1b1b1e] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">chat</span>
              <span>Open WhatsApp</span>
            </button>
          </div>

          {/* Pipeline Stage Selector */}
          <div className="space-y-1.5 pt-2 border-t border-[#f0edf1]">
            <label className="text-[12px] font-semibold text-[#1b1b1e]">Update Pipeline Status:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['New', 'Contacted', 'Converted'] as Lead['status'][]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`py-1.5 px-2 rounded-lg text-[12px] font-semibold transition-all border ${
                    lead.status === st
                      ? 'bg-[#5300b7] text-white border-[#5300b7] shadow-xs'
                      : 'bg-[#fbf8fc] text-[#4a4455] border-[#ccc3d7] hover:bg-[#f0edf1]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Log */}
          <div className="space-y-2 pt-2 border-t border-[#f0edf1]">
            <label className="text-[12px] font-semibold text-[#1b1b1e]">CRM Activity Notes:</label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((n, i) => (
                  <div key={i} className="text-[12px] bg-[#fbf8fc] p-2 rounded border border-[#ccc3d7]/50 text-[#303033]">
                    • {n}
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-[#7b7486] italic">No previous follow-up notes recorded yet.</p>
              )}
            </div>

            {onAddNote && (
              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add quick follow-up note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 text-[12px] px-2.5 py-1.5 rounded-lg border border-[#ccc3d7] focus:outline-none focus:border-[#5300b7]"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-3 py-1.5 bg-[#5300b7] disabled:opacity-40 text-white text-[12px] font-semibold rounded-lg hover:bg-[#6d28d9]"
                >
                  Add
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0edf1] bg-[#fbf8fc] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#5300b7] text-white text-[13px] font-bold hover:bg-[#6d28d9] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
