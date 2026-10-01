import React, { useEffect, useMemo, useState } from 'react';
import { createOwnerBusiness, loadBusinessFormData, loadOwnerBusiness, updateOwnerBusiness, uploadBusinessImages } from '../api';
import { BusinessListing } from '../types';

type Category = { _id: string; name: string; services?: string[]; children?: Category[] };
type Form = Record<string, string>;
type Hours = { day: string; isClosed: boolean; opens: string; closes: string };
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const steps = ['Basic Information', 'Contact Information', 'Address & Location', 'Business Details', 'Working Hours', 'Media & Social', 'Additional Information', 'Review & Publish'];
const emptyForm: Form = { name: '', description: '', category: '', subcategory: '', services: '', phone: '', alternatePhone: '', whatsapp: '', email: '', website: '', addressLine1: '', addressLine2: '', landmark: '', locality: '', city: '', state: '', postalCode: '', country: 'IN', latitude: '', longitude: '', establishedYear: '', teamSize: '', priceRange: '', timeZone: 'Asia/Kolkata', amenities: '', highlights: '', logo: '', images: '', facebook: '', instagram: '', linkedin: '', youtube: '', x: '', faqs: '', offers: '', googlePlaceId: '', mapEmbedUrl: '' };
const split = (value?: string) => (value || '').split(',').map(part => part.trim()).filter(Boolean);
const lines = (value?: string) => (value || '').split('\n').map(part => part.trim()).filter(Boolean);
const textField = (value?: string) => value || '';

