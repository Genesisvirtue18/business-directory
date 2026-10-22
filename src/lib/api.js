const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://directory-backend-ai6r.onrender.com/api/v1").replace(/\/$/, "");

async function request(path, query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== "") params.set(key, value); });
  try {
    const fetchOptions = query.lat !== undefined ? { cache: "no-store" } : { next: { revalidate: 60 } };
    const response = await fetch(`${baseUrl}${path}${params.size ? `?${params}` : ""}`, { ...fetchOptions, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return {};
    const body = await response.json();
    return body.data || {};
  } catch { return {}; }
}

export const getBusinesses = (query) => request("/businesses", query);
export const getCategories = (query) => request("/categories", query);
export const getCities = (query) => request("/locations/cities", query);
export const getBusinessCities = () => request("/locations/business-cities");
export async function getBusiness(slug) { const { item } = await request(`/businesses/${encodeURIComponent(slug)}`); return item; }
export async function getGoogleReviews(slug, pageToken) {
  const query = new URLSearchParams({ pageSize: '10' }); if (pageToken) query.set('pageToken', pageToken);
  try {
    const response = await fetch(`${baseUrl}/businesses/${encodeURIComponent(slug)}/google-reviews?${query}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) return {};
    const body = await response.json(); return body.data || {};
  } catch { return {}; }
}
