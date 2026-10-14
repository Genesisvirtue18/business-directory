import {
  ArrowLeft,
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
  Quote,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  ShoppingBag,
  Utensils,
  Users,
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
import { getBusinesses, getCategories } from "@/lib/api";
import { toHomeBusiness } from "@/lib/directory-data";

const steps = [
  { title: "Search", text: "Find businesses by category, location or name.", icon: Search },
  { title: "Explore", text: "View details, photos, services, reviews and ratings.", icon: Building2 },
  { title: "Connect", text: "Contact, visit and share your experience with others.", icon: Star },
];

const testimonials = [
  { name: "Priya Sharma", city: "Delhi", text: "Genesis Virtue helped me find the best skin clinic near me. The reviews were so helpful!" },
  { name: "Rohit Verma", city: "Mumbai", text: "As a business owner, this platform brings us genuine leads and more visibility." },
  { name: "Ankita Patel", city: "Bangalore", text: "I love how easy it is to find trusted businesses in my city." },
];

const blogs = [
  {
    tag: "Business Tips",
    title: "10 Proven Ways to Grow Your Local Business in 2024",
    date: "May 20, 2024",
    image: "url('https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=800&q=80')",
  },
  {
    tag: "Reviews",
    title: "Why Customer Reviews Matter More Than Ever",
    date: "May 15, 2024",
    image: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80')",
  },
  {
    tag: "SEO",
    title: "How to Improve Local SEO and Rank Higher in Search",
    date: "May 10, 2024",
    image: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')",
  },
];

const stats = [
  {
    value: "10,000+",
    label: "Businesses Listed",
    icon: Building2,
  },
  {
    value: "50,000+",
    label: "Happy Customers",
    icon: Users,
  },
  {
    value: "25,000+",
    label: "Reviews",
    icon: Star,
  },
  {
    value: "200+",
    label: "Cities Covered",
    icon: MapPin,
  },
];

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

function AdBar() {
  return (
    <div className="mx-auto flex h-16 max-w-5xl items-center justify-center rounded border border-slate-200 bg-slate-50 text-sm text-slate-400 shadow-sm">
      Ads by Google
    </div>
  );
}

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" />
      ))}
    </span>
  );
}

