"use client";

import { FormEvent, useState } from "react";
import { deviceOptions, issueOptions } from "../../data/content";
import { repairWhatsappHref, validateRepairForm, type RepairFormErrors, type RepairFormValues } from "../../../lib/whatsapp";
import { NewTabHint, withNewTabLabel } from "../a11y/NewTabHint";
import { WhatsAppIcon } from "../brand/WhatsAppIcon";

const initialForm: RepairFormValues = {
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
  const [errors, setErrors] = useState<RepairFormErrors>({});
  const [fallbackHref, setFallbackHref] = useState("");

  function updateField(field: keyof RepairFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFallbackHref("");
    if (status) setStatus("");
  }

  function submitRepair(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateRepairForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("Please correct the highlighted fields before continuing.");
      const firstError = Object.keys(validationErrors)[0] as keyof RepairFormValues;
      window.setTimeout(() => document.getElementById(`repair-${firstError}`)?.focus(), 0);
      return;
    }

    const href = repairWhatsappHref({ ...form, preferredNextStep: form.nextStep });
    setFallbackHref(href);

    try {
      const popup = window.open(href, "_blank", "noopener,noreferrer");
      if (!popup) {
        setStatus("WhatsApp was blocked. Use the direct chat link below, then attach any photos or videos before sending.");
        return;
      }
      setStatus("WhatsApp opened with your repair details. Attach any photos or videos there before sending.");
    } catch {
      setStatus("WhatsApp could not open. Use the direct chat link below, then attach any photos or videos before sending.");
    }
  }

  function fieldError(field: keyof RepairFormValues) {
    return errors[field] ? <span className="form-error" id={`repair-${field}-error`} role="alert">{errors[field]}</span> : null;
  }

  return (
    <form className="repair-form" onSubmit={submitRepair} noValidate>
      <p className="required-note">Fields marked <span aria-hidden="true">*</span> are required.</p>
      <div className="field-row">
        <label htmlFor="repair-name">Full name <span aria-hidden="true">*</span>
          <input id="repair-name" name="name" required autoComplete="name" maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "repair-name-error" : undefined} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Your name" />
          {fieldError("name")}
        </label>
        <label htmlFor="repair-phone">Phone number <span aria-hidden="true">*</span>
          <input id="repair-phone" name="phone" required type="tel" inputMode="tel" autoComplete="tel" maxLength={30} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "repair-phone-error" : undefined} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="e.g. 0803 000 0000" />
          {fieldError("phone")}
        </label>
      </div>
      <div className="field-row">
        <label htmlFor="repair-device">Device category
          <select id="repair-device" name="device" aria-invalid={Boolean(errors.device)} aria-describedby={errors.device ? "repair-device-error" : undefined} value={form.device} onChange={(e) => updateField("device", e.target.value)}>
            {deviceOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          {fieldError("device")}
        </label>
        <label htmlFor="repair-model">Brand and model <span aria-hidden="true">*</span>
          <input id="repair-model" name="model" required maxLength={100} aria-invalid={Boolean(errors.model)} aria-describedby={errors.model ? "repair-model-error" : undefined} value={form.model} onChange={(e) => updateField("model", e.target.value)} placeholder="e.g. Samsung A52" />
          {fieldError("model")}
        </label>
      </div>
      <div className="field-row">
        <label htmlFor="repair-issue">Main fault
          <select id="repair-issue" name="issue" aria-invalid={Boolean(errors.issue)} aria-describedby={errors.issue ? "repair-issue-error" : undefined} value={form.issue} onChange={(e) => updateField("issue", e.target.value)}>
            {issueOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          {fieldError("issue")}
        </label>
        <label htmlFor="repair-nextStep">Preferred next step/contact method <span aria-hidden="true">*</span>
          <select id="repair-nextStep" name="nextStep" required aria-invalid={Boolean(errors.nextStep)} aria-describedby={errors.nextStep ? "repair-nextStep-error" : undefined} value={form.nextStep} onChange={(e) => updateField("nextStep", e.target.value)}>
            <option>WhatsApp guidance</option>
            <option>Call me</option>
            <option>Workshop drop-off guidance</option>
          </select>
          {fieldError("nextStep")}
        </label>
      </div>
      <label htmlFor="repair-details">Additional fault description <span>Optional</span>
        <textarea id="repair-details" name="details" rows={4} maxLength={800} aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? "repair-details-error" : undefined} value={form.details} onChange={(e) => updateField("details", e.target.value)} placeholder="Describe what happened and anything already tried." />
        {fieldError("details")}
      </label>
      <button className="button button-primary form-submit" type="submit">Continue on WhatsApp <WhatsAppIcon size={18} /></button>
      <p className="form-note">
        Your details are placed in a WhatsApp draft for you to review and edit before sending.
        This website does not keep a copy of the form after you leave the page. Attach photos or videos after WhatsApp opens.
      </p>
      <p className="form-status" role={Object.keys(errors).length > 0 ? "alert" : "status"} aria-live="polite">{status}</p>
      {fallbackHref ? (
        <p className="form-fallback">
          <a
            href={fallbackHref}
            target="_blank"
            rel="noreferrer"
            aria-label={withNewTabLabel("Open WhatsApp directly")}
          >
            Open WhatsApp directly
            <NewTabHint />
          </a>
        </p>
      ) : null}
    </form>
  );
}
