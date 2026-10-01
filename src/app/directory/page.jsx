import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Dumbbell,
  Grid2X2,
  Heart,
  MapPin,
  Menu,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Store,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import { getBusinesses, getCategories, getCities } from "@/lib/api";
import { categoryListingPath, toDirectoryBusiness } from "@/lib/directory-data";

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
  return (
    <article
      className={[
        "group overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-xl",
        sponsored
          ? "border-violet-200 p-4 hover:border-violet-300"
          : "border-slate-100 p-0 hover:border-violet-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden",
          sponsored ? "h-48 rounded-lg" : "h-44 rounded-lg m-4 mb-0",
        ].join(" ")}
      >
        <div className={["absolute inset-0 bg-gradient-to-br", business.swatch].join(" ")} />

        {business.image ? <img src={business.image} alt={`${business.name} photos`} className="absolute inset-0 h-full w-full object-cover" /> : null}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.6),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,255,255,0.3),transparent_20%),linear-gradient(to_top,rgba(15,23,42,0.18),transparent_70%)]" />

        {!business.image ? <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-white/90 text-xl font-semibold text-slate-700 shadow-[0_16px_38px_rgba(15,23,42,0.16)] transition-transform group-hover:scale-105">
            {business.short}
          </div>
        </div> : null}

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            {business.badge}
          </span>
          {business.isFeatured && !sponsored ? (
            <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              Featured
            </span>
          ) : null}
        </div>

        <button
          type="button"
          aria-label="Save business"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-violet-600"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className={sponsored ? "px-1 pt-4" : "p-4 pt-4"}>
        <h3 className="truncate text-[15px] font-semibold text-slate-900 group-hover:text-violet-700">
          {business.name}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-amber-500">{business.rating}</span>
          <Stars rating={business.rating} />
          <span className="text-xs text-slate-500">({business.reviews})</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            {business.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {business.area}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="font-semibold text-emerald-600">{business.status}</span>
          {"closesAt" in business ? (
            <span className="text-slate-500">{business.closesAt}</span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={business.phone ? `tel:${business.phone}` : undefined}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-violet-600 transition-colors hover:border-violet-200 hover:bg-violet-50"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>

          <Link
            href={`/${(business.address?.city || "india").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/${business.slug}/${encodeURIComponent(business._id || business.id || business.slug)}_BZDET`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-sm shadow-violet-300 transition-all hover:scale-[1.02] hover:shadow-violet-400"
          >
            View Profile
          </Link>
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
  const [{ items: businessItems = [], pagination = {} }, { items: categoryItems = [] }, { items: cityItems = [] }] = await Promise.all([
    getBusinesses({ page, limit, q: params?.q, city: cityName, locality: params?.locality, state: params?.state, category: categorySlug, verified: params?.verified, minimumRating: params?.minimumRating, sort: params?.sort }),
    getCategories({ limit: 20 }),
    getCities({ limit: 20 }),
  ]);
  const navItems = ["Home", "Businesses", "Categories", "Cities", "Deals", "Blog", "Contact Us"];
  const businesses = businessItems.map(toDirectoryBusiness);
  const pageHref = targetPage => { const query = new URLSearchParams(); for (const [key, value] of Object.entries({ q: params?.q, city: cityName, locality: params?.locality, state: params?.state, category: categorySlug, verified: params?.verified, minimumRating: params?.minimumRating, sort: params?.sort, limit })) if (value) query.set(key, String(value)); query.set('page', String(targetPage)); return `/directory?${query.toString()}`; };
  const sponsoredBusinesses = businesses.filter((business) => business.isFeatured);
  const regularBusinesses = businesses.filter((business) => !business.isFeatured);
  const stats = [
    { value: pagination.totalItems || 0, label: "Published Listings", icon: ShieldCheck },
    { value: cityItems.length, label: "Cities Covered", icon: MapPin },
    { value: businesses.filter((business) => business.verified).length, label: "Verified Listings", icon: BadgeCheck },
    { value: businesses.length ? (businesses.reduce((total, business) => total + Number(business.rating), 0) / businesses.length).toFixed(1) : "0.0", label: "Average Rating", icon: Star },
  ];
  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-950">
      {/* ========== HERO ========== */}
      <section className="relative isolate overflow-hidden bg-[#030818] text-white">
        <Image
          src="/images/hero-bg.png"
          alt="Delhi skyline with India Gate at dusk"
          fill
          preload
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.88)_36%,rgba(2,6,23,0.66)_67%,rgba(2,6,23,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(104,92,255,0.18),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(255,157,91,0.16),transparent_24%),radial-gradient(circle_at_70%_85%,rgba(121,78,255,0.12),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-5 lg:px-8 lg:pb-16 lg:pt-6">
          {/* Header */}
          <header className="flex h-16 items-center justify-between rounded-lg border border-white/10 bg-white/10 px-4 backdrop-blur-xl lg:h-20 lg:px-6">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-black shadow-[0_10px_30px_rgba(99,102,241,0.4)]">
                G
              </div>
              <div className="leading-tight">
                <h1 className="text-[17px] font-semibold text-white lg:text-xl">
                  Genesis Virtue
                </h1>
                <p className="text-[11px] text-slate-300 lg:text-xs">
                  Business Directory
                </p>
              </div>
            </a>

            <nav className="hidden items-center gap-7 xl:flex">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={[
                    "text-sm font-medium transition",
                    index === 0 ? "text-white" : "text-slate-300 hover:text-white",
                  ].join(" ")}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
                Add Business
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] transition hover:shadow-[0_10px_40px_rgba(99,102,241,0.5)]"
              >
                <Users className="h-4 w-4" />
                Login / Sign Up
              </button>
            </div>

            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </header>

          {/* Hero Content */}
          <div className="grid gap-10 pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:pt-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-violet-300" />
                India&apos;s trusted local directory
              </div>

              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[56px]">
                Find Trusted
                <br />
                Businesses{" "}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Near You
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
                Discover, connect and grow with the best local businesses across India.
              </p>

              <div className="mt-8 overflow-hidden rounded-lg border border-white/12 bg-white/96 p-2 text-slate-900 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur">
                <form action="/directory" method="get" className="grid gap-2 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_160px]">
                  <label className="flex h-16 items-center gap-3 rounded-lg px-4 hover:bg-slate-50/50">
                    <Search className="h-5 w-5 text-slate-400" />
                    <span className="flex min-w-0 flex-1 flex-col"><span className="text-[11px] font-medium text-slate-400">Business, service, or category</span><input name="q" defaultValue={params?.q || ''} placeholder={categoryItems.find(item => item.slug === categorySlug)?.name || 'What are you looking for?'} className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none" /></span>
                  </label>
                  <label className="flex h-16 items-center gap-3 rounded-lg border-t border-slate-100 px-4 md:border-l md:border-t-0 hover:bg-slate-50/50">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="flex min-w-0 flex-1 flex-col"><span className="text-[11px] font-medium text-slate-400">City or locality</span><input name="city" defaultValue={cityName || ''} placeholder="Anywhere" className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none" /></span>
                  </label>
                  {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
                  <input type="hidden" name="limit" value={limit} />
                  <button className="inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(99,102,241,0.32)] transition hover:scale-[1.02]">Search Now</button>
                </form>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-slate-200">Popular Searches:</span>
                {categoryItems.slice(0, 7).map((item) => (
                  <a
                    key={item.slug || item.name}
                    href={categoryListingPath(cityName || cityItems[0]?.name || "Delhi", item)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100 backdrop-blur transition hover:border-violet-300/50 hover:bg-white/10"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Hero Stats Card */}
            <div className="hidden items-end justify-end lg:flex">
              <div className="w-full max-w-[360px] rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                      Live Coverage
                    </p>
                    <p className="mt-2 text-2xl font-semibold capitalize text-white">{cityName || 'India'}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                    <Building2 className="h-6 w-6 text-violet-200" />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Published listings", value: (pagination.totalItems || 0).toLocaleString(), icon: Building2 },
                    { label: "Verified on this page", value: businesses.filter((business) => business.verified).length.toLocaleString(), icon: BadgeCheck },
                    { label: "Reviews on this page", value: businesses.reduce((sum, business) => sum + Number(business.reviewCount || 0), 0).toLocaleString(), icon: Star },
                    { label: "Cities covered", value: cityItems.length.toLocaleString(), icon: ShieldCheck },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-white/10 bg-black/15 p-4 transition hover:bg-black/25"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-white">{value}</p>
                          <p className="mt-1 text-xs text-slate-300">{label}</p>
                        </div>
                        <Icon className="h-5 w-5 text-violet-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DIRECTORY ========== */}
      <section className="bg-[#f5f7fc]">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Filters */}
            <aside className="rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
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
                <label className="block text-sm font-semibold text-slate-900">Verification<select name="verified" defaultValue={params?.verified || ''} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="">All published listings</option><option value="true">Verified only</option><option value="false">Not verified</option></select></label>
                <label className="block text-sm font-semibold text-slate-900">Sort by<select name="sort" defaultValue={params?.sort || 'relevance'} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option value="relevance">Most relevant</option><option value="rating">Top rated</option><option value="newest">Newest</option></select></label>
                <input type="hidden" name="limit" value={limit} />
                <button className="w-full rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">Apply filters</button>
              </form>
            </aside>

            {/* Results */}
            <div className="space-y-6">
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
                    <span>Sorted by: <strong className="font-semibold text-slate-700">{{ rating: 'Top rated', newest: 'Newest' }[params?.sort] || 'Most relevant'}</strong></span>
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
                <div className="grid gap-4 xl:grid-cols-3">
                  {sponsoredBusinesses.map((business) => (
                    <BusinessCard key={business.name} business={business} sponsored />
                  ))}
                </div>
              </section>

              {/* Business Grid */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

