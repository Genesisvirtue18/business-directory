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
export async function getGoogleReviews(id, signal) {
  const response = await fetch(`${baseUrl}/businesses/${encodeURIComponent(id)}/google-reviews`, { cache: "no-store", signal: signal || AbortSignal.timeout(10000) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Unable to load Google review information");
  return body.data?.google;
}
