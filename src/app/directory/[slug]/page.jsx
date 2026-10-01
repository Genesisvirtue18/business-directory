import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Stethoscope,
  Syringe,
  Users,
  Video,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getBusiness, getBusinesses } from "@/lib/api";
import { businessDetailPath, toDirectoryBusiness } from "@/lib/directory-data";

function SparkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2l1.8 5.7L19.5 9.5l-5.7 1.8L12 17l-1.8-5.7L4.5 9.5l5.7-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRow({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-3.5 w-3.5 ${index < Math.round(Number(rating)) ? 'fill-current' : 'text-slate-200'}`} />
      ))}
    </span>
  );
}

function SectionCard({
  title,
  children,
  className = "",
  noCard = false,
}) {
  return (
    <section
      className={
        noCard
          ? className
          : [
              "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
              className,
            ].join(" ")
      }
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default async function BusinessDetailPage({ params }) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  const { items: relatedItems = [] } = await getBusinesses({ limit: 5 });
  if (!business) {
    return <main className="min-h-screen bg-[#f5f7fc] p-8 text-center text-slate-600">Business not found.</main>;
  }
  const breadcrumbs = ["Home", business.address?.city, business.keywords?.[0], business.name].filter(Boolean);
  const gallery = [
    ...(Array.isArray(business.images) ? business.images : []),
    business.logo,
  ].filter(isImageSource);
  if (!gallery.length) gallery.push("/images/hero-bg.png");
  const highlights = business.highlights?.length ? business.highlights : business.keywords || [];
  const services = (business.services || []).map((title, index) => ({ title, text: business.description || "", icon: [Syringe, Stethoscope, ShieldCheck, Video, SparkIcon][index % 5] }));
  const reviews = (business.reviews || []).map((review) => ({
    id: review._id,
    name: review.reviewerName,
    rating: Number(review.rating || 0),
    ago: review.createdAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(review.createdAt)) : "",
    text: review.comment,
  }));
  const related = relatedItems.filter((item) => item.slug !== slug).map(toDirectoryBusiness);
  const address = [business.address?.addressLine1, business.address?.addressLine2, business.address?.landmark, business.address?.locality, business.address?.city, business.address?.state, business.address?.postalCode].filter(Boolean).join(", ");
  const workingHours = (business.workingHours || []).map((entry) => entry.isClosed ? `${entry.day}: Closed` : `${entry.day}: ${entry.opens} - ${entry.closes}`);
  const categoryName = business.category?.name || business.keywords?.[0] || "Business";
  const contactOptions = [
    business.phone && { icon: Phone, title: business.phone, sub: "Call Business", href: `tel:${business.phone}` },
    business.whatsapp && { icon: MessageSquare, title: business.whatsapp, sub: "WhatsApp", href: `https://wa.me/${business.whatsapp.replace(/\D/g, "")}` },
    business.email && { icon: Globe, title: business.email, sub: "Send Email", href: `mailto:${business.email}` },
    business.website && { icon: Globe, title: business.website, sub: "Visit Website", href: business.website },
    ...Object.entries(business.socialLinks || {}).filter(([, url]) => url).map(([platform, url]) => ({ icon: Globe, title: platform, sub: `Follow on ${platform}`, href: url })),
  ].filter(Boolean);
  const detailStats = [
    { value: business.reviewCount || 0, label: "Total Reviews", icon: Star },
    { value: business.viewCount || 0, label: "Profile Views", icon: Users },
    { value: `${Number(business.averageRating || 0).toFixed(1)}/5`, label: "Average Rating", icon: BadgeCheck },
    { value: business.leadCount || 0, label: "Customer Leads", icon: ShieldCheck },
  ];
  const directionsUrl = business.location?.coordinates ? `https://www.google.com/maps/search/?api=1&query=${business.location.coordinates[1]},${business.location.coordinates[0]}` : undefined;
  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-950">
      {/* ========== HEADER ========== */}
      <section className="bg-[#030818] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl lg:h-20 lg:flex-nowrap lg:px-6">
            <Link href="/directory" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500 text-lg font-black shadow-[0_10px_30px_rgba(99,102,241,0.4)]">
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
            </Link>

            <nav className="hidden flex-wrap items-center gap-5 xl:flex">
              {["Home", "Businesses", "Categories", "Cities", "Deals", "Blog", "Contact Us"].map(
                (item, index) => (
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
                ),
              )}
            </nav>

            <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Business</span>
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] hover:bg-violet-700"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Login / Sign Up</span>
              </button>
            </div>
          </header>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb} className="flex items-center gap-2">
              <a href="#" className="hover:text-slate-700">
                {crumb}
              </a>
              {index < breadcrumbs.length - 1 ? (
                <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-slate-300" />
              ) : null}
            </div>
          ))}
        </div>

        {/* Grid: main + sidebar */}
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ===== LEFT COLUMN ===== */}
          <div className="space-y-6">
            {/* --- HERO CARD --- */}
            <section className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
              {/* Gallery */}
              <div>
                <div className="relative overflow-hidden rounded-[8px]">
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                    Verified Business
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-slate-100">
                    <Image
                      src={gallery[0]}
                      unoptimized
                      alt="Business interior"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  <button
                    type="button"
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-violet-600 shadow-md"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-violet-600 shadow-md"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {gallery.map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-slate-100"
                    >
                      <Image
                        src={src}
                        unoptimized
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover object-center"
                        sizes="160px"
                      />
                      {index === 3 ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 text-sm font-semibold text-white">
                          +12 Photos
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {business.name}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-500">★</span>
                    <span className="font-semibold text-slate-900">{Number(business.averageRating || 0).toFixed(1)}</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">({business.reviewCount || 0} Reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                    <CircleCheckBig className="h-4 w-4" />
                    Open Now
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">{workingHours[0] || "Hours not provided"}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                  {highlights.map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
                  {[
                    { label: "Status", value: business.verificationStatus || "Pending", icon: CalendarDays },
                    { label: "Reviews", value: business.reviewCount || 0, icon: Users },
                    { label: "Location", value: business.address?.city || "Not provided", icon: MapPin },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-slate-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  {business.description || "This business has not added a description yet."}
                </p>

                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  Read More
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="mt-4 flex flex-wrap items-center gap-3 overflow-x-auto">
                  <a href={business.phone ? `tel:${business.phone}` : undefined} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white">
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a href={business.website} target="_blank" rel="noreferrer" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700">
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                  <button className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700">
                    <Heart className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            </section>

            {/* --- TABS CARD --- */}
            <section className="rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-4 py-2">
                {["Overview", "Services", "Reviews (320)", "Photos", "Deals", "Q&A"].map(
                  (tab, index) => (
                    <button
                      key={tab}
                      type="button"
                      className={[
                        "rounded-[18px] px-4 py-3 text-sm font-medium transition",
                        index === 0
                          ? "bg-violet-50 text-violet-700"
                          : "text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    About {business.name}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    {business.description || "This business has not added a description yet."}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        <ShieldCheck className="h-4 w-4 text-violet-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[8px] bg-violet-50 p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-violet-600 shadow-sm">
                    <BadgeCheck className="h-8 w-8" />
                  </div>
                  <p className="mt-5 text-[22px] font-semibold text-violet-700">
                    {business.verificationStatus === "verified" ? "Verified Business" : "Business Profile"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {categoryName}
                  </p>
                </div>
              </div>
            </section>

            {/* --- SERVICES --- */}
            <SectionCard title="Our Services">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {services.map(({ title, text, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-lg border border-slate-200 p-4 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-violet-50 text-violet-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
                    <p className="mt-2 text-xs leading-6 text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* --- 3 COLUMN INFO CARDS --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <SectionCard title="Business Information">
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>{address || "Address not provided"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>{workingHours.length ? workingHours.map((entry) => <span key={entry} className="block">{entry}</span>) : "Hours not provided"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>{business.email || "Email not provided"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>{business.website || "Website not provided"}</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Why Choose Us?">
                <div className="space-y-3 text-sm text-slate-600">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CircleCheckBig className="h-4 w-4 text-violet-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Location">
                <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100">
                  {business.mapEmbedUrl ? <iframe src={business.mapEmbedUrl} title={`Map for ${business.name}`} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-forms allow-popups" className="h-48 w-full border-0" /> : <div className="flex h-48 items-center justify-center bg-[linear-gradient(135deg,#e5e7eb_0%,#f8fafc_45%,#dbeafe_100%)] text-slate-400">Map Preview</div>}
                </div>
                <a href={directionsUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white text-sm font-semibold text-violet-700 hover:bg-violet-50">
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </a>
              </SectionCard>
            </div>
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <aside className="space-y-8">
            <section className="space-y-4">
              {/* Contact Form */}
              <div className="rounded-[8px] border border-slate-200 bg-white p-4">
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-slate-900">
                    Contact Business
                  </h2>
                  <p className="text-xs text-slate-500">Get a quick response</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="h-10 w-full rounded-[8px] border border-slate-200 px-3 text-sm outline-none focus:border-violet-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="h-10 w-full rounded-[8px] border border-slate-200 px-3 text-sm outline-none focus:border-violet-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="h-10 w-full rounded-[8px] border border-slate-200 px-3 text-sm outline-none focus:border-violet-500"
                  />
                  <select className="h-10 w-full rounded-[8px] border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-500">
                    <option>Select Service</option>
                    {business.services?.map((service) => <option key={service}>{service}</option>)}
                  </select>
                  <textarea
                    rows={3}
                    placeholder="Your Message"
                    className="w-full resize-none rounded-[8px] border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                </div>

                <button className="mt-3 h-10 w-full rounded-[8px] bg-violet-600 text-sm font-medium text-white hover:bg-violet-700">
                  Send Message
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  Response within 15 mins
                </p>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                {contactOptions.map(({ icon: Icon, title, sub, href }) => (
                  <a
                    key={`${sub}-${title}`}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center justify-between rounded-[8px] border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-violet-50 text-violet-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-500">{sub}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </section>

            {/* Ad */}
            <section className="rounded-lg border border-slate-200 bg-gradient-to-br from-[#f2ecff] to-[#faf7ff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[18px] font-semibold text-slate-900">
                    Want More Customers?
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Advertise your business and reach thousands of potential customers.
                  </p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-600">
                  Ad
                </span>
              </div>
              <button className="mt-5 inline-flex h-11 items-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700">
                Advertise Now
              </button>
            </section>

            {/* Stats */}
            <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              {detailStats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                </div>
              ))}
            </section>
          </aside>
        </div>

        {/* ===== BOTTOM SECTIONS ===== */}
        <div className="mt-6 space-y-6">
          {business.offers?.some(offer => offer.isActive !== false) ? <SectionCard title="Current Offers"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{business.offers.filter(offer => offer.isActive !== false).map(offer => <article key={offer._id || offer.title} className="rounded-lg border border-violet-200 bg-violet-50 p-4"><h3 className="font-semibold text-slate-900">{offer.title}</h3>{offer.description ? <p className="mt-1 text-sm text-slate-600">{offer.description}</p> : null}{offer.code ? <p className="mt-3 inline-block rounded bg-white px-2 py-1 text-xs font-bold text-violet-700">Code: {offer.code}</p> : null}</article>)}</div></SectionCard> : null}
          {business.faqs?.length ? <SectionCard title="Frequently Asked Questions"><div className="space-y-4">{business.faqs.map(faq => <article key={faq._id || faq.question} className="border-b border-slate-100 pb-3 last:border-0"><h3 className="font-semibold text-slate-900">{faq.question}</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{faq.answer}</p></article>)}</div></SectionCard> : null}
          {/* Reviews */}
          <SectionCard title="What Our Patients Say" noCard>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {reviews.map((review) => (
                <div
                  key={review.id || `${review.name}-${review.ago}`}
                  className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-700">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {review.name}
                          </h3>
                          <StarRow rating={review.rating} />
                        </div>
                        <span className="whitespace-nowrap text-xs text-slate-400">
                          {review.ago}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                    {review.text}
                  </p>
                </div>
              ))}
              {!reviews.length ? <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">No reviews yet.</p> : null}
            </div>
          </SectionCard>

          {/* Related */}
          <SectionCard title="You May Also Like" noCard>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => (
                <article
                  key={item.name}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-28 overflow-hidden bg-gradient-to-br from-violet-100 via-fuchsia-50 to-indigo-100">
                    <div className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Verified
                    </div>
                    <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-xs font-semibold shadow-sm">
                      ⭐ {item.rating}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{item.reviews}</span>
                      <span className="text-xs font-medium text-violet-600">{item.area}</span>
                    </div>
                    <Link href={businessDetailPath(item)} className="mt-3 flex h-9 w-full items-center justify-center rounded-lg bg-violet-600 text-xs font-medium text-white transition hover:bg-violet-700">
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}

function isImageSource(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

