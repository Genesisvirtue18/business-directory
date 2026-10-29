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

  const fieldClass = "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
  return <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">Contact {businessName}</h2>
      <p className="mt-1 text-sm leading-5 text-slate-600">Send an inquiry directly to this business.</p>
    </div>
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-700">Your name<input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Full name" className={`mt-1.5 ${fieldClass}`} /></label>
      <label className="block text-xs font-medium text-slate-700">Phone number<input name="phone" required minLength={7} maxLength={30} type="tel" autoComplete="tel" placeholder="Phone number" className={`mt-1.5 ${fieldClass}`} /></label>
      <label className="block text-xs font-medium text-slate-700">Email <span className="font-normal text-slate-400">(optional)</span><input name="email" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" className={`mt-1.5 ${fieldClass}`} /></label>
      {services.length > 0 && <label className="block text-xs font-medium text-slate-700">Service <span className="font-normal text-slate-400">(optional)</span><select name="service" defaultValue="" className={`mt-1.5 ${fieldClass}`}><option value="">Choose a service</option>{services.map(service => <option key={service} value={service}>{service}</option>)}</select></label>}
      <label className="block text-xs font-medium text-slate-700">Message<textarea name="message" required minLength={5} maxLength={2000} rows={4} placeholder="How can the business help you?" className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-6 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" /></label>
    </div>
    {status.message && <p role={status.error ? "alert" : "status"} className={`mt-3 rounded-lg px-3 py-2 text-sm leading-5 ${status.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>{status.message}</p>}
    <button type="submit" disabled={sending} className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-violet-700 px-4 text-sm font-semibold text-white transition hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
      {sending ? "Sending inquiry…" : "Send inquiry"}
    </button>
    <p className="mt-2 text-center text-[11px] leading-4 text-slate-500">Your contact details are shared with this business so it can respond.</p>
  </form>;
}
