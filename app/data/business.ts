export const business = {
  name: "Threvelonbase",
  tagline: "Technology Evolution and Revolution",
  whatsappNumber: "2348037722368",
  phones: [
    { label: "Primary line", display: "+234 803 772 2368", href: "tel:+2348037722368" },
    { label: "Alternative line", display: "+234 903 608 8295", href: "tel:+2349036088295" },
  ],
  email: "threvelonbase@gmail.com",
  instagram: "https://instagram.com/threvelonbase",
  address: {
    shop: "Shop 12A",
    complex: "Cash Hold Shopping Complex",
    street: "Arakale Road",
    locality: "Akure",
    region: "Ondo State",
    country: "Nigeria",
  },
  mapsUrl:
    "https://maps.google.com/?q=Shop+12A+Cash+Hold+Shopping+Complex+Arakale+Road+Akure",
  hours: {
    days: "Monday-Saturday",
    display: "8:00 AM-6:00 PM",
    opens: "08:00",
    closes: "18:00",
  },
  established: "2020",
} as const;

export type Business = typeof business;