export default async function Home() {
  const [{ items: businessItems = [] }, { items: categoryItems = [] }] = await Promise.all([
    getBusinesses({ limit: 6 }),
    getCategories({ limit: 100 }),
  ]);
  const categories = categoryItems
    .filter((category) => !category.parentCategory)
    .map((category, index) => {
      const key = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
      return {
      id: category._id || category.id || `${category.name}-${index}`,
      slug: category.slug,
      label: category.name,
      description: category.description,
      image: imageForCategory(category),
      hasRelevantImage: Boolean(category.image || categoryImageMatchers.some(([pattern]) => pattern.test(key))),
      icon: iconForCategory(category),
      };
    });
  const imageCategories = categories.filter((category) => category.hasRelevantImage).slice(0, 4);
  const businesses = businessItems.map(toHomeBusiness);
  return (
    <main className="min-h-screen bg-white text-slate-950">
    <section className="relative overflow-hidden">

  {/* Video Background */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src="/images/hero-video.mp4" type="video/mp4" />
  </video>

  {/* Gradient Overlay */}
  <div
    className="absolute inset-0"
    style={{
     background:
"linear-gradient(90deg, rgba(2,11,45,.75) 0%, rgba(2,11,45,.55) 40%, rgba(2,11,45,.15) 100%)",
    }}
  />

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
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-10 lg:grid-cols-[1fr_360px] lg:px-8 lg:pb-20 lg:pt-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 ring-1 ring-white/15">
              <ShieldCheck className="h-4 w-4 text-indigo-300" />
              India&apos;s Trusted Business Directory
            </div>
            <h1 className="max-w-2xl text-4xl text-slate-100 font-semibold leading-tight sm:text-5xl">
              Find Trusted Businesses. Grow{" "}
              <span className="text-violet-400">Together.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-slate-100">
              Discover the best local businesses in India. Connect, review and grow with Genesis Virtue.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold">
              <span>Popular Searches:</span>
              {["Dentist in Delhi", "Skin Clinic in Mumbai", "Restaurants in Bangalore", "Gyms in Pune"].map((item) => (
                <a key={item} className="rounded-full border border-white/25 px-4 py-2 text-slate-200" href={`/directory?q=${encodeURIComponent(item.split(' in ')[0])}&city=${encodeURIComponent(item.split(' in ')[1] || '')}`}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <aside className="self-end max-w-sm rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg">
                <BadgeCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Verified Businesses
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Genuine reviews, verified listings and trusted information.
                </p>

                <a
                  href="/directory?verified=true"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-violet-600"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-5 lg:px-8">
        <AdBar />
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Browse Categories</h2>
            <p className="mt-1 text-sm text-slate-500">Explore every main category in the directory.</p>
          </div>
          <Link href="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">View directory <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10">
          {categories.map(({ id, slug, label, icon: Icon }) => (
            <NearbyCategoryLink key={id} category={slug || id} fallbackHref={slug ? `/directory?category=${encodeURIComponent(slug)}` : "/directory"} className="group flex min-w-0 flex-col items-center gap-1.5 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white text-violet-700 transition group-hover:border-violet-300 group-hover:bg-violet-50 group-hover:shadow-sm">
                <Icon className="h-7 w-7" strokeWidth={1.7} />
              </span>
              <span className="line-clamp-2 text-xs font-medium leading-tight text-slate-700 group-hover:text-violet-700">{label}</span>
            </NearbyCategoryLink>
          ))}
        </div>
      </section>

      {imageCategories.length > 0 && <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-slate-900">Explore by Image</h2>
          <p className="mt-1 text-sm text-slate-500">A closer look at selected categories.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {imageCategories.map(({ id, slug, label, image }) => (
            <article key={id} className="rounded-xl border border-slate-300 bg-white p-4">
              <h3 className="mb-3 text-base font-semibold text-slate-900">{label}</h3>
              <NearbyCategoryLink category={slug || id} fallbackHref={slug ? `/directory?category=${encodeURIComponent(slug)}` : "/directory"} className="group relative block h-40 overflow-hidden rounded-lg bg-slate-100">
                <img src={image} alt={label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">Browse {label}</span>
                <ArrowRight className="absolute bottom-3 right-3 h-5 w-5 text-white transition group-hover:translate-x-1" />
              </NearbyCategoryLink>
            </article>
          ))}
        </div>
      </section>}

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

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#071737] via-[#1E1B4B] to-[#312E81] p-8 shadow-2xl">

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-white">
              Trusted Across India
            </h2>

            <p className="mt-2 text-sm text-indigo-100">
              Connecting customers with verified businesses every day
            </p>
          </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {stats.map(({ value, label, icon: Icon }) => (
    <div
      key={label}
      className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition hover:bg-white/15"
    >
      <div className="flex items-center justify-between">
        
        <div>
          <h3 className="text-3xl font-semibold text-white">
            {value}
          </h3>

          <p className="mt-1 text-sm text-indigo-100">
            {label}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
          <Icon className="h-6 w-6 text-white" />
        </div>

      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-3 lg:px-8">
        <AdBar />
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
                  Check ratings & reviews
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

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl  font-semibold text-slate-900">
              What Our Users Say
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Trusted by businesses and customers across India
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200">
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                  {item.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {item.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium text-slate-700">
                        5.0
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>

              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-3 lg:px-8">
        <AdBar />
      </section>

    <section id="blog" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
  
  {/* Header - More Compact */}
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 border border-indigo-100/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="text-xs font-semibold text-indigo-600 tracking-wide">
          Insights & Tips
        </span>
      </div>
      
      <h2 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
        Latest <span className="text-slate-900 bg-clip-text ">From Our Blog</span>
      </h2>
      
      <p className="mt-1 text-sm text-slate-500">
        Insights, reviews and growth strategies for modern businesses.
      </p>
    </div>

    <a
      href="/directory"
      className="group hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
    >
      View All
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  </div>

  {/* Blog Grid - More Compact Layout */}
  <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">

    {/* Featured Blog - Compact */}
    <article className="group relative overflow-hidden rounded-2xl">
      <div
        className="h-[380px] w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
        style={{ backgroundImage: blogs[0].image }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider border border-white/10">
            {blogs[0].tag}
          </span>
          <span className="text-[10px] text-white/60">•</span>
          <span className="text-[10px] text-white/60">5 min read</span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-2 group-hover:text-indigo-200 transition-colors">
          {blogs[0].title}
        </h3>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span>{blogs[0].date}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1">
              <span className="text-indigo-300">✦</span>
              Featured
            </span>
          </div>
          
          <Link href="/#blog" className="rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-medium text-white transition-all hover:bg-white hover:text-slate-900 border border-white/20 hover:border-white">
            Read Article →
          </Link>
        </div>
      </div>
    </article>

    {/* Side Articles - Compact */}
    <div className="flex flex-col gap-3">
      {blogs.slice(1, 4).map((post, index) => (
        <article
          key={post.title}
          className="group flex gap-3 rounded-xl border border-slate-100 bg-white p-2.5 transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50"
        >
          <div
            className="h-24 w-28 shrink-0 rounded-lg bg-cover bg-center transition-transform group-hover:scale-105"
            style={{ backgroundImage: post.image }}
          />
          
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                {post.tag}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-[10px] text-slate-400">{post.date}</span>
            </div>
            
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {post.title}
            </h3>
            
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="text-indigo-300">◆</span>
                3 min read
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">12 comments</span>
            </div>
          </div>
        </article>
      ))}
      
      {/* View All Mobile Button */}
      <a
        href="/directory"
        className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 md:hidden"
      >
        View All Articles
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>

  </div>

 
</section>
      <section className="mx-auto max-w-7xl px-5 py-5 lg:px-8">
        <AdBar />
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
            Genesis Virtue helps you discover local businesses and services in one place. Explore categories, compare business details, ratings, and reviews, then contact the business that fits your needs. Business owners can create a listing to help more people find them.
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

