"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clapperboard, Megaphone, Search, Share2, ShieldCheck, Target } from "lucide-react";

function getServiceIcon(service) {
  const name = service.toLowerCase();
  if (name.includes("search") || name.includes("seo")) return Search;
  if (name.includes("social")) return Share2;
  if (name.includes("advert") || name.includes("paid")) return Megaphone;
  if (name.includes("content") || name.includes("video")) return Clapperboard;
  if (name.includes("strategy") || name.includes("consult")) return Target;
  return ShieldCheck;
}

export default function BusinessServices({ services = [] }) {
  const [query, setQuery] = useState("");
  const filteredServices = useMemo(() => services.filter(service => service.toLowerCase().includes(query.trim().toLowerCase())), [services, query]);

  return (
    <section id="services" className="scroll-mt-24 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.025)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600">Core expertise</p>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Our Services</h2>
        </div>
        {services.length ? <span className="text-[9px] text-slate-400">{services.length} service{services.length === 1 ? "" : "s"} available</span> : null}
        {services.length > 5 ? <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 sm:w-56"><Search className="h-4 w-4 shrink-0" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search services" className="w-full text-sm text-slate-800 outline-none" /></label> : null}
      </div>
      {services.length ? <div className="grid gap-2.5 sm:grid-cols-2 xl:gap-3">
        {filteredServices.map(service => {
          const Icon = getServiceIcon(service);
          return <article key={service} className="flex min-h-[126px] flex-col rounded-xl border border-slate-200 p-3 transition hover:border-violet-200 hover:shadow-sm sm:p-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Icon className="h-4 w-4" /></span>
            <h3 className="mt-2.5 text-[11px] font-semibold text-slate-900">{service}</h3>
            <div className="mt-auto pt-3">
              <Link href="#contact" className="inline-flex items-center gap-1 text-[9px] font-medium text-violet-700 hover:text-violet-900">
                Inquire about this service <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </article>;
        })}
        {!filteredServices.length ? <p className="col-span-full py-6 text-center text-sm text-slate-500">No services match your search.</p> : null}
      </div> : <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No services listed yet.</p>}
    </section>
  );
}
