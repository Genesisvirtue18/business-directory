import { businessDetailPath } from "@/lib/directory-data";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

const businessTypes = [
  [/^restaurant(s)?$/, "Restaurant"],
  [/^hospital(s)?$/, "Hospital"],
  [/^dentist(s)?$/, "Dentist"],
  [/^doctor(s)?$/, "Physician"],
  [/^hotel(s)?$/, "Hotel"],
];

export function absoluteSiteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function buildBusinessJsonLd(business, canonicalPath) {
  const category = String(business.category?.name || "").trim().toLowerCase();
  const specificType = businessTypes.find(([pattern]) => pattern.test(category))?.[1];
  const address = business.address || {};
  const schema = {
    "@context": "https://schema.org",
    "@type": specificType || "LocalBusiness",
    "@id": absoluteSiteUrl(canonicalPath),
    url: absoluteSiteUrl(canonicalPath),
    name: business.name,
  };
  if (business.description) schema.description = business.description;
  const images = [...new Set([business.logo, ...(business.images || [])].filter(isHttpUrl))];
  if (images.length) schema.image = images;
  if (business.phone) schema.telephone = business.phone;
  if (business.email) schema.email = business.email;
  const sameAs = [business.website, ...Object.values(business.socialLinks || {})].filter(isHttpUrl);
  if (sameAs.length) schema.sameAs = [...new Set(sameAs)];
  const postalAddress = {
    "@type": "PostalAddress",
    ...(address.addressLine1 || address.addressLine2 ? { streetAddress: [address.addressLine1, address.addressLine2].filter(Boolean).join(", ") } : {}),
    ...(address.locality || address.city ? { addressLocality: [address.locality, address.city].filter(Boolean).join(", ") } : {}),
    ...(address.state ? { addressRegion: address.state } : {}),
    ...(address.postalCode ? { postalCode: address.postalCode } : {}),
    ...(address.country ? { addressCountry: address.country } : {}),
  };
  if (Object.keys(postalAddress).length > 1) schema.address = postalAddress;
  const coordinates = business.location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length === 2 && coordinates.every(Number.isFinite)) {
    schema.geo = { "@type": "GeoCoordinates", longitude: coordinates[0], latitude: coordinates[1] };
  }
  if (business.priceRange) schema.priceRange = business.priceRange;
  const hours = (business.workingHours || []).filter(item => !item.isClosed && item.opens && item.closes).map(item => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${item.day?.[0]?.toUpperCase()}${item.day?.slice(1)}`,
    opens: item.opens,
    closes: item.closes,
  }));
  if (hours.length) schema.openingHoursSpecification = hours;
  return schema;
}

export function buildDirectoryJsonLd(businesses, canonicalPath) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteSiteUrl(canonicalPath)}#businesses`,
    url: absoluteSiteUrl(canonicalPath),
    itemListElement: businesses.map((business, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "Thing", name: business.name, url: absoluteSiteUrl(businessDetailPath(business)) },
    })),
  };
}

export function jsonLdString(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function isHttpUrl(value) {
  if (typeof value !== "string") return false;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}

