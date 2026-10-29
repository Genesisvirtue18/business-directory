"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, MessageSquareText } from "lucide-react";
import { recordBusinessView } from "@/lib/api";

export default function BusinessActivityStats({ businessId, initialViews = 0, initialLeads = 0 }) {
  const trackedBusiness = useRef("");
  const [views, setViews] = useState(initialViews);
  const [leads, setLeads] = useState(initialLeads);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId || trackedBusiness.current === businessId) return;
    trackedBusiness.current = businessId;
    let active = true;
    recordBusinessView(businessId)
      .then(data => { if (active) setViews(Number(data.viewCount || 0)); })
      .catch(() => { if (active) setError("View count may take a moment to update."); });
    return () => { active = false; };
  }, [businessId]);

  useEffect(() => {
    const updateLeads = event => {
      if (event.detail?.businessId === businessId && Number.isFinite(event.detail.leadCount)) {
        setLeads(event.detail.leadCount);
      }
    };
    window.addEventListener("business-lead-submitted", updateLeads);
    return () => window.removeEventListener("business-lead-submitted", updateLeads);
  }, [businessId]);

  const stats = [
    { value: views, label: "Profile views", detail: "Visits to this profile", Icon: Eye },
    { value: leads, label: "Customer leads", detail: "Contact form inquiries", Icon: MessageSquareText },
  ];

  return <section aria-label="Business activity" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid gap-2.5 sm:grid-cols-2">
      {stats.map(({ value, label, detail, Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="text-xl font-semibold leading-6 tabular-nums text-slate-950">{Number(value).toLocaleString()}</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-800">{label}</p>
          <p className="text-[11px] leading-4 text-slate-500">{detail}</p>
        </div>
      </div>)}
    </div>
    {error && <p role="status" className="mt-2 text-xs text-slate-500">{error}</p>}
  </section>;
}
