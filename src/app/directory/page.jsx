import Link from "next/link";
import { BadgeCheck, Building2, ChevronLeft, ChevronRight, MapPin, Phone, Plus, Search, SlidersHorizontal, Store } from "lucide-react";
import { getBusinesses, getCategories, getCities } from "@/lib/api";
import { businessDetailPath, toDirectoryBusiness } from "@/lib/directory-data";
import UseMyLocationButton from "@/components/UseMyLocationButton";
import { absoluteSiteUrl, buildDirectoryJsonLd, jsonLdString } from "@/lib/business-schema";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const hasSearchState = Object.keys(params || {}).some(key => !["limit"].includes(key));
  return {
    title: "Find Local Businesses Near You | Genesis Virtue",
    description: "Discover local businesses by category, location, and distance.",
    alternates: { canonical: absoluteSiteUrl("/directory") },
    ...(hasSearchState ? { robots: { index: false, follow: true } } : {}),
  };
}

function BusinessCard({ business }) {
  const href = businessDetailPath(business);
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-violet-200 hover:shadow-md">
      <Link href={href} aria-label={`View ${business.name}`} className="relative block h-44 bg-slate-100">
        {business.image ? <img src={business.image} alt={business.name} className="h-full w-full object-cover" /> : <div className={`flex h-full items-center justify-center bg-gradient-to-br ${business.swatch}`}><Store className="h-10 w-10 text-slate-500/50" /></div>}
        {business.verified ? <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm"><BadgeCheck className="h-3.5 w-3.5" />Verified</span> : null}
        {business.isFeatured ? <span className="absolute right-3 top-3 rounded-full bg-violet-700 px-2.5 py-1 text-xs font-semibold text-white">Featured</span> : null}
      </Link>
      <div className="p-4">
        <h2 className="truncate text-base font-semibold text-slate-900"><Link href={href} className="hover:text-violet-700">{business.name}</Link></h2>
        <p className="mt-1 text-sm text-slate-600">{business.category}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-4 w-4 shrink-0" />{business.area}{business.address?.city && business.area !== business.address.city ? `, ${business.address.city}` : ""}</p>
        <div className="mt-4 flex gap-2">
          {business.phone ? <a href={`tel:${business.phone}`} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"><Phone className="h-4 w-4" />Call</a> : null}
          <Link href={href} className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-violet-700 px-3 text-sm font-semibold text-white hover:bg-violet-800">View profile</Link>
        </div>
      </div>
    </article>
  );
}

export default async function DirectoryPage({ searchParams, routeCity, routeCategory }) {
  const params = await searchParams;
  const cityName = routeCity ? routeCity.replace(/-/g, " ") : params?.city;
  const categorySlug = routeCategory || params?.category;
  const page = Math.max(1, Number(params?.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params?.limit) || 24));
  const radiusMeters = Math.min(50000, Math.max(100, Number(params?.radiusMeters) || 10000));
  const hasCoordinates = params?.lat !== undefined && params?.lng !== undefined;
  const [{ items: businessItems = [], pagination = {} }, { items: categoryItems = [] }, { items: cityItems = [] }] = await Promise.all([
    getBusinesses({ page, limit, q: params?.q, city: hasCoordinates ? undefined : cityName, locality: hasCoordinates ? undefined : params?.locality, state: hasCoordinates ? undefined : params?.state, category: categorySlug, verified: params?.verified, lat: params?.lat, lng: params?.lng, radiusMeters, openNow: params?.openNow, sort: params?.sort === "distance" ? "relevance" : params?.sort }),
    getCategories({ limit: 100 }),
    getCities({ limit: 100 }),
  ]);
  const businesses = businessItems.map(toDirectoryBusiness);
  const pageHref = targetPage => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries({ q: params?.q, city: cityName, locality: params?.locality, state: params?.state, category: categorySlug, verified: params?.verified, lat: params?.lat, lng: params?.lng, radiusMeters: hasCoordinates ? radiusMeters : undefined, openNow: params?.openNow, sort: params?.sort, limit })) if (value !== undefined && value !== "") query.set(key, String(value));
    query.set("page", String(targetPage));
    return `/directory?${query.toString()}`;
  };
  const selectedCategory = categoryItems.find(item => item.slug === categorySlug);
  const directorySchema = buildDirectoryJsonLd(businessItems, "/directory");
  const resultCount = Number(pagination.totalItems) || businesses.length;
  const resultsLabel = selectedCategory?.name || params?.q || "Businesses";
  const cityOptions = cityItems.map(city => typeof city === "string" ? city : city.name).filter(Boolean);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(directorySchema) }} />
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[68px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 lg:px-8">
          <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-[-1.5px] text-violet-700">Genesis Virtue</Link>
          <form action="/directory" method="get" className="order-3 flex w-full max-w-xl items-center gap-2 sm:order-none sm:flex-1 sm:px-4">
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3"><MapPin className="h-4 w-4 shrink-0 text-slate-400" /><input name="city" list="directory-cities" defaultValue={cityName || ""} placeholder="City" className="w-full bg-transparent text-sm outline-none" /><datalist id="directory-cities">{cityOptions.map(city => <option key={city} value={city} />)}</datalist></label>
            <label className="flex h-10 min-w-0 flex-[1.5] items-center gap-2 rounded-md border border-slate-300 bg-white px-3"><input name="q" defaultValue={params?.q || selectedCategory?.name || ""} placeholder="Business or service" className="w-full bg-transparent text-sm outline-none" />{categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}<button aria-label="Search" className="-mr-2 flex h-8 w-9 shrink-0 items-center justify-center rounded bg-violet-700 text-white hover:bg-violet-800"><Search className="h-4 w-4" /></button></label>
          </form>
          <div className="flex items-center gap-2"><Link href="/register" className="flex h-9 items-center gap-1 rounded border border-slate-300 px-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 sm:px-3"><Plus className="h-3.5 w-3.5" /><span className="hidden sm:inline">Add Your Business Now</span></Link><Link href="/login" className="flex h-9 items-center rounded bg-violet-700 px-3 text-xs font-semibold text-white hover:bg-violet-800 sm:px-4">Login</Link></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        <p className="text-sm text-slate-500"><Link href="/" className="hover:text-violet-700">Home</Link><ChevronRight className="mx-1 inline h-3.5 w-3.5" />Businesses</p>
        <div className="mb-6 mt-3 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-2xl font-bold tracking-tight">{params?.q || selectedCategory?.name ? `Results for “${resultsLabel}”` : "Find local businesses"}{cityName ? ` in ${cityName}` : ""}</h1><p className="mt-1 text-sm text-slate-500">{resultCount.toLocaleString()} {resultCount === 1 ? "business" : "businesses"} found</p></div>
          <UseMyLocationButton category={categorySlug} searchTerm={params?.q} />
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4"><h2 className="font-semibold">Filters</h2><Link href="/directory" className="text-sm font-medium text-violet-700">Reset</Link></div>
            <form action="/directory" method="get" className="space-y-4 p-4">
              <label className="block text-sm font-medium">Category<select name="category" defaultValue={categorySlug || ""} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">All categories</option>{categoryItems.map(item => <option key={item._id || item.slug} value={item.slug}>{item.name}</option>)}</select></label>
              <label className="block text-sm font-medium">City<input name="city" list="filter-cities" defaultValue={cityName || ""} placeholder="Any city" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><datalist id="filter-cities">{cityOptions.map(city => <option key={city} value={city} />)}</datalist></label>
              <label className="block text-sm font-medium">Locality<input name="locality" defaultValue={params?.locality || ""} placeholder="Any locality" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="block text-sm font-medium">State<input name="state" defaultValue={params?.state || ""} placeholder="Any state" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              {hasCoordinates ? <><input type="hidden" name="lat" value={params.lat} /><input type="hidden" name="lng" value={params.lng} /><label className="block text-sm font-medium">Distance<select name="radiusMeters" defaultValue={radiusMeters} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="1000">Within 1 km</option><option value="5000">Within 5 km</option><option value="10000">Within 10 km</option><option value="25000">Within 25 km</option><option value="50000">Within 50 km</option></select></label><label className="block text-sm font-medium">Availability<select name="openNow" defaultValue={params?.openNow || ""} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Any status</option><option value="true">Open now</option><option value="false">Closed now</option></select></label></> : null}
              <label className="block text-sm font-medium">Verification<select name="verified" defaultValue={params?.verified || ""} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">All listings</option><option value="true">Verified only</option><option value="false">Not verified</option></select></label>
              <label className="block text-sm font-medium">Sort by<select name="sort" defaultValue={params?.sort || (hasCoordinates ? "distance" : "relevance")} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="relevance">Most relevant</option>{hasCoordinates ? <option value="distance">Nearest first</option> : null}<option value="newest">Newest</option></select></label>
              <input type="hidden" name="q" value={params?.q || ""} /><input type="hidden" name="limit" value={limit} />
              <button className="w-full rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><SlidersHorizontal className="mr-2 inline h-4 w-4" />Apply filters</button>
            </form>
          </aside>

          <section aria-label="Business results" className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm text-slate-600">Showing {businesses.length ? ((page - 1) * limit) + 1 : 0}–{Math.min(page * limit, resultCount)} of {resultCount}</p><span className="text-sm text-slate-500">{{ newest: "Newest", distance: "Nearest first" }[params?.sort] || "Most relevant"}</span></div>
            {businesses.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{businesses.map(business => <BusinessCard key={business._id || business.slug || business.name} business={business} />)}</div> : <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center"><Building2 className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-3 text-lg font-semibold">No businesses found</h2><p className="mt-1 text-sm text-slate-500">Try another search or adjust your filters.</p><Link href="/directory" className="mt-4 inline-flex rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white">Clear filters</Link></div>}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"><span className="text-slate-500">Page {page} of {Math.max(1, pagination.totalPages || 1)}</span><div className="flex gap-2">{pagination.hasPreviousPage ? <Link href={pageHref(page - 1)} aria-label="Previous page" className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 hover:bg-slate-50"><ChevronLeft className="h-4 w-4" />Previous</Link> : <span className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-100 px-3 text-slate-300"><ChevronLeft className="h-4 w-4" />Previous</span>}{pagination.hasNextPage ? <Link href={pageHref(page + 1)} aria-label="Next page" className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 hover:bg-slate-50">Next<ChevronRight className="h-4 w-4" /></Link> : <span className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-100 px-3 text-slate-300">Next<ChevronRight className="h-4 w-4" /></span>}</div></div>
          </section>
        </div>
      </div>
    </main>
  );
}
