import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CarFront,
  Coffee,
  Dumbbell,
  GraduationCap,
  Grid2X2,
  HomeIcon,
  MapPin,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ShoppingBag,
  Utensils,
  Phone,
  Wrench,
  Hotel,
  Landmark,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";
import NearbyCategoryLink from "@/components/NearbyCategoryLink";
import BestNearYou from "@/components/BestNearYou";
import { getBusinesses, getCategories, getCities } from "@/lib/api";
import { businessDetailPath, toHomeBusiness } from "@/lib/directory-data";

const categoryIconMatchers = [
  [/restaurant|food|dining|cafe|catering|bakery|pizza|hospitality/, Utensils],
  [/doctor|medical|health|clinic|dent|pharmacy|hospital|vet/, Stethoscope],
  [/beauty|salon|spa|cosmetic|makeup/, Sparkles],
  [/education|school|college|university|training|tuition/, GraduationCap],
  [/home|real-estate|property|interior|furniture|construction/, HomeIcon],
  [/auto|car|vehicle|transport|taxi|bike|motor/, CarFront],
  [/repair|plumb|electric|maintenance|service|mechanic/, Wrench],
  [/shop|retail|store|market|grocery|fashion|shopping/, ShoppingBag],
  [/gym|fitness|sport|yoga/, Dumbbell],
  [/finance|bank|insurance|account|legal|law/, Landmark],
  [/travel|tour|lodging|hotel|stay/, Hotel],
  [/business|consult|office|professional|agency/, BriefcaseBusiness],
  [/coffee|tea/, Coffee],
];

function iconForCategory(category) {
  const key = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
  return categoryIconMatchers.find(([pattern]) => pattern.test(key))?.[1] || Grid2X2;
}

const categoryImageMatchers = [
  [/restaurant|food|dining|cafe|catering|bakery|pizza/, "photo-1517248135467-4c7edcad34c4"],
  [/doctor|medical|health|clinic|dent|pharmacy|hospital|vet/, "photo-1576091160399-112ba8d25d1d"],
  [/beauty|salon|spa|cosmetic|makeup/, "photo-1560066984-138dadb4c035"],
  [/education|school|college|university|training|tuition/, "photo-1523050854058-8df90110c9f1"],
  [/home|real-estate|property|interior|furniture|construction/, "photo-1600210492486-724fe5c67fb0"],
  [/auto|car|vehicle|transport|taxi|bike|motor/, "photo-1486262715619-67b85e0b08d3"],
  [/repair|plumb|electric|maintenance|service|mechanic/, "photo-1621905251918-48416bd8575a"],
  [/shop|retail|store|market|grocery|fashion|shopping/, "photo-1441986300917-64674bd600d8"],
  [/gym|fitness|sport|yoga/, "photo-1534438327276-14e5300c3a48"],
  [/finance|bank|insurance|account|legal|law/, "photo-1486406146926-c627a92ad1ab"],
  [/travel|tour|lodging|hotel|stay/, "photo-1566073771259-6a8506099945"],
  [/business|consult|office|professional|agency/, "photo-1497366754035-f200968a6e72"],
];

