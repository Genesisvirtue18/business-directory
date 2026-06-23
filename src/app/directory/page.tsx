import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
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
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

const navItems = [
  "Home",
  "Businesses",
  "Categories",
  "Cities",
  "Deals",
  "Blog",
  "Contact Us",
];

const popularSearches = [
  "Skin Clinic",
  "Dentist",
  "Hair Salon",
  "Restaurants",
  "Gyms",
  "Hospitals",
  "Coaching",
];

const categories = [
  { label: "All Categories", count: "1250", icon: Grid2X2 },
  { label: "Skin Clinic", count: "156", icon: Sparkles, active: true },
  { label: "Dental Clinic", count: "98", icon: Smile },
  { label: "Hair Salon", count: "85", icon: Store },
  { label: "Gyms", count: "76", icon: Dumbbell },
];

const locations = [
  { label: "All Locations", count: "1250" },
  { label: "Delhi", count: "156", active: true },
  { label: "South Delhi", count: "98" },
  { label: "West Delhi", count: "78" },
  { label: "Noida", count: "65" },
];

const ratings = [
  { label: "5 Stars", count: "102" },
  { label: "4.0 & above", count: "68" },
  { label: "3.0 & above", count: "34" },
  { label: "2.0 & above", count: "12" },
  { label: "1.0 & above", count: "5" },
];

const sponsoredBusinesses = [
  {
    name: "Cutis Skin Studio",
    category: "Skin Clinic",
    rating: "5.0",
    reviews: "320",
    area: "South Delhi",
    status: "Open now",
    closesAt: "Closes 9:00 PM",
    short: "C",
    badge: "Ad",
    swatch: "from-[#f0dcc5] via-[#faf2e8] to-[#d8b48a]",
  },
  {
    name: "Dr. Nivedita Dadu",
    category: "Skin Clinic",
    rating: "4.9",
    reviews: "198",
    area: "Delhi",
    status: "Open now",
    closesAt: "Closes 8:30 PM",
    short: "ND",
    badge: "Ad",
    swatch: "from-[#f2e2cc] via-[#fff4e6] to-[#d6aa74]",
  },
  {
    name: "Elegance Skin & Laser",
    category: "Skin Clinic",
    rating: "4.8",
    reviews: "256",
    area: "Central Delhi",
    status: "Open now",
    closesAt: "Closes 9:00 PM",
    short: "E",
    badge: "Ad",
    swatch: "from-[#f4e7cf] via-[#fff9ef] to-[#dfbb86]",
  },
];

const businesses = [
  {
    name: "Oswal Jain Skin Clinic",
    rating: "5.0",
    reviews: "320 Reviews",
    category: "Skin Clinic",
    area: "West Delhi",
    status: "Open now",
    closesAt: "Closes 9:30 PM",
    short: "OJ",
    badge: "Top Rated",
    verified: false,
    swatch: "from-[#f3d9c0] via-[#fff3e2] to-[#d5b58e]",
  },
  {
    name: "DermaWorld Skin & Laser",
    rating: "4.8",
    reviews: "245 Reviews",
    category: "Skin Clinic",
    area: "South Delhi",
    status: "Open now",
    closesAt: "Closes 9:00 PM",
    short: "DW",
    badge: "Verified",
    verified: true,
    swatch: "from-[#c8eaf4] via-[#f3fbff] to-[#86d4ea]",
  },
  {
    name: "Dr. Aesthetica Skin Clinic",
    rating: "4.7",
    reviews: "178 Reviews",
    category: "Skin Clinic",
    area: "South Delhi",
    status: "Open now",
    closesAt: "Closes 8:00 PM",
    short: "DA",
    badge: "Verified",
    verified: true,
    swatch: "from-[#f1dfc8] via-[#fff8ef] to-[#d6ad83]",
  },
  {
    name: "ClearSkin Dermatology",
    rating: "4.6",
    reviews: "143 Reviews",
    category: "Skin Clinic",
    area: "Central Delhi",
    status: "Open now",
    closesAt: "Closes 8:30 PM",
    short: "CS",
    badge: "Verified",
    verified: true,
    swatch: "from-[#d6edf2] via-[#f7fcfd] to-[#95d6dd]",
  },
  {
    name: "Skin Science Clinic",
    rating: "4.6",
    reviews: "98 Reviews",
    category: "Skin Clinic",
    area: "North Delhi",
    status: "Open now",
    closesAt: "Closes 8:30 PM",
    short: "SS",
    badge: "Verified",
    verified: true,
    swatch: "from-[#f0e1cb] via-[#fff7ea] to-[#d8b283]",
  },
  {
    name: "Radiant Skin Clinic",
    rating: "4.6",
    reviews: "76 Reviews",
    category: "Skin Clinic",
    area: "West Delhi",
    status: "Open now",
    closesAt: "Closes 8:00 PM",
    short: "R",
    badge: "Verified",
    verified: true,
    swatch: "from-[#e2e1f8] via-[#fafaff] to-[#a3a0f0]",
  },
];

