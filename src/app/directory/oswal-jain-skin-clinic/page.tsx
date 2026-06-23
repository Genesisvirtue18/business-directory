import Image from "next/image";
import type { ReactNode, SVGProps } from "react";
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
} from "lucide-react";

const breadcrumbs = ["Home", "Delhi", "Skin Clinic", "Oswal Jain Skin Clinic"];

const gallery = [
  "/images/hero-bg.png",
  "/images/hero-bg.png",
  "/images/hero-bg.png",
  "/images/hero-bg.png",
];

const highlights = [
  "Advanced Technology",
  "Experienced Doctors",
  "Hygienic & Safe",
  "Personalized Care",
  "Affordable Pricing",
  "100% Satisfaction",
];

const services = [
  {
    title: "Laser Skin Treatment",
    text: "Advanced laser treatments for acne scars, pigmentation and skin rejuvenation.",
    icon: Syringe,
  },
  {
    title: "Hair Fall Treatment",
    text: "Specialised solutions for hair fall, dandruff and scalp problems.",
    icon: Stethoscope,
  },
  {
    title: "Acne Treatment",
    text: "Expert care for acne, pimples scars and related skin concerns.",
    icon: ShieldCheck,
  },
  {
    title: "Anti-Aging Solutions",
    text: "Wrinkle reduction, skin tightening and anti-aging treatments.",
    icon: Video,
  },
  {
    title: "Hydra Facial",
    text: "Deep cleansing and hydration for glowing, healthy skin.",
    icon: SparkIcon,
  },
];

const reviews = [
  {
    name: "Priya Sharma",
    ago: "2 days ago",
    text: "Amazing experience! The doctors are very professional and the results are beyond my expectations.",
  },
  {
    name: "Rahul Verma",
    ago: "1 week ago",
    text: "Best skin clinic in Delhi. Advanced equipment and friendly staff. Highly recommended!",
  },
  {
    name: "Anjali Mehta",
    ago: "2 weeks ago",
    text: "I had a great experience with laser treatment. Very good results and painless procedure.",
  },
  {
    name: "Neha Kapoor",
    ago: "3 weeks ago",
    text: "Professional service and excellent care. My skin has improved so much!",
  },
];

const related = [
  {
    name: "Dr. Aesthetica Clinic",
    rating: "4.8",
    reviews: "210",
    area: "South Delhi",
  },
  {
    name: "DermaWorld Skin & Laser",
    rating: "4.7",
    reviews: "178",
    area: "West Delhi",
  },
  {
    name: "ClearSkin Dermatology",
    rating: "4.6",
    reviews: "150",
    area: "Central Delhi",
  },
  {
    name: "Radiant Skin Clinic",
    rating: "4.5",
    reviews: "98",
    area: "South Delhi",
  },
  {
    name: "Skin Science Clinic",
    rating: "4.6",
    reviews: "120",
    area: "North Delhi",
  },
];

