import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  BriefcaseBusiness,
  Building,
  ChevronRight,
  Grid2X2,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  SlidersHorizontal,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { getBusinesses, getCategories, getCities } from "@/lib/api";
import { businessDetailPath, categoryListingPath, toDirectoryBusiness } from "@/lib/directory-data";
import UseMyLocationButton from "@/components/UseMyLocationButton";
import { absoluteSiteUrl, buildDirectoryJsonLd, jsonLdString } from "@/lib/business-schema";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const hasSearchState = Object.keys(params || {}).some(key => !["limit"].includes(key));
  return {
    title: "Find Local Businesses Near You | Genesis Virtue",
    description: "Discover local businesses by category, location, rating, and distance.",
    alternates: { canonical: absoluteSiteUrl("/directory") },
    ...(hasSearchState ? { robots: { index: false, follow: true } } : {}),
  };
}

function Stars({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-3.5 w-3.5 ${index < Math.round(Number(rating)) ? 'fill-current' : 'text-slate-200'}`} />
      ))}
    </span>
  );
}

function BusinessCard({
  business,
  sponsored = false,
}) {
  const detailHref = businessDetailPath(business);
  return (
    <article className="group flex min-h-[170px] flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:flex-row">
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <Store className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-blue-700"><Link href={detailHref}>{business.name}</Link></h3>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded bg-emerald-700 px-1.5 py-0.5 font-bold text-white">{business.rating} ★</span>
          <span>{business.reviews} Ratings</span>
          {business.verified ? <span className="inline-flex items-center gap-1 font-semibold text-blue-700"><BadgeCheck className="h-3.5 w-3.5" />Verified</span> : null}
          {business.isFeatured || sponsored ? <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">Top rated</span> : null}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600"><MapPin className="h-3.5 w-3.5 shrink-0" />{business.area}{business.address?.city ? `, ${business.address.city}` : ""}</p>
        <div className="mt-2 flex flex-wrap gap-1.5"><span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{business.category}</span><span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{business.status}</span></div>
        <p className="mt-2 text-xs font-semibold text-amber-700">⚡ Quick response available</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={business.phone ? `tel:${business.phone}` : undefined} className="inline-flex h-8 items-center gap-1.5 rounded bg-green-700 px-3 text-xs font-semibold text-white"><Phone className="h-3.5 w-3.5" />{business.phone || "Call"}</a>
          {business.whatsapp ? <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`} className="inline-flex h-8 items-center rounded border border-slate-200 px-3 text-xs font-semibold text-slate-700">WhatsApp</a> : null}
          <Link href={detailHref} className="inline-flex h-8 items-center rounded bg-[#0876ce] px-3 text-xs font-semibold text-white">Get Best Deal</Link>
        </div>
      </div>
      <Link aria-label={`View photos and details for ${business.name}`} href={detailHref} className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-36">
        {business.image ? <img src={business.image} alt={`${business.name}`} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${business.swatch} text-lg font-semibold text-slate-600`}>{business.short}</div>}
        <span className="absolute bottom-1 right-1 rounded bg-black/65 px-2 py-1 text-[10px] font-semibold text-white">Photos</span>
      </Link>
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
    getBusinesses({ page, limit, q: params?.q, city: hasCoordinates ? undefined : cityName, locality: hasCoordinates ? undefined : params?.locality, state: hasCoordinates ? undefined : params?.state, category: categorySlug, verified: params?.verified, minimumRating: params?.minimumRating, lat: params?.lat, lng: params?.lng, radiusMeters, openNow: params?.openNow, sort: params?.sort === "distance" ? "relevance" : params?.sort }),
    getCategories({ limit: 20 }),
    getCities({ limit: 20 }),
  ]);
  const businesses = businessItems.map(toDirectoryBusiness);
  const pageHref = targetPage => { const query = new URLSearchParams(); for (const [key, value] of Object.entries({ q: params?.q, city: cityName, locality: params?.locality, state: params?.state, category: categorySlug, verified: params?.verified, minimumRating: params?.minimumRating, lat: params?.lat, lng: params?.lng, radiusMeters: hasCoordinates ? radiusMeters : undefined, openNow: params?.openNow, sort: params?.sort, limit })) if (value !== undefined && value !== "") query.set(key, String(value)); query.set('page', String(targetPage)); return `/directory?${query.toString()}`; };
  const selectedCategory = categoryItems.find(item => item.slug === categorySlug);
  const citySlug = String(cityName || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const categoryPath = selectedCategory && citySlug ? categoryListingPath(cityName, selectedCategory) : "/directory";
  const directorySchema = buildDirectoryJsonLd(businessItems, hasCoordinates ? "/directory" : categoryPath);
  const sponsoredBusinesses = businesses.filter((business) => business.isFeatured);
  const regularBusinesses = businesses.filter((business) => !business.isFeatured);
  const promoCategories = [
    { title: "B2B", subtitle: "Quick Quotes", query: "B2B services", color: "bg-[#1178cf]", icon: BriefcaseBusiness },
    { title: "REPAIRS & SERVICES", subtitle: "Find nearby help", query: "Repairs and Services", color: "bg-[#2855a0]", icon: Wrench },
    { title: "REAL ESTATE", subtitle: "Find your place", query: "Real Estate", color: "bg-[#6766cf]", icon: Building },
    { title: "DOCTORS", subtitle: "Book a visit", query: "Doctors", color: "bg-[#008968]", icon: Stethoscope },
  ];
  const stats = [
    { value: pagination.totalItems || 0, label: "Published Listings", icon: ShieldCheck },
    { value: cityItems.length, label: "Cities Covered", icon: MapPin },
    { value: businesses.filter((business) => business.verified).length, label: "Verified Listings", icon: BadgeCheck },
    { value: businesses.length ? (businesses.reduce((total, business) => total + Number(business.rating), 0) / businesses.length).toFixed(1) : "0.0", label: "Average Rating", icon: Star },
  ];
  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(directorySchema) }} />
      {/* ========== DIRECTORY HEADER ========== */}
      <section className="border-b border-slate-200 bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Header */}
          <header className="flex min-h-[68px] flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-2.5">
            <Link href="/directory" className="shrink-0 text-2xl font-extrabold tracking-[-1.5px] text-violet-700">Genesis Virtue</Link>
            <form action="/directory" method="get" className="order-3 flex w-full max-w-xl items-center gap-2 sm:order-none sm:flex-1 sm:px-4">
              <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3"><MapPin className="h-4 w-4 shrink-0 text-slate-400" /><input name="city" defaultValue={cityName || ""} placeholder="City" className="w-full bg-transparent text-sm outline-none" /></label>
              <label className="flex h-10 min-w-0 flex-[1.5] items-center gap-2 rounded-md border border-slate-300 px-3"><input name="q" defaultValue={params?.q || selectedCategory?.name || ""} placeholder="Business or service" className="w-full bg-transparent text-sm outline-none" /><button aria-label="Search" className="-mr-2 flex h-8 w-9 shrink-0 items-center justify-center rounded bg-violet-700 text-white"><Search className="h-4 w-4" /></button></label>
              {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
            </form>
            <div className="flex items-center gap-2"><Link href="/business-owner" className="hidden items-center gap-1 rounded border border-slate-300 px-2.5 py-2 text-xs font-semibold sm:flex"><Plus className="h-3.5 w-3.5" />Free Listing</Link><Link href="/login" className="rounded bg-[#0876ce] px-3 py-2 text-xs font-semibold text-white">Login / Sign Up</Link></div>
          </header>
          <section aria-label="Featured services" className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4 lg:grid-cols-[minmax(0,2.15fr)_repeat(4,minmax(0,0.48fr))]">
            <Link href="/directory?q=exclusive+deals" className="relative col-span-2 flex min-h-[215px] items-center overflow-hidden rounded-2xl bg-[#21105e] bg-cover bg-center p-6 text-white shadow-sm sm:col-span-4 lg:col-span-1 lg:min-h-[240px] lg:p-8" style={{ backgroundImage: "linear-gradient(90deg,rgba(27,8,79,.98) 0%,rgba(36,12,92,.88) 39%,rgba(36,12,92,.05) 78%),url('/images/exlusive-deals-image.png')" }}>
              <div className="relative z-10 max-w-[58%] sm:max-w-[48%]">
                <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-extrabold text-violet-700">Genesis Virtue</span>
                <p className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">Exclusive<br /><span className="text-amber-300">LOCAL DEALS</span></p>
                <p className="mt-2 text-sm text-white/90 sm:text-base">Discover more value from businesses near you</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#ff5b16] px-4 py-2 text-sm font-bold">Explore deals <ArrowRight className="h-4 w-4" /></span>
              </div>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((dot) => <span key={dot} className={`h-2 w-2 rounded-full ${dot === 0 ? "bg-white" : "bg-white/50"}`} />)}</div>
            </Link>
            {promoCategories.map(({ title, subtitle, query, color, icon: Icon }) => (
              <Link key={title} href={`/directory?q=${encodeURIComponent(query)}`} className={`group relative flex min-h-[140px] flex-col overflow-hidden rounded-2xl ${color} p-4 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-h-[170px] lg:min-h-[240px] lg:p-4`}>
                <span className="relative z-10 text-sm font-extrabold leading-tight sm:text-base">{title}</span>
                <span className="relative z-10 mt-2 max-w-[90px] text-xs leading-5 text-white/90">{subtitle}</span>
                <Icon className="absolute -bottom-2 -right-2 h-20 w-20 text-white/30 transition group-hover:scale-110 sm:h-24 sm:w-24 lg:h-28 lg:w-28" strokeWidth={1.15} />
                <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-md bg-black/15"><ChevronRight className="h-5 w-5" /></span>
              </Link>
            ))}
          </section>
          <div className="flex flex-wrap items-end justify-between gap-3 py-3"><div><p className="text-xs text-slate-500">Home › {cityName || "India"} › {selectedCategory?.name || params?.q || "Businesses"}</p><h1 className="mt-1 text-xl font-semibold">{selectedCategory?.name || params?.q || "Local Businesses"} in {cityName || "India"}</h1></div><p className="text-xs text-slate-500">{(pagination.totalItems || businesses.length).toLocaleString()} listings</p></div>
          <div className="flex gap-2 overflow-x-auto pb-3 text-xs">
            {[{label:"Sort by",name:"sort",value:params?.sort||"relevance",options:[["relevance","Relevance"],["rating","Top Rated"],["newest","Newest"]]},{label:"Rating",name:"minimumRating",value:params?.minimumRating||"",options:[["","Any Rating"],["4","4+ Stars"],["3","3+ Stars"]]},{label:"Verified",name:"verified",value:params?.verified||"",options:[["","All Listings"],["true","Verified"]]}].map(filter=><form key={filter.name} action="/directory"><input type="hidden" name="q" value={params?.q||""}/><input type="hidden" name="city" value={cityName||""}/><input type="hidden" name="category" value={categorySlug||""}/><select aria-label={filter.label} name={filter.name} defaultValue={filter.value} className="min-w-max rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700">{filter.options.map(([value,label])=><option key={value} value={value}>{filter.label}: {label}</option>)}</select><button className="sr-only">Apply</button></form>)}<Link href="/directory" className="min-w-max rounded-md border border-slate-200 bg-white px-3 py-2 font-medium">Clear filters</Link><UseMyLocationButton category={categorySlug} searchTerm={params?.q} /></div>
        </div>
      </section>

      {/* ========== DIRECTORY ========== */}
      <section className="bg-[#f5f7fc]">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Filters */}
            <aside className="order-2 space-y-4 lg:order-2">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4"><h3 className="font-semibold text-slate-900">Need help finding {selectedCategory?.name || "a business"}?</h3><p className="mt-1 text-xs text-slate-600">Connect with trusted local businesses and get the right service.</p><Link href="/directory" className="mt-3 inline-flex rounded-full bg-[#0876ce] px-4 py-2 text-xs font-semibold text-white">Find the right business <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
              <div className="rounded-lg border border-slate-200 bg-white p-4"><h3 className="text-sm font-semibold text-slate-900">Popular categories</h3><div className="mt-3 space-y-2">{categoryItems.slice(0, 7).map(item=><Link key={item.slug} href={categoryListingPath(cityName || cityItems[0]?.name || "India", item)} className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs text-slate-700 last:border-0"><span>{item.name}</span><ArrowRight className="h-3 w-3 text-slate-400" /></Link>)}</div></div>
              <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h3 className="text-[15px] font-semibold text-slate-900">Filters</h3>
                <Link href="/directory" className="text-xs font-semibold text-violet-600 transition hover:text-violet-700">Reset All</Link>
              </div>

              <form action="/directory" method="get" className="space-y-4 px-5 py-5">
                <label className="block text-sm font-semibold text-slate-900">Search<input name="q" defaultValue={params?.q || ''} placeholder="Business or service" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>
                <label className="block text-sm font-semibold text-slate-900">Category<select name="category" defaultValue={categorySlug || ''} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="">All categories</option>{categoryItems.map(item => <option key={item._id} value={item.slug}>{item.name}</option>)}</select></label>
                <label className="block text-sm font-semibold text-slate-900">City<input name="city" defaultValue={cityName || ''} placeholder="Any city" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>
                <label className="block text-sm font-semibold text-slate-900">Locality<input name="locality" defaultValue={params?.locality || ''} placeholder="Any locality" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>
                <label className="block text-sm font-semibold text-slate-900">State<input name="state" defaultValue={params?.state || ''} placeholder="Any state" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>
                <label className="block text-sm font-semibold text-slate-900">Minimum rating<select name="minimumRating" defaultValue={params?.minimumRating || ''} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="">Any rating</option>{[4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating}+ stars</option>)}</select></label>
                {hasCoordinates ? <>
                  <input type="hidden" name="lat" value={params.lat} /><input type="hidden" name="lng" value={params.lng} />
                  <label className="block text-sm font-semibold text-slate-900">Distance<select name="radiusMeters" defaultValue={radiusMeters} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="1000">Within 1 km</option><option value="5000">Within 5 km</option><option value="10000">Within 10 km</option><option value="25000">Within 25 km</option><option value="50000">Within 50 km</option></select></label>
                  <label className="block text-sm font-semibold text-slate-900">Availability<select name="openNow" defaultValue={params?.openNow || ""} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="">Any status</option><option value="true">Open now</option><option value="false">Closed now</option></select></label>
                </> : <p className="text-xs text-slate-500">Use “Use my location” to filter by distance and open status.</p>}
                <label className="block text-sm font-semibold text-slate-900">Verification<select name="verified" defaultValue={params?.verified || ''} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="">All published listings</option><option value="true">Verified only</option><option value="false">Not verified</option></select></label>
                <label className="block text-sm font-semibold text-slate-900">Sort by<select name="sort" defaultValue={params?.sort || (hasCoordinates ? 'distance' : 'relevance')} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="relevance">Most relevant</option>{hasCoordinates ? <option value="distance">Nearest first</option> : null}<option value="rating">Top rated</option><option value="newest">Newest</option></select></label>
                <input type="hidden" name="limit" value={limit} />
                <button className="w-full rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">Apply filters</button>
              </form>
              </div>
            </aside>

            {/* Results */}
            <div className="order-1 min-w-0 space-y-4 lg:order-1">
              {/* Results Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:px-5">
                <div>
                  <h3 className="text-[18px] font-semibold text-slate-900">
                    Showing results for{" "}
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      {categoryItems.find((item) => item.slug === categorySlug)?.name || params?.q || "Businesses"}
                    </span>{" "}
                    {cityName ? `in ${cityName}` : "across India"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{pagination.totalItems || businesses.length} businesses found</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Sorted by: <strong className="font-semibold text-slate-700">{{ rating: 'Top rated', newest: 'Newest', distance: 'Nearest first' }[params?.sort] || 'Most relevant'}</strong></span>
                  </div>

                  <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                      aria-label="Grid view"
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center bg-white text-slate-500 transition hover:bg-slate-50"
                      aria-label="List view"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    <MapPin className="h-4 w-4 text-violet-600" />
                    View on Map
                  </button>
                </div>
              </div>

              {/* Sponsored */}
              <section className="rounded-lg border border-violet-200 bg-gradient-to-br from-[#f8f5ff] to-[#faf7ff] p-4 shadow-[0_10px_30px_rgba(99,102,241,0.06)]">
                <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-violet-700">
                  <Sparkles className="h-4 w-4" />
                  Sponsored Businesses
                </div>
                <div className="grid gap-3">
                  {sponsoredBusinesses.map((business) => (
                    <BusinessCard key={business.name} business={business} sponsored />
                  ))}
                </div>
              </section>

              {/* Business Grid */}
              <div className="grid gap-3">
                  {regularBusinesses.map((business) => (
                  <BusinessCard key={business._id || business.slug || business.name} business={business} />
                ))}
                {!businesses.length ? <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 md:col-span-2 xl:col-span-3 2xl:col-span-4">No businesses match these filters. Try a wider location or a lower minimum rating.</p> : null}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-4 text-sm shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <p className="text-slate-500">Page {page} of {Math.max(1, pagination.totalPages || 0)}</p>
                <div className="flex gap-2">
                  {pagination.hasPreviousPage ? <Link href={pageHref(page - 1)} className="rounded-lg border px-4 py-2 hover:bg-violet-50">Previous</Link> : <span className="rounded-lg border px-4 py-2 text-slate-300">Previous</span>}
                  {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-lg border px-4 py-2 hover:bg-violet-50">Next</Link> : <span className="rounded-lg border px-4 py-2 text-slate-300">Next</span>}
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ value, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:border-violet-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[22px] font-semibold text-slate-900">{value}</p>
                        <p className="mt-1 text-sm text-slate-500">{label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-[#f5f7fc] px-4 pb-10 pt-2 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-r from-[#efe8ff] via-[#faf7ff] to-[#f1edf9] px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600">
                <Phone className="h-7 w-7 rotate-[-20deg]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Grow Your Business With Genesis Virtue
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Reach more customers and increase visibility.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-violet-300 transition hover:scale-[1.02] hover:shadow-violet-400"
              >
                Add Business
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

