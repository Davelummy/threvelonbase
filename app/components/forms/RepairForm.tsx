"use client";

import { FormEvent, useState } from "react";
import { MessageCircle } from "lucide-react";
import { deviceOptions, issueOptions } from "../../data/content";
import { repairWhatsappHref } from "../../../lib/whatsapp";

type RepairFormState = {
  name: string;
  phone: string;
  device: string;
  model: string;
  issue: string;
  details: string;
  nextStep: string;
};

const initialForm: RepairFormState = {
  name: "",
  phone: "",
  device: deviceOptions[0],
  model: "",
  issue: issueOptions[0],
  details: "",
  nextStep: "WhatsApp guidance",
};

export function RepairForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");

  function updateField(field: keyof RepairFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status) setStatus("");
  }

  function submitRepair(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const model = String(data.get("model") ?? "").trim();

    if (name.length < 2) {
      setStatus("Enter your name so the workshop knows who to address.");
      return;
    }
    if (phone.length < 7) {
      setStatus("Enter a phone number with at least 7 digits.");
      return;
    }
    if (!model) {
      setStatus("Add the device brand and model, or enter ‘Not sure’ if you need help identifying it.");
      return;
    }

    const href = repairWhatsappHref({
      name,
      phone,
      device: `${String(data.get("device") ?? "")} - ${model}`,
      issue: String(data.get("issue") ?? ""),
      details: `${String(data.get("details") ?? "").trim() || "Not provided"}. Preferred next step: ${String(data.get("nextStep") ?? "WhatsApp guidance")}.`,
    });
    const popup = window.open(href, "_blank", "noopener,noreferrer");

    if (!popup) {
      setStatus("WhatsApp could not open automatically. Use the direct chat link below to continue.");
      return;
    }

    setStatus("WhatsApp opened with your repair details. Attach any photos or videos there before sending.");
  }

  return (
    <form className="repair-form" onSubmit={submitRepair} noValidate={false}>
      <p className="required-note">Fields marked <span aria-hidden="true">*</span> are required.</p>
      <div className="field-row">
        <label htmlFor="repair-name">Full name <span aria-hidden="true">*</span>
          <input id="repair-name" name="name" required autoComplete="name" maxLength={80} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Your name" />
        </label>
        <label htmlFor="repair-phone">Phone number <span aria-hidden="true">*</span>
          <input id="repair-phone" name="phone" required type="tel" inputMode="tel" autoComplete="tel" maxLength={30} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="e.g. 0803 000 0000" />
        </label>
      </div>
      <div className="field-row">
        <label htmlFor="repair-device">Device category
          <select id="repair-device" name="device" value={form.device} onChange={(e) => updateField("device", e.target.value)}>
            {deviceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label htmlFor="repair-model">Brand and model <span aria-hidden="true">*</span>
          <input id="repair-model" name="model" required maxLength={100} value={form.model} onChange={(e) => updateField("model", e.target.value)} placeholder="e.g. Samsung A52" />
        </label>
      </div>
      <div className="field-row">
        <label htmlFor="repair-issue">Main fault
          <select id="repair-issue" name="issue" value={form.issue} onChange={(e) => updateField("issue", e.target.value)}>
            {issueOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label htmlFor="repair-next-step">Preferred next step
          <select id="repair-next-step" name="nextStep" value={form.nextStep} onChange={(e) => updateField("nextStep", e.target.value)}>
            <option>WhatsApp guidance</option>
            <option>Call me</option>
            <option>Workshop drop-off guidance</option>
          </select>
        </label>
      </div>
      <label htmlFor="repair-details">Additional fault description <span>Optional</span>
        <textarea id="repair-details" name="details" rows={4} maxLength={800} value={form.details} onChange={(e) => updateField("details", e.target.value)} placeholder="Describe what happened and anything already tried." />
      </label>
      <button className="button button-primary form-submit" type="submit">Continue on WhatsApp <MessageCircle size={18} /></button>
      <p className="form-note">Your details are placed in a WhatsApp draft for you to review. Attach photos or videos after WhatsApp opens.</p>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
