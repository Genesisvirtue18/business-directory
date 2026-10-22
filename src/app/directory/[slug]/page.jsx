import Image from "next/image";
import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  Globe,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Plus,
  Star,
  ShieldCheck,
  Users,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getBusiness, getBusinesses, getGoogleReviews } from "@/lib/api";
import { businessDetailPath, toDirectoryBusiness } from "@/lib/directory-data";
import { buildBusinessJsonLd, jsonLdString } from "@/lib/business-schema";
import BusinessServices from "@/components/BusinessServices";

function SectionCard({
  title,
  children,
  className = "",
  noCard = false,
  id,
}) {
  return (
    <section
      id={id}
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

export default async function BusinessDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
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
  const highlights = business.highlights?.length ? business.highlights : business.keywords || [];
  const related = relatedItems.filter((item) => item.slug !== slug).map(toDirectoryBusiness);
  const canonicalPath = businessDetailPath(business);
  const businessSchema = buildBusinessJsonLd(business, canonicalPath);
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
    { value: business.viewCount || 0, label: "Profile Views", icon: Users },
    { value: business.leadCount || 0, label: "Customer Leads", icon: ShieldCheck },
  ];
  const reviews = Array.isArray(business.reviews) ? business.reviews : [];
  const averageRating = Number(business.averageRating) || (reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0);
  const directionsUrl = business.location?.coordinates ? `https://www.google.com/maps/search/?api=1&query=${business.location.coordinates[1]},${business.location.coordinates[0]}` : undefined;
  const google = await getGoogleReviews(slug, query?.googlePage);
  const googleMapsUrl = google.mapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([business.name, address].filter(Boolean).join(', '))}`;
  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(businessSchema) }} />
      {/* ========== HEADER ========== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[68px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 lg:px-8">
          <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-[-1.5px] text-violet-700">Genesis Virtue</Link>
          <form action="/directory" method="get" className="order-3 flex w-full max-w-xl items-center gap-2 sm:order-none sm:flex-1 sm:px-4">
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3"><MapPin className="h-4 w-4 shrink-0 text-slate-400" /><input name="city" defaultValue={business.address?.city || ""} placeholder="City" className="w-full bg-transparent text-sm outline-none" /></label>
            <label className="flex h-10 min-w-0 flex-[1.5] items-center gap-2 rounded-md border border-slate-300 bg-white px-3"><input name="q" defaultValue={categoryName} placeholder="Business or service" className="w-full bg-transparent text-sm outline-none" /><button aria-label="Search" className="-mr-2 flex h-8 w-9 shrink-0 items-center justify-center rounded bg-violet-700 text-white hover:bg-violet-800"><Search className="h-4 w-4" /></button></label>
          </form>
          <div className="flex items-center gap-2"><Link href="/register" className="flex h-9 items-center gap-1 rounded border border-slate-300 px-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 sm:px-3"><Plus className="h-3.5 w-3.5" /><span className="hidden sm:inline">Add Your Business Now</span></Link><Link href="/login" className="flex h-9 items-center rounded bg-violet-700 px-3 text-xs font-semibold text-white hover:bg-violet-800 sm:px-4">Login</Link></div>
        </div>
      </header>

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
              <div id="photos" className="scroll-mt-32">
                <div className="grid h-[300px] grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-xl bg-slate-100 sm:h-[360px]">
                  {gallery.slice(0, 4).length ? gallery.slice(0, 4).map((src, index) => <div key={src} className={`relative overflow-hidden bg-slate-100 ${index === 0 && gallery.length === 1 ? "col-span-2 row-span-2" : ""}`}><Image src={src} unoptimized alt={`${business.name} photo ${index + 1}`} fill className="object-cover object-center" sizes="(max-width: 1024px) 50vw, 25vw" /></div>) : <div className="col-span-2 row-span-2 flex items-center justify-center bg-gradient-to-br from-violet-50 to-slate-200 text-5xl font-semibold text-slate-400" aria-label={`No photos available for ${business.name}`}>{business.name.slice(0, 1).toUpperCase()}</div>}
                </div>
              </div>

              {/* Info */}
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {business.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  {business.verificationStatus === "verified" ? <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600"><CircleCheckBig className="h-4 w-4" />Verified</span> : null}
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
                    { label: "Location", value: business.address?.city || "Not provided", icon: MapPin },
                    ...(business.verificationStatus ? [{ label: "Verification", value: business.verificationStatus, icon: CalendarDays }] : []),
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

                <div className="mt-4 flex flex-wrap items-center gap-3 overflow-x-auto">
                  <a href={business.phone ? `tel:${business.phone}` : undefined} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white">
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a href={business.website} target="_blank" rel="noreferrer" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700">
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                </div>
              </div>
            </section>

            {/* --- BUSINESS OVERVIEW --- */}
            <section id="overview" className="scroll-mt-32 rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
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
                  <p className="mt-5 text-[22px] font-semibold text-violet-700">{categoryName}</p>
                  {business.verificationStatus === "verified" ? <p className="mt-2 text-sm leading-6 text-slate-600">Verified listing</p> : null}
                </div>
              </div>
            </section>

            {/* --- SERVICES --- */}
            <BusinessServices services={business.services || []} />

            {/* --- REVIEWS --- */}
            <SectionCard id="reviews" title="Customer Reviews" className="scroll-mt-32">
              <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4">
                <p className="text-3xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
                <div><div className="flex items-center gap-0.5 text-amber-400" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < Math.round(averageRating) ? "fill-current" : "text-slate-200"}`} />)}</div><p className="mt-1 text-xs text-slate-500">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p></div>
              </div>
              {reviews.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{reviews.map((review, index) => <article key={review._id || `${review.reviewerName}-${index}`} className="rounded-lg border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-slate-900">{review.reviewerName}</h3><div className="mt-1 flex items-center gap-0.5 text-amber-400">{Array.from({ length: 5 }, (_, starIndex) => <Star key={starIndex} className={`h-3.5 w-3.5 ${starIndex < Number(review.rating) ? "fill-current" : "text-slate-200"}`} />)}</div></div><span className="text-xs text-slate-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span></div>{review.comment ? <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p> : null}{review.isVerified ? <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" />Verified review</span> : null}</article>)}</div> : <p className="mt-4 text-sm text-slate-500">No reviews yet.</p>}
            </SectionCard>

            <SectionCard id="google-reviews" title="Google Reviews" className="scroll-mt-32">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reviews from Google</p>{google.available ? <div className="mt-2 flex items-center gap-3"><span className="text-2xl font-bold text-slate-900">{Number(google.averageRating || 0).toFixed(1)}</span><div><div className="flex gap-0.5 text-amber-400" aria-label={`${google.averageRating} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(google.averageRating || 0)) ? 'fill-current' : 'text-slate-200'}`} />)}</div><p className="mt-1 text-xs text-slate-500">{google.totalReviewCount || 0} Google reviews</p></div></div> : <p className="mt-1 text-sm text-slate-600">Google reviews are not available for this listing yet.</p>}</div><a href={googleMapsUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-violet-700 hover:underline">Read all reviews on Google ↗</a></div>
              {google.available && google.reviews?.length ? <div className="grid gap-3 md:grid-cols-2">{google.reviews.map((review, index) => <article key={`${review.createTime || 'review'}-${index}`} className="rounded-lg border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-slate-900">{review.name || 'Google user'}</h3><div className="mt-1 flex gap-0.5 text-amber-400" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Number(review.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />)}</div></div><span className="shrink-0 text-xs text-slate-500">{review.createTime ? new Date(review.createTime).toLocaleDateString() : ''}</span></div>{review.comment ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{review.comment}</p> : null}</article>)}</div> : null}
              {google.available && google.nextPageToken ? <a href={`/directory/${encodeURIComponent(slug)}?googlePage=${encodeURIComponent(google.nextPageToken)}#google-reviews`} className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">More Google reviews</a> : null}
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white font-bold text-blue-600" aria-hidden="true">G</span>Google</p>
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
                  {business.location?.coordinates ? <iframe src={`https://maps.google.com/maps?q=${business.location.coordinates[1]},${business.location.coordinates[0]}&z=15&output=embed`} title={`Map for ${business.name}`} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-forms allow-popups" className="h-48 w-full border-0" /> : <div className="flex h-48 items-center justify-center bg-[linear-gradient(135deg,#e5e7eb_0%,#f8fafc_45%,#dbeafe_100%)] text-slate-400">Map preview is unavailable</div>}
                </div>
                <a href={business.mapEmbedUrl || directionsUrl || '#'} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white text-sm font-semibold text-violet-700 hover:bg-violet-50">
                  <MapPin className="h-4 w-4" />
                  {business.mapEmbedUrl ? 'Open Google Maps' : 'Get Directions'}
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
                  <p className="text-xs text-slate-500">Contact {business.name}</p>
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
          <SectionCard id="deals" title="Current Offers" className="scroll-mt-32">{business.offers?.some(offer => offer.isActive !== false) ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{business.offers.filter(offer => offer.isActive !== false).map(offer => <article key={offer._id || offer.title} className="rounded-lg border border-violet-200 bg-violet-50 p-4"><h3 className="font-semibold text-slate-900">{offer.title}</h3>{offer.description ? <p className="mt-1 text-sm text-slate-600">{offer.description}</p> : null}{offer.code ? <p className="mt-3 inline-block rounded bg-white px-2 py-1 text-xs font-bold text-violet-700">Code: {offer.code}</p> : null}</article>)}</div> : <p className="text-sm text-slate-500">No current offers listed.</p>}</SectionCard>
          {business.faqs?.length ? <section id="questions" className="scroll-mt-32 overflow-hidden rounded-2xl border border-slate-100 bg-white px-5 py-8 shadow-sm sm:px-8">
            <div className="mx-auto mb-7 max-w-2xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">Frequently Asked Questions</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">You ask? <span className="font-serif italic">We answer</span></h2>
            </div>
            <div className="mx-auto max-w-3xl divide-y divide-slate-100">
              {business.faqs.map(faq => <details key={faq._id || faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-800 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span><Plus className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 whitespace-pre-wrap pr-8 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>)}
            </div>
          </section> : null}
          {/* Related */}
          <SectionCard title="You May Also Like" noCard>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => (
                <article
                  key={item.name}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-28 overflow-hidden bg-gradient-to-br from-violet-100 via-fuchsia-50 to-indigo-100">
                    {item.image ? <Image src={item.image} alt={`${item.name} photo`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-xl font-semibold text-slate-500">{item.short}</div>}
                    {item.verified ? <div className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">Verified</div> : null}
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{item.category}</p><p className="mt-3 text-xs font-medium text-violet-600">{item.area}</p>
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

