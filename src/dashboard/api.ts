import { BusinessListing, Lead, Review } from './types';

type ApiReview = {
  _id?: string;
  reviewerName?: string;
  rating?: number | string;
  createdAt?: string;
  comment?: string;
  isVerified?: boolean;
};

type ApiLead = {
  _id?: string;
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  status?: string;
  createdAt?: string;
  message?: string;
  notes?: string[];
  business?: { name?: string };
};

type ApiBusiness = {
  _id?: string;
  id?: string;
  name?: string;
  owner?: { name?: string };
  category?: { name?: string };
  address?: Record<string, string>;
  location?: { coordinates?: number[] };
  phone?: string;
  alternatePhone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  logo?: string;
  images?: string[];
  services?: string[];
  workingHours?: BusinessListing['workingHours'];
  listingStatus?: string;
  verificationStatus?: string;
  googlePlaceVerificationStatus?: 'unverified' | 'verified' | 'mismatch';
  createdAt?: string;
  averageRating?: number;
  reviewCount?: number;
  reviews?: ApiReview[];
  viewCount?: number;
  leadCount?: number;
  description?: string;
};

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://directory-backend-ai6r.onrender.com/api/v1').replace(/\/$/, '');
const token = () => typeof window === 'undefined' ? '' : localStorage.getItem('directflow_access_token') || '';
export async function request(path: string, options: RequestInit = {}) { const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...options.headers } }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.message || 'Unable to load dashboard data'); return body.data || {}; }
export async function logout() { const refreshToken = typeof window === 'undefined' ? '' : localStorage.getItem('directflow_refresh_token') || ''; try { if (refreshToken) await request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }); } finally { if (typeof window !== 'undefined') { localStorage.removeItem('directflow_access_token'); localStorage.removeItem('directflow_refresh_token'); } } }
const ago = (value?: string) => value ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.round((new Date(value).getTime() - Date.now()) / 86400000), 'day') : 'Recently';
const reviewStats = (item: ApiBusiness) => { const ratings = (item.reviews || []).map((review) => Number(review.rating)).filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5); return ratings.length ? { average: Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2)), count: ratings.length } : { average: Number(item.averageRating || 0), count: Number(item.reviewCount || 0) }; };
export const toDashboardBusiness = (item: ApiBusiness): BusinessListing => { const stats = reviewStats(item); return ({ id: item._id || item.id || '', name: item.name || 'Business', owner: item.owner?.name || 'Business owner', category: (item.category?.name || 'Services') as BusinessListing['category'], location: [item.address?.locality, item.address?.city, item.address?.state].filter(Boolean).join(', ') || 'Location not added', phone: item.phone || 'Not added', alternatePhone: item.alternatePhone, whatsapp: item.whatsapp, email: item.email, website: item.website, logo: item.logo, images: item.images || [], services: item.services || [], address: item.address || {}, workingHours: item.workingHours || [], status: item.listingStatus === 'published' ? 'Active' : item.listingStatus === 'rejected' ? 'Rejected' : item.listingStatus === 'pending_review' ? 'Pending' : item.listingStatus === 'suspended' ? 'Suspended' : 'Draft', timeAgo: ago(item.createdAt), rating: stats.average, averageRating: stats.average, reviewsCount: stats.count, views: Number(item.viewCount || 0), enquiries: Number(item.leadCount || 0), verified: item.verificationStatus === 'verified', googlePlaceVerificationStatus: item.googlePlaceVerificationStatus || 'unverified', description: item.description || '' }); };
export async function loadOwnerDashboard(): Promise<{ businesses: BusinessListing[]; reviews: Review[]; leads: Lead[] }> {
  const [{ items: businesses = [] }, { items: leads = [] }] = await Promise.all([
    request('/owner/businesses?limit=100'),
    request('/owner/leads?limit=100'),
  ]);
  return {
    businesses: (businesses as ApiBusiness[]).map(toDashboardBusiness),
    reviews: (businesses as ApiBusiness[]).flatMap((business) => (business.reviews || []).map((review): Review => ({ id: review._id || '', author: review.reviewerName || 'Customer', rating: Number(review.rating || 0), timeAgo: ago(review.createdAt), comment: review.comment || '', verified: Boolean(review.isVerified) }))),
    leads: (leads as ApiLead[]).map((lead): Lead => ({
      id: lead._id || lead.id || '',
      name: lead.name || 'Customer',
      phone: lead.phone || '',
      email: lead.email,
      service: lead.service,
      status: lead.status === 'contacted' ? 'Contacted' : lead.status === 'converted' ? 'Converted' : 'New',
      timestamp: ago(lead.createdAt),
      message: lead.message || '',
      notes: lead.notes || [],
      targetBusiness: lead.business?.name || 'Business',
    })),
  };
}
export async function updateOwnerLeadStatus(id: string, status: Lead['status']) {
  const statusValue: Record<Lead['status'], 'new' | 'contacted' | 'converted'> = { New: 'new', Contacted: 'contacted', Converted: 'converted' };
  await request(`/owner/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status: statusValue[status] }) });
}
export async function addOwnerLeadNote(id: string, note: string) {
  await request(`/owner/leads/${id}/notes`, { method: 'POST', body: JSON.stringify({ note }) });
}
export async function loadAdminDashboard(): Promise<BusinessListing[]> { const { items = [] } = await request('/admin/businesses?limit=100'); return items.map(toDashboardBusiness); }
export async function reviewBusiness(id: string, decision: 'approve' | 'reject', rejectionReason?: string) { const { item } = await request(`/admin/businesses/${id}/review`, { method: 'PATCH', body: JSON.stringify({ decision, ...(rejectionReason ? { rejectionReason } : {}) }) }); return toDashboardBusiness(item); }
export async function clearGooglePlaceMismatch(id: string) { const { item } = await request(`/admin/businesses/${id}/google-place`, { method: 'PATCH' }); return toDashboardBusiness(item); }
export async function loadBusinessFormData() { const { items = [] } = await request('/categories/tree'); return { categories: items }; }
export async function geocodeBusinessAddress(address: { addressLine1: string; addressLine2?: string; landmark?: string; locality?: string; city: string; state: string; postalCode?: string; country: string }) { const params = new URLSearchParams(Object.entries(address).filter((entry): entry is [string, string] => Boolean(entry[1]))); const { point } = await request(`/owner/geocode?${params}`, { signal: AbortSignal.timeout(15000) }); return point as { lat: number; lng: number; label: string }; }
export async function loadOwnerBusiness(id: string) { const { item } = await request(`/owner/businesses/${id}`); return item; }
export async function createOwnerBusiness(payload: Record<string, unknown>) { const { item } = await request('/owner/businesses', { method: 'POST', body: JSON.stringify(payload) }); return toDashboardBusiness(item); }
export async function updateOwnerBusiness(id: string, payload: Record<string, unknown>) { const { item } = await request(`/owner/businesses/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); return toDashboardBusiness(item); }
export async function uploadBusinessImages(files: File[]) { const urls: string[] = []; for (let offset = 0; offset < files.length; offset += 10) { const form = new FormData(); files.slice(offset, offset + 10).forEach(file => form.append('images', file)); const response = await fetch(`${baseUrl}/owner/uploads`, { method: 'POST', headers: token() ? { Authorization: `Bearer ${token()}` } : {}, body: form }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.message || 'Unable to upload images'); urls.push(...(body.data?.urls || [])); } return urls; }
export type ManagedCategory = { _id: string; name: string; services?: string[]; children?: ManagedCategory[] };
export async function loadAdminCategories(): Promise<ManagedCategory[]> { const { items = [] } = await request('/admin/categories'); return items; }
export async function createCategory(name: string, parentCategory?: string) { const { item } = await request('/admin/categories', { method: 'POST', body: JSON.stringify({ name, ...(parentCategory ? { parentCategory } : {}) }) }); return item; }
export async function addCategoryServices(id: string, services: string[]) { const { item } = await request(`/admin/categories/${id}/services`, { method: 'POST', body: JSON.stringify({ services }) }); return item; }
async function uploadCsv(path: string, file: File) { const form = new FormData(); form.append('file', file); const response = await fetch(`${baseUrl}${path}`, { method: 'POST', headers: token() ? { Authorization: `Bearer ${token()}` } : {}, body: form }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.message || 'Unable to import CSV'); return body.data || {}; }
export const importCategoriesCsv = (file: File, parentId?: string) => uploadCsv(parentId ? `/admin/categories/${parentId}/subcategories/import` : '/admin/categories/import', file);
export const importServicesCsv = (file: File, categoryId: string) => uploadCsv(`/admin/categories/${categoryId}/services/import`, file);
export async function importBusinessesCsv(file: File): Promise<{ businesses: BusinessListing[]; createdCount: number; failed: { row: number; businessName: string; message: string }[] }> {
  const result = await uploadCsv('/admin/businesses/import', file) as {
    items?: ApiBusiness[];
    createdCount?: number;
    failed?: { row: number; businessName: string; message: string }[];
  };
  const items = result.items || [];
  return {
    businesses: items.map(toDashboardBusiness),
    createdCount: result.createdCount ?? items.length,
    failed: result.failed || [],
  };
}