function imageForCategory(category) {
  if (category.image) return category.image;
  const key = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
  const photo = categoryImageMatchers.find(([pattern]) => pattern.test(key))?.[1] || "photo-1497366216548-37526070297c";
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=85`;
}

export default async function Home() {
  const [{ items: businessItems = [], pagination = {} }, { items: categoryItems = [] }, { pagination: cityPagination = {} }, { pagination: verifiedPagination = {} }] = await Promise.all([
    getBusinesses({ limit: 6 }),
    getCategories({ limit: 100 }),
    getCities({ limit: 100 }),
    getBusinesses({ verified: true, limit: 1 }),
  ]);
  const categories = categoryItems
    .filter((category) => !category.parentCategory)
    .map((category, index) => {
      return {
      id: category._id || category.id || `${category.name}-${index}`,
      slug: category.slug,
      label: category.name,
      description: category.description,
      image: imageForCategory(category),
      icon: iconForCategory(category),
      };
    });
  const featuredCategories = categories.slice(0, 12);
  const businesses = businessItems.map(toHomeBusiness);
  const popularCategories = categories.slice(0, 6);
  const stats = [
    { value: (pagination.totalItems || 0).toLocaleString(), label: "Businesses Listed", icon: Building2 },
    { value: (verifiedPagination.totalItems || 0).toLocaleString(), label: "Verified Businesses", icon: BadgeCheck },
    { value: (cityPagination.totalItems || 0).toLocaleString(), label: "Cities Available", icon: MapPin },
  ];
  return (
    <main className="min-h-screen bg-white text-slate-950">
    <section className="relative overflow-hidden bg-[#071632]">
      <video autoPlay muted loop playsInline preload="metadata" poster="/images/hero-bg.png" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover">
        <source src="/images/hero-video.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#040d26]/85 via-[#040d26]/60 to-[#040d26]/25" />

        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
          <div className="mx-auto flex min-h-[68px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 lg:px-8">
            <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-[-1.5px] text-violet-700">
              Genesis Virtue
            </Link>
            <form action="/directory" method="get" className="order-3 flex w-full max-w-xl items-center gap-2 sm:order-none sm:flex-1 sm:px-4">
              <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <input name="city" placeholder="City" className="w-full bg-transparent text-sm outline-none" />
              </label>
              <label className="flex h-10 min-w-0 flex-[1.5] items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
                <input name="q" placeholder="Business or service" className="w-full bg-transparent text-sm outline-none" />
                <button aria-label="Search" className="-mr-2 flex h-8 w-9 shrink-0 items-center justify-center rounded bg-violet-700 text-white hover:bg-violet-800">
                  <Search className="h-4 w-4" />
                </button>
              </label>
            </form>
            <div className="flex items-center gap-2">
              <Link href="/register" className="flex h-9 items-center gap-1 rounded border border-slate-300 px-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 sm:px-3">
                <Plus className="h-3.5 w-3.5" />Add Your Business Now
              </Link>
              <Link href="/login" className="flex h-9 items-center rounded bg-violet-700 px-3 text-xs font-semibold text-white hover:bg-violet-800 sm:px-4">
                Login
              </Link>
            </div>
          </div>
        </header>
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-9 lg:px-8 lg:pb-10 lg:pt-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-white/15"><ShieldCheck className="h-4 w-4 text-violet-300" />India&apos;s local business directory</span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">Find Trusted Businesses.<br /><span className="text-violet-300">Grow Together.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">Discover local services and connect with businesses across India.</p>
            </div>
            
          </div>
          <form action="/directory" method="get" className="mt-8 flex max-w-5xl flex-col gap-2 rounded-xl bg-white p-2 shadow-2xl sm:flex-row">
            <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg px-3 text-slate-400"><MapPin className="h-5 w-5 shrink-0" /><input name="city" placeholder="Enter city or location" className="w-full text-sm text-slate-900 outline-none" /></label>
            <label className="flex h-12 min-w-0 flex-[1.5] items-center gap-3 rounded-lg border-t border-slate-100 px-3 text-slate-400 sm:border-l sm:border-t-0"><Search className="h-5 w-5 shrink-0" /><input name="q" placeholder="Business or service" className="w-full text-sm text-slate-900 outline-none" /></label>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-700 px-6 text-sm font-semibold text-white hover:bg-violet-800"><Search className="h-4 w-4" />Search Now</button>
          </form>
          {popularCategories.length ? <div className="mt-4 flex flex-wrap items-center gap-2 text-xs"><span className="mr-1 font-semibold text-white">Popular categories</span>{popularCategories.map(({ id, slug, label }) => <Link key={id} href={slug ? `/directory?category=${encodeURIComponent(slug)}` : "/directory"} className="rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-slate-100 transition hover:bg-white/15">{label}</Link>)}</div> : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-slate-200 border-b border-slate-100 px-5 py-5 lg:px-8">
        {stats.map(({ value, label, icon: Icon }) => <div key={label} className="flex items-center justify-center gap-2 px-2 py-2 sm:gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-4 w-4" /></span><span><span className="block text-base font-bold text-slate-900 sm:text-lg">{value}</span><span className="text-[10px] text-slate-500 sm:text-xs">{label}</span></span></div>)}
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold text-slate-900">Discover Local Specialties</h2><p className="mt-1 text-sm text-slate-500">Browse businesses by category.</p></div><Link href="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">All categories <ArrowRight className="h-4 w-4" /></Link></div>
        {featuredCategories.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {featuredCategories.map(({ id, slug, label, image, icon: Icon }) => <NearbyCategoryLink key={id} category={slug || id} fallbackHref={slug ? `/directory?category=${encodeURIComponent(slug)}` : "/directory"} className="group relative h-36 overflow-hidden rounded-xl bg-slate-200 sm:h-40"><img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" /><span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-violet-700"><Icon className="h-5 w-5" /></span><span className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-semibold text-white">{label}</span></NearbyCategoryLink>)}
        </div> : <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Categories will appear here when they are available.</p>}
      </section>

      <BestNearYou fallbackBusinesses={businesses} />

      <section id="add-business" className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-amber-50 p-6 shadow-sm sm:p-9 md:grid-cols-[1.3fr_0.7fr] md:items-center lg:p-10">
          <div>
            <span className="inline-flex rounded-full border border-violet-100 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">For local business owners</span>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">Help your next local customer find you.</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">Show people what you do, where to find you, and how to get in touch. Create your business profile on Genesis Virtue.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-lg bg-violet-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800">
                <Plus className="h-4 w-4" />Add Your Business Now
              </Link>
              <Link href="/login" className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-violet-700">Already listed? Login</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-white bg-white p-5 shadow-lg shadow-violet-900/5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700"><Building2 className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Your business profile</p>
                <p className="mt-0.5 text-xs text-slate-500">Ready to be discovered</p>
              </div>
              <BadgeCheck className="ml-auto h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
              <MapPin className="h-4 w-4 text-violet-600" /> Local search · Your category · Your city
            </div>
            <div className="mt-3 flex gap-2" aria-hidden="true">
              <span className="h-2 flex-1 rounded-full bg-violet-200" />
              <span className="h-2 flex-1 rounded-full bg-fuchsia-200" />
              <span className="h-2 flex-1 rounded-full bg-amber-200" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#071737] via-[#191b4b] to-[#342d82] px-5 py-8 shadow-[0_24px_65px_rgba(15,23,42,0.16)] sm:px-8 sm:py-10 lg:px-12">
          <div className="mb-7 text-center sm:mb-9">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Genesis Virtue</span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">Trusted Across India</h2>
            <p className="mt-2 text-sm text-indigo-100 sm:text-base">Connecting customers with verified businesses every day</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="group flex min-h-32 items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.09] px-5 py-5 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.14] sm:px-6 lg:px-7">
                <div className="min-w-0"><p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{value}</p><p className="mt-1.5 text-sm font-medium text-indigo-100 sm:text-base">{label}</p></div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.12] text-white transition group-hover:bg-violet-500/40"><Icon className="h-6 w-6" strokeWidth={1.8} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl  px-5 py-12 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-8 text-white"
          style={{
            backgroundImage: `
      linear-gradient(
        rgba(15,23,42,0.82),
        rgba(15,23,42,0.82)
      ),
      url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')
    `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="mb-8 text-center text-3xl  font-semibold">
            How Genesis Virtue Works
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Search</h3>
                <p className="text-sm text-slate-300">
                  Find businesses nearby
                </p>
              </div>
            </div>

            {/* Verify */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Verify</h3>
                <p className="text-sm text-slate-300">
                  Explore local businesses
                </p>
              </div>
            </div>

            {/* Connect */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Connect</h3>
                <p className="text-sm text-slate-300">
                  Contact businesses directly
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="deals" className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            backgroundImage:
              "url('/images/exlusive-deals-image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="px-8 py-12 md:px-12">

            <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-indigo-100 backdrop-blur">
              Great Offers Near You
            </span>

            <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-white">
              Exclusive Deals from Top Businesses
            </h2>

            <p className="mt-4 max-w-lg text-base leading-7 text-slate-200">
              Explore amazing discounts and offers from trusted local businesses.
            </p>

            <a
              href="/directory"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Deals
              <ArrowRight className="h-4 w-4" />
            </a>

          </div>
        </div>
      </section>
      <section id="blog" className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
  <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
    <h2 className="text-2xl font-semibold text-slate-900">Latest From Our Blog</h2>
    <p className="mt-2 text-sm text-slate-500">New articles will appear here when they are published.</p>
  </div>
</section>
<section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
  <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600">

    <div className="flex flex-col items-center justify-between gap-5 px-6 py-6 lg:flex-row">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <Rocket className="h-7 w-7 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white lg:text-2xl">
            Grow Your Business With Genesis Virtue
          </h2>

          <p className="mt-1 text-sm text-indigo-100">
            Reach more customers and increase visibility.
          </p>
        </div>

      </div>

      <div className="flex gap-3">

        <Link
          href="/register"
          className="inline-flex h-10 items-center rounded-xl bg-white px-5 text-sm font-semibold text-indigo-600"
        >
          Add Your Business Now
        </Link>

        <Link
          href="/login"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white"
        >
          Login
        </Link>

      </div>

    </div>

  </div>
</section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            One-stop for local businesses, services, and stores across India
          </h2>
          <p className="mt-4 max-w-6xl text-sm leading-6 text-slate-600">
            Genesis Virtue helps you discover local businesses and services in one place. Explore categories, compare business details, and contact the business that fits your needs. Business owners can create a listing to help more people find them.
          </p>

          <h3 className="mt-9 text-lg font-semibold text-slate-900">
            Browse categories for everyday needs
          </h3>
          <div className="mt-5 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map(({ id, slug, label, description, icon: Icon }) => (
              <Link
                key={id}
                href={slug ? `/directory?category=${encodeURIComponent(slug)}` : "/directory"}
                className="group"
              >
                <span className="flex items-center gap-2.5 font-semibold text-slate-800 group-hover:text-violet-700">
                  <Icon className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-violet-600" strokeWidth={1.7} />
                  {label}
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">
                  {description || `Find local ${label.toLowerCase()} businesses, view their details, and connect with the right provider.`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="relative bg-[#061531] text-white">

  {/* Top Border Glow */}
  <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

  <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr]">

      {/* Brand */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-bold text-white shadow-lg">
            G
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Genesis Virtue
            </h3>

            <p className="text-xs text-slate-400">
              Business Directory
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
          India's trusted platform to discover, connect and grow with verified local businesses.
        </p>

        {/* Socials */}
        <div className="mt-6 flex gap-3">
          {[ FaFacebookF,   FaInstagram,   FaLinkedinIn, FaYoutube].map((Icon, i) => (
            <a
              key={i}
              href={["https://facebook.com", "https://instagram.com", "https://linkedin.com", "https://youtube.com"][i]}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-indigo-600 hover:text-white"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Links */}
      {[
        {
          title: "Quick Links",
          links: ["Home", "Businesses", "Categories", "Cities", "Deals"],
        },
        {
          title: "For Businesses",
          links: ["Add Business", "Dashboard", "Premium Plans", "Advertising"],
        },
        {
          title: "Company",
          links: ["About Us", "Contact", "Blog", "Careers"],
        },
        {
          title: "Support",
          links: ["Help Center", "Terms", "Privacy", "Sitemap"],
        },
      ].map((section) => (
        <div key={section.title}>
          <h3 className="mb-4 font-semibold text-white">
            {section.title}
          </h3>

          <div className="space-y-3">
            {section.links.map((link) => (
              <a
                key={link}
                href={(({ "Home": "/", "Businesses": "/directory", "Categories": "/#categories", "Cities": "/directory", "Deals": "/#deals", "Add Business": "/register", "Dashboard": "/login", "Premium Plans": "/login", "Advertising": "/login", "About Us": "/#contact", "Contact": "/#contact", "Blog": "/#blog", "Careers": "/#contact", "Help Center": "/#contact", "Terms": "/#contact", "Privacy": "/#contact", "Sitemap": "/" })[link] || "/directory")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Newsletter */}
      <div>
        <h3 className="font-semibold">
          Newsletter
        </h3>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Get business tips, SEO updates and exclusive offers.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
          <input
            placeholder="Enter your email"
            className="h-11 w-full rounded-xl bg-white px-4 text-sm text-slate-900 outline-none"
          />

          <button className="mt-3 w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium transition hover:bg-indigo-700">
            Subscribe
          </button>
        </div>
      </div>

    </div>

    {/* Bottom */}
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row">

      <p>
        © 2026 Genesis Virtue. All rights reserved.
      </p>

      <div className="flex gap-6">
        <a href="/#contact">Privacy Policy</a>
        <a href="/#contact">Terms</a>
        <a href="/#contact">Cookies</a>
      </div>

    </div>

  </div>
</footer>
    </main>
  );
}

