"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");
      const response = await fetch(`${apiUrl}/auth/${isRegistering ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || (isRegistering ? "Unable to create your account." : "Invalid email or password."));
      localStorage.setItem("directflow_access_token", body.data.accessToken);
      localStorage.setItem("directflow_refresh_token", body.data.refreshToken);
      router.push(["admin", "super_admin"].includes(body.data.user.role) ? "/admin" : "/business-owner");
    } catch (loginError) { setError(loginError.message || "Unable to sign in."); }
    finally { setSubmitting(false); }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 p-5 text-slate-900">
      <section className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-7 shadow-2xl shadow-violet-900/10 sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-700 text-white shadow-lg shadow-violet-200"><Building2 /></div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">DirectFlow</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{isRegistering ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-slate-500">{isRegistering ? "Register as a business owner in seconds." : "Sign in to manage your business or directory."}</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm font-semibold">Email address
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-3 text-slate-400 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100"><Mail size={18}/><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@company.com" className="h-12 w-full bg-transparent text-slate-900 outline-none" /></span>
          </label>
          <label className="block text-sm font-semibold">Password
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-3 text-slate-400 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100"><LockKeyhole size={18}/><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} autoComplete={isRegistering ? "new-password" : "current-password"} placeholder={isRegistering ? "At least 8 characters" : "Enter your password"} className="h-12 w-full bg-transparent text-slate-900 outline-none" /></span>
          </label>
          {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
          <button disabled={submitting} className="h-12 w-full rounded-xl bg-violet-700 font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Signing in…" : "Sign in"}</button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">{isRegistering ? "Already have an account?" : "New business owner?"} <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="font-semibold text-violet-700 hover:underline">{isRegistering ? "Sign in" : "Register"}</button></div>
        {isRegistering && <p className="mt-3 text-center text-xs text-slate-500">New accounts are automatically registered as Business Owners.</p>}
      </section>
    </main>
  );
}
