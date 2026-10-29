"use client";

import { useState } from "react";
import { submitBusinessLead } from "@/lib/api";

export default function BusinessContactForm({ businessId, businessName, services = [] }) {
  const [status, setStatus] = useState({ message: "", error: false });
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setStatus({ message: "", error: false });
    try {
      const result = await submitBusinessLead(businessId, {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email") || "",
        service: formData.get("service") || undefined,
        message: formData.get("message"),
      });
      form.reset();
      setStatus({ message: `Your inquiry was sent to ${businessName}.`, error: false });
      if (Number.isFinite(result?.item?.leadCount)) {
        window.dispatchEvent(new CustomEvent("business-lead-submitted", { detail: { businessId, leadCount: result.item.leadCount } }));
      }
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "Unable to send your inquiry. Please try again.", error: true });
    } finally {
      setSending(false);
    }
  }

  const fieldClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 md:h-8 md:px-2 md:text-[10px] xl:h-11 xl:px-3 xl:text-sm";
  return <form id="contact" onSubmit={submit} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_3px_14px_rgba(76,29,149,0.04)] md:p-3 xl:p-5">
    <div className="mb-3 md:mb-2 xl:mb-4">
      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-600">Direct inquiries</p>
      <h2 className="text-base font-semibold tracking-tight text-slate-950 md:text-sm xl:text-lg">Contact {businessName}</h2>
      <p className="mt-1 text-[10px] leading-4 text-slate-500 md:text-[9px] xl:text-xs">Send an inquiry directly to this business.</p>
    </div>
    <div className="space-y-2 md:space-y-1.5 xl:space-y-3">
      <label className="block text-[10px] font-semibold text-slate-700 md:text-[9px] xl:text-[10px]">Your Name<input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Full name" className={`mt-1 ${fieldClass}`} /></label>
      <label className="block text-[10px] font-semibold text-slate-700 md:text-[9px] xl:text-[10px]">Phone Number<input name="phone" required minLength={7} maxLength={30} type="tel" autoComplete="tel" placeholder="Phone number" className={`mt-1 ${fieldClass}`} /></label>
      <label className="block text-[10px] font-semibold text-slate-700 md:text-[9px] xl:text-[10px]">Email Address <span className="font-normal text-slate-400">(optional)</span><input name="email" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" className={`mt-1 ${fieldClass}`} /></label>
      {services.length > 0 && <label className="block text-[11px] font-medium text-slate-700 md:text-[10px] xl:text-xs">Service <span className="font-normal text-slate-400">(optional)</span><select name="service" defaultValue="" className={`mt-1 ${fieldClass}`}><option value="">Choose a service</option>{services.map(service => <option key={service} value={service}>{service}</option>)}</select></label>}
      <label className="block text-[11px] font-medium text-slate-700 md:text-[10px] xl:text-xs">Message<textarea name="message" required minLength={5} maxLength={2000} rows={4} placeholder="How can the business help you?" className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-2.5 py-2 text-xs leading-5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 md:min-h-16 md:px-2 md:py-1.5 md:text-[10px] xl:px-3 xl:py-2.5 xl:text-sm xl:leading-6" /></label>
    </div>
    {status.message && <p role={status.error ? "alert" : "status"} className={`mt-3 rounded-lg px-3 py-2 text-sm leading-5 ${status.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>{status.message}</p>}
    <button type="submit" disabled={sending} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-violet-700 px-3 text-xs font-semibold text-white transition hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60 md:mt-2 md:h-8 md:text-[10px] xl:mt-4 xl:h-11 xl:px-4 xl:text-sm">
      {sending ? "Sending inquiry…" : "Send inquiry"}
    </button>
    <p className="mt-2 text-center text-[10px] leading-4 text-slate-500 md:text-[9px] xl:text-[11px]">Your contact details are shared with this business so it can respond.</p>
  </form>;
}
