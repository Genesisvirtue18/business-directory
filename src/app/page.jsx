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
import Image from "next/image";
import NearbyCategoryLink from "@/components/NearbyCategoryLink";
import BestNearYou from "@/components/BestNearYou";
import HeroBackdrop from "@/components/HeroBackdrop";
import { getBusinesses, getCategories, getCities } from "@/lib/api";
import { toHomeBusiness } from "@/lib/directory-data";

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
  [/education|school|college|university|training|tuition/, "photo-1523240795612-9a054b0db644"],
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
      image: imageForCategory(category),
      icon: iconForCategory(category),
      };
    });
  const featuredCategories = categories.slice(0, 8);
  const businesses = businessItems.map(toHomeBusiness);
  const stats = [
    { value: (pagination.totalItems || 0).toLocaleString(), label: "Businesses Listed", icon: Building2 },
    { value: (verifiedPagination.totalItems || 0).toLocaleString(), label: "Verified Businesses", icon: BadgeCheck },
    { value: (cityPagination.totalItems || 0).toLocaleString(), label: "Cities Available", icon: MapPin },
  ];
  return (
    <main className="min-h-screen bg-white text-slate-950">
    <section className="hero-background relative overflow-hidden">
      <HeroBackdrop />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#040d26]/85 via-[#040d26]/60 to-[#040d26]/25" />

        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
          <div className="mx-auto flex min-h-[68px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 lg:px-8">
            <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-[-1.5px] text-violet-700">
              Genesis Virtue
            </Link>
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
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-9 pt-9 sm:pb-10 lg:px-8 lg:pt-12">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-white/15"><ShieldCheck className="h-4 w-4 text-violet-300" />India&apos;s local business directory</span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">Find Trusted Businesses.<br /><span className="text-violet-300">Grow Together.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">Discover local services and connect with businesses across India.</p>
            </div>
          <form action="/directory" method="get" className="mt-7 grid max-w-5xl gap-2 rounded-xl bg-white p-2 shadow-2xl sm:grid-cols-[1fr_1.35fr_auto] sm:items-end">
            <label htmlFor="home-city" className="grid min-h-16 min-w-0 grid-cols-[20px_1fr] items-center gap-x-3 rounded-lg border border-slate-200 px-3 py-2 text-slate-400 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200">
              <MapPin className="row-span-2 h-5 w-5 shrink-0" />
              <span className="text-[11px] font-semibold leading-4 text-slate-600">City or area</span>
              <input id="home-city" name="city" autoComplete="address-level2" placeholder="Enter a city or area" className="w-full text-sm text-slate-900 outline-none placeholder:text-slate-500" />
            </label>
            <label htmlFor="home-query" className="grid min-h-16 min-w-0 grid-cols-[20px_1fr] items-center gap-x-3 rounded-lg border border-slate-200 px-3 py-2 text-slate-400 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-200">
              <Search className="row-span-2 h-5 w-5 shrink-0" />
              <span className="text-[11px] font-semibold leading-4 text-slate-600">Business, service, or category</span>
              <input id="home-query" name="q" placeholder="What are you looking for?" className="w-full text-sm text-slate-900 outline-none placeholder:text-slate-500" />
            </label>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-violet-700 px-6 text-sm font-semibold text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"><Search className="h-4 w-4" />Search</button>
          </form>
          <p className="mt-3 text-sm text-slate-200">Search by city or service, or <Link href="#nearby" className="font-semibold text-white underline decoration-white/60 underline-offset-4 hover:decoration-white">use your location</Link>.</p>
        </div>
      </section>

      <section aria-label="Directory summary" className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 border-b border-slate-100 px-5 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
        {stats.map(({ value, label, icon: Icon }) => <div key={label} className="flex items-center justify-start gap-3 px-2 py-2 sm:justify-center sm:px-3 sm:py-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-4 w-4" /></span><span><span className="block text-base font-bold text-slate-900 sm:text-lg">{value}</span><span className="text-xs text-slate-600">{label}</span></span></div>)}
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold text-slate-900">Discover Local Specialties</h2><p className="mt-1 text-sm text-slate-500">Browse businesses by category.</p></div><Link href="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">All categories <ArrowRight className="h-4 w-4" /></Link></div>
        {featuredCategories.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4">
          {featuredCategories.map(({ id, slug, label, image, icon: Icon }) => <NearbyCategoryLink key={id} category={slug || id} fallbackHref={slug ? `/directory?category=${encodeURIComponent(slug)}` : "/directory"} className="group relative h-36 overflow-hidden rounded-xl bg-slate-200 sm:h-40"><Image src={image} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 16vw" className="object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" /><span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-violet-700"><Icon className="h-5 w-5" /></span><span className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-semibold text-white">{label}</span></NearbyCategoryLink>)}
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

      <section className="mx-auto max-w-7xl  px-5 py-12 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-8 text-white"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(49,46,129,0.92))",
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
              "url('/images/exclusive-deals-image.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="px-8 py-12 md:px-12">

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="max-w-xl text-4xl font-semibold leading-tight text-white">Exclusive Deals from Top Businesses</h2>
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">Preview</span>
            </div>

            <p className="mt-4 max-w-lg text-base leading-7 text-slate-200">
              Explore amazing discounts and offers from trusted local businesses.
            </p>

          </div>
        </div>
      </section>
      <section id="blog" className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-9 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Latest From Our Blog</h2>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Preview</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">New articles will appear here when they are published.</p>
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

        </div>
      </section>

      <footer id="contact" className="relative bg-[#061531] text-white">

  {/* Top Border Glow */}
  <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

  <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr] xl:gap-8">

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
          India&apos;s trusted platform to discover, connect and grow with verified local businesses.
        </p>

        {/* Socials */}
        <div className="mt-6 flex gap-3">
          {[ FaFacebookF,   FaInstagram,   FaLinkedinIn, FaYoutube].map((Icon, i) => (
            <a
              key={i}
              href={["https://facebook.com", "https://instagram.com", "https://linkedin.com", "https://youtube.com"][i]}
              aria-label={["Facebook", "Instagram", "LinkedIn", "YouTube"][i]}
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
              <Link
                key={link}
                href={(({ "Home": "/", "Businesses": "/directory", "Categories": "/#categories", "Cities": "/directory", "Deals": "/#deals", "Add Business": "/register", "Dashboard": "/login", "Premium Plans": "/login", "Advertising": "/login", "About Us": "/#contact", "Contact": "/#contact", "Blog": "/#blog", "Careers": "/#contact", "Help Center": "/#contact", "Terms": "/#contact", "Privacy": "/#contact", "Sitemap": "/" })[link] || "/directory")}
                className="block text-sm text-slate-400 transition hover:text-white"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Newsletter */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-semibold">Newsletter</h3>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">Preview</span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Get business tips, SEO updates and exclusive offers.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
          <input
            type="email"
            aria-label="Email address — newsletter preview"
            placeholder="Newsletter preview"
            disabled
            className="h-11 w-full cursor-not-allowed rounded-xl bg-white/80 px-4 text-sm text-slate-700 outline-none disabled:opacity-80"
          />

          <button disabled className="mt-3 w-full cursor-not-allowed rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white disabled:opacity-60">
            Subscribe preview
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
        <Link href="/#contact">Privacy Policy</Link>
        <Link href="/#contact">Terms</Link>
        <Link href="/#contact">Cookies</Link>
      </div>

    </div>

  </div>
</footer>
    </main>
  );
}

