import type { EnquiryCategory } from "../app/data/content";
import { business } from "../app/data/business";

export type RepairEnquiry = {
  name: string;
  phone: string;
  device: string;
  issue: string;
  details: string;
};

const categoryMessages: Record<Exclude<EnquiryCategory, "repair">, string> = {
  phones:
    "Hello Threvelonbase, I want to ask about new and used phones currently available. My preferred model or use case is: [add details]. My budget range is: [add range].",
  usedPhones:
    "Hello Threvelonbase, I want to ask about a used phone. My preferred model or use case is: [add details]. My budget range is: [add range].",
  accessories:
    "Hello Threvelonbase, I want to ask about an accessory. My device model is: [add model]. I need: [add accessory or compatibility details].",
  training:
    "Hello Threvelonbase, I would like information about repair training or apprenticeship. My experience level is: [add level]. My learning goal and preferred start time are: [add details].",
  repairBusinessSetup:
    "Hello Threvelonbase, I would like to discuss repair-business setup. My project stage, location and desired outcome are: [add details]. My timeframe is: [add timeframe].",
  institutionalTraining:
    "Hello Threvelonbase, I would like to discuss institutional training. Our organisation, location, desired outcome and timeframe are: [add details].",
  consultancy:
    "Hello Threvelonbase, I would like to discuss business consultancy. My business stage, location, desired outcome and timeframe are: [add details].",
};

export function whatsappHref(message: string) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function enquiryMessage(category: Exclude<EnquiryCategory, "repair">) {
  return categoryMessages[category];
}

export function repairMessage(enquiry: RepairEnquiry) {
  return [
    "Hello Threvelonbase, I would like to request a repair.",
    "",
    `Name: ${enquiry.name.trim()}`,
    `Phone number: ${enquiry.phone.trim()}`,
    `Device category: ${enquiry.device}`,
    `Main fault: ${enquiry.issue}`,
    `Additional fault description: ${enquiry.details.trim() || "Not provided"}`,
    "Preferred next step: Please advise me on the diagnosis and workshop drop-off or contact process.",
  ].join("\n");
}

export function repairWhatsappHref(enquiry: RepairEnquiry) {
  return whatsappHref(repairMessage(enquiry));
}
