"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck, Stethoscope, Syringe, Video } from "lucide-react";

function SparkIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M12 2l1.8 5.7L19.5 9.5l-5.7 1.8L12 17l-1.8-5.7L4.5 9.5l5.7-1.8L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}

const icons = [Syringe, Stethoscope, ShieldCheck, Video, SparkIcon];

export default function BusinessServices({ services = [] }) {
  const [query, setQuery] = useState("");
  const filteredServices = useMemo(() => services.filter(service => service.toLowerCase().includes(query.trim().toLowerCase())), [services, query]);

  return (
    <section id="services" className="scroll-mt-32 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Our Services</h2>
        {services.length > 5 ? <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 sm:w-56"><Search className="h-4 w-4 shrink-0" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search services" className="w-full text-sm text-slate-800 outline-none" /></label> : null}
      </div>
      {services.length ? <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredServices.map((service, index) => {
          const Icon = icons[index % icons.length];
          return <div key={service} className="flex min-h-[92px] flex-col items-center justify-center rounded-lg border border-slate-200 p-3 text-center transition hover:border-violet-200 hover:bg-violet-50/40"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Icon className="h-4 w-4" /></span><span className="mt-2 text-xs font-medium text-slate-700">{service}</span></div>;
        })}
        {!filteredServices.length ? <p className="col-span-full py-6 text-center text-sm text-slate-500">No services match your search.</p> : null}
      </div> : <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No services listed yet.</p>}
    </section>
  );
}
