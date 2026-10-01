const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://directory-backend-ai6r.onrender.com//api/v1").replace(/\/$/, "");

async function request(path, query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== "") params.set(key, value); });
  try {
    const response = await fetch(`${baseUrl}${path}${params.size ? `?${params}` : ""}`, { next: { revalidate: 60 } });
    if (!response.ok) return {};
    const body = await response.json();
    return body.data || {};
  } catch { return {}; }
}

export const getBusinesses = (query) => request("/businesses", query);
export const getCategories = (query) => request("/categories", query);
export const getCities = (query) => request("/locations/cities", query);
export async function getBusiness(slug) { const { item } = await request(`/businesses/${encodeURIComponent(slug)}`); return item; }
