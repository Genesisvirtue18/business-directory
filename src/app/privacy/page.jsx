import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Lokal Lens",
  description: "Learn how Lokal Lens collects, uses, and protects personal information.",
};

const sections = [
  {
    title: "Information we collect",
    paragraphs: [
      "When you create or use an account, we may process your name, email address, phone number, account credentials, and account activity. Passwords are stored as password hashes, not as plain text.",
      "If you create or manage a business listing, we process the information you provide, which may include the business name, description, address, location, contact details, services, opening hours, photos, and related listing content. Published listing details are visible to the public.",
      "If you choose to use location features, your browser may ask for permission to provide your device location. With permission, Lokal Lens uses coordinates to help find nearby businesses and may save them in your browser storage for later visits. You can remove saved location data from your browser storage or revoke location permission in your browser settings.",
      "We also receive technical information needed to operate and protect the service, such as request, device, and security information handled by our application and infrastructure.",
    ],
  },
  {
    title: "How we use information",
    paragraphs: [
      "We use information to provide business search and discovery, create and manage listings, operate accounts and dashboards, respond to requests, improve reliability, and protect the service from abuse.",
      "Where you connect a Google Business Profile, we use the authorization and profile information needed to provide the connected features you request, such as selecting a business location or displaying available reviews. You can disconnect that integration through its available settings.",
    ],
  },
  {
    title: "When information is shared",
    paragraphs: [
      "Business information that you publish is shared publicly so people can discover and contact the business. Do not include personal or confidential information in a public listing unless you intend it to be public.",
      "We use service providers to host and operate the platform, store application data, process images, and support location or Google Business Profile features. These providers process information as needed to provide their services and may have their own privacy practices.",
      "We may also disclose information when required by law, to protect users and the service, or as part of a business transfer. We do not sell personal information.",
    ],
  },
  {
    title: "Storage, security, and retention",
    paragraphs: [
      "Account session tokens and saved location preferences may be stored in your browser. You can sign out to clear the app's local session and clear browser storage to remove locally saved preferences.",
      "We use reasonable safeguards designed to protect information. No website or storage system can be guaranteed completely secure.",
      "We retain information for as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce our agreements. Public listing information may remain visible until it is changed, unpublished, or removed.",
    ],
  },
  {
    title: "Your choices and requests",
    paragraphs: [
      "You can choose whether to grant location permission, and you can manage listing information through the available owner tools. Depending on where you live, you may have rights to access, correct, delete, or restrict certain personal information. Contact us to submit a privacy request.",
    ],
  },
  {
    title: "Children and external services",
    paragraphs: [
      "Lokal Lens is a business discovery and management service, not a service directed to children. Some features link to or rely on external services; their own terms and privacy policies apply when you use them.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "We may update this policy as the service changes. The effective date above indicates when this version was published. For questions or privacy requests, contact us through the contact links on the Lokal Lens website.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" aria-label="Lokal Lens home" className="shrink-0">
            <Image src="/logo.png" alt="Lokal Lens" width={230} height={40} className="h-auto w-36 sm:w-44" priority />
          </Link>
          <Link href="/" className="text-sm font-semibold text-violet-700 hover:text-violet-900">
            Back to home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Lokal Lens</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: October 27, 2026</p>
        <p className="mt-6 leading-7 text-slate-700">
          This policy explains how Lokal Lens handles information when you browse local businesses,
          create an account, or manage a business listing.
        </p>

        <div className="mt-8 space-y-8">
          {sections.map(({ title, paragraphs }) => (
            <section key={title}>
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              <div className="mt-3 space-y-3">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-7 text-slate-700">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-500">
          This policy describes the service at a general level and is not legal advice. Please review
          it for your organization and applicable privacy requirements before publication.
        </p>
      </article>
    </main>
  );
}
