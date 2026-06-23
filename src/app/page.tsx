import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Dumbbell,
  GraduationCap,
  Grid2X2,
  Heart,
  HomeIcon,
  Hospital,
  MapPin,
  Menu,
  Plus,
  Quote,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Store,
  Smile,
  Utensils,
  Users,
  Phone
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const navItems = ["Home", "Businesses", "Categories", "Cities", "Deals", "Blog", "Contact Us"];

const categories = [
  { label: "Healthcare", icon: Stethoscope },
  { label: "Dentists", icon: Smile },
  { label: "Skin Care", icon: Sparkles },
  { label: "Hospitals", icon: Hospital },
  { label: "Real Estate", icon: HomeIcon },
  { label: "Education", icon: GraduationCap },
  { label: "Restaurants", icon: Utensils },
  { label: "Salons", icon: Plus },
  { label: "Fitness", icon: Dumbbell },
  { label: "More", icon: Grid2X2 },
];

const businesses = [
  {
    name: "Oswal Jain Skin Clinic",
    category: "Skin Care",
    city: "Delhi, India",
    rating: "4.8",
    reviews: 128,
    image: "url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=80')",
  },
  {
    name: "Clinic Eximus",
    category: "Dental Care",
    city: "Mumbai, India",
    rating: "4.6",
    reviews: 96,
    image: "url('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80')",
  },
  {
    name: "Delhi Eye Care Centre",
    category: "Eye Care",
    city: "Delhi, India",
    rating: "4.7",
    reviews: 75,
    image: "url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=700&q=80')",
  },
  {
    name: "The Dental Studio",
    category: "Dental Care",
    city: "Bangalore, India",
    rating: "4.5",
    reviews: 62,
    image: "url('https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=700&q=80')",
  },
  {
    name: "Care & Cure Hospital",
    category: "Hospital",
    city: "Hyderabad, India",
    rating: "4.4",
    reviews: 51,
    image: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=80')",
  },
];

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

export default function Home() {
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

        <header className="sticky top-0 z-50">
          <div className="mx-auto mt-4 flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-6 backdrop-blur-xl">

            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-lg font-black text-white shadow-lg">
                G
              </div>

              <div className="leading-tight">
                <h2 className="text-base font-extrabold text-white">
                  Genesis Virtue
                </h2>
                <p className="text-[11px] text-slate-300">
                  Business Directory
                </p>
              </div>
            </a>

            {/* Desktop Menu */}
            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`relative text-sm font-semibold transition ${item === "Home"
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                    }`}
                >
                  {item}

                  {item === "Home" && (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-violet-400" />
                  )}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden items-center gap-3 lg:flex">
              <button className="flex h-10 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white/10">
                <Plus size={16} />
                Add Business
              </button>

              <button className="h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-900/30 transition hover:scale-105">
                Login
              </button>
            </div>

            {/* Mobile */}
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white lg:hidden">
              <Menu size={18} />
            </button>
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

            <div className="mt-8 max-w-4xl rounded-2xl bg-white/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur">
              <div className="grid items-center gap-2 md:grid-cols-[1fr_1fr_110px]">

                <div className="flex h-14 items-center gap-3 rounded-xl px-4">
                  <Search className="h-5 w-5 text-indigo-500" />
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex h-14 items-center gap-3 border-t border-slate-100 px-4 md:border-l md:border-t-0">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                  <input
                    type="text"
                    placeholder="City or location"
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white transition hover:scale-105">
                  Search
                </button>

              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold">
              <span>Popular Searches:</span>
              {["Dentist in Delhi", "Skin Clinic in Mumbai", "Restaurants in Bangalore", "Gyms in Pune"].map((item) => (
                <a key={item} className="rounded-full border border-white/25 px-4 py-2 text-slate-200" href="#">
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
                  href="#"
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

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

  <div className="mb-8 text-center">
    <h2 className="text-2xl font-semibold text-slate-900">
      Browse Popular Categories
    </h2>

    <p className="mt-2 text-sm text-slate-500">
      Find trusted businesses across various categories.
    </p>
  </div>

  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {categories.map(({ label, icon: Icon }) => (
      <a
        key={label}
        href="#"
        className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 transition-all duration-300 hover:border-indigo-100 hover:shadow-lg"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {label}
          </h3>

          <p className="text-xs text-slate-500">
            Explore
          </p>
        </div>
      </a>
    ))}
  </div>

</section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Featured Businesses
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Discover trusted local businesses across India
            </p>
          </div>

          <a
            href="#"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:flex"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <article
              key={business.name}
              className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div
                  className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: business.image }}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {business.name}
                    </h3>

                    <button>
                      <Heart className="h-4 w-4 text-slate-400 transition hover:text-red-500" />
                    </button>
                  </div>

                  <div className="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                    {business.category}
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {business.city}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">
                        {business.rating}
                      </span>

                      <span className="text-xs text-slate-400">
                        ({business.reviews})
                      </span>
                    </div>

                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
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
            {[
              ["10,000+", "Businesses Listed", Building2],
              ["50,000+", "Happy Customers", Users],
              ["25,000+", "Reviews", Star],
              ["200+", "Cities Covered", MapPin],
            ].map(([value, label, Icon]) => (
              <div
                key={String(label)}
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

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
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
              href="#"
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

    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
  
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
      href="#"
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
          
          <button className="rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-medium text-white transition-all hover:bg-white hover:text-slate-900 border border-white/20 hover:border-white">
            Read Article →
          </button>
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
        href="#"
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

        <a
          href="#"
          className="inline-flex h-10 items-center rounded-xl bg-white px-5 text-sm font-semibold text-indigo-600"
        >
          Add Business
        </a>

        <a
          href="#"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white"
        >
          Learn More
          <ArrowRight className="h-4 w-4" />
        </a>

      </div>

    </div>

  </div>
</section>

      <footer className="relative bg-[#061531] text-white">

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
              href="#"
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
                href="#"
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
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
        <a href="#">Cookies</a>
      </div>

    </div>

  </div>
</footer>
    </main>
  );
}