const stats = [
  {
    value: "50,000+",
    label: "Verified Businesses",
    icon: ShieldCheck,
  },
  {
    value: "10M+",
    label: "Happy Customers",
    icon: Users,
  },
  {
    value: "500+",
    label: "Cities Covered",
    icon: MapPin,
  },
  {
    value: "4.8/5",
    label: "Average Rating",
    icon: Star,
  },
];

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" />
      ))}
    </span>
  );
}

function BusinessCard({
  business,
  sponsored = false,
}: {
  business: (typeof businesses)[number] | (typeof sponsoredBusinesses)[number];
  sponsored?: boolean;
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

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.6),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,255,255,0.3),transparent_20%),linear-gradient(to_top,rgba(15,23,42,0.18),transparent_70%)]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-white/90 text-xl font-semibold text-slate-700 shadow-[0_16px_38px_rgba(15,23,42,0.16)] transition-transform group-hover:scale-105">
            {business.short}
          </div>
        </div>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            {business.badge}
          </span>
          {sponsored ? null : (
            <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              Featured
            </span>
          )}
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
          <Stars />
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
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-violet-600 transition-colors hover:border-violet-200 hover:bg-violet-50"
          >
            <Phone className="h-4 w-4" />
            Call
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-sm shadow-violet-300 transition-all hover:scale-[1.02] hover:shadow-violet-400"
          >
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
}

export default function DirectoryPage() {
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
                <div className="grid gap-2 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_160px]">
                  <label className="flex h-16 items-center gap-3 rounded-lg px-4 hover:bg-slate-50/50">
                    <Search className="h-5 w-5 text-slate-400" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] font-medium text-slate-400">
                        What are you looking for?
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        Skin Clinic
                      </span>
                    </span>
                  </label>

                  <label className="flex h-16 items-center gap-3 rounded-lg border-t border-slate-100 px-4 md:border-l md:border-t-0 hover:bg-slate-50/50">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] font-medium text-slate-400">
                        Enter city or location
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        Delhi, India
                      </span>
                    </span>
                  </label>

                  <button
                    type="button"
                    className="inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(99,102,241,0.32)] transition hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(99,102,241,0.4)]"
                  >
                    Search Now
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-slate-200">Popular Searches:</span>
                {popularSearches.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100 backdrop-blur transition hover:border-violet-300/50 hover:bg-white/10"
                  >
                    {item}
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
                    <p className="mt-2 text-2xl font-semibold text-white">Delhi NCR</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                    <Building2 className="h-6 w-6 text-violet-200" />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Verified", value: "12.4k", icon: BadgeCheck },
                    { label: "Open now", value: "8.7k", icon: CheckCircle2 },
                    { label: "Reviews", value: "55k+", icon: Star },
                    { label: "Top rated", value: "1.9k", icon: ShieldCheck },
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
                <button
                  type="button"
                  className="text-xs font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-5 px-5 py-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Category</p>
                  <div className="mt-3 space-y-2">
                    {categories.map(({ label, count, icon: Icon, active }) => (
                      <label
                        key={label}
                        className={[
                          "flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all",
                          active
                            ? "border-violet-300 bg-violet-50 text-violet-700 shadow-sm"
                            : "border-transparent bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white",
                        ].join(" ")}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </span>
                        <span className="text-xs font-medium text-slate-400">{count}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Location</p>
                  <div className="mt-3 rounded-lg border border-slate-200 px-3 py-2.5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Search className="h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search location"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {locations.map(({ label, count, active }) => (
                      <label
                        key={label}
                        className={[
                          "flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm transition",
                          active
                            ? "bg-violet-50 text-violet-700"
                            : "text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={active}
                            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />
                          <span>{label}</span>
                        </span>
                        <span className="text-xs font-medium text-slate-400">{count}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Rating</p>
                  <div className="mt-3 space-y-2">
                    {ratings.map((item) => (
                      <label
                        key={item.label}
                        className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                      >
                        <span className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="inline-flex items-center gap-1">
                            <Stars />
                            <span>{item.label}</span>
                          </span>
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          ({item.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Open Now</p>
                  <label className="mt-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span>Open Now</span>
                  </label>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Verified Businesses</p>
                  <label className="mt-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span>Verified Only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:px-5">
                <div>
                  <h3 className="text-[18px] font-semibold text-slate-900">
                    Showing results for{" "}
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Skin Clinic
                    </span>{" "}
                    in Delhi, India
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">156 businesses found</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Sort by:</span>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
                    >
                      Most Relevant
                      <ChevronDown className="h-4 w-4" />
                    </button>
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
                {businesses.map((business) => (
                  <BusinessCard key={business.name} business={business} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:flex-row">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50"
                    aria-label="Previous page"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  {["1", "2", "3", "4"].map((item, index) => (
                    <button
                      key={item}
                      type="button"
                      className={[
                        "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition",
                        index === 0
                          ? "border-violet-600 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-300"
                          : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50",
                      ].join(" ")}
                    >
                      {item}
                    </button>
                  ))}

                  <span className="px-1 text-slate-400">...</span>

                  <button
                    type="button"
                    className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    13
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50"
                    aria-label="Next page"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Show:</span>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    12 per page
                    <ChevronDown className="h-4 w-4" />
                  </button>
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