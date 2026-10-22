import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { createOwnerBusiness, geocodeBusinessAddress as requestAddressCoordinates, loadBusinessFormData, loadOwnerBusiness, updateOwnerBusiness, uploadBusinessImages } from '../api';
import { BusinessListing } from '../types';

type Category = { _id: string; name: string; services?: string[]; children?: Category[] };
type Form = Record<string, string>;
type Hours = { day: string; isClosed: boolean; opens: string; closes: string };
type Faq = { question: string; answer: string };
type Offer = { title: string; description: string; code: string };
type ProfileFaq = { question?: string; answer?: string };
type ProfileOffer = { title?: string; description?: string; code?: string };
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const steps = ['Basic Information', 'Contact Information', 'Address & Location', 'Business Details', 'Working Hours', 'Media & Social', 'Additional Information', 'Review & Publish'];
const establishedYearOptions = Array.from({ length: new Date().getFullYear() - 1799 }, (_, index) => String(new Date().getFullYear() - index));
const emptyForm: Form = { name: '', description: '', category: '', subcategory: '', services: '', phone: '', alternatePhone: '', whatsapp: '', email: '', website: '', addressLine1: '', addressLine2: '', landmark: '', locality: '', city: '', state: '', postalCode: '', country: 'IN', establishedYear: '', teamSize: '', priceRange: '', timeZone: 'Asia/Kolkata', amenities: '', logo: '', images: '', facebook: '', instagram: '', linkedin: '', youtube: '', x: '', mapEmbedUrl: '' };
const timeZones = ['Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Kathmandu', 'Asia/Bangkok', 'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney', 'UTC'];
const split = (value?: string) => (value || '').split(',').map(part => part.trim()).filter(Boolean);
const textField = (value?: string) => value || '';
const phoneForForm = (value?: string) => { const digits = (value || '').replace(/\D/g, ''); return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits.slice(-10); };

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
  const [faqs, setFaqs] = useState<Faq[]>([{ question: '', answer: '' }]);
  const [offers, setOffers] = useState<Offer[]>([{ title: '', description: '', code: '' }]);
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [geocoding, setGeocoding] = useState(false);
  const [locationMessage, setLocationMessage] = useState('Coordinates are looked up from the address when you continue.');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [geocodedAddress, setGeocodedAddress] = useState('');
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
        phone: phoneForForm(item.phone), alternatePhone: phoneForForm(item.alternatePhone), whatsapp: phoneForForm(item.whatsapp), email: textField(item.email), website: textField(item.website),
        addressLine1: textField(item.address?.addressLine1), addressLine2: textField(item.address?.addressLine2), landmark: textField(item.address?.landmark), locality: textField(item.address?.locality), city: textField(item.address?.city), state: textField(item.address?.state), postalCode: textField(item.address?.postalCode), country: textField(item.address?.country || 'IN'),
        establishedYear: item.establishedYear?.toString() || '', teamSize: item.teamSize?.toString() || '', priceRange: textField(item.priceRange), timeZone: textField(item.timeZone || 'Asia/Kolkata'), amenities: (item.amenities || []).join(', '), logo: textField(item.logo), images: (item.images || []).join(', '),
        facebook: textField(item.socialLinks?.facebook), instagram: textField(item.socialLinks?.instagram), linkedin: textField(item.socialLinks?.linkedin), youtube: textField(item.socialLinks?.youtube), x: textField(item.socialLinks?.x),
        mapEmbedUrl: textField(item.mapEmbedUrl),
      });
      setHighlights(item.highlights?.length ? item.highlights : ['']);
      setFaqs(item.faqs?.length ? item.faqs.map((faq: ProfileFaq) => ({ question: faq.question || '', answer: faq.answer || '' })) : [{ question: '', answer: '' }]);
      setOffers(item.offers?.length ? item.offers.map((offer: ProfileOffer) => ({ title: offer.title || '', description: offer.description || '', code: offer.code || '' })) : [{ title: '', description: '', code: '' }]);
      const storedCoordinates = item.location?.coordinates;
      if (storedCoordinates?.length === 2) {
        setCoordinates([Number(storedCoordinates[0]), Number(storedCoordinates[1])]);
        setGeocodedAddress([item.address?.addressLine1, item.address?.addressLine2, item.address?.landmark, item.address?.locality, item.address?.city, item.address?.state, item.address?.postalCode, item.address?.country || 'IN'].filter(Boolean).join(', '));
      }
      if (item.workingHours?.length) setHours(days.map(day => item.workingHours.find((entry: Hours) => entry.day === day) || { day, isClosed: true, opens: '', closes: '' }));
      setStatus(item.listingStatus || 'draft'); setVerification(item.verificationStatus || 'pending');
      setReviewReason(item.rejectionReason || '');
    }).catch(reason => setError(reason.message));
  }, [businessId]);

  const fieldMaxLengths: Record<string, number> = { name: 180, email: 254, website: 2048, addressLine1: 250, addressLine2: 250, landmark: 150, locality: 120, city: 120, state: 120, postalCode: 20, country: 2, amenities: 9000, mapEmbedUrl: 2048 };
  const input = (key: string, label: string, type = 'text', options: { required?: boolean; placeholder?: string } = {}) => <label className="block text-sm font-medium text-slate-700">{label}{options.required ? ' *' : ''}<input type={type} required={options.required} maxLength={fieldMaxLengths[key]} min={key === 'teamSize' ? 1 : undefined} step={key === 'teamSize' ? 1 : undefined} value={form[key] || ''} placeholder={options.placeholder} onChange={event => set(key, key === 'country' ? event.target.value.replace(/[^a-z]/gi, '').toUpperCase() : event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" /></label>;
  const toggleService = (service: string) => set('services', selectedServices.includes(service) ? selectedServices.filter(value => value !== service).join(', ') : [...selectedServices, service].join(', '));

  async function upload(event: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'images') {
    const files = Array.from(event.target.files || []); if (!files.length) return;
    const invalidType = files.find(file => !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type));
    if (invalidType) { setError(`${invalidType.name} is not a supported image. Use JPEG, PNG, WebP, or GIF.`); event.target.value = ''; return; }
    const oversized = files.find(file => file.size > 5 * 1024 * 1024);
    if (oversized) { setError(`${oversized.name} is larger than the 5 MB upload limit.`); event.target.value = ''; return; }
    if (target === 'images' && split(form.images).length + files.length > 30) { setError('A listing can have up to 30 photos.'); event.target.value = ''; return; }
    setUploading(true); setError('');
    try {
      const urls = await uploadBusinessImages(files);
      set(target, target === 'logo' ? urls[0] || '' : [...split(form.images), ...urls].join(', '));
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to upload images'); }
    finally { setUploading(false); event.target.value = ''; }
  }

  async function geocodeBusinessAddress() {
    const addressParts = { addressLine1: form.addressLine1, addressLine2: form.addressLine2, landmark: form.landmark, locality: form.locality, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country || 'IN' };
    const address = Object.values(addressParts).filter(Boolean).join(', ');
    if (coordinates && geocodedAddress === address) return true;
    setGeocoding(true);
    setLocationMessage('Finding coordinates from the address…');
    try {
      const result = await requestAddressCoordinates(addressParts);
      const point: [number, number] = [Number(result.lng), Number(result.lat)];
      if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) throw new Error('The address did not return valid coordinates. Please check the address.');
      setCoordinates(point);
      setGeocodedAddress(address);
      setLocationLabel(result.label);
      setLocationMessage('Address located successfully. Confirm the matched place below.');
      return true;
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Unable to find coordinates for this address.';
      setError(message);
      setLocationMessage(message);
      return false;
    } finally { setGeocoding(false); }
  }

  function validateStep() {
    if (step === 0 && (!form.name.trim() || !form.category)) return 'Enter a business name and select a category.';
    if (step === 0 && !selectedServices.length) return 'Select at least one service for this business.';
    if (step === 0 && !form.description.trim()) return 'Add a business description before continuing.';
    if (step === 0 && selectedServices.length > 100) return 'Add no more than 100 services.';
    if (step === 0 && selectedServices.some(service => service.length > 150)) return 'Each service must be 150 characters or fewer.';
    if (step === 1 && !/^[6-9]\d{9}$/.test(form.phone)) return 'Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.';
    if (step === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (step === 1 && [form.alternatePhone, form.whatsapp].some(value => value && !/^[6-9]\d{9}$/.test(value))) return 'Phone and WhatsApp numbers must be valid 10-digit Indian numbers.';
    if (step === 2 && (!form.addressLine1.trim() || !form.city.trim() || !form.state.trim())) return 'Address line 1, city, and state are required.';
    if (step === 4 && hours.some(day => !day.isClosed && (!day.opens || !day.closes))) return 'Add opening and closing times, or mark each day closed.';
    if (step === 6 && faqs.some(item => Boolean(item.question.trim()) !== Boolean(item.answer.trim()))) return 'Complete both the question and answer for each FAQ, or remove the empty FAQ.';
    if (step === 6 && offers.some(item => Boolean(item.description.trim() || item.code.trim()) && !item.title.trim())) return 'Add an offer title or remove the other offer details.';
    if (step === 7 && (!form.phone.trim() || !form.email.trim() || !form.addressLine1.trim() || !form.city.trim() || !selectedServices.length)) return 'Phone, email, full address, and at least one service are required.';
    return '';
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateStep(); if (validation) { setError(validation); if (step === 7 && !form.description.trim()) setStep(0); else if (step === 7 && !form.phone.trim()) setStep(1); else if (step === 7) setStep(2); return; }
    if (step === 2 && !(await geocodeBusinessAddress())) return;
    if (step < steps.length - 1) { setError(''); setStep(current => current + 1); return; }
    setSaving(true); setError('');
    try {
      const location = coordinates ? { type: 'Point', coordinates } : undefined;
      const faqEntries = faqs.filter(item => item.question.trim() && item.answer.trim()).map(item => ({ question: item.question.trim(), answer: item.answer.trim() }));
      const offerEntries = offers.filter(item => item.title.trim()).map(item => ({ title: item.title.trim(), ...(item.description.trim() ? { description: item.description.trim() } : {}), ...(item.code.trim() ? { code: item.code.trim() } : {}) }));
      const payload = {
        name: form.name.trim(), description: form.description || undefined, category: form.category, subcategories: form.subcategory ? [form.subcategory] : [], services: selectedServices,
        phone: form.phone, alternatePhone: form.alternatePhone || undefined, whatsapp: form.whatsapp || undefined, email: form.email, website: form.website || undefined,
        address: { addressLine1: form.addressLine1, addressLine2: form.addressLine2, landmark: form.landmark, locality: form.locality, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country || 'IN' }, location: location || null,
        establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined, teamSize: form.teamSize ? Number(form.teamSize) : undefined, priceRange: form.priceRange || undefined, timeZone: form.timeZone || undefined, amenities: split(form.amenities), highlights: highlights.map(value => value.trim()).filter(Boolean),
        workingHours: hours.map(({ day, isClosed, opens, closes }) => ({ day, isClosed, ...(isClosed ? {} : { opens, closes }) })), logo: form.logo, images: split(form.images),
        socialLinks: Object.fromEntries(Object.entries({ facebook: form.facebook, instagram: form.instagram, linkedin: form.linkedin, youtube: form.youtube, x: form.x }).filter(([, value]) => value)),
        faqs: faqEntries, offers: offerEntries, mapEmbedUrl: form.mapEmbedUrl || undefined,
      };
      const saved = businessId ? await updateOwnerBusiness(businessId, payload) : await createOwnerBusiness(payload);
      onSaved(saved, !businessId);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save business'); }
    finally { setSaving(false); }
  }

  const preview = [form.name, category?.name, form.description, form.phone, form.email, [form.addressLine1, form.locality, form.city, form.state].filter(Boolean).join(', '), `${split(form.images).length} photos`, `${selectedServices.length} services`].filter(Boolean);
  const reviewSections = [
    { title: 'Contact', value: [form.phone, form.alternatePhone && `Alt: ${form.alternatePhone}`, form.whatsapp && `WhatsApp: ${form.whatsapp}`, form.email, form.website].filter(Boolean).join(' · ') },
    { title: 'Address and coordinates', value: [[form.addressLine1, form.addressLine2, form.landmark, form.locality, form.city, form.state, form.postalCode, form.country].filter(Boolean).join(', '), coordinates ? `${coordinates[1]}, ${coordinates[0]}` : 'No coordinates'].filter(Boolean).join(' · ') },
    { title: 'Business details', value: [form.establishedYear && `Since ${form.establishedYear}`, form.teamSize && `${form.teamSize} team members`, form.priceRange, form.timeZone, split(form.amenities).length && `${split(form.amenities).length} amenities`, highlights.filter(value => value.trim()).length && `${highlights.filter(value => value.trim()).length} reasons to choose us`].filter(Boolean).join(' · ') },
    { title: 'Media and social', value: [`${split(form.images).length} photos`, form.logo ? 'Logo added' : 'No logo', ...(['facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const).filter(key => form[key]).map(key => `${key}: ${form[key]}`)].join(' · ') },
    { title: 'Additional information', value: [`${faqs.filter(item => item.question && item.answer).length} FAQs`, `${offers.filter(item => item.title).length} offers`].join(' · ') },
    { title: 'Weekly hours', value: hours.map(item => item.isClosed ? `${item.day}: closed` : `${item.day}: ${item.opens}–${item.closes}`).join(' · ') },
  ];
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-5"><form onSubmit={submit} className="mx-auto my-3 max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
    <header className="flex items-start justify-between gap-4 border-b p-5"><div><h2 className="text-xl font-bold">{businessId ? 'Edit business' : 'Add your business'}</h2><p className="mt-1 text-sm text-slate-500">Complete each section, then review your listing before sending it for admin approval.</p></div><button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm">Close</button></header>
    <nav aria-label="Business form steps" className="grid grid-cols-4 gap-2 border-b bg-slate-50 p-4 md:grid-cols-8">{steps.map((title, index) => <button key={title} type="button" onClick={() => { if (index <= step) { setStep(index); setError(''); } }} className={`rounded-lg px-2 py-2 text-left text-[11px] font-semibold ${step === index ? 'bg-violet-700 text-white' : index < step ? 'bg-violet-100 text-violet-800' : 'bg-white text-slate-500'}`}><span className="block text-sm">{index + 1}</span>{title}</button>)}</nav>
    <section className="space-y-4 p-5">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mb-2"><h3 className="text-lg font-bold">{steps[step]}</h3><p className="text-sm text-slate-500">Step {step + 1} of {steps.length}</p></div>
      {step === 0 && <div className="grid gap-4 sm:grid-cols-2">{input('name', 'Business name', 'text', { required: true })}<label className="block text-sm font-medium text-slate-700">Category *<select required value={form.category} onChange={event => { set('category', event.target.value); set('subcategory', ''); set('services', ''); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Choose a category</option>{categories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Subcategory<select value={form.subcategory} disabled={!subcategories.length} onChange={event => { set('subcategory', event.target.value); set('services', ''); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Choose a subcategory</option>{subcategories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><div className="sm:col-span-2"><label className="block text-sm font-medium text-slate-700">Description *<textarea required maxLength={10000} value={form.description} onChange={event => set('description', event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-violet-500" /></label></div><fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-medium">Services <span className="text-red-600">*</span></legend><p className="mb-2 text-xs text-slate-500">Select at least one service offered by your business.</p>{serviceOptions.length ? <div className="flex flex-wrap gap-2">{serviceOptions.map(service => <label key={service} className={`rounded-full border px-3 py-1.5 text-sm ${selectedServices.includes(service) ? 'border-violet-500 bg-violet-50 text-violet-800' : 'border-slate-200'}`}><input type="checkbox" className="mr-2" checked={selectedServices.includes(service)} onChange={() => toggleService(service)} />{service}</label>)}</div> : <input value={form.services} onChange={event => set('services', event.target.value)} placeholder="Separate services with commas" className="w-full rounded-lg border border-slate-300 px-3 py-2" />}</fieldset></div>}
      {step === 1 && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Phone *<input required inputMode="numeric" autoComplete="tel-national" type="tel" maxLength={10} pattern="[6-9][0-9]{9}" value={form.phone} onChange={event => set('phone', event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit phone number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-medium text-slate-700">Alternate phone<input inputMode="numeric" type="tel" maxLength={10} pattern="[6-9][0-9]{9}" value={form.alternatePhone} onChange={event => set('alternatePhone', event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Optional 10-digit number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-medium text-slate-700">WhatsApp number<input inputMode="numeric" type="tel" maxLength={10} pattern="[6-9][0-9]{9}" value={form.whatsapp} onChange={event => set('whatsapp', event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Optional 10-digit number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>{input('email', 'Email', 'email', { required: true })}{input('website', 'Website', 'url')}</div>}
      {step === 2 && <div className="grid gap-4 sm:grid-cols-2">{input('addressLine1', 'Address line 1', 'text', { required: true })}{input('addressLine2', 'Address line 2')}{input('landmark', 'Landmark')}{input('locality', 'Locality')}{input('city', 'City', 'text', { required: true })}{input('state', 'State', 'text', { required: true })}{input('postalCode', 'Postal code')}{input('country', 'Country code (ISO 2 letters)')}<div className="sm:col-span-2">{input('mapEmbedUrl', 'Google Maps link (optional)', 'url', { placeholder: 'Paste a Google Maps share link' })}</div><p className="sm:col-span-2 text-xs text-slate-500">{locationMessage} Address lookup uses OpenStreetMap. <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">© OpenStreetMap contributors</a>.</p>{locationLabel && <p className="sm:col-span-2 rounded bg-emerald-50 p-2 text-xs text-emerald-800">Matched map location: {locationLabel}</p>}{coordinates && <p className="sm:col-span-2 text-xs text-emerald-700">Coordinates saved for nearby search.</p>}</div>}
      {step === 3 && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Established year<div className="relative mt-1"><select value={form.establishedYear} onChange={event => set('establishedYear', event.target.value)} className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10"><option value="">Select year</option>{form.establishedYear && !establishedYearOptions.includes(form.establishedYear) && <option value={form.establishedYear}>{form.establishedYear}</option>}{establishedYearOptions.map(year => <option key={year} value={year}>{year}</option>)}</select><CalendarDays className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-slate-500" /></div></label>{input('teamSize', 'Team size', 'number')}<label className="block text-sm font-medium text-slate-700">Price range<select value={form.priceRange} onChange={event => set('priceRange', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Choose</option>{['budget', 'moderate', 'expensive', 'luxury'].map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Time zone<select value={form.timeZone} onChange={event => set('timeZone', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">{form.timeZone && !timeZones.includes(form.timeZone) && <option value={form.timeZone}>{form.timeZone}</option>}{timeZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}</select></label>{input('amenities', 'Amenities', 'text', { placeholder: 'Parking, Wi-Fi, ...' })}<fieldset className="sm:col-span-2"><legend className="text-sm font-medium">Why choose us?</legend><p className="mb-2 text-xs text-slate-500">Add the key reasons customers should choose this business.</p><div className="space-y-2">{highlights.map((highlight, index) => <div key={index} className="flex gap-2"><input maxLength={180} value={highlight} onChange={event => setHighlights(current => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={`Reason ${index + 1}`} className="w-full rounded-lg border border-slate-300 px-3 py-2" /><button type="button" aria-label="Remove reason" onClick={() => setHighlights(current => current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : [''])} className="px-2 text-slate-500"><Trash2 className="h-4 w-4" /></button></div>)}</div><button type="button" disabled={highlights.length >= 30} onClick={() => setHighlights(current => [...current, ''])} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 disabled:opacity-50"><Plus className="h-4 w-4" />Add reason</button></fieldset></div>}
      {step === 4 && <div className="space-y-2">{hours.map((entry, index) => <div key={entry.day} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2 rounded-lg border p-3"><span className="text-sm font-semibold capitalize">{entry.day}</span><input aria-label={`${entry.day} opening time`} type="time" disabled={entry.isClosed} value={entry.opens} onChange={event => setHours(current => current.map((item, i) => i === index ? { ...item, opens: event.target.value } : item))} className="rounded border px-2 py-1.5 text-sm disabled:bg-slate-100" /><input aria-label={`${entry.day} closing time`} type="time" disabled={entry.isClosed} value={entry.closes} onChange={event => setHours(current => current.map((item, i) => i === index ? { ...item, closes: event.target.value } : item))} className="rounded border px-2 py-1.5 text-sm disabled:bg-slate-100" /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={entry.isClosed} onChange={event => setHours(current => current.map((item, i) => i === index ? { ...item, isClosed: event.target.checked } : item))} />Closed</label></div>)}</div>}
      {step === 5 && <div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><label className="block text-sm font-semibold">Business logo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => upload(event, 'logo')} disabled={uploading} className="mt-2 block w-full text-sm" /></label>{form.logo && <div className="mt-2 flex items-center gap-3"><img src={form.logo} alt="Business logo preview" className="h-16 w-16 rounded object-cover" /><button type="button" onClick={() => set('logo', '')} className="text-sm text-red-700">Remove logo</button></div>}</div><div className="sm:col-span-2"><label className="block text-sm font-semibold">Business photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={event => upload(event, 'images')} disabled={uploading} className="mt-2 block w-full text-sm" /><span className="mt-1 block text-xs font-normal text-slate-500">JPEG, PNG, WebP, or GIF · up to 5 MB each · up to 30 photos</span></label><div className="mt-2 flex flex-wrap gap-2">{split(form.images).map(url => <div key={url} className="relative"><img src={url} alt="Business photo preview" className="h-20 w-20 rounded object-cover" /><button type="button" aria-label="Remove image" onClick={() => set('images', split(form.images).filter(value => value !== url).join(', '))} className="absolute -right-1 -top-1 rounded-full bg-white px-1 text-red-700 shadow">×</button></div>)}</div></div>{(['facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const).map(key => <React.Fragment key={key}>{input(key, key === 'x' ? 'X profile URL' : `${key[0].toUpperCase()}${key.slice(1)} URL`, 'url')}</React.Fragment>)}</div>}
      {step === 6 && <div className="space-y-6"><div><div className="mb-3 flex items-center justify-between"><h4 className="font-semibold">Frequently asked questions</h4><button type="button" onClick={() => setFaqs(current => [...current, { question: '', answer: '' }])} disabled={faqs.length >= 50} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700"><Plus className="h-4 w-4" />Add FAQ</button></div><div className="space-y-3">{faqs.map((faq, index) => <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]"><label className="text-sm font-medium">Question<input value={faq.question} maxLength={500} onChange={event => setFaqs(current => current.map((item, i) => i === index ? { ...item, question: event.target.value } : item))} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Question" /></label><label className="text-sm font-medium">Answer<textarea value={faq.answer} maxLength={3000} onChange={event => setFaqs(current => current.map((item, i) => i === index ? { ...item, answer: event.target.value } : item))} className="mt-1 min-h-10 w-full rounded-lg border px-3 py-2" placeholder="Answer" /></label><button type="button" aria-label="Remove FAQ" onClick={() => setFaqs(current => current.length > 1 ? current.filter((_, i) => i !== index) : [{ question: '', answer: '' }])} className="self-center text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div></div><div><div className="mb-3 flex items-center justify-between"><h4 className="font-semibold">Offers</h4><button type="button" onClick={() => setOffers(current => [...current, { title: '', description: '', code: '' }])} disabled={offers.length >= 30} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700"><Plus className="h-4 w-4" />Add offer</button></div><div className="space-y-3">{offers.map((offer, index) => <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"><label className="text-sm font-medium">Offer title<input value={offer.title} maxLength={180} onChange={event => setOffers(current => current.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Offer title" /></label><label className="text-sm font-medium">Description<input value={offer.description} maxLength={2000} onChange={event => setOffers(current => current.map((item, i) => i === index ? { ...item, description: event.target.value } : item))} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Offer details" /></label><label className="text-sm font-medium">Promo code<input value={offer.code} maxLength={50} onChange={event => setOffers(current => current.map((item, i) => i === index ? { ...item, code: event.target.value } : item))} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Optional code" /></label><button type="button" aria-label="Remove offer" onClick={() => setOffers(current => current.length > 1 ? current.filter((_, i) => i !== index) : [{ title: '', description: '', code: '' }])} className="self-center text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div></div><div className="rounded-lg bg-slate-50 p-3 text-sm"><strong>Featured listing:</strong> Featured placement and expiry are managed by an administrator.</div></div>}
      {step === 7 && <div className="space-y-4"><div className="rounded-xl border p-4"><h4 className="font-semibold">Listing preview</h4><dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{preview.map((value, index) => <div key={`${index}-${value}`} className="rounded bg-slate-50 p-2">{value}</div>)}</dl><div className="mt-3 grid gap-3 sm:grid-cols-2">{reviewSections.map(section => <div key={section.title} className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">{section.title}</p><p className="mt-1 break-words text-sm text-slate-600">{section.value || 'Not provided'}</p></div>)}<div className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">Services</p><p className="mt-1 text-sm text-slate-600">{selectedServices.join(', ') || 'None added'}</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">FAQs</p><ul className="mt-1 list-inside list-disc text-sm text-slate-600">{faqs.filter(item => item.question && item.answer).map((faq, index) => <li key={index}>{faq.question}: {faq.answer}</li>)}</ul></div><div className="rounded-lg bg-slate-50 p-3"><p className="font-semibold">Offers</p><ul className="mt-1 list-inside list-disc text-sm text-slate-600">{offers.filter(item => item.title).map((offer, index) => <li key={index}>{offer.title}{offer.description ? `: ${offer.description}` : ''}{offer.code ? ` (${offer.code})` : ''}</li>)}</ul></div></div></div>{reviewReason && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Admin feedback:</strong> {reviewReason}</p>}<div className="grid gap-2 rounded-lg bg-violet-50 p-4 text-sm sm:grid-cols-2"><p>Listing status: <strong className="capitalize">{businessId ? status.replace('_', ' ') : 'Pending review after submission'}</strong></p><p>Verification: <strong className="capitalize">{businessId ? verification : 'Pending admin approval'}</strong></p></div><p className="text-sm text-slate-500">Submitting sends this listing to the admin approval queue. Verification and featured placement are controlled by admins.</p></div>}
    </section>
    <footer className="flex items-center justify-between gap-3 border-t bg-slate-50 p-4"><button type="button" disabled={step === 0} onClick={() => { setStep(current => current - 1); setError(''); }} className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-40">Back</button><div className="flex items-center gap-2"><span className="text-xs text-slate-500">{step + 1} / {steps.length}</span><button type="submit" disabled={saving || uploading || geocoding} className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{uploading ? 'Uploading…' : geocoding ? 'Finding address…' : saving ? 'Saving…' : step === steps.length - 1 ? 'Submit for review' : 'Continue'}</button></div></footer>
  </form></div>;
};
