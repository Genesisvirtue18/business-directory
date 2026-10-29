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

  return <section aria-label="Business activity" className="rounded-none border-0 bg-transparent p-0 shadow-none">
    <div className="grid gap-2.5 sm:grid-cols-2">
      {stats.map(({ value, label, detail, Icon }) => <div key={label} className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-2 py-2.5 xl:gap-3 xl:px-3.5 xl:py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 xl:h-10 xl:w-10"><Icon className="h-4 w-4 xl:h-5 xl:w-5" /></span>
        <div className="min-w-0">
          <p className="text-lg font-semibold leading-5 tabular-nums text-slate-950 xl:text-xl xl:leading-6">{Number(value).toLocaleString()}</p>
          <p className="mt-0.5 text-[10px] font-semibold text-slate-800 xl:text-xs">{label}</p>
          <p className="text-[9px] leading-3.5 text-slate-500 xl:text-[11px] xl:leading-4">{detail}</p>
        </div>
      </div>)}
    </div>
    {error && <p role="status" className="mt-2 text-xs text-slate-500">{error}</p>}
  </section>;
}