function SparkIcon(props: SVGProps<SVGSVGElement>) {
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

function StarRow() {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" />
      ))}
    </span>
  );
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]",
        className,
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-[17px] font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function BusinessDetailPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-950">
      <section className="bg-[#030818] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <header className="flex h-16 items-center justify-between rounded-[22px] border border-white/10 bg-white/10 px-4 backdrop-blur-xl lg:h-20 lg:px-6">
            <a href="/directory" className="flex items-center gap-3">
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
            </a>

            <nav className="hidden items-center gap-7 xl:flex">
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

            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
                Add Business
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] hover:bg-violet-700"
              >
                <Users className="h-4 w-4" />
                Login / Sign Up
              </button>
            </div>
          </header>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
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

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:grid-cols-[1.05fr_1fr] lg:p-5">
              <div>
                <div className="relative overflow-hidden rounded-[24px]">
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                    Verified Business
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-slate-100">
                    <Image
                      src={gallery[0]}
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
                      className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-slate-100"
                    >
                      <Image
                        src={src}
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

              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Oswal Jain Skin Clinic
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-500">★</span>
                    <span className="font-semibold text-slate-900">4.9</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">(320 Reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                    <CircleCheckBig className="h-4 w-4" />
                    Open Now
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">Closes 9:00 PM</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                  {["Skin Clinic", "Dermatologist", "Hair Treatment"].map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Year Established", value: "2010", icon: CalendarDays },
                    { label: "Team Size", value: "15+ Staff", icon: Users },
                    { label: "Serving in", value: "Delhi, India", icon: MapPin },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-[18px] border border-slate-200 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600">
                  Oswal Jain Skin Clinic is a leading dermatology and skincare
                  center in Delhi with advanced technology and experienced
                  dermatologists dedicated to providing the best skin and hair
                  care solutions.
                </p>

                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
                >
                  Read More
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-violet-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-violet-50">
                    <Globe className="h-4 w-4" />
                    Website
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Heart className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
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
                    About Oswal Jain Skin Clinic
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    Oswal Jain Skin Clinic is one of Delhi&apos;s most trusted
                    dermatology and skincare centers. We offer advanced
                    treatments for skin, hair, laser, and cosmetology with
                    world-class technology and experienced doctors.
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

                <div className="rounded-[24px] bg-violet-50 p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-violet-600 shadow-sm">
                    <BadgeCheck className="h-8 w-8" />
                  </div>
                  <p className="mt-5 text-[22px] font-semibold text-violet-700">
                    Trusted by 10,000+ Happy Patients
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Quality care you can rely on
                  </p>
                </div>
              </div>
            </section>

            <SectionCard title="Our Services">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {services.map(({ title, text, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-[18px] border border-slate-200 p-4"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-center text-sm font-semibold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-center text-xs leading-6 text-slate-500">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
              <SectionCard title="Business Information">
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>C-1/48, First Floor, Rajouri Garden, New Delhi - 110027</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>
                      Mon - Sat: 10:00 AM - 9:00 PM
                      <br />
                      Sunday: 10:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>info@oswaljainskin.com</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-4 w-4 text-violet-600" />
                    <span>www.oswaljainskinclinic.com</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Why Choose Us?">
                <div className="space-y-3 text-sm text-slate-600">
                  {[
                    "10+ Years of Experience",
                    "Experienced & Certified Doctors",
                    "Advanced & Latest Technology",
                    "Safe & Hygienic Environment",
                    "Personalized Treatment Plans",
                    "Thousands of Happy Patients",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CircleCheckBig className="h-4 w-4 text-violet-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Location">
                <div className="rounded-[18px] overflow-hidden border border-slate-200 bg-slate-100">
                  <div className="flex h-48 items-center justify-center bg-[linear-gradient(135deg,#e5e7eb_0%,#f8fafc_45%,#dbeafe_100%)] text-slate-400">
                    Map Preview
                  </div>
                </div>
                <button className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white text-sm font-semibold text-violet-700 hover:bg-violet-50">
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </button>
              </SectionCard>
            </div>

            <SectionCard title="What Our Patients Say">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {reviews.map((review) => (
                  <div
                    key={review.name}
                    className="rounded-[18px] border border-slate-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                        {review.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {review.name}
                            </p>
                            <StarRow />
                          </div>
                          <span className="text-xs text-slate-400">{review.ago}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="You May Also Like">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {related.map((item) => (
                  <article
                    key={item.name}
                    className="overflow-hidden rounded-[18px] border border-slate-200 bg-white"
                  >
                    <div className="relative h-28 bg-gradient-to-br from-[#d9c4a8] via-[#f4eadc] to-[#d7e4ef]">
                      <div className="absolute inset-0 flex items-end justify-start p-3">
                        <div className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                          Verified
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-900">
                          {item.rating}
                        </span>
                        <span className="text-amber-400">★</span>
                        <span className="text-xs text-slate-500">
                          ({item.reviews})
                        </span>
                        <span className="ml-auto text-xs text-slate-500">
                          {item.area}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Skin Clinic</p>
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="rounded-[22px] bg-gradient-to-b from-violet-600 to-indigo-600 p-5 text-white">
                <h2 className="text-[18px] font-semibold">Contact Business</h2>
                <p className="mt-1 text-sm text-violet-100">
                  Have questions? Get in touch!
                </p>

                <div className="mt-4 space-y-3">
                  {["Your Name", "Your Phone", "Your Email", "Select Service", "Your Message"].map(
                    (placeholder, index) => (
                      <div
                        key={placeholder}
                        className={[
                          "rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-500",
                          index === 4 ? "h-28" : "",
                        ].join(" ")}
                      >
                        {placeholder}
                      </div>
                    ),
                  )}
                </div>

                <button className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-violet-700">
                  Send Message
                </button>

                <p className="mt-3 text-center text-xs text-violet-100">
                  We typically reply within a few minutes
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { icon: Phone, title: "+91 98765 43210", sub: "Tap to Call" },
                  { icon: MessageSquare, title: "WhatsApp Us", sub: "Chat on WhatsApp" },
                  { icon: Globe, title: "Email Us", sub: "info@oswaljainskin.com" },
                ].map(({ icon: Icon, title, sub }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="text-xs text-slate-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#f2ecff] to-[#faf7ff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[18px] font-semibold text-slate-900">
                    Want More Customers?
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Advertise your business and reach thousands of potential
                    customers.
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

            <section className="space-y-3 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              {[
                { value: "320+", label: "Total Reviews", icon: Star },
                { value: "10,000+", label: "Happy Patients", icon: Users },
                { value: "4.9/5", label: "Average Rating", icon: BadgeCheck },
                { value: "10+", label: "Years Experience", icon: ShieldCheck },
              ].map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-[18px] border border-slate-200 px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
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
      </div>
    </main>
  );
}
