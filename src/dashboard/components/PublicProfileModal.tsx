import React from 'react';
import { BusinessListing } from '../types';

interface PublicProfileModalProps { isOpen: boolean; onClose: () => void; business: BusinessListing; }

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ isOpen, onClose, business }) => {
  if (!isOpen) return null;
  const address = business.address || {};
  const fullAddress = [address.addressLine1, address.addressLine2, address.landmark, address.locality, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(', ');
  const hours = business.workingHours || [];
  const contacts: [string, string | undefined][] = [['Phone', business.phone], ['Alternate phone', business.alternatePhone], ['WhatsApp', business.whatsapp], ['Email', business.email], ['Website', business.website]];
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div role="dialog" aria-modal="true" aria-labelledby="business-profile-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#ccc3d7] bg-white shadow-2xl">
    <div className="sticky top-0 flex items-center justify-between border-b bg-[#fbf8fc] p-4"><span className="text-[12px] font-bold text-[#5300b7]">Business listing</span><button onClick={onClose} aria-label="Close" className="material-symbols-outlined">close</button></div>
    <div className="space-y-5 p-5">
      <div className="flex items-start gap-4">{business.logo ? <img src={business.logo} alt={`${business.name} logo`} className="h-16 w-16 rounded-xl object-cover" /> : null}<div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 id="business-profile-title" className="text-xl font-bold">{business.name}</h3>{business.verified && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">Verified</span>}</div><p className="mt-1 text-[13px] text-[#4a4455]">{business.category} · {business.status}</p><p className="mt-1 text-sm">⭐ {Number(business.averageRating || 0).toFixed(1)} ({business.reviewsCount || 0} reviews)</p></div></div>
      {business.images?.length ? <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{business.images.map((url, index) => <img key={`${url}-${index}`} src={url} alt={`${business.name} photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />)}</div> : null}
      <section className="rounded-xl bg-[#f6f2f7] p-4"><h4 className="font-bold">About</h4><p className="mt-1 whitespace-pre-wrap text-[13px] text-[#4a4455]">{business.description || 'No description has been provided.'}</p></section>
      <div className="grid gap-4 sm:grid-cols-2"><section><h4 className="font-bold">Contact</h4><dl className="mt-2 space-y-2 text-[13px]">{contacts.filter(([, value]) => value && value !== 'Not added').map(([label, value]) => <div key={label} className="flex flex-col"><dt className="text-[#7b7486]">{label}</dt><dd className="break-all font-medium">{value}</dd></div>)}</dl></section><section><h4 className="font-bold">Address</h4><p className="mt-2 text-[13px] text-[#4a4455]">{fullAddress || business.location || 'Location not added'}</p><h4 className="mt-4 font-bold">Hours</h4><ul className="mt-2 space-y-1 text-[12px]">{hours.map(item => <li key={item.day} className="flex justify-between gap-2 capitalize"><span>{item.day}</span><span>{item.isClosed ? 'Closed' : `${item.opens || ''}–${item.closes || ''}`}</span></li>)}</ul></section></div>
      {business.services?.length ? <section><h4 className="font-bold">Services</h4><div className="mt-2 flex flex-wrap gap-2">{business.services.map(service => <span key={service} className="rounded-full bg-violet-50 px-3 py-1 text-xs text-violet-800">{service}</span>)}</div></section> : null}
    </div>
    <div className="border-t p-4 text-right"><button onClick={onClose} className="rounded-lg bg-[#5300b7] px-4 py-2 text-[13px] font-bold text-white">Done</button></div>
  </div></div>;
};
