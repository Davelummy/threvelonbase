import type { EnquiryCategory } from "../app/data/content";
import { business } from "../app/data/business";

export type RepairEnquiry = {
  name: string;
  phone: string;
  device: string;
  model?: string;
  issue: string;
  details: string;
  preferredNextStep?: string;
};

export type RepairFormValues = {
  name: string;
  phone: string;
  device: string;
  model: string;
  issue: string;
  details: string;
  nextStep: string;
};

export type RepairFormErrors = Partial<Record<keyof RepairFormValues, string>>;

const maxNameLength = 80;
const maxPhoneLength = 30;
const maxModelLength = 100;
const maxDetailsLength = 800;

export function validateRepairForm(values: RepairFormValues): RepairFormErrors {
  const errors: RepairFormErrors = {};
  const name = values.name.trim();
  const phone = values.phone.trim();
  const model = values.model.trim();
  const details = values.details.trim();

  if (!name) errors.name = "Enter your name.";
  else if (name.length < 2) errors.name = "Enter at least 2 characters for your name.";
  else if (name.length > maxNameLength) errors.name = `Keep your name to ${maxNameLength} characters or fewer.`;

  if (!phone) errors.phone = "Enter a phone number for the team to reach you.";
  else if (phone.length > maxPhoneLength) errors.phone = `Keep your phone number to ${maxPhoneLength} characters or fewer.`;
  else if (!/^[+\d\s().-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a valid phone number with at least 7 digits.";
  }

  if (!values.device.trim()) errors.device = "Choose a device category.";
  if (!model) errors.model = "Enter the brand and model, or use ‘Not sure’.";
  else if (model.length > maxModelLength) errors.model = `Keep the brand and model to ${maxModelLength} characters or fewer.`;
  if (!values.issue.trim()) errors.issue = "Choose the main fault.";
  if (details.length > maxDetailsLength) errors.details = `Keep the description to ${maxDetailsLength} characters or fewer.`;
  if (!values.nextStep.trim()) errors.nextStep = "Choose how you would like us to follow up.";

  return errors;
}

export function whatsappHref(message: string) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function newPhoneMessage() {
  return "Hello Threvelonbase, I want to ask about a new phone. My preferred model or use case is: [add details]. My preferred contact method is: [add method].";
}

export function usedPhoneMessage() {
  return "Hello Threvelonbase, I want to ask about a used phone. My preferred model or use case is: [add details]. My preferred contact method is: [add method].";
}

export function accessoriesMessage() {
  return "Hello Threvelonbase, I want to ask about an accessory. My device model is: [add model]. I need: [add accessory or compatibility details]. My preferred contact method is: [add method].";
}

export function trainingMessage() {
  return "Hello Threvelonbase, I would like information about repair training or apprenticeship. My experience level is: [add level]. My learning goal and preferred start time are: [add details].";
}

export function repairBusinessSetupMessage() {
  return "Hello Threvelonbase, I would like to discuss repair-business setup. My project stage, location and desired outcome are: [add details]. My timeframe is: [add timeframe].";
}

export function institutionalTrainingMessage() {
  return "Hello Threvelonbase, I would like to discuss institutional training. Our organisation, location, desired outcome and timeframe are: [add details].";
}

export function consultancyMessage() {
  return "Hello Threvelonbase, I would like to discuss business consultancy. My business stage, location, desired outcome and timeframe are: [add details].";
}

export function enquiryMessage(category: Exclude<EnquiryCategory, "repair">) {
  const messages = {
    phones: "Hello Threvelonbase, I want to ask about the new and used phones currently available. My preferred model or use case is: [add details]. My preferred contact method is: [add method].",
    usedPhones: usedPhoneMessage(),
    accessories: accessoriesMessage(),
    training: trainingMessage(),
    repairBusinessSetup: repairBusinessSetupMessage(),
    institutionalTraining: institutionalTrainingMessage(),
    consultancy: consultancyMessage(),
  } satisfies Record<Exclude<EnquiryCategory, "repair">, string>;

  return messages[category];
}

export function repairMessage(enquiry: RepairEnquiry) {
  const message = [
    "Hello Threvelonbase, I would like to request a repair.",
    "",
    `Name: ${enquiry.name.trim()}`,
    `Phone number: ${enquiry.phone.trim()}`,
    `Device category: ${enquiry.device}`,
    ...(enquiry.model?.trim() ? [`Brand and model: ${enquiry.model.trim()}`] : []),
    `Main fault: ${enquiry.issue}`,
    `Additional fault description: ${enquiry.details.trim() || "Not provided"}`,
    `Preferred next step/contact method: ${enquiry.preferredNextStep?.trim() || "Please advise me on the diagnosis and contact process."}`,
    "I can attach photos or videos after WhatsApp opens.",
  ];

  return message.join("\n");
}

export function repairWhatsappHref(enquiry: RepairEnquiry) {
  return whatsappHref(repairMessage(enquiry));
}
