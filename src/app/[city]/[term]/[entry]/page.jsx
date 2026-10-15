import BusinessDetailPage from "@/app/directory/[slug]/page";
import DirectoryPage from "@/app/directory/page";
import { getCategories, getBusiness } from "@/lib/api";
import { absoluteSiteUrl } from "@/lib/business-schema";
import { businessDetailPath, categoryListingPath } from "@/lib/directory-data";

function displayWords(value = "") {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function generateMetadata({ params, searchParams }) {
  const { city, term, entry } = await params;
  const query = await searchParams;
  const hasCoordinates = query?.lat !== undefined || query?.lng !== undefined;
  const termSlug = term.toLowerCase();
  if (entry.endsWith("_BZDET")) {
    const business = await getBusiness(termSlug);
    return {
      title: business ? `${business.name} in ${business.address?.city || displayWords(city)} | Genesis Virtue` : "Business Profile | Genesis Virtue",
      description: business?.description || `Contact ${business?.name || displayWords(termSlug)} in ${displayWords(city)}.`,
      alternates: business ? { canonical: absoluteSiteUrl(businessDetailPath(business)) } : undefined,
      ...(!business ? { robots: { index: false, follow: false } } : {}),
    };
  }
  const { items = [] } = await getCategories({ limit: 100 });
  const category = items.find((item) => item.slug === termSlug);
  const categoryName = category?.name || displayWords(term);
  const cityName = displayWords(city);
  return {
    title: `${categoryName} in ${cityName} | Genesis Virtue Business Directory`,
    description: `Find trusted ${categoryName.toLowerCase()} in ${cityName}. Compare local businesses and contact details.`,
    alternates: category ? { canonical: absoluteSiteUrl(categoryListingPath(cityName, category)) } : undefined,
    ...(!category || hasCoordinates ? { robots: { index: false, follow: Boolean(category) } } : {}),
  };
}

export default async function SeoDirectoryRoute({ params, searchParams }) {
  const { city, term, entry } = await params;
  const termSlug = term.toLowerCase();
  if (entry.endsWith("_BZDET")) {
    return <BusinessDetailPage params={Promise.resolve({ slug: termSlug })} />;
  }
  if (!entry.startsWith("nct-")) return <main className="p-10 text-center">Page not found.</main>;
  return <DirectoryPage searchParams={searchParams} routeCity={city} routeCategory={termSlug} />;
}
