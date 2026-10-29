import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  Globe,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { getBusiness } from "@/lib/api";
import { businessDetailPath } from "@/lib/directory-data";
import { buildBusinessJsonLd, jsonLdString } from "@/lib/business-schema";
import BusinessServices from "@/components/BusinessServices";
import GooglePlacesReviews from "@/components/GooglePlacesReviews";
import BusinessActivityStats from "@/components/BusinessActivityStats";
import BusinessContactForm from "@/components/BusinessContactForm";

function SectionCard({ eyebrow, title, children, className = "", id }) {
  return (
    <section id={id} className={`scroll-mt-24 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.025)] sm:p-5 ${className}`}>
      {eyebrow ? <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600">{eyebrow}</p> : null}
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function formatTime(value) {
  const [hours, minutes] = String(value || "").split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value || "";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
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

export default async function BusinessDetailPage({ params }) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) {
    return <main className="min-h-screen bg-slate-50 p-8 text-center text-slate-600">Business not found.</main>;
  }

  const businessId = String(business._id || business.id || "");
  const businessSchema = buildBusinessJsonLd(business, businessDetailPath(business));
  const categoryName = business.category?.name || business.keywords?.[0] || "Business";
  const categorySlug = business.category?.slug || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const address = [
    business.address?.addressLine1,
    business.address?.addressLine2,
    business.address?.landmark,
    business.address?.locality,
    business.address?.city,
    business.address?.state,
    business.address?.postalCode,
  ].filter(Boolean).join(", ");
  const workingHours = business.workingHours || [];
  const highlights = business.highlights?.length ? business.highlights : business.keywords || [];
  const firstOpenDay = workingHours.find((entry) => !entry.isClosed && entry.opens && entry.closes);
  const hoursSummary = firstOpenDay
    ? `${firstOpenDay.day}: ${formatTime(firstOpenDay.opens)} – ${formatTime(firstOpenDay.closes)}`
    : workingHours.length ? "Hours listed" : "Hours not provided";
  const verified = business.verificationStatus === "verified";
  const contactOptions = [
    business.phone && { icon: Phone, title: business.phone, sub: "Call business", href: `tel:${business.phone}` },
    business.whatsapp && { icon: MessageSquare, title: business.whatsapp, sub: "WhatsApp", href: `https://wa.me/${business.whatsapp.replace(/\D/g, "")}` },
    business.email && { icon: MessageSquare, title: business.email, sub: "Email", href: `mailto:${business.email}` },
    business.website && { icon: Globe, title: "Website", sub: business.website, href: business.website },
    ...Object.entries(business.socialLinks || {}).filter(([, url]) => url).map(([platform, url]) => ({
      icon: Globe,
      title: `Follow on ${platform}`,
      sub: platform,
      href: url,
    })),
  ].filter(Boolean);
  const coordinates = business.location?.coordinates;
  const directionsUrl = coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`
    : address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : undefined;
  const activeOffers = (business.offers || []).filter((offer) => offer.isActive !== false);
  const logo = isImageSource(business.logo) ? business.logo : null;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    business.address?.city
      ? { label: business.address.city, href: `/directory?city=${encodeURIComponent(business.address.city)}` }
      : null,
    { label: categoryName, href: `/directory?category=${encodeURIComponent(categorySlug)}` },
    { label: business.name },
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(businessSchema) }} />
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur">
        <div className="mx-auto flex min-h-14 max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-2 lg:px-6">
          <Link href="/" aria-label="Lokal Lens home" className="shrink-0">
            <Image src="/logo.png" alt="Lokal Lens" width={230} height={40} className="h-auto w-32 sm:w-36" />
          </Link>
          <form action="/directory" method="get" className="order-3 flex w-full max-w-xl items-center gap-2 sm:order-none sm:flex-1 sm:px-4">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-600" />
              <input name="city" defaultValue={business.address?.city || ""} placeholder="City" className="w-full bg-transparent text-xs outline-none" />
            </label>
            <label className="flex h-9 min-w-0 flex-[1.5] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3">
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <input name="q" defaultValue={categoryName} placeholder="Business or service" className="w-full bg-transparent text-xs outline-none" />
              <button aria-label="Search" className="-mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700">
                <ChevronRight className="h-4 w-4" />
              </button>
            </label>
          </form>
          <div className="flex items-center gap-2">
            <Link href="/register" className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-800 hover:bg-slate-50 sm:px-3">
              <Plus className="h-3.5 w-3.5" /><span className="hidden sm:inline">Add Your Business</span>
            </Link>
            <Link href="/login" className="flex h-8 items-center rounded-lg bg-slate-900 px-3 text-[11px] font-semibold text-white hover:bg-slate-800">Login</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-4 lg:px-6">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {crumb.href ? <Link href={crumb.href} className="hover:text-violet-700">{crumb.label}</Link> : <span aria-current="page" className="font-semibold text-slate-800">{crumb.label}</span>}
              {index < breadcrumbs.length - 1 ? <ChevronDown className="h-3 w-3 -rotate-90 text-slate-300" /> : null}
            </span>
          ))}
        </nav>

        <section className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-white via-white to-violet-50/50 p-4 shadow-[0_3px_12px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-100 bg-white text-2xl font-bold text-violet-600 shadow-sm sm:h-[78px] sm:w-[78px]">
                {logo ? <Image src={logo} alt={`${business.name} logo`} width={78} height={78} unoptimized className="h-full w-full object-contain p-2" /> : <span>{business.name.slice(0, 1).toUpperCase()}</span>}
                {verified ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" aria-label="Verified business" /> : null}
              </div>
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  {verified ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">Verified Business</span> : null}
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${workingHours.length ? "bg-slate-100 text-slate-600" : "bg-slate-100 text-slate-500"}`}>
                    {workingHours.length ? `Hours · ${hoursSummary}` : hoursSummary}
                  </span>
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-medium text-violet-700">{categoryName}</span>
                </div>
                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{business.name}</h1>
                {business.description ? <p className="mt-1 line-clamp-2 max-w-3xl text-xs leading-5 text-slate-600 sm:text-sm">{business.description}</p> : null}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600">
                  {address ? <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-violet-600" />{[business.address?.locality, business.address?.city].filter(Boolean).join(", ") || address}</span> : null}
                  {address && firstOpenDay ? <span className="text-slate-300">•</span> : null}
                  {firstOpenDay ? <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3 text-slate-400" />{hoursSummary}</span> : null}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
              {business.phone ? <a href={`tel:${business.phone}`} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[11px] font-semibold text-white shadow-sm hover:bg-violet-700"><Phone className="h-3.5 w-3.5" />Call Now</a> : null}
              {business.website ? <a href={business.website} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[11px] font-semibold text-slate-700 hover:border-violet-200 hover:text-violet-700"><Globe className="h-3.5 w-3.5" />Visit Website</a> : null}
            </div>
          </div>
        </section>

        <div className="mt-5 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,31%)] xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0 space-y-4">
            <SectionCard eyebrow="Business overview" title={`About ${business.name}`} className="relative">
              <span className="absolute right-4 top-4 max-w-[45%] truncate rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-medium text-violet-700 sm:right-5 sm:top-5">{categoryName}</span>
              <p className="mt-3 whitespace-pre-line text-xs leading-5 text-slate-600 sm:text-[13px] sm:leading-6">
                {business.description || "Business description has not been provided."}
              </p>
              {highlights.length ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {highlights.slice(0, 4).map((highlight, index) => (
                    <div key={highlight} className="flex min-w-0 items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${index % 2 ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600"}`}>
                        {index % 2 ? <CircleCheckBig className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      </span>
                      <span className="text-[11px] font-semibold leading-4 text-slate-800">{highlight}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </SectionCard>

            <BusinessServices services={business.services || []} />

            {activeOffers.length ? (
              <SectionCard eyebrow="Offers" title="Current Offers">
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {activeOffers.map((offer) => (
                    <article key={offer._id || offer.title} className="rounded-xl border border-violet-100 bg-violet-50/60 p-3">
                      <h3 className="text-sm font-semibold text-slate-900">{offer.title}</h3>
                      {offer.description ? <p className="mt-1 text-xs leading-5 text-slate-600">{offer.description}</p> : null}
                      {offer.code ? <p className="mt-2 inline-block rounded-md bg-white px-2 py-1 text-[10px] font-bold text-violet-700">Code: {offer.code}</p> : null}
                    </article>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            <GooglePlacesReviews key={businessId} businessId={businessId} />

            <div className="grid gap-4 sm:grid-cols-2">
              <SectionCard eyebrow="The edge" title="Why Choose Us?">
                <div className="mt-3 space-y-2.5 text-[11px] leading-5 text-slate-600">
                  {highlights.length ? highlights.map((highlight) => (
                    <p key={highlight}><CircleCheckBig className="mr-1.5 inline h-3.5 w-3.5 text-violet-600" /><span className="font-medium text-slate-800">{highlight}</span></p>
                  )) : <p>No business highlights have been provided yet.</p>}
                </div>
              </SectionCard>

              <SectionCard eyebrow="Map & access" title="Office Location">
                <div className="mt-3 flex h-[88px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[linear-gradient(135deg,#f1f5f9_25%,transparent_25%),linear-gradient(225deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(315deg,#f1f5f9_25%,#f8fafc_25%)] bg-[length:24px_24px]">
                  <div className="flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 shadow-sm">
                    <MapPin className="h-3.5 w-3.5 text-violet-600" />
                    {business.address?.locality || business.address?.city || "Business location"}
                  </div>
                </div>
                <p className="mt-2 text-[10px] leading-4 text-slate-500">{address || "Address not provided"}</p>
                {directionsUrl ? <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50/60 text-[10px] font-semibold text-violet-700 hover:bg-violet-100"><MapPin className="h-3 w-3" />Get Directions</a> : null}
              </SectionCard>
            </div>

            <SectionCard eyebrow="Availability" title="Operating Hours" className="relative">
              {workingHours.length ? (
                <div className="mt-3 grid gap-x-5 sm:grid-cols-2">
                  {workingHours.map((entry) => (
                    <div key={entry.day} className="flex items-center justify-between gap-3 border-t border-slate-100 py-2 text-[10px]">
                      <span className="capitalize text-slate-700">{entry.day}</span>
                      <span className={entry.isClosed ? "text-rose-600" : "text-slate-600"}>
                        {entry.isClosed ? "Closed" : `${formatTime(entry.opens)} – ${formatTime(entry.closes)}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : <p className="mt-3 text-xs text-slate-500">Operating hours have not been provided.</p>}
            </SectionCard>

            {business.faqs?.length ? (
              <section id="questions" className="scroll-mt-24 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.025)] sm:p-5">
                <div className="mb-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600">Frequently Asked Questions</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">You ask? <span className="font-serif italic text-violet-600">We answer.</span></h2>
                </div>
                <div className="space-y-2">
                  {business.faqs.map((faq) => (
                    <details key={faq._id || faq.question} className="group rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11px] font-semibold text-slate-800 marker:hidden [&::-webkit-details-marker]:hidden">
                        <span>{faq.question}</span><ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-2 whitespace-pre-wrap border-t border-slate-100 pt-2 text-[10px] leading-5 text-slate-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-4">
            <BusinessContactForm businessId={businessId} businessName={business.name} services={business.services || []} />

            <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
              <h2 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">Verified Contacts</h2>
              {contactOptions.length ? <div className="space-y-1.5">
                {contactOptions.map(({ icon: Icon, title, sub, href }) => (
                  <a key={`${sub}-${title}`} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-2.5 py-2 hover:border-violet-200">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600"><Icon className="h-3.5 w-3.5" /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-[9px] text-slate-500">{sub}</span><span className="block truncate text-[10px] font-semibold text-slate-900">{title}</span></span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </a>
                ))}
              </div> : <p className="px-1 py-2 text-[10px] text-slate-500">No additional contact details are available.</p>}
            </section>

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <h2 className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Live Profile Activity</h2>
                <span className="rounded-full bg-violet-50 px-2 py-1 text-[8px] font-semibold text-violet-600">Updated live</span>
              </div>
              <BusinessActivityStats key={businessId} businessId={businessId} initialViews={business.viewCount || 0} initialLeads={business.leadCount || 0} />
              <div className="mt-2 rounded-xl bg-gradient-to-br from-violet-950 to-indigo-800 p-3 text-white">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-violet-200">Lokal Lens Ad</p>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[8px] font-medium">Boost reach</span>
                </div>
                <h3 className="mt-2 text-xs font-semibold">Want More Customers?</h3>
                <p className="mt-1 text-[9px] leading-4 text-violet-100">Showcase your business to customers searching in your area.</p>
                <Link href="/register" className="mt-2.5 flex h-7 items-center justify-center rounded-lg bg-violet-500 text-[9px] font-semibold text-white hover:bg-violet-400">Advertise Now</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-[10px] text-slate-500 lg:px-6">
          <p>© {new Date().getFullYear()} Lokal Lens. All rights reserved.</p>
          <nav aria-label="Footer" className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-violet-700">Privacy Policy</Link>
            <Link href="/register" className="hover:text-violet-700">Add Your Business</Link>
            <Link href="/login" className="hover:text-violet-700">Login</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