export const BusinessProfileForm = ({ businessId, onClose, onSaved }: { businessId?: string; onClose: () => void; onSaved: (business: BusinessListing, created: boolean) => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [hours, setHours] = useState<Hours[]>(days.map(day => ({ day, isClosed: day === 'sunday', opens: '09:00', closes: '17:00' })));
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('Draft');
  const [verification, setVerification] = useState('Pending');
  const [reviewReason, setReviewReason] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));
  const category = useMemo(() => categories.find(item => item._id === form.category), [categories, form.category]);
  const subcategories = category?.children || [];
  const subcategory = subcategories.find(item => item._id === form.subcategory);
  const serviceOptions = subcategory?.services || category?.services || [];
  const selectedServices = split(form.services);

  useEffect(() => { loadBusinessFormData().then(({ categories }) => setCategories(categories)).catch(reason => setError(reason.message)); }, []);
  useEffect(() => {
    if (!businessId) return;
    loadOwnerBusiness(businessId).then(item => {
      setForm({
        ...emptyForm, name: textField(item.name), description: textField(item.description), category: item.category?._id || item.category || '', subcategory: String(item.subcategories?.[0]?._id || item.subcategories?.[0] || ''), services: (item.services || []).join(', '),
        phone: textField(item.phone), alternatePhone: textField(item.alternatePhone), whatsapp: textField(item.whatsapp), email: textField(item.email), website: textField(item.website),
        addressLine1: textField(item.address?.addressLine1), addressLine2: textField(item.address?.addressLine2), landmark: textField(item.address?.landmark), locality: textField(item.address?.locality), city: textField(item.address?.city), state: textField(item.address?.state), postalCode: textField(item.address?.postalCode), country: textField(item.address?.country || 'IN'), latitude: item.location?.coordinates?.[1]?.toString() || '', longitude: item.location?.coordinates?.[0]?.toString() || '',
        establishedYear: item.establishedYear?.toString() || '', teamSize: item.teamSize?.toString() || '', priceRange: textField(item.priceRange), timeZone: textField(item.timeZone || 'Asia/Kolkata'), amenities: (item.amenities || []).join(', '), highlights: (item.highlights || []).join(', '), logo: textField(item.logo), images: (item.images || []).join(', '),
        facebook: textField(item.socialLinks?.facebook), instagram: textField(item.socialLinks?.instagram), linkedin: textField(item.socialLinks?.linkedin), youtube: textField(item.socialLinks?.youtube), x: textField(item.socialLinks?.x),
        faqs: (item.faqs || []).map((faq: any) => `${faq.question} | ${faq.answer}`).join('\n'), offers: (item.offers || []).map((offer: any) => [offer.title, offer.description, offer.code].filter(Boolean).join(' | ')).join('\n'), googlePlaceId: textField(item.googlePlaceId), mapEmbedUrl: textField(item.mapEmbedUrl),
      });
      if (item.workingHours?.length) setHours(days.map(day => item.workingHours.find((entry: Hours) => entry.day === day) || { day, isClosed: true, opens: '', closes: '' }));
      setStatus(item.listingStatus || 'draft'); setVerification(item.verificationStatus || 'pending');
      setReviewReason(item.rejectionReason || '');
    }).catch(reason => setError(reason.message));
  }, [businessId]);

  const input = (key: string, label: string, type = 'text', options: { required?: boolean; placeholder?: string } = {}) => <label className="block text-sm font-medium text-slate-700">{label}{options.required ? ' *' : ''}<input type={type} required={options.required} value={form[key] || ''} placeholder={options.placeholder} onChange={event => set(key, event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" /></label>;
  const textarea = (key: string, label: string, placeholder = '') => <label className="block text-sm font-medium text-slate-700">{label}<textarea value={form[key] || ''} placeholder={placeholder} onChange={event => set(key, event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-violet-500" /></label>;
  const toggleService = (service: string) => set('services', selectedServices.includes(service) ? selectedServices.filter(value => value !== service).join(', ') : [...selectedServices, service].join(', '));

  async function upload(event: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'images') {
    const files = Array.from(event.target.files || []); if (!files.length) return;
    if (target === 'images' && split(form.images).length + files.length > 30) { setError('A listing can have up to 30 photos.'); event.target.value = ''; return; }
    setUploading(true); setError('');
    try {
      const urls = await uploadBusinessImages(files);
      set(target, target === 'logo' ? urls[0] || '' : [...split(form.images), ...urls].join(', '));
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to upload images'); }
    finally { setUploading(false); event.target.value = ''; }
  }

  function validateStep() {
    if (step === 0 && (!form.name.trim() || !form.category)) return 'Enter a business name and select a category.';
    if (step === 2 && Boolean(form.latitude) !== Boolean(form.longitude)) return 'Enter both latitude and longitude, or leave both blank.';
    if (step === 2 && form.latitude && (Number(form.latitude) < -90 || Number(form.latitude) > 90 || Number(form.longitude) < -180 || Number(form.longitude) > 180)) return 'Coordinates are outside the valid latitude/longitude range.';
    if (step === 4 && hours.some(day => !day.isClosed && (!day.opens || !day.closes))) return 'Add opening and closing times, or mark each day closed.';
    if (step === 7 && (!form.description.trim() || !form.phone.trim() || !form.addressLine1.trim())) return 'A description, phone number, and address line 1 are required to submit for approval.';
    return '';
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateStep(); if (validation) { setError(validation); if (step === 7 && !form.description.trim()) setStep(0); else if (step === 7 && !form.phone.trim()) setStep(1); else if (step === 7) setStep(2); return; }
    if (step < steps.length - 1) { setError(''); setStep(current => current + 1); return; }
    setSaving(true); setError('');
    try {
      const location = form.latitude && form.longitude ? { type: 'Point', coordinates: [Number(form.longitude), Number(form.latitude)] } : undefined;
      const faqs = lines(form.faqs).map(line => { const [question, ...answer] = line.split('|').map(part => part.trim()); return { question, answer: answer.join(' | ') }; }).filter(item => item.question && item.answer);
      const offers = lines(form.offers).map(line => { const [title, description, code] = line.split('|').map(part => part.trim()); return { title, ...(description ? { description } : {}), ...(code ? { code } : {}) }; }).filter(item => item.title);
      const payload = {
        name: form.name.trim(), description: form.description || undefined, category: form.category, subcategories: form.subcategory ? [form.subcategory] : [], services: selectedServices,
        phone: form.phone || undefined, alternatePhone: form.alternatePhone || undefined, whatsapp: form.whatsapp || undefined, email: form.email || undefined, website: form.website || undefined,
        address: { addressLine1: form.addressLine1, addressLine2: form.addressLine2, landmark: form.landmark, locality: form.locality, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country || 'IN' }, location: location || null,
        establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined, teamSize: form.teamSize ? Number(form.teamSize) : undefined, priceRange: form.priceRange || undefined, timeZone: form.timeZone || undefined, amenities: split(form.amenities), highlights: split(form.highlights),
        workingHours: hours.map(({ day, isClosed, opens, closes }) => ({ day, isClosed, ...(isClosed ? {} : { opens, closes }) })), logo: form.logo, images: split(form.images),
        socialLinks: Object.fromEntries(Object.entries({ facebook: form.facebook, instagram: form.instagram, linkedin: form.linkedin, youtube: form.youtube, x: form.x }).filter(([, value]) => value)),
        faqs, offers, googlePlaceId: form.googlePlaceId || undefined, mapEmbedUrl: form.mapEmbedUrl,
      };
      const saved = businessId ? await updateOwnerBusiness(businessId, payload) : await createOwnerBusiness(payload);
      onSaved(saved, !businessId);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save business'); }
    finally { setSaving(false); }
  }

  const preview = [form.name, category?.name, form.description, form.phone, form.email, [form.addressLine1, form.locality, form.city, form.state].filter(Boolean).join(', '), `${split(form.images).length} photos`, `${selectedServices.length} services`].filter(Boolean);
  const reviewSections = [
    { title: 'Contact', value: [form.phone, form.alternatePhone && `Alt: ${form.alternatePhone}`, form.whatsapp && `WhatsApp: ${form.whatsapp}`, form.email, form.website].filter(Boolean).join(' · ') },
    { title: 'Address and coordinates', value: [[form.addressLine1, form.addressLine2, form.landmark, form.locality, form.city, form.state, form.postalCode, form.country].filter(Boolean).join(', '), form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : 'No coordinates'].filter(Boolean).join(' · ') },
    { title: 'Business details', value: [form.establishedYear && `Since ${form.establishedYear}`, form.teamSize && `${form.teamSize} team members`, form.priceRange, form.timeZone, split(form.amenities).length && `${split(form.amenities).length} amenities`, split(form.highlights).length && `${split(form.highlights).length} highlights`].filter(Boolean).join(' · ') },
    { title: 'Media and social', value: [`${split(form.images).length} photos`, form.logo ? 'Logo added' : 'No logo', ...(['facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const).filter(key => form[key]).map(key => `${key}: ${form[key]}`)].join(' · ') },
    { title: 'Additional information', value: [`${lines(form.faqs).length} FAQs`, `${lines(form.offers).length} offers`, form.googlePlaceId && `Google Place ID: ${form.googlePlaceId}`, form.mapEmbedUrl && 'Google Maps embed added'].filter(Boolean).join(' · ') },
    { title: 'Weekly hours', value: hours.map(item => item.isClosed ? `${item.day}: closed` : `${item.day}: ${item.opens}–${item.closes}`).join(' · ') },
  ];
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-5"><form onSubmit={submit} className="mx-auto my-3 max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
    <header className="flex items-start justify-between gap-4 border-b p-5"><div><h2 className="text-xl font-bold">{businessId ? 'Edit business' : 'Add your business'}</h2><p className="mt-1 text-sm text-slate-500">Complete each section, then review your listing before sending it for admin approval.</p></div><button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm">Close</button></header>
    <nav aria-label="Business form steps" className="grid grid-cols-4 gap-2 border-b bg-slate-50 p-4 md:grid-cols-8">{steps.map((title, index) => <button key={title} type="button" onClick={() => { if (index <= step) { setStep(index); setError(''); } }} className={`rounded-lg px-2 py-2 text-left text-[11px] font-semibold ${step === index ? 'bg-violet-700 text-white' : index < step ? 'bg-violet-100 text-violet-800' : 'bg-white text-slate-500'}`}><span className="block text-sm">{index + 1}</span>{title}</button>)}</nav>
    <section className="space-y-4 p-5">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mb-2"><h3 className="text-lg font-bold">{steps[step]}</h3><p className="text-sm text-slate-500">Step {step + 1} of {steps.length}</p></div>
      {step === 0 && <div className="grid gap-4 sm:grid-cols-2">{input('name', 'Business name', 'text', { required: true })}<label className="block text-sm font-medium text-slate-700">Category *<select required value={form.category} onChange={event => { set('category', event.target.value); set('subcategory', ''); set('services', ''); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Choose a category</option>{categories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Subcategory<select value={form.subcategory} disabled={!subcategories.length} onChange={event => { set('subcategory', event.target.value); set('services', ''); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Choose a subcategory</option>{subcategories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><div className="sm:col-span-2">{textarea('description', 'Description')}</div><fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-medium">Services</legend>{serviceOptions.length ? <div className="flex flex-wrap gap-2">{serviceOptions.map(service => <label key={service} className={`rounded-full border px-3 py-1.5 text-sm ${selectedServices.includes(service) ? 'border-violet-500 bg-violet-50 text-violet-800' : 'border-slate-200'}`}><input type="checkbox" className="mr-2" checked={selectedServices.includes(service)} onChange={() => toggleService(service)} />{service}</label>)}</div> : <input value={form.services} onChange={event => set('services', event.target.value)} placeholder="Separate services with commas" className="w-full rounded-lg border border-slate-300 px-3 py-2" />}</fieldset></div>}
      {step === 1 && <div className="grid gap-4 sm:grid-cols-2">{input('phone', 'Phone', 'tel')}{input('alternatePhone', 'Alternate phone', 'tel')}{input('whatsapp', 'WhatsApp number', 'tel')}{input('email', 'Email', 'email')}{input('website', 'Website', 'url')}</div>}
      {step === 2 && <div className="grid gap-4 sm:grid-cols-2">{input('addressLine1', 'Address line 1')}{input('addressLine2', 'Address line 2')}{input('landmark', 'Landmark')}{input('locality', 'Locality')}{input('city', 'City')}{input('state', 'State')}{input('postalCode', 'Postal code')}{input('country', 'Country code (ISO 2 letters)')}{input('latitude', 'Latitude', 'number')}{input('longitude', 'Longitude', 'number')}<p className="sm:col-span-2 text-xs text-slate-500">Provide both coordinates to enable map location filtering.</p></div>}
      {step === 3 && <div className="grid gap-4 sm:grid-cols-2">{input('establishedYear', 'Established year', 'number')}{input('teamSize', 'Team size', 'number')}<label className="block text-sm font-medium text-slate-700">Price range<select value={form.priceRange} onChange={event => set('priceRange', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Choose</option>{['budget', 'moderate', 'expensive', 'luxury'].map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>{input('timeZone', 'Time zone', 'text', { placeholder: 'Asia/Kolkata' })}{input('amenities', 'Amenities', 'text', { placeholder: 'Parking, Wi-Fi, ...' })}{input('highlights', 'Highlights', 'text', { placeholder: 'Same-day service, ...' })}</div>}
      {step === 4 && <div className="space-y-2">{hours.map((entry, index) => <div key={entry.day} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 rounded-lg border p-3"><span className="text-sm font-semibold capitalize">{entry.day}</span><input aria-label={`${entry.day} opening time`} type="time" disabled={entry.isClosed} value={entry.opens} onChange={event => setHours(current => current.map((item, i) => i === index ? { ...item, opens: event.target.value } : item))} className="rounded border px-2 py-1.5 text-sm disabled:bg-slate-100" /><input aria-label={`${entry.day} closing time`} type="time" disabled={entry.isClosed} value={entry.closes} onChange={event => setHours(current => current.map((item, i) => i === index ? { ...item, closes: event.target.value } : item))} className="rounded border px-2 py-1.5 text-sm disabled:bg-slate-100" /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={entry.isClosed} onChange={event => setHours(current => current.map((item, i) => i === index ? { ...item, isClosed: event.target.checked } : item))} />Closed</label></div>)}</div>}
      {step === 5 && <div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><label className="block text-sm font-semibold">Business logo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => upload(event, 'logo')} disabled={uploading} className="mt-2 block w-full text-sm" /></label>{form.logo && <div className="mt-2 flex items-center gap-3"><img src={form.logo} alt="Business logo preview" className="h-16 w-16 rounded object-cover" /><button type="button" onClick={() => set('logo', '')} className="text-sm text-red-700">Remove logo</button></div>}</div><div className="sm:col-span-2"><label className="block text-sm font-semibold">Business photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={event => upload(event, 'images')} disabled={uploading} className="mt-2 block w-full text-sm" /></label><div className="mt-2 flex flex-wrap gap-2">{split(form.images).map(url => <div key={url} className="relative"><img src={url} alt="Business photo preview" className="h-20 w-20 rounded object-cover" /><button type="button" aria-label="Remove image" onClick={() => set('images', split(form.images).filter(value => value !== url).join(', '))} className="absolute -right-1 -top-1 rounded-full bg-white px-1 text-red-700 shadow">×</button></div>)}</div></div>{(['facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const).map(key => <React.Fragment key={key}>{input(key, key === 'x' ? 'X profile URL' : `${key[0].toUpperCase()}${key.slice(1)} URL`, 'url')}</React.Fragment>)}</div>}
      {step === 6 && <div className="grid gap-4">{textarea('faqs', 'FAQs (one per line: question | answer)', 'Do you accept walk-ins? | Yes, walk-ins are welcome.')}{textarea('offers', 'Offers (one per line: title | description | code)', 'New customer discount | 10% off first visit | WELCOME10')}{input('googlePlaceId', 'Google Place ID')}{input('mapEmbedUrl', 'Map embed URL', 'url')}<div className="rounded-lg bg-slate-50 p-3 text-sm"><strong>Featured listing:</strong> Featured placement and expiry are managed by an administrator.</div></div>}
      {step === 7 && <div className="space-y-4"><div className="rounded-xl border p-4"><h4 className="font-semibold">Listing preview</h4><dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{preview.map((value, index) => <div key={`${index}-${value}`} className="rounded bg-slate-50 p-2">{value}</div>)}</dl><div className="mt-3 grid gap-3 sm:grid-cols-2">{reviewSections.map(section => <div key={section.title} className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">{section.title}</p><p className="mt-1 break-words text-sm text-slate-600">{section.value || 'Not provided'}</p></div>)}<div className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">Services</p><p className="mt-1 text-sm text-slate-600">{selectedServices.join(', ') || 'None added'}</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">FAQs</p><ul className="mt-1 list-inside list-disc text-sm text-slate-600">{lines(form.faqs).map((faq, index) => <li key={index}>{faq}</li>)}</ul></div><div className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">Offers</p><ul className="mt-1 list-inside list-disc text-sm text-slate-600">{lines(form.offers).map((offer, index) => <li key={index}>{offer}</li>)}</ul></div></div></div>{reviewReason && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Admin feedback:</strong> {reviewReason}</p>}<div className="grid gap-2 rounded-lg bg-violet-50 p-4 text-sm sm:grid-cols-2"><p>Listing status: <strong className="capitalize">{businessId ? status.replace('_', ' ') : 'Pending review after submission'}</strong></p><p>Verification: <strong className="capitalize">{businessId ? verification : 'Pending admin approval'}</strong></p></div><p className="text-sm text-slate-500">Submitting sends this listing to the admin approval queue. Verification and featured placement are controlled by admins.</p></div>}
    </section>
    <footer className="flex items-center justify-between gap-3 border-t bg-slate-50 p-4"><button type="button" disabled={step === 0} onClick={() => { setStep(current => current - 1); setError(''); }} className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-40">Back</button><div className="flex items-center gap-2"><span className="text-xs text-slate-500">{step + 1} / {steps.length}</span><button type="submit" disabled={saving || uploading} className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{uploading ? 'Uploading…' : saving ? 'Saving…' : step === steps.length - 1 ? 'Submit for review' : 'Continue'}</button></div></footer>
  </form></div>;
};
