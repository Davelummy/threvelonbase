import { business, siteOrigin } from "../../data/business";
import { repairTypes, serviceCards } from "../../data/content";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function LocalBusinessJsonLd() {
  const homepageUrl = siteOrigin
    ? new URL("/", siteOrigin).toString()
    : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description:
      "Electronics repairs for phones, laptops and everyday devices in Akure, plus phones, accessories, repair training and business services.",
    telephone: business.phones.map((phone) => phone.display),
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${business.address.shop}, ${business.address.complex}, ${business.address.street}`,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: weekDays,
        opens: business.hours.opens,
        closes: business.hours.closes,
      },
    ],
    knowsAbout: [
      ...repairTypes,
      ...serviceCards.map((service) => service.title),
    ],
    ...(homepageUrl
      ? { "@id": `${homepageUrl}#local-business`, url: homepageUrl }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
