export const homepageTitle = "Threvelonbase | Electronics Repairs, Devices & Training in Akure";
export const homepageDescription =
  "Electronics repairs for phones, laptops and everyday devices in Akure, plus phones, accessories, repair training and business services.";

export const navItems = [
  ["Services", "#services"],
  ["Repairs", "#repairs"],
  ["Academy", "#academy"],
  ["Business solutions", "#business"],
  ["About", "#about"],
] as const;

/** Hash links that still work from /privacy. */
export function homeSectionHref(hash: `#${string}`, pathname = "/") {
  return pathname === "/" ? hash : `/${hash}`;
}

export function rootedSectionHref(hash: `#${string}`) {
  return `/${hash}`;
}

export const repairTypes = [
  "Screen and touch repairs",
  "Charging ports and batteries",
  "Liquid damage recovery",
  "Board-level and microsoldering",
  "Software, flashing and formatting",
  "Speakers, cameras and buttons",
  "Network and signal issues",
  "General diagnostics",
] as const;

export const deviceOptions = [
  "Phone",
  "Laptop",
  "Tablet",
  "Power bank",
  "Bluetooth device",
  "Speaker",
  "MP3 player",
  "Other electronic device",
] as const;

export const issueOptions = [
  "Screen or touch issue",
  "Charging or battery issue",
  "Liquid damage",
  "Software issue",
  "Audio or speaker issue",
  "Network or signal issue",
  "Device not powering on",
  "Not sure - I need a diagnosis",
] as const;

export const serviceCards = [
  {
    number: "01",
    title: "Electronics repairs",
    copy: "Phones, laptops, power banks, MP3 players, Bluetooth devices, speakers and other everyday electronics.",
    icon: "wrench",
    href: "#repairs",
    action: "Start a repair",
  },
  {
    number: "02",
    title: "New & used phones",
    copy: "Ask about currently available devices and get direct guidance before you buy.",
    icon: "smartphone",
    href: "#devices",
    action: "Choose new or used",
  },
  {
    number: "03",
    title: "Accessories",
    copy: "Phone and laptop accessories, charging essentials, audio devices and everyday add-ons.",
    icon: "headphones",
    href: "whatsapp:accessories",
    action: "Ask about accessories",
  },
  {
    number: "04",
    title: "Training & apprenticeship",
    copy: "Hands-on repair training, mentorship and professional discipline for aspiring technicians.",
    icon: "book",
    href: "#academy",
    action: "View training",
  },
  {
    number: "05",
    title: "Business services",
    copy: "Repair-site setup, institutional training and practical consultancy for organisations and entrepreneurs.",
    icon: "briefcase",
    href: "#business",
    action: "View business services",
  },
] as const;

export type EnquiryCategory =
  | "repair"
  | "phones"
  | "usedPhones"
  | "accessories"
  | "training"
  | "repairBusinessSetup"
  | "institutionalTraining"
  | "consultancy";
