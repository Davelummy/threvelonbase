import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadWhatsapp() {
  const businessPath = new URL("../app/data/business.ts", import.meta.url);
  const whatsappPath = new URL("../lib/whatsapp.ts", import.meta.url);
  const businessSource = await readFile(businessPath, "utf8");
  const whatsappSource = await readFile(whatsappPath, "utf8");
  const whatsappNumber = businessSource.match(/whatsappNumber:\s*"([^"]+)"/)?.[1];
  assert.ok(whatsappNumber, "business WhatsApp number should be configured");
  const javascript = whatsappSource
    .replace('import type { EnquiryCategory } from "../app/data/content";\n', "")
    .replace('import { business } from "../app/data/business";', `const business = { whatsappNumber: "${whatsappNumber}" };`)
    .replace(/export type RepairEnquiry = \{[\s\S]*?\};\n\n/, "")
    .replace(/export type RepairFormValues = \{[\s\S]*?\};\n\n/, "")
    .replace(/export type RepairFormErrors = [^;]+;\n\n/, "")
    .replace(/: RepairFormErrors/g, "")
    .replace(/: RepairFormValues/g, "")
    .replace(/: RepairEnquiry/g, "")
    .replace(/: string/g, "")
    .replace(/: Exclude<EnquiryCategory, "repair">/g, "")
    .replace(/\s+satisfies Record<[^;]+>/, "")
    .replace(/export function/g, "function")
    .concat(`\nreturn { whatsappHref, validateRepairForm, newPhoneMessage, usedPhoneMessage, accessoriesMessage, trainingMessage, repairBusinessSetupMessage, institutionalTrainingMessage, consultancyMessage, enquiryMessage, enquiryWhatsappHref, repairMessage, repairWhatsappHref };`);

  return new Function(javascript)();
}

test("builds an encoded repair WhatsApp URL with all collected details", async () => {
  const { repairMessage, repairWhatsappHref } = await loadWhatsapp();
  const enquiry = {
    name: " Ada Okafor ",
    phone: "0803 000 0000",
    device: "Phone",
    model: "Samsung A52",
    issue: "Charging or battery issue",
    details: "It stopped charging after a fall.",
    preferredNextStep: "Call me",
  };
  const message = repairMessage(enquiry);

  assert.match(message, /Brand and model: Samsung A52/);
  assert.match(message, /Preferred next step\/contact method: Call me/);
  assert.match(message, /attach photos or videos/i);
  assert.equal(decodeURIComponent(repairWhatsappHref(enquiry).split("?text=")[1]), message);
});

test("keeps enquiry messages differentiated by category", async () => {
  const {
    enquiryMessage,
    enquiryWhatsappHref,
    newPhoneMessage,
    usedPhoneMessage,
    accessoriesMessage,
    trainingMessage,
    repairBusinessSetupMessage,
    institutionalTrainingMessage,
    consultancyMessage,
  } = await loadWhatsapp();
  const messages = [
    enquiryMessage("phones"),
    enquiryMessage("usedPhones"),
    accessoriesMessage(),
    trainingMessage(),
    repairBusinessSetupMessage(),
    institutionalTrainingMessage(),
    consultancyMessage(),
  ];

  assert.equal(new Set(messages).size, messages.length);
  assert.equal(enquiryMessage("phones"), newPhoneMessage());
  assert.equal(enquiryMessage("usedPhones"), usedPhoneMessage());
  assert.match(enquiryMessage("phones"), /new phone/i);
  assert.match(enquiryMessage("usedPhones"), /used phone/i);
  assert.doesNotMatch(enquiryMessage("phones"), /used phone/i);
  assert.doesNotMatch(enquiryMessage("usedPhones"), /new phone/i);
  assert.match(enquiryMessage("institutionalTraining"), /institutional training/i);
  assert.match(enquiryMessage("consultancy"), /consultancy/i);
  assert.match(enquiryMessage("repairBusinessSetup"), /repair-business setup/i);

  const newPhoneHref = enquiryWhatsappHref("phones");
  const usedPhoneHref = enquiryWhatsappHref("usedPhones");
  const setupHref = enquiryWhatsappHref("repairBusinessSetup");
  const institutionalHref = enquiryWhatsappHref("institutionalTraining");
  const consultancyHref = enquiryWhatsappHref("consultancy");

  assert.match(newPhoneHref, /^https:\/\/wa\.me\/2348037722368\?text=/);
  assert.equal(decodeURIComponent(newPhoneHref.split("?text=")[1]), newPhoneMessage());
  assert.equal(decodeURIComponent(usedPhoneHref.split("?text=")[1]), usedPhoneMessage());
  assert.equal(decodeURIComponent(setupHref.split("?text=")[1]), repairBusinessSetupMessage());
  assert.equal(decodeURIComponent(institutionalHref.split("?text=")[1]), institutionalTrainingMessage());
  assert.equal(decodeURIComponent(consultancyHref.split("?text=")[1]), consultancyMessage());
  assert.notEqual(newPhoneHref, usedPhoneHref);
  assert.notEqual(setupHref, institutionalHref);
  assert.notEqual(institutionalHref, consultancyHref);
});

test("returns readable, bounded validation errors without changing entered values", async () => {
  const { validateRepairForm } = await loadWhatsapp();
  const values = {
    name: "A",
    phone: "not-a-phone",
    device: "",
    model: "",
    issue: "",
    details: "x".repeat(801),
    nextStep: "",
  };
  const errors = validateRepairForm(values);

  assert.deepEqual(Object.keys(errors).sort(), ["details", "device", "issue", "model", "name", "nextStep", "phone"]);
  assert.equal(values.details.length, 801);
  assert.match(errors.phone, /valid phone number/i);
  assert.match(errors.details, /800 characters/i);
});

test("accepts a complete repair request", async () => {
  const { validateRepairForm } = await loadWhatsapp();
  assert.deepEqual(validateRepairForm({
    name: "Ada Okafor",
    phone: "+234 803 000 0000",
    device: "Phone",
    model: "Samsung A52",
    issue: "Charging or battery issue",
    details: "It stopped charging yesterday.",
    nextStep: "WhatsApp guidance",
  }), {});
});
